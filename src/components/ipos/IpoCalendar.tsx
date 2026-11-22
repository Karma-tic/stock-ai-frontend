// src/components/ipos/IpoCalendar.tsx
// The page's picture: a three-week calendar with one lane per live IPO.
// The bar is the bidding window; the ring is allotment; the diamond is listing.
import { Link } from 'react-router-dom';
import { Ipo, dayLabel, isISODate, todayIST } from './ipoData';

const DAY = 86400000;
const BEFORE = 4;
const SPAN = 21;

export default function IpoCalendar({ ipos }: { ipos: Ipo[] }) {
  const today = Date.parse(todayIST());
  const start = today - BEFORE * DAY;
  const pct = (iso?: string | null, end = false) => {
    if (!isISODate(iso)) return null;
    const t = Date.parse(iso.slice(0, 10)) + (end ? DAY : 0);
    return Math.max(0, Math.min(100, ((t - start) / (SPAN * DAY)) * 100));
  };
  const lanes = ipos.filter((i) => i.stage !== 'listed' && isISODate(i.open_date)).slice(0, 10);
  const days = Array.from({ length: SPAN }, (_, k) => start + k * DAY);
  const todayX = ((today - start) / (SPAN * DAY)) * 100 + 100 / SPAN / 2;

  if (!lanes.length) return null;

  return (
    <figure className="rounded-card border border-line bg-surface p-4 sm:p-5" aria-label="IPO calendar for the next three weeks">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-base font-semibold text-ink">IPO calendar</span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><i className="h-2 w-5 rounded-full bg-cobalt" />Bidding</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full border-2 border-ink/60" />Allotment</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rotate-45 bg-up" />Listing</span>
        </span>
      </figcaption>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* day header */}
          <div className="grid grid-cols-[minmax(0,180px)_1fr] gap-3">
            <span />
            <div className="relative grid text-[11px] text-muted" style={{ gridTemplateColumns: `repeat(${SPAN}, minmax(0, 1fr))` }}>
              {days.map((t) => {
                const d = new Date(t);
                const isToday = t === today;
                const weekStart = d.getUTCDay() === 1;
                return (
                  <span key={t} className={`num pb-1 text-center ${isToday ? 'font-semibold text-accent' : weekStart ? 'text-ink/70' : ''}`}>
                    {isToday ? 'Today' : weekStart || t === start ? dayLabel(new Date(t).toISOString()).replace(/^\w+ /, '') : d.getUTCDate()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* lanes */}
          <ul className="divide-y divide-line border-t border-line">
            {lanes.map((ipo) => {
              const a = pct(ipo.open_date);
              const b = pct(ipo.close_date, true);
              const allot = pct(ipo.allotment_date);
              const list = pct(ipo.listing_date);
              const tone = ipo.stage === 'open' ? 'bg-cobalt' : ipo.stage === 'upcoming' ? 'bg-cobalt/35' : 'bg-ink/25';
              const cell = 100 / SPAN / 2;
              return (
                <li key={ipo.id} className="grid grid-cols-[minmax(0,180px)_1fr] items-center gap-3 py-2">
                  <Link to={`/ipos/${ipo.id}`} className="min-w-0 truncate text-sm font-medium text-ink hover:text-accent" title={ipo.company_name}>
                    {ipo.company_name}
                    <span className="ml-1.5 text-xs font-normal text-muted">{ipo.category === 'SME' ? 'SME' : ''}</span>
                  </Link>
                  <div className="relative h-6">
                    <span className="absolute inset-y-0 w-px bg-accent/50" style={{ left: `${todayX}%` }} aria-hidden="true" />
                    {a != null && b != null && b > a && (
                      <span
                        className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full ${tone}`}
                        style={{ left: `${a}%`, width: `${b - a}%` }}
                        title={`Bidding ${dayLabel(ipo.open_date)} to ${dayLabel(ipo.close_date)}`}
                      />
                    )}
                    {allot != null && (
                      <span
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/60 bg-surface"
                        style={{ left: `${allot + cell}%` }}
                        title={`Allotment ${dayLabel(ipo.allotment_date)}`}
                      />
                    )}
                    {list != null && (
                      <span
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-up"
                        style={{ left: `${list + cell}%` }}
                        title={`Listing ${dayLabel(ipo.listing_date)}`}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </figure>
  );
}
