// src/components/ipos/IpoAlertsCard.tsx
// "Email me new IPOs". Visitors: double opt-in. Signed-in users: one tap.
// Pro: included automatically, with a switch to turn it off.
import { FormEvent, useEffect, useState } from 'react';
import { BellRing, Check, Loader2 } from 'lucide-react';
import { api, BASE } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { buttonClass } from '../ui/Button';

type Me = { subscribed: boolean; is_pro: boolean; email?: string | null };
type Phase = 'loading' | 'visitor' | 'member';

export default function IpoAlertsCard() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      if (!data.session) return setPhase('visitor');
      api
        .get('/api/ipo-alerts/me')
        .then((r) => alive && (setMe(r.data), setPhase('member')))
        .catch(() => alive && setPhase('visitor'));
    });
    return () => {
      alive = false;
    };
  }, []);

  async function subscribeVisitor(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch(`${BASE}/api/ipo-alerts/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ email: email.trim(), source: 'ipo-page' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || 'Could not sign you up. Please try again.');
      setNote({ ok: true, text: data?.message || 'Check your inbox and tap the link to confirm.' });
    } catch (err: any) {
      setNote({ ok: false, text: err?.message || 'Could not sign you up. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  async function setMine(on: boolean) {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const r = await api.post('/api/ipo-alerts/me', { on });
      setMe(r.data);
    } catch {
      setNote({ ok: false, text: 'Could not update your alerts. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="rounded-card border border-line bg-surface p-5" aria-labelledby="ipo-alerts-title">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
          <BellRing className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 id="ipo-alerts-title" className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
            New IPO alerts
            {me?.is_pro && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">Included with Pro</span>}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            An email when a new IPO is announced: dates, price, lot size, and the points in favour and to check.
          </p>
        </div>
      </div>

      {phase === 'loading' && <span className="skeleton mt-4 block h-11" aria-hidden="true" />}

      {phase === 'visitor' &&
        (note?.ok ? (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-control bg-accent/10 px-3 py-2.5 text-sm font-medium text-ink">
            <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> {note.text}
          </p>
        ) : (
          <form onSubmit={subscribeVisitor} className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <label htmlFor="ipo-alert-email" className="sr-only">Email address</label>
            <input
              id="ipo-alert-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-control border border-line bg-canvas px-3 text-[15px] text-ink placeholder:text-muted focus:border-cobalt focus:outline-none"
            />
            <button type="submit" disabled={busy} className={buttonClass('primary', 'md')}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Email me new IPOs
            </button>
          </form>
        ))}

      {phase === 'member' && me && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-sm text-ink" role="status">
            {me.subscribed ? (
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-up" aria-hidden="true" />On for <span className="truncate font-medium">{me.email}</span></span>
            ) : (
              <span className="text-muted">Off</span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setMine(!me.subscribed)}
            disabled={busy}
            className={buttonClass(me.subscribed ? 'ghost' : 'primary', 'sm')}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {me.subscribed ? 'Turn off' : 'Email me new IPOs'}
          </button>
        </div>
      )}

      {note && !note.ok && <p role="alert" className="mt-2 text-sm text-down">{note.text}</p>}
      <p className="mt-3 text-xs text-muted">Research, not advice. Unsubscribe from any email in one tap.</p>
    </aside>
  );
}
