// src/components/ipos/IpoCard.tsx
// One live IPO: where it is, the money facts, demand so far, and the brief
// (points in favour, points to check). Research, not advice.
import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, CircleCheck } from 'lucide-react';
import Term from '../ui/Term';
import { Ipo, inr, known, stageLine } from './ipoData';

/** Subscription on a log scale from 0.1x to 300x, with 1x, 10x and 100x marked. */
function DemandMeter({ times }: { times: number }) {
  const lo = Math.log10(0.1);
  const hi = Math.log10(300);
  const x = (v: number) => ((Math.log10(Math.max(0.1, Math.min(300, v))) - lo) / (hi - lo)) * 100;
  const tone = times >= 10 ? 'bg-up' : times >= 1 ? 'bg-cobalt' : 'bg-caution';
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted"><Term k="subscription">Demand so far</Term></span>
        <span className="num font-semibold text-ink">{times.toLocaleString('en-IN', { maximumFractionDigits: 2 })}× subscribed</span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-ink/[0.08]" role="img" aria-label={`Subscribed ${times} times`}>
        <span className={`absolute inset-y-0 left-0 rounded-full ${tone}`} style={{ width: `${x(times)}%` }} />
        {[1, 10, 100].map((t) => (
          <span key={t} className="absolute -top-0.5 h-3 w-px bg-ink/30" style={{ left: `${x(t)}%` }} aria-hidden="true" />
        ))}
      </div>
      <div className="relative mt-1 h-3 text-[10px] text-muted" aria-hidden="true">
        {[1, 10, 100].map((t) => (
          <span key={t} className="num absolute -translate-x-1/2" style={{ left: `${x(t)}%` }}>{t}×</span>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value, hint }: { label: React.ReactNode; value: React.ReactNode; hint?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="num mt-0.5 truncate text-[15px] font-semibold text-ink" title={hint}>{value}</dd>
    </div>
  );
}

export default function IpoCard({ ipo }: { ipo: Ipo }) {
  const brief = ipo.brief || { favour: [], check: [] };
  const gmpTone = !ipo.gmp_known ? 'text-muted' : (ipo.gmp_value ?? 0) > 0 ? 'text-up' : (ipo.gmp_value ?? 0) < 0 ? 'text-down' : 'text-muted';
  const stageTone =
    ipo.stage === 'open' ? 'bg-up/10 text-up' : ipo.stage === 'upcoming' ? 'bg-accent/10 text-accent' : 'bg-caution/10 text-caution';
  const showDemand = ipo.stage !== 'upcoming' && ipo.subscription_times != null;

  return (
    <article className="flex flex-col rounded-card border border-line bg-surface p-5 transition-colors hover:border-accent/40">
      <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] text-ink">
            <Link to={`/ipos/${ipo.id}`} className="hover:text-accent">{ipo.company_name}</Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {ipo.category === 'SME' ? `SME · ${ipo.exchange || 'SME platform'}` : 'Mainboard · NSE + BSE'}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${stageTone}`}>{stageLine(ipo)}</span>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 sm:grid-cols-4">
        <Fact label="Price" value={known(ipo.price_band) || 'TBA'} />
        <Fact
          label="Minimum application"
          value={ipo.min_investment ? inr(ipo.min_investment) : 'TBA'}
          hint={known(ipo.lot_size) ? `One lot of ${ipo.lot_size} shares` : undefined}
        />
        <Fact label="Issue size" value={groupCr(known(ipo.issue_size)) || 'TBA'} />
        <Fact
          label={<Term k="gmp">Grey-market premium</Term>}
          value={
            <span className={gmpTone}>
              {!ipo.gmp_known ? 'Not quoted' : ipo.gmp_value != null ? (
                <>₹{ipo.gmp_value}{ipo.gmp_percent != null && <span className="ml-1 text-xs font-medium">({ipo.gmp_percent.toFixed(1)}%)</span>}</>
              ) : ipo.gmp}
            </span>
          }
          hint="Unofficial and unregulated"
        />
      </dl>

      {showDemand && <div className="mt-4"><DemandMeter times={ipo.subscription_times as number} /></div>}

      <div className="mt-4 grid flex-1 gap-4 sm:grid-cols-2">
        <section aria-label="Points in favour">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-up">
            <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> Points in favour
          </h4>
          {brief.favour.length ? (
            <ul className="mt-2 space-y-1.5 text-sm leading-snug text-ink/90">
              {brief.favour.map((t) => <li key={t}>{t}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Nothing stands out yet.</p>
          )}
        </section>
        <section aria-label="Points to check">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-caution">
            <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Points to check
          </h4>
          {brief.check.length ? (
            <ul className="mt-2 space-y-1.5 text-sm leading-snug text-ink/90">
              {brief.check.map((t) => <li key={t}>{t}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Nothing flagged yet.</p>
          )}
        </section>
      </div>

      <footer className="mt-5 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{ipo.source_updated_at ? `Updated ${ipo.source_updated_at} · ${ipo.source || 'source'}` : ''}</span>
        <Link to={`/ipos/${ipo.id}`} className="inline-flex min-h-[40px] items-center gap-1 font-semibold text-accent hover:underline">
          Full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}

/** "₹8981.12 Cr" -> "₹8,981.12 Cr" (Indian grouping). */
function groupCr(v: string | null | undefined) {
  if (!v) return v;
  return v.replace(/\d{4,}/, (n) => Number(n).toLocaleString('en-IN'));
}
