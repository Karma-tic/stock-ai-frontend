// src/components/UpgradeModal.tsx
// The Pro upgrade sheet: a bottom sheet on phones, a 480 px dialog on desktop.
// Plans, amounts and the create-order / verify-order calls are unchanged.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Check, CircleCheck, Loader2, LockKeyhole, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loadRazorpay } from '../lib/loadRazorpay';
import { buttonClass } from './ui/Button';
import { track } from '../lib/track';
import { trackEvent } from '../lib/analytics';
import { noteNotNow } from '../lib/paywall';
import { refreshAllowance, refreshPlan } from '../lib/plan';
import { useSwipeDown } from '../lib/useSwipeDown';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

declare global {
  interface Window { Razorpay: any }
}

type PlanId = 'trial' | 'onetime';
type Plan = { id: PlanId; title: string; price: string; period: string; amount: number; days: number };

// Amounts are in paise and must match the backend's plan table.
const PLANS: Plan[] = [
  { id: 'trial', title: '1 day', price: '₹1', period: 'one time, to try it', amount: 100, days: 1 },
  { id: 'onetime', title: '30 days', price: '₹99', period: 'one payment, no auto-renewal', amount: 9900, days: 30 },
];

// Only what Pro really adds today. Research, faster; never "better calls".
const BENEFITS = [
  'Unlimited Evidence Boards (free: 2 a day)',
  'Big-investor history: 3 years of ownership, deals and insider trades',
  'Email alerts when promoters, insiders or big funds move in your stocks',
  'Unlimited watchlist and portfolio, with health check and CSV export',
];

