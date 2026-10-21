// src/components/UpgradeModal.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { loadRazorpay } from '../lib/loadRazorpay';
import { Check, Loader2, LockKeyhole, X } from 'lucide-react';
import { buttonClass } from './ui/Button';


const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

declare global {
  interface Window { Razorpay: any }
}

type PlanType = 'trial' | 'onetime' | 'subscription' | null;

export default function UpgradeModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState<PlanType>('onetime');
  const [hasUsedTrial, setHasUsedTrial] = useState(false);

  // Start loading Razorpay Checkout as soon as the modal opens, so it is ready by the time a plan is chosen.
  useEffect(() => {
    loadRazorpay();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.has_used_trial) {
        setHasUsedTrial(true);
      }
    });
  }, []);
  const features = [
    'Unlimited Evidence Boards (free: 2 a day)',
    'Big investors: 3 years of ownership, deals and insider trades (free: last year and 90 days)',
    'Email alerts when promoters, insiders or big funds move in your stocks',
    'Full portfolio health check: sector and size split, big-investor moves',
    'Unlimited watchlist and portfolio, with CSV export',
  ];

  // Dialog basics: Escape closes, focus moves in and back, the page behind does not scroll
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => { if (!loading) onClose(); }, [loading, onClose]);
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
const plans = [
  {
    id:       'trial' as PlanType,
    emoji:    '🎯',
    title:    '1 Day Trial',
    price:    '₹1',
    period:   'one time',
    desc:     'Try everything for 1 day',
    amount:   100,
    days:     1,
    badge:    'TRY IT',
    badgeColor: 'bg-caution/15',
    border:   'border-caution/40',
  },
  {
    id:       'onetime' as PlanType,
    emoji:    '🔓',
    title:    '1 Month Access',
    price:    '₹99',
    originalPrice: '₹499',
    period:   'no auto-renewal',
    desc:     'Pay once, access for 30 days',
    amount:   9900,
    days:     30,
    badge:    'POPULAR',
    badgeColor: 'bg-cobalt',
    border:   'border-white/50',
  },
  // REMOVED subscription plan — UPI AutoPay not supported yet
];
  const handlePayment = async (plan: typeof plans[0]) => {
  setLoading(true);
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) {
      alert('Please login again');
      setLoading(false);
      return;
    }

    // Always use one-time order — no subscriptions
    const res = await axios.post(
      `${BASE}/api/payment/create-order`,
      { amount: plan.amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderData = res.data;
    console.log('Order created:', orderData);

    const options: any = {
      key:         orderData.key,
      order_id:    orderData.order_id,
      amount:      orderData.amount,
      currency:    'INR',
      name:        'Stock AI',
      description: plan.title,
      theme:       { color: '#3451F5' },
      modal: {
        ondismiss: () => {
          console.log('Payment dismissed');
          setLoading(false);
        }
      },
      handler: async (response: any) => {
        console.log('Payment success:', response);
        try {
          const verifyRes = await axios.post(
            `${BASE}/api/payment/verify-order`,
            {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              days:                plan.days,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log('Verify success:', verifyRes.data);
          alert(
            plan.days === 1
              ? '✅ Trial activated! Enjoy 1 day Pro access.'
              : '✅ You are now Pro for 30 days!'
          );
          onSuccess();
          onClose();
        } catch (e: any) {
          const detail = e?.response?.data?.detail || e.message;
          console.error('Verify failed:', detail);
          alert(
            `Payment received but activation failed.\n` +
            `Error: ${detail}\n` +
            `Payment ID: ${response.razorpay_payment_id}\n` +
            `Email contact@karmatix.in with this ID for manual activation.`
          );
        }
      },
      prefill: { email: session.session?.user?.email || '' },
    };

    if (!(await loadRazorpay())) {
      alert('Payment gateway failed to load. Please refresh the page.');
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      console.error('Payment failed:', r.error);
      alert(`Payment failed: ${r.error.description}\nTry a different payment method.`);
      setLoading(false);
    });
    rzp.open();

  } catch (e: any) {
    console.error('Payment error:', e?.response?.data || e.message);
    alert(`Error: ${e?.response?.data?.detail || e.message}`);
    setLoading(false);
  }
};

  const visiblePlans = plans.filter((p) => !(p.id === 'trial' && hasUsedTrial));
  const chosen = visiblePlans.find((p) => p.id === selected) || null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[#0B0F14]/55 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        className="board-panel relative max-h-[92dvh] w-full overflow-y-auto rounded-t-card border border-line bg-surface outline-none shadow-lift sm:max-w-md sm:rounded-card"
      >
        <span className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-ink/15 sm:hidden" aria-hidden="true" />
        <header className="flex items-start justify-between gap-3 px-6 pb-4 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Stock AI Pro</p>
            <h2 id="upgrade-title" className="mt-1 text-2xl font-bold tracking-[-0.02em] text-ink">Research without the daily limit</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>

        <ul className="space-y-2 px-6">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/90">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} />
              {f}
            </li>
          ))}
        </ul>

        <fieldset className="mt-6 space-y-3 px-6">
          <legend className="sr-only">Choose a plan</legend>
          {visiblePlans.map((plan) => {
            const active = selected === plan.id;
            return (
              <label
                key={plan.id}
                className={`relative flex cursor-pointer items-center gap-3 rounded-card border p-4 transition ${
                  active ? 'border-accent bg-accent/[0.06] ring-1 ring-accent' : 'border-line hover:border-ink/25'
                }`}
              >
                <input type="radio" name="plan" value={plan.id || ''} checked={active} onChange={() => setSelected(plan.id)} className="h-4 w-4 shrink-0 accent-cobalt" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{plan.title}</span>
                    {plan.id === 'onetime' && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">Popular</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {plan.desc}, {plan.period}
                  </span>
                </span>
                <span className="text-right">
                  <span className="num block text-xl font-bold text-ink">{plan.price}</span>
                  {'originalPrice' in plan && <span className="num block text-xs text-muted line-through">{(plan as any).originalPrice}</span>}
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <button
            type="button"
            onClick={() => chosen && handlePayment(chosen)}
            disabled={loading || !chosen}
            className={buttonClass('primary', 'lg', 'w-full')}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Opening payment…' : chosen ? `Pay ${chosen.price}` : 'Choose a plan'}
          </button>
          <button type="button" onClick={close} disabled={loading} className="mt-2 h-11 w-full rounded-control text-sm font-medium text-muted hover:text-ink">
            Maybe later
          </button>
          <p className="mt-2 text-center text-xs leading-relaxed text-muted">
            <LockKeyhole className="mr-1 inline h-3 w-3 align-[-1px]" strokeWidth={2} />
            Secure payment by Razorpay. No auto-renewal. Help: contact@karmatix.in
          </p>
        </div>
      </div>
    </div>
  );
}
