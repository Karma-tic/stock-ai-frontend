// src/components/landing/FiledThisWeek.tsx
// Real examples of what Stock AI flags: the latest important NSE filings, each with its source.
// Hidden if there is nothing to show; never invented.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { BASE } from '../../lib/api';
import { relativeTime } from '../../lib/relativeTime';

type Ev = { ticker: string; label: string; title: string; source_name?: string; source_url?: string; published_at?: string };

export default function FiledThisWeek() {
  const [events, setEvents] = useState<Ev[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`${BASE}/api/events/recent?limit=3`)
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => alive && setEvents(d.events || []))
      .catch(() => alive && setEvents([]));
    return () => {
      alive = false;
    };
  }, []);
  if (!events || !events.length) return null;
  return (
    <div className="hero-rise mt-8 max-w-xl" style={{ animationDelay: '520ms' }}>
      <p className="text-xs font-semibold text-muted">Flagged this week</p>
      <ul className="mt-2 space-y-2">
        {events.map((ev) => (
          <li key={ev.ticker} className="flex items-start gap-3 rounded-control border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <Link to={`/stock/${encodeURIComponent(ev.ticker)}`} className="num font-semibold hover:text-accent">
                  {ev.ticker}
                </Link>
                <span className="text-muted"> · {ev.label}</span>
              </p>
              <p className="truncate text-xs text-muted">
                {ev.title}
                {ev.published_at ? ` · ${relativeTime(ev.published_at)}` : ''}
              </p>
            </div>
            {ev.source_url && (
              <a
                href={ev.source_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source: ${ev.source_name || 'filing'}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-control text-muted hover:text-accent"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
