// src/components/AlertsPage.tsx
// Alerts under More: which emails Stock AI sends, with plain on/off switches.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Mail, Users } from 'lucide-react';
import { getNotificationPreferences, saveNotificationPreferences } from '../lib/api';
import { usePlanState } from '../lib/plan';
import { toast } from '../lib/toast';
import { trackEvent } from '../lib/analytics';
import SEO from './SEO';

type Prefs = { email_digest: boolean; high_priority_alerts: boolean; minimum_severity: string };

function Switch({ on, onChange, label, busy }: { on: boolean; onChange: (v: boolean) => void; label: string; busy?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={busy}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-accent' : 'bg-ink/20'}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}

const SEVERITY = [
  { value: 'critical', label: 'Only critical (defaults, investigations, results delays)' },
  { value: 'high', label: 'High and critical (results, big orders, rating changes)' },
  { value: 'medium', label: 'Medium and up (also board meetings, smaller deals)' },
];

export default function AlertsPage() {
  const plan = usePlanState();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getNotificationPreferences()
      .then((r) => setPrefs(r.data?.preferences || null))
      .catch(() => setPrefs({ email_digest: false, high_priority_alerts: false, minimum_severity: 'high' }));
  }, []);

  const save = async (next: Prefs) => {
    const before = prefs;
    setPrefs(next);
    setBusy(true);
    try {
      await saveNotificationPreferences(next);
      if (next.high_priority_alerts && !before?.high_priority_alerts) trackEvent('alert_create', { source: 'alerts_page' });
      toast.success('Saved');
    } catch {
      setPrefs(before);
      toast.error('Could not save. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl px-4 pb-24 pt-8 sm:px-6">
      <SEO title="Alerts | Stock AI" description="Choose which Stock AI emails you get." />
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">Alerts</h1>
      <p className="mt-1 text-sm text-muted">
        Alerts cover the stocks in your <Link to="/?tab=watchlist" className="font-semibold text-accent hover:underline">watchlist</Link>. They arrive by email.
      </p>

      {!prefs ? (
        <div className="mt-6 space-y-3">
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          <li className="rounded-card border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">New filings and results</p>
                <p className="mt-0.5 text-sm text-muted">An email when a company you follow files something important.</p>
              </div>
              <Switch label="New filings and results" on={prefs.high_priority_alerts} busy={busy} onChange={(v) => save({ ...prefs, high_priority_alerts: v })} />
            </div>
            {prefs.high_priority_alerts && (
              <label className="mt-4 block pl-8 text-sm">
                <span className="text-muted">Which ones</span>
                <select
                  value={prefs.minimum_severity}
                  onChange={(e) => save({ ...prefs, minimum_severity: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink"
                >
                  {SEVERITY.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </li>
          <li className="rounded-card border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">Daily digest</p>
                <p className="mt-0.5 text-sm text-muted">One email a day with what changed for your stocks and the market wrap.</p>
              </div>
              <Switch label="Daily digest" on={prefs.email_digest} busy={busy} onChange={(v) => save({ ...prefs, email_digest: v })} />
            </div>
          </li>
          <li className="rounded-card border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">Big-investor moves</p>
                <p className="mt-0.5 text-sm text-muted">
                  Promoter, insider and bulk-deal alerts come with filing alerts on Pro.{' '}
                  {plan.isPro ? <span className="font-semibold text-accent">Included in your plan.</span> : <span>Free accounts get company filings only.</span>}
                </p>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
