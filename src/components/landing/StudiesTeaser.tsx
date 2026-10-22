import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import { useApi, useInView } from './hooks';

type Row = { horizon: string; label: string; n_peers?: number; median_vs_peers?: number; beat_peers_share?: number };
type Study = { id: string; title: string; summary: Row[]; events_priced: number; period_from?: string; period_to?: string };

// Three findings from the live studies, all at the same 6-month horizon so none is picked for looking good.
const PICKS: { id: string; horizon: string }[] = [
  { id: 'promoter_sell', horizon: '6m' },
  { id: 'promoter_buy', horizon: '6m' },
  { id: 'dii_up', horizon: '6m' },
];

function read(r: Row) {
  const g = r.median_vs_peers ?? 0;
  if (Math.abs(g) < 1) return 'About the same as similar stocks';
  return `${g > 0 ? 'Ahead of' : 'Behind'} similar stocks by ${Math.abs(g).toFixed(1)} points`;
}

export default function StudiesTeaser() {
  const [ref, near] = useInView<HTMLElement>('300px');
  const res = useApi<{ studies: Study[] }>('/api/studies', near);
  const byId = new Map((res.data?.studies || []).map((s) => [s.id, s]));
  const cards = PICKS.map((p) => {
    const s = byId.get(p.id);
    const r = s?.summary.find((x) => x.horizon === p.horizon && x.median_vs_peers != null);
    return s && r ? { s, r } : null;
  }).filter(Boolean) as { s: Study; r: Row }[];

  if (res.status === 'error' || (res.status === 'ready' && !cards.length)) return null;

  return (
    <section ref={ref} aria-labelledby="studies-heading" className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold text-accent">Studies</p>
        <h2 id="studies-heading" className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
          We checked whether following big investors works.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Every promoter trade and big stake change on NSE over three years, each measured against similar stocks on the same days. We publish the results as they came out, including when a signal did not help.
        </p>

        {!cards.length ? (
          <Skeleton className="mt-10 h-36 w-full" />
        ) : (
          <ul className="mt-10 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
            {cards.map(({ s, r }) => {
              const g = r.median_vs_peers ?? 0;
              return (
                <li key={s.id} className="flex flex-col bg-surface p-5 sm:p-6">
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className={`num mt-4 text-3xl font-semibold tracking-[-0.02em] ${Math.abs(g) < 1 ? 'text-ink' : g > 0 ? 'text-up' : 'text-down'}`}>
                    {g > 0 ? '+' : g < 0 ? '−' : ''}
                    {Math.abs(g).toFixed(1)} pts
                  </p>
                  <p className="mt-1 text-sm text-ink/85">{read(r)}, {r.label} later.</p>
                  <p className="num mt-auto pt-4 text-xs text-muted">
                    {(r.n_peers || 0).toLocaleString('en-IN')} cases · {r.beat_peers_share?.toFixed(0)}% came out ahead
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl text-xs leading-relaxed text-muted">Typical case shown. Outcomes varied widely, and past patterns do not predict any single stock.</p>
          <Link to="/studies" className="group inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-accent">
            See all seven studies <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
