// src/components/invest/ExploreTab.tsx — filterable catalog of investment options.
import { useMemo, useState } from 'react';
import { Check, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { InvestOption, LivePayload, NEEDS, RiskLevel } from '../../data/investCatalog';
import { fitScore, fmtReturn, LiveTag, matchesProfile, midReturn, Profile, RiskMeter, RISK_NAME } from './investShared';

type Sort = 'fit' | 'retHi' | 'riskLo';

export interface ExploreFilters { cats: string[]; needs: string[]; maxRisk: RiskLevel; horizon: number; q: string; sort: Sort }
export const DEFAULT_FILTERS: ExploreFilters = { cats: [], needs: [], maxRisk: 5, horizon: 99, q: '', sort: 'fit' };

interface Props {
  options: InvestOption[];
  categories: Record<string, string>;
  profile: Profile | null;
  live: LivePayload | null;
  compare: string[];
  filters: ExploreFilters;
  setFilters: (f: ExploreFilters) => void;
  onToggleCompare: (id: string) => void;
  onOpen: (o: InvestOption) => void;
  onTakeQuiz: () => void;
}

const chip = (on: boolean) =>
  `min-h-[32px] rounded-full border px-3 text-xs font-medium transition ${
    on ? 'border-cobalt bg-cobalt text-white' : 'border-line bg-surface text-ink/85 hover:border-ink/25'
  }`;

export default function ExploreTab(p: Props) {
  const { filters: f, setFilters } = p;
  const [showFilters, setShowFilters] = useState(false);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const res = p.options.filter(o =>
      (!f.cats.length || f.cats.includes(o.category)) &&
      o.risk <= f.maxRisk &&
      o.min_horizon_years <= f.horizon &&
      f.needs.every(n => o.tags.includes(n)) &&
      (!q || [o.name, o.best_for, o.tax, o.how_to_invest, p.categories[o.category], ...o.pros, ...o.risks].join(' ').toLowerCase().includes(q)),
    );
    const mid = (o: InvestOption) => (o.return_low < 0 ? 0 : midReturn(o));
    const sorters: Record<Sort, (a: InvestOption, b: InvestOption) => number> = {
      fit: (a, b) => fitScore(b, p.profile) - fitScore(a, p.profile) || a.sort_order - b.sort_order,
      retHi: (a, b) => mid(b) - mid(a),
      riskLo: (a, b) => a.risk - b.risk || mid(b) - mid(a),
    };
    return res.sort(sorters[f.sort]);
  }, [p.options, p.categories, p.profile, f]);

  const activeCount = f.cats.length + f.needs.length + (f.maxRisk < 5 ? 1 : 0) + (f.horizon < 99 ? 1 : 0);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Filters */}
      <aside className={`rounded-card border border-line bg-surface p-5 space-y-5 lg:sticky lg:top-24 ${showFilters ? '' : 'hidden lg:block'}`} aria-label="Filters">
        <div className="rounded-control bg-ink/[0.05] px-3 py-2.5 text-sm flex items-center justify-between gap-2">
          {p.profile ? (
            <span>Profile: <b className="text-accent">{p.profile.name}</b></span>
          ) : (
            <span className="text-muted">Rank results for you</span>
          )}
          <button type="button" onClick={p.onTakeQuiz} className="text-accent font-semibold underline underline-offset-2 text-xs">
            {p.profile ? 'Retake' : 'Take quiz'}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(p.categories).map(([k, v]) => (
              <button key={k} type="button" aria-pressed={f.cats.includes(k)} className={chip(f.cats.includes(k))} onClick={() => setFilters({ ...f, cats: toggle(f.cats, k) })}>{v}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="invest-max-risk" className="text-xs font-medium text-muted flex justify-between">
            <span>Max risk</span><span className="normal-case tracking-normal text-accent">{f.maxRisk} · {RISK_NAME[f.maxRisk]}</span>
          </label>
          <input id="invest-max-risk" type="range" min={1} max={5} value={f.maxRisk} onChange={e => setFilters({ ...f, maxRisk: Number(e.target.value) as RiskLevel })} className="w-full accent-cobalt" />
        </div>

        <div className="space-y-2">
          <label htmlFor="invest-horizon" className="text-xs font-medium text-muted">I can stay invested for</label>
          <select id="invest-horizon" value={f.horizon} onChange={e => setFilters({ ...f, horizon: Number(e.target.value) })} className="h-10 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink">
            <option value={99}>Any period</option>
            <option value={1}>Under 1 year</option>
            <option value={3}>1–3 years</option>
            <option value={5}>3–5 years</option>
            <option value={10}>5–10 years</option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted">Must have</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(NEEDS).map(([k, v]) => (
              <button key={k} type="button" aria-pressed={f.needs.includes(k)} className={chip(f.needs.includes(k))} onClick={() => setFilters({ ...f, needs: toggle(f.needs, k) })}>{v}</button>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <button type="button" onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: f.sort })} className="text-sm font-semibold text-accent underline underline-offset-2">Clear filters</button>
        )}
      </aside>

      {/* Results */}
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="search" id="invest-search" value={f.q} onChange={e => setFilters({ ...f, q: e.target.value })} placeholder="Search: tax saving, gold, monthly income…" aria-label="Search options"
              className="h-10 w-full rounded-control border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25" />
          </div>
          <select id="invest-sort" aria-label="Sort by" value={f.sort} onChange={e => setFilters({ ...f, sort: e.target.value as Sort })} className="h-10 rounded-control border border-line bg-surface px-3 text-sm text-ink">
            <option value="fit">{p.profile ? 'Best match for my profile' : 'Recommended order'}</option>
            <option value="retHi">Highest typical return</option>
            <option value="riskLo">Lowest risk</option>
          </select>
          <button type="button" onClick={() => setShowFilters(s => !s)} className="lg:hidden inline-flex h-10 items-center gap-2 rounded-control border border-line bg-surface px-3 text-sm font-medium text-ink">
            <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
        </div>

        <p className="text-sm text-muted">
          <b className="text-ink num">{list.length}</b> options match. Returns are typical yearly ranges, not promises.
        </p>

        {list.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-10 text-center text-muted">Nothing matches all these filters. Raise the risk limit or remove a “Must have”.</div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {list.map(o => {
              const fit = matchesProfile(o, p.profile);
              const inCmp = p.compare.includes(o.id);
              return (
                <article key={o.id} className={`rounded-card border border-line bg-surface p-5 flex flex-col gap-3 transition ${fit ? 'border-accent/50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted">{p.categories[o.category]}</p>
                      <h3 className="text-base font-semibold leading-snug text-ink">{o.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      {o.return_label ? (
                        <p className="max-w-[8.5rem] text-sm font-semibold leading-snug text-ink">{o.return_label}</p>
                      ) : (
                        <p className="num whitespace-nowrap text-lg font-semibold text-ink">{fmtReturn(o)}</p>
                      )}
                      {!o.return_label && <p className="text-[11px] text-muted">typical / yr</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskMeter risk={o.risk} />
                    {fit && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">Matches your profile</span>}
                    {o.tags.includes('warning') && <span className="rounded-full bg-caution/15 px-2 py-0.5 text-[11px] font-bold text-caution">Caution</span>}
                  </div>
                  <p className="text-sm text-ink/85">{o.best_for}</p>
                  {o.live_symbol && <LiveTag symbol={o.live_symbol} quote={p.live?.prices[o.live_symbol]} />}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div><dt className="text-[11px] text-muted">Lock-in</dt><dd className="font-semibold text-ink">{o.lock_in}</dd></div>
                    <div><dt className="text-[11px] text-muted">Minimum</dt><dd className="font-semibold text-ink">{o.minimum}</dd></div>
                  </dl>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
                    <button type="button" onClick={() => p.onOpen(o)} className="text-sm font-semibold text-accent hover:underline underline-offset-2">Risks & details →</button>
                    <button type="button" onClick={() => p.onToggleCompare(o.id)} aria-pressed={inCmp}
                      className={`inline-flex items-center gap-1 rounded-control border px-3 py-1.5 text-xs font-semibold transition ${inCmp ? 'border-accent bg-accent/10 text-accent' : 'border-line text-ink/85 hover:border-accent/40'}`}>
                      {inCmp ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />} {inCmp ? 'Comparing' : 'Compare'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
