// src/components/MorningBriefSignup.tsx
// The free morning brief without an account: an email box (double opt-in, the
// server sends a confirmation link) and a link to the Telegram channel.
import { FormEvent, useState } from 'react';
import { Check, Loader2, Mail, Send } from 'lucide-react';
import { BASE } from '../lib/api';
import { buttonClass } from './ui/Button';

export const TELEGRAM_URL = 'https://t.me/byteplaystock';

export function TelegramLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 font-semibold text-accent hover:underline ${className}`}
    >
      <Send className="h-4 w-4" aria-hidden="true" /> Follow on Telegram
    </a>
  );
}

type State = { kind: 'idle' | 'sending' | 'done' | 'error'; message?: string };

export default function MorningBriefSignup({ source, compact = false }: { source: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state.kind === 'sending') return;
    setState({ kind: 'sending' });
    try {
      const res = await fetch(`${BASE}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || 'Could not sign you up. Please try again.');
      setState({ kind: 'done', message: data?.message || 'Check your inbox and tap the link to confirm.' });
    } catch (err: any) {
      setState({ kind: 'error', message: err?.message || 'Could not sign you up. Please try again.' });
    }
  }

  return (
    <div className={`rounded-card border border-line bg-surface ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
          <Mail className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className={`${compact ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold tracking-[-0.015em] text-ink`}>
            Get the market brief before the open
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            One short email each weekday morning: what moved the last session, with sources. Free, no account needed.
          </p>
        </div>
      </div>

      {state.kind === 'done' ? (
        <p role="status" className="mt-5 flex items-center gap-2 rounded-control bg-accent/10 px-4 py-3 text-sm font-medium text-ink">
          <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> {state.message}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`brief-email-${source}`} className="sr-only">Email address</label>
          <input
            id={`brief-email-${source}`}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 min-w-0 flex-1 rounded-control border border-line bg-canvas px-3 text-[15px] text-ink placeholder:text-muted focus:border-cobalt focus:outline-none"
          />
          <button type="submit" disabled={state.kind === 'sending'} className={buttonClass('primary', 'md')}>
            {state.kind === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Send me the brief
          </button>
        </form>
      )}
      {state.kind === 'error' && <p role="alert" className="mt-2 text-sm text-down">{state.message}</p>}

      <p className="mt-4 text-sm text-muted">
        Prefer Telegram? <TelegramLink /> for the evening wrap.
      </p>
    </div>
  );
}
