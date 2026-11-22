// src/components/ipos/GmpVsListing.tsx
// Recently listed IPOs: what the grey market implied on listing day versus
// what the shares actually opened at. One row each: hollow dot = GMP implied,
// solid dot = actual listing gain, the line between them is the miss.
import { Link } from 'react-router-dom';
import { Ipo, dayLabel } from './ipoData';

type Row = { ipo: Ipo; implied: number; actual: number };

export default function GmpVsListing({ ipos }: { ipos: Ipo[] }) {
  const rows: Row[] = ipos
    .filter((i) => i.stage === 'listed' && i.listing_gain_percent != null && i.issue_price)
    .map((i) => {
      const gmp = i.gmp_at_listing ?? i.gmp_value ?? 0;
      return { ipo: i, implied: (gmp / (i.issue_price as number)) * 100, actual: i.listing_gain_percent as number };
    })
    .slice(0, 12);
  if (rows.length < 3) return null;

  const close = rows.filter((r) => Math.abs(r.actual - r.implied) <= 10).length;
  const under = rows.filter((r) => r.actual > r.implied + 10).length;
  const lo = Math.min(-25, ...rows.flatMap((r) => [r.implied, r.actual])) - 5;
  const hi = Math.max(50, ...rows.flatMap((r) => [r.implied, r.actual])) + 5;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const sign = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(Math.abs(v) < 10 ? 1 : 0)}%`;

  return (
    <section aria-labelledby="gmp-vs-listing" className="rounded-card border border-line bg-surface p-5">
      <h2 id="gmp-vs-listing" className="text-lg font-semibold tracking-[-0.01em] text-ink">
        Did the grey market get it right?
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        {close
          ? `For ${close} of the last ${rows.length} listings, the first price was within 10 points of what the grey-market premium implied on listing day.`
          : `None of the last ${rows.length} listings opened within 10 points of what the grey-market premium implied on listing day.`}
        {under ? ` ${under} listed well above it.` : ''} It is a rough guide, not a forecast.
      </p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full border-2 border-ink/50" />GMP implied</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-cobalt" />Actual listing</span>
      </div>

      <ul className="mt-3 divide-y divide-line">
        {rows.map(({ ipo, implied, actual }) => {
          const a = x(implied);
          const b = x(actual);
          const tone = actual >= 0 ? 'text-up' : 'text-down';
          return (
            <li key={ipo.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-2.5 sm:grid-cols-[minmax(0,200px)_1fr_auto]">
              <div className="min-w-0">
                <Link to={`/ipos/${ipo.id}`} className="block truncate text-sm font-medium text-ink hover:text-accent">{ipo.company_name}</Link>
                <span className="text-xs text-muted">{ipo.category === 'SME' ? 'SME · ' : ''}{dayLabel(ipo.listing_date)}</span>
              </div>
              <div className="relative order-3 col-span-2 h-5 sm:order-none sm:col-span-1" role="img"
                   aria-label={`GMP implied ${sign(implied)}, listed at ${sign(actual)}`}>
                <span className="absolute inset-y-0 w-px bg-ink/20" style={{ left: `${x(0)}%` }} aria-hidden="true" />
                <span className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink/25" style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%` }} />
                <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/50 bg-surface" style={{ left: `${a}%` }} />
                <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt" style={{ left: `${b}%` }} />
              </div>
              <span className="num whitespace-nowrap text-right text-sm">
                <span className="text-muted">{sign(implied)} → </span>
                <span className={`font-semibold ${tone}`}>{sign(actual)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Listing gain is the first traded price against the issue price, from InvestorGain.</p>
    </section>
  );
}
