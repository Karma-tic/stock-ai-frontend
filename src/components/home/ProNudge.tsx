// src/components/home/ProNudge.tsx
// Two quiet banners on Home, never both:
// - Pro ended: "Your Pro ended on 19 Dec. Renew to keep alerts on." (their data stays)
// - A 3-day regular on the free plan: "You've read 7 Evidence Boards this week. Try Pro for ₹1 for a day."
// The second follows the paywall rules (value seen first, one more prompt at most after "Not now").
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePlanState } from '../../lib/plan';
import { boardsSeen, canPrompt, noteNotNow, notePromptShown, noteVisitDay, threeDayVisitor } from '../../lib/paywall';
import { trackEvent } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

const DISMISS = 'bp_nudge_dismissed';

export default function ProNudge({ onUpgrade }: { onUpgrade: (context: string, moment: string) => void }) {
  const plan = usePlanState();
  const [mode, setMode] = useState<'expired' | 'regular' | null>(null);
  const [trialUsed, setTrialUsed] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setTrialUsed(!!data.session?.user?.user_metadata?.has_used_trial));
  }, []);

  useEffect(() => {
    const days = noteVisitDay();
    if (plan.loading || plan.isPro) return setMode(null);
    let dismissed = '';
    try {
      dismissed = sessionStorage.getItem(DISMISS) || '';
    } catch {
      /* ignore */
    }
    if (plan.expired && plan.validUntil && dismissed !== 'expired') return setMode('expired');
    if (dismissed !== 'regular' && threeDayVisitor(days) && boardsSeen() >= 2 && canPrompt()) {
      notePromptShown();
      trackEvent('paywall_view', { moment: 'three_day_visitor', plan: 'free' });
      return setMode('regular');
    }
    setMode(null);
  }, [plan.loading, plan.isPro, plan.expired, plan.validUntil]);

  if (!mode) return null;
  const close = () => {
    try {
      sessionStorage.setItem(DISMISS, mode);
    } catch {
      /* ignore */
    }
    noteNotNow();
    setMode(null);
  };
  const ended = plan.validUntil
    ? new Date(plan.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
    : '';
  const n = boardsSeen();
  const offer = trialUsed ? 'Pro is ₹99 for 30 days.' : 'Try Pro for ₹1 for a day.';
  return (
    <div className="mb-4 flex items-start gap-3 rounded-card border border-accent/30 bg-accent/[0.06] px-4 py-3" role="status">
      <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink">
        {mode === 'expired' ? (
          <>Your Pro ended on {ended}. Renew to keep unlimited boards and big-investor alerts. Your watchlist is still here.</>
        ) : (
          <>
            You've read {n} Evidence {n === 1 ? 'Board' : 'Boards'} this week. {offer}
          </>
        )}{' '}
        <button
          type="button"
          onClick={() =>
            mode === 'expired' ? onUpgrade('Renew Pro', 'pro_expired') : onUpgrade('Research without the daily limit', 'three_day_visitor')
          }
          className="font-semibold text-accent hover:underline"
        >
          {mode === 'expired' ? 'Renew' : 'See Pro'}
        </button>
      </p>
      <button type="button" onClick={close} aria-label="Dismiss" className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-control text-muted hover:text-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
