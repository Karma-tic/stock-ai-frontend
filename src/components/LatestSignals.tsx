// src/components/LatestSignals.tsx
// "Researched this morning": stocks the AI researched today, as a snap carousel.
// Four chips a row on wider screens. Each chip carries a balance dot (supporting vs concerning points: a count, never
// a verdict). Phones swipe with the next chip peeking; desktop gets arrow buttons.
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { evidenceBalance } from '../lib/evidence';

type Row = { ticker: string; current_price?: number; balance?: { support: number; concern: number } | null };

function dot(b?: Row['balance']) {
  if (!b || !(b.support + b.concern)) return { cls: 'bg-ink/25', word: 'Not scored' };
  const bal = evidenceBalance(b.support, b.concern);
  const word = bal.label.split(',')[0];
  if (bal.lean >= 0.15) return { cls: 'bg-up', word };
  if (bal.lean <= -0.15) return { cls: 'bg-caution', word };
  return { cls: 'bg-ink/40', word };
}

export default function LatestSignals({ signals }: { signals: Row[] | null }) {
  const scroller = useRef<HTMLUListElement>(null);
  if (!signals || !signals.length) return null;

  const nudge = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <section aria-label="Researched this morning" className="group/rail relative mb-4 rounded-card border border-line bg-surface px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 className="text-sm font-semibold text-ink">Researched this morning</h2>
        <span className="text-xs text-muted">Tap one for its Evidence Board</span>
      </div>
      <ul ref={scroller} className="scrollbar-hide -mx-4 mt-2 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 sm:-mx-1 sm:scroll-px-1 sm:px-1">
        {signals.map((s) => {
          const price = Number(s.current_price);
          const d = dot(s.balance);
          return (
            <li key={s.ticker} className="w-[42%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/4)]">
              <Link
                to={`/?analyze=${encodeURIComponent(s.ticker)}`}
                className="flex min-h-[64px] flex-col justify-center rounded-control border border-line px-3 py-2 transition duration-150 hover:border-accent/50 active:scale-[0.97]"
              >
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${d.cls}`} aria-hidden="true" />
                  <span className="num truncate text-sm font-semibold text-ink">{s.ticker}</span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted">
                  <span className="num">{Number.isFinite(price) ? `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : ''}</span>
                  {' · '}
                  {d.word}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {signals.length > 4 && (
        <>
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Earlier stocks"
            className="absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink opacity-0 shadow-lift transition focus:opacity-100 group-hover/rail:opacity-100 sm:grid"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="More stocks"
            className="absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink opacity-0 shadow-lift transition focus:opacity-100 group-hover/rail:opacity-100 sm:grid"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </section>
  );
}
