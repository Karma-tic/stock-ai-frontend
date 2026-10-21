import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Stocks the AI researched this morning, as a quiet swipeable strip. No verdicts:
// the Evidence Board, one tap away, holds the sourced points.
export default function LatestSignals() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;
      axios
        .get(`${BASE}/api/signals/latest`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setSignals((res.data.signals || []).slice(0, 8)))
        .catch(() => {});
    };
    load();
  }, []);

  if (!signals.length) return null;

  return (
    <section aria-label="Researched this morning" className="rounded-card border border-line bg-surface px-4 py-3 sm:px-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Researched this morning</h2>
        <span className="text-xs text-muted">Tap one for its Evidence Board</span>
      </div>
      <ul className="scrollbar-hide -mx-1 mt-2 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {signals.map((s) => {
          const price = Number(s.current_price);
          return (
            <li key={s.ticker} className="snap-start">
              <Link
                to={`/?analyze=${encodeURIComponent(s.ticker)}`}
                className="flex min-h-[56px] w-[132px] flex-col justify-center rounded-control border border-line px-3 py-2 transition hover:border-accent/50"
              >
                <span className="num truncate text-sm font-semibold text-ink">{s.ticker}</span>
                <span className="num mt-0.5 block whitespace-nowrap text-[11px] text-muted">
                  {Number.isFinite(price) ? `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : ''}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
