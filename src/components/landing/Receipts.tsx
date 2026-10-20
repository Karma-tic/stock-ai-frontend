import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import { TrackOutcome, TrackRecordData, fmtDay, useApi, useInView } from './hooks';

const SOURCES = ['NSE', 'BSE', 'Reuters', 'Business Standard', 'Mint', 'Moneycontrol', 'Economic Times'];

type State = 'yes' | 'no' | 'pending';
const stateOf = (o: TrackOutcome): State => (o.was_correct == null ? 'pending' : o.was_correct ? 'yes' : 'no');
const WORD: Record<State, string> = { yes: 'played out', no: 'did not play out', pending: 'pending' };

function describe(o: TrackOutcome) {
  const s = stateOf(o);
  const move = typeof o.pct_change === 'number' ? `, price ${o.pct_change >= 0 ? '+' : '−'}${Math.abs(o.pct_change).toFixed(1)}% in 7 days` : '';
  return `${o.ticker} · ${fmtDay(o.signal_date)}: ${WORD[s]}${move}`;
}

// The last 90 tracked analyses, one square each. Real data only, misses included.
// Why: honesty is the strongest argument for a skeptical investor.
export default function Receipts() {
  const [ref, near] = useInView<HTMLElement>('300px');
  const track = useApi<TrackRecordData>('/api/track-record', near);
  const [focus, setFocus] = useState<number | null>(null);

  const recent = useMemo(() => {
    const list = [...(track.data?.signals || [])];
    list.sort((a, b) => (b.signal_date || '').localeCompare(a.signal_date || ''));
    return list.slice(0, 90).reverse(); // oldest on the left, newest on the right
  }, [track.data]);

  const counts = useMemo(() => {
    const c = { yes: 0, no: 0, pending: 0 };
    recent.forEach((o) => c[stateOf(o)]++);
    return c;
  }, [recent]);

  const shown = focus !== null ? recent[focus] : recent[recent.length - 1];

  return (
    <section ref={ref} aria-labelledby="receipts-heading" className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold text-accent">Track record</p>
        <h2 id="receipts-heading" className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
          We publish when we are wrong.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Every analysis is checked automatically 7 days later against the actual price. Nothing is hidden or removed.
        </p>

        <div className="mt-10">
          {track.status === 'error' ? (
            <p className="text-sm text-muted">
              The track record is unavailable right now.{' '}
              <Link to="/track-record" className="font-semibold text-accent underline underline-offset-4">
                Open the full record
              </Link>
            </p>
          ) : !recent.length ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <p className="tnum text-sm text-ink">
                  <span className="text-2xl font-semibold">{counts.yes}</span> played out
                </p>
                <p className="tnum text-sm text-ink">
                  <span className="text-2xl font-semibold">{counts.no}</span> did not
                </p>
                {counts.pending > 0 && (
                  <p className="tnum text-sm text-muted">
                    <span className="text-2xl font-semibold">{counts.pending}</span> pending
                  </p>
                )}
                <p className="text-sm text-muted">of the last {recent.length} tracked analyses</p>
              </div>

              <div className="receipts-strip mt-5 snap-x overflow-x-auto pb-2 scrollbar-hide">
                <div role="list" aria-label="Last tracked analyses, oldest to newest" className="grid w-max grid-flow-col grid-rows-3 gap-1.5 sm:grid-rows-2 lg:grid-rows-3">
                  {recent.map((o, i) => {
                    const s = stateOf(o);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role="listitem"
                        aria-label={describe(o)}
                        onMouseEnter={() => setFocus(i)}
                        onFocus={() => setFocus(i)}
                        onClick={() => setFocus(i)}
                        className={`receipt flex h-7 w-7 items-center justify-center rounded-[5px] text-[11px] font-bold leading-none transition sm:h-8 sm:w-8 lg:h-7 lg:w-7 ${
                          s === 'yes' ? 'bg-accent text-accent-ink' : s === 'no' ? 'border border-ink/35 text-ink/70' : 'bg-ink/10 text-muted'
                        } ${focus === i ? 'ring-2 ring-accent ring-offset-2 ring-offset-canvas' : ''}`}
                      >
                        <span aria-hidden="true">{s === 'yes' ? '✓' : s === 'no' ? '✕' : '•'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="num mt-3 min-h-[20px] text-sm text-ink/85" aria-live="polite">
                {shown ? describe(shown) : ''}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-accent text-[9px] font-bold text-accent-ink">✓</span> played out
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-ink/35 text-[9px] font-bold text-ink/70">✕</span> did not
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-ink/10 text-[9px] font-bold">•</span> pending
                </span>
                <Link to="/track-record" className="group ml-auto inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-accent">
                  See every outcome <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="text-xs font-medium text-muted">Built on filings and trusted news from</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {SOURCES.map((s) => (
              <li key={s} className="num text-sm text-ink/70">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            Research, not advice. Stock AI is not SEBI-registered and nothing here is a personal recommendation.{' '}
            <Link to="/disclaimer" className="font-medium text-ink underline underline-offset-4">
              Read the disclaimer
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