function proUntil(days: number) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function UpgradeModal({
  onClose,
  onSuccess,
  context,
  moment,
}: {
  onClose: () => void;
  onSuccess: () => void;
  /** What the person was trying to do, e.g. "Unlock unlimited Evidence Boards". */
  context?: string;
  /** Where it opened from, for the funnel (locked_board, watchlist_limit, header…). */
  moment?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlanId>('onetime');
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ days: number } | null>(null);

  // Razorpay Checkout starts loading as soon as the sheet opens.
  useEffect(() => {
    loadRazorpay();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      track('upgrade_view', session?.access_token);
      trackEvent('paywall_view', { moment: moment || 'unknown', plan: 'free' });
      if (session?.user?.user_metadata?.has_used_trial) setHasUsedTrial(true);
    });
    // Once per opening; the moment does not change while the sheet is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dialog basics: Escape closes, focus moves in and back, the page behind does not scroll.
  const panelRef = useRef<HTMLDivElement>(null);
  const finish = useCallback(() => {
    if (done) onSuccess();
    onClose();
  }, [done, onClose, onSuccess]);
  const close = useCallback(() => {
    if (loading) return;
    if (!done) noteNotNow();
    finish();
  }, [loading, finish, done]);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      back?.focus?.();
    };
  }, [close]);

  // Swipe down to dismiss on phones (not while a payment is starting).
  useSwipeDown(panelRef, close, !loading);

  const visiblePlans = PLANS.filter((p) => !(p.id === 'trial' && hasUsedTrial));
  const chosen = visiblePlans.find((p) => p.id === selected) || visiblePlans[visiblePlans.length - 1];

  const handlePayment = async (plan: Plan) => {
    trackEvent('upgrade_click', { plan: plan.id, source: moment || 'sheet' });
    setError('');
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError('Your session has ended. Please sign in again, then upgrade.');
        setLoading(false);
        return;
      }

      const res = await axios.post(`${BASE}/api/payment/create-order`, { amount: plan.amount }, { headers: { Authorization: `Bearer ${token}` } });
      const orderData = res.data;

      if (!(await loadRazorpay())) {
        setError('The payment window could not load. Check your connection and try again.');
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.key,
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Stock AI',
        description: `Pro, ${plan.title}`,
        theme: { color: '#3451F5' },
        prefill: { email: session.session?.user?.email || '' },
        // UPI first; cards, net banking and wallets stay available below it.
        config: {
          display: {
            blocks: { upi: { name: 'Pay with UPI', instruments: [{ method: 'upi' }] } },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: true },
          },
        },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: any) => {
          try {
            await axios.post(
              `${BASE}/api/payment/verify-order`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                days: plan.days,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if ('vibrate' in navigator) navigator.vibrate?.(8);
            trackEvent('payment_success', { plan: plan.id, source: moment || 'unknown', value: plan.amount / 100 });
            refreshPlan();
            refreshAllowance();
            setDone({ days: plan.days });
          } catch (e: any) {
            const detail = e?.response?.data?.detail || e.message;
            setError(
              `Your payment went through but Pro did not switch on (${detail}). Email contact@karmatix.in with payment ID ${response.razorpay_payment_id} and we will turn it on.`,
            );
          } finally {
            setLoading(false);
          }
        },
      });
      rzp.on('payment.failed', (r: any) => {
        setError(`Payment failed: ${r?.error?.description || 'please try another method'}.`);
        setLoading(false);
      });
      rzp.open();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Could not start the payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-canvas/70 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        className="board-panel relative max-h-[92dvh] w-full overflow-y-auto rounded-t-card border border-line bg-surface shadow-lift outline-none sm:max-w-[480px] sm:rounded-card"
      >
        <span className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-ink/15 sm:hidden" aria-hidden="true" />

        {done ? (
          <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-center" role="status">
            <span className="relative mx-auto grid h-14 w-14 place-items-center">
              {/* One soft burst of 12 cobalt particles; none under reduced motion */}
              <span className="burst" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} style={{ ['--a' as any]: `${i * 30}deg` }} />
                ))}
              </span>
              <span className="upgrade-done grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
                <CircleCheck className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </span>
            <h2 id="upgrade-title" className="mt-4 text-2xl font-bold tracking-[-0.02em] text-ink">
              You're on Pro until {proUntil(done.days)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Unlimited Evidence Boards and alerts are on. Thank you for supporting Stock AI.</p>
            <button type="button" onClick={finish} className={buttonClass('primary', 'lg', 'mt-6 w-full')}>
              Continue
            </button>
          </div>
        ) : (
          <>
            <header className="flex items-start justify-between gap-3 px-6 pb-4 pt-5">
              <div>
                <p className="text-xs font-semibold text-accent">Stock AI Pro</p>
                <h2 id="upgrade-title" className="mt-1 text-2xl font-bold tracking-[-0.02em] text-ink">
                  {context || 'Research without the daily limit'}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </header>

            <ul className="space-y-2.5 px-6">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm leading-snug text-ink/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            <fieldset className="mt-6 space-y-2.5 px-6">
              <legend className="sr-only">Choose a plan</legend>
              {visiblePlans.map((plan) => {
                const active = chosen?.id === plan.id;
                return (
                  <label
                    key={plan.id}
                    className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-card border px-4 py-3 transition duration-150 ${
                      active ? 'border-accent bg-accent/[0.06] ring-1 ring-accent' : 'border-line hover:border-ink/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={active}
                      onChange={() => setSelected(plan.id)}
                      className="h-4 w-4 shrink-0 accent-cobalt"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{plan.title}</span>
                      <span className="block text-xs text-muted">{plan.period}</span>
                    </span>
                    <span className="num text-xl font-bold text-ink">{plan.price}</span>
                  </label>
                );
              })}
            </fieldset>

            <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
              {error && (
                <p role="alert" className="mb-3 rounded-control bg-down/10 px-3 py-2 text-sm leading-relaxed text-ink">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => chosen && handlePayment(chosen)}
                disabled={loading || !chosen}
                className={buttonClass('primary', 'lg', 'w-full')}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Opening payment…' : chosen ? `Pay ${chosen.price} with UPI` : 'Choose a plan'}
              </button>
              <button type="button" onClick={close} disabled={loading} className="mt-2 h-11 w-full rounded-control text-sm font-medium text-muted hover:text-ink">
                Not now
              </button>
              <p className="mt-2 text-center text-xs leading-relaxed text-muted">
                <LockKeyhole className="mr-1 inline h-3 w-3 align-[-1px]" strokeWidth={2} aria-hidden="true" />
                Secure payment by Razorpay · No auto-renewal ·{' '}
                <Link to="/refund" onClick={onClose} className="font-medium text-accent hover:underline">
                  Refund policy
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
