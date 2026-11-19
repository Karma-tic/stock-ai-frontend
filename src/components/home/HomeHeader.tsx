// src/components/home/HomeHeader.tsx
// "Your morning, read for you": a greeting, one sentence built from data, the
// market's state with a live countdown, and Nifty 50 / Sensex tiles.
import { useEffect, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { getMarketIndices } from '../../lib/api';
import { durationWords, greeting, marketClock } from '../../lib/marketClock';
import { relativeTime } from '../../lib/relativeTime';
import Sparkline from '../ui/Sparkline';

type Index = { name: string; value: number; change: number; pct_change: number; points: { t: number; v: number }[]; as_of?: number };

const inr = { maximumFractionDigits: 2, minimumFractionDigits: 2 } as const;

function IndexTile({ index }: { index: Index }) {
  const up = index.change >= 0;
  return (
    <div className="min-w-0 rounded-card border border-line bg-surface px-3.5 pb-2 pt-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted">{index.name}</span>
        <span className={`num text-xs font-semibold ${up ? 'text-up' : 'text-down'}`}>
          {up ? '▲' : '▼'}
          <NumberFlow value={Math.abs(index.pct_change)} format={inr} locales="en-IN" suffix="%" />
        </span>
      </div>
      <div className="num mt-0.5 text-lg font-semibold tabular-nums text-ink">
        <NumberFlow value={index.value} format={inr} locales="en-IN" />
      </div>
      <Sparkline points={index.points} height={40} className="mt-1" label={`${index.name} today, ${up ? 'up' : 'down'} ${Math.abs(index.pct_change)}%`} />
    </div>
  );
}

export default function HomeHeader({ firstName, newCount }: { firstName?: string; newCount?: number | null }) {
  const [clock, setClock] = useState(() => marketClock());
  const [indices, setIndices] = useState<Index[] | null>(null);

  useEffect(() => {
    const tick = window.setInterval(() => setClock(marketClock()), 30000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () =>
      getMarketIndices()
        .then((r) => alive && setIndices(r.data?.indices || []))
        .catch(() => alive && setIndices([]));
    load();
    // Refresh while the market is open so the tiles tick
    const t = window.setInterval(() => marketClock().phase !== 'closed' && load(), 60000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  const nifty = indices?.find((i) => i.name === 'Nifty 50');
  const parts: string[] = [];
  if (clock.phase === 'closed') {
    parts.push(nifty ? `Market closed. Nifty ended ${nifty.pct_change >= 0 ? '+' : ''}${nifty.pct_change.toFixed(2)}%.` : 'Market closed.');
  } else {
    parts.push(`Market ${clock.untilWhat} in ${durationWords(clock.until)}.`);
  }
  if (typeof newCount === 'number' && newCount > 0) {
    parts.push(`${newCount} of your stocks ${newCount === 1 ? 'has' : 'have'} something new.`);
  }

  return (
    <section aria-label="Your morning" className="mb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted">{parts.join(' ')}</p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
          title="Regular NSE hours, Mon to Fri. Exchange holidays are not shown yet."
        >
          <span className={`market-dot h-2 w-2 rounded-full ${clock.phase === 'open' ? 'is-open bg-up' : clock.phase === 'pre-open' ? 'bg-caution' : 'bg-ink/30'}`} aria-hidden="true" />
          {clock.label}
          <span className="font-medium text-muted">
            · {clock.untilWhat} in {durationWords(clock.until)}
          </span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
        {indices === null
          ? [0, 1].map((i) => (
              <div key={i} className="rounded-card border border-line bg-surface px-3.5 pb-2 pt-3" aria-hidden="true">
                <span className="skeleton block h-3 w-16" />
                <span className="skeleton mt-2 block h-5 w-24" />
                <span className="skeleton mt-2 block h-10 w-full" />
              </div>
            ))
          : indices.map((i) => <IndexTile key={i.name} index={i} />)}
      </div>
      {indices && indices.length > 0 && nifty?.as_of ? (
        <p className="mt-1.5 text-right text-[11px] text-muted">Updated {relativeTime(nifty.as_of)} · NSE/BSE via Yahoo Finance</p>
      ) : null}
    </section>
  );
}
