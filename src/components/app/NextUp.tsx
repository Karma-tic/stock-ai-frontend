import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { getEventRadar } from '../../lib/api';
import { relDay } from '../../lib/evidence';

type Ev = { id: string; ticker: string; title: string; severity: string; published_at?: string; event_date?: string };

// NSE regular hours: Mon–Fri, 9:15 to 15:30 IST. Exchange holidays are not accounted for.
export function marketStatus(now = new Date()) {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const open = 9 * 60 + 15;
  const close = 15 * 60 + 30;
  const weekday = day >= 1 && day <= 5;
  if (weekday && mins >= open && mins < close) {
    const left = close - mins;
    return { open: true, text: `Market open, closes in ${Math.floor(left / 60)}h ${left % 60}m` };
  }
  if (weekday && mins < open) return { open: false, text: 'Market opens today at 9:15 AM' };
  const nextDay = day === 5 || day === 6 ? 'Monday' : day === 0 ? 'Monday' : 'tomorrow';
  return { open: false, text: `Market closed, opens ${nextDay} at 9:15 AM` };
}

const SEV: Record<string, { word: string; cls: string; Icon: typeof Info }> = {
  critical: { word: 'Critical', cls: 'text-down', Icon: AlertTriangle },
  high: { word: 'High', cls: 'text-caution', Icon: AlertTriangle },
  medium: { word: 'Medium', cls: 'text-accent', Icon: Info },
  low: { word: 'Low', cls: 'text-muted', Icon: Info },
};

export default function NextUp() {
  const [events, setEvents] = useState<Ev[] | null>(null);
  const [status, setStatus] = useState(() => marketStatus());

  useEffect(() => {
    getEventRadar()
      .then((r) => setEvents((r.data?.events || []).slice(0, 5)))
      .catch(() => setEvents([]));
    const t = window.setInterval(() => setStatus(marketStatus()), 60000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-line bg-surface p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-up' : 'bg-ink/30'}`} aria-hidden="true" />
          {status.text}
        </p>
        <p className="mt-1 text-xs text-muted">Regular NSE hours. Holidays are not shown.</p>
      </div>

      <div className="rounded-card border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Next up for your stocks</h2>
          <Link to="/today" className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-accent">
            Radar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {events === null ? (
          <div className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="skeleton block h-12 w-full" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No material changes for your stocks right now. Add stocks to your watchlist to fill this.</p>
        ) : (
          <ul className="mt-2">
            {events.map((e) => {
              const s = SEV[e.severity] || SEV.low;
              return (
                <li key={e.id} className="border-b border-line py-2.5 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="num text-xs font-semibold text-ink">{e.ticker}</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${s.cls}`}>
                      <s.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      {s.word}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[13px] text-ink/85">{e.title}</p>
                  {(e.event_date || e.published_at) && <p className="mt-0.5 text-[11px] text-muted">{relDay(e.event_date || e.published_at)}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
