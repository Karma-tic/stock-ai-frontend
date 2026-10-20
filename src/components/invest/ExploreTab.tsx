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
  `rounded-full border px-3 py-1 text-xs font-medium transition ${
 on ? 'border-lavender-primary bg-lavender-primary text-white' : 'border-lavender-text/15 bg-surface text-lavender-text/80 hover:border-lavender-primary/40'
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
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
      {/* Filters */}
      <aside className={`app-card p-5 space-y-5 lg:sticky lg:top-24 ${showFilters ? '' : 'hidden lg:block'}`} aria-label="Filters">
        <div className="rounded-xl bg-lavender-surface px-3 py-2.5 text-sm flex items-center justify-between gap-2">
          {p.profile ? (
            <span>Profile: <b className="text-lavender-primary">{p.profile.name}</b></span>
          ) : (
            <span className="text-lavender-text/70">Rank results for you</span>
          )}
          <button type="button" onClick={p.onTakeQuiz} className="text-lavender-primary font-semibold underline underline-offset-2 text-xs">
            {p.profile ? 'Retake' : 'Take quiz'}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(p.categories).map(([k, v]) => (
              <button key={k} type="button" aria-pressed={f.cats.includes(k)} className={chip(f.cats.includes(k))} onClick={() => setFilters({ ...f, cats: toggle(f.cats, k) })}>{v}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="invest-max-risk" className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60 flex justify-between">
            <span>Max risk</span><span className="normal-case tracking-normal text-lavender-primary">{f.maxRisk} · {RISK_NAME[f.maxRisk]}</span>
          </label>
          <input id="invest-max-risk" type="range" min={1} max={5} value={f.maxRisk} onChange={e => setFilters({ ...f, maxRisk: Number(e.target.value) as RiskLevel })} className="w-full accent-cobalt" />
        </div>

        <div className="space-y-2">
          <label htmlFor="invest-horizon" className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">I can stay invested for</label>
          <select id="invest-horizon" value={f.horizon} onChange={e => setFilters({ ...f, horizon: Number(e.target.value) })} className="w-full rounded-xl border border-lavender-text/15 bg-surface px-3 py-2 text-sm">
            <option value={99}>Any period</option>
            <option value={1}>Under 1 year</option>
            <option value={3}>1–3 years</option>
            <option value={5}>3–5 years</option>
            <option value={10}>5–10 years</option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">Must have</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(NEEDS).map(([k, v]) => (
              <button key={k} type="button" aria-pressed={f.needs.includes(k)} className={chip(f.needs.includes(k))} onClick={() => setFilters({ ...f, needs: toggle(f.needs, k) })}>{v}</button>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <button type="button" onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: f.sort })} className="text-sm font-semibold text-lavender-primary underline underline-offset-2">Clear filters</button>
        )}
      </aside>

      {/* Results */}
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lavender-text/50" />
            <input type="search" id="invest-search" value={f.q} onChange={e => setFilters({ ...f, q: e.target.value })} placeholder="Search: tax saving, gold, monthly income…" aria-label="Search options"
              className="w-full rounded-xl border border-lavender-text/15 bg-surface py-2.5 pl-9 pr-3 text-sm" />
          </div>
          <select id="invest-sort" aria-label="Sort by" value={f.sort} onChange={e => setFilters({ ...f, sort: e.target.value as Sort })} className="rounded-xl border border-lavender-text/15 bg-surface px-3 py-2.5 text-sm">
            <option value="fit">{p.profile ? 'Best match for my profile' : 'Recommended order'}</option>
            <option value="retHi">Highest typical return</option>
            <option value="riskLo">Lowest risk</option>
          </select>
          <button type="button" onClick={() => setShowFilters(s => !s)} className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-lavender-text/15 bg-surface px-3 py-2.5 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
        </div>

        <p className="text-sm text-lavender-text/70">
          <b className="text-lavender-text tabular-nums">{list.length}</b> options match. Returns are typical yearly ranges, not promises.
        </p>

        {list.length === 0 ? (
          <div className="app-card p-10 text-center text-lavender-text/70">Nothing matches all these filters. Raise the risk limit or remove a “Must have”.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {list.map(o => {
              const fit = matchesProfile(o, p.profile);
              const inCmp = p.compare.includes(o.id);
              return (
                <article key={o.id} className={`app-card p-5 flex flex-col gap-3 transition hover:shadow-lavender ${fit ? 'ring-2 ring-lavender-primary/40' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">{p.categories[o.category]}</p>
                      <h3 className="text-lg font-bold leading-snug text-lavender-text">{o.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold tabular-nums text-lavender-text whitespace-nowrap">{fmtReturn(o)}</p>
                      <p className="text-[11px] text-lavender-text/60">typical / yr</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskMeter risk={o.risk} />
                    {fit && <span className="rounded-full bg-lavender-primary/10 px-2 py-0.5 text-[11px] font-bold text-lavender-primary">Matches your profile</span>}
                    {o.tags.includes('warning') && <span className="rounded-full bg-caution/15 px-2 py-0.5 text-[11px] font-bold text-caution dark:text-caution">Caution</span>}
                  </div>
                  <p className="text-sm text-lavender-text/75">{o.best_for}</p>
                  {o.live_symbol && <LiveTag symbol={o.live_symbol} quote={p.live?.prices[o.live_symbol]} />}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div><dt className="text-[11px] text-lavender-text/60">Lock-in</dt><dd className="font-semibold text-lavender-text">{o.lock_in}</dd></div>
                    <div><dt className="text-[11px] text-lavender-text/60">Minimum</dt><dd className="font-semibold text-lavender-text">{o.minimum}</dd></div>
                  </dl>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-lavender-text/10 pt-3">
                    <button type="button" onClick={() => p.onOpen(o)} className="text-sm font-semibold text-lavender-primary hover:underline underline-offset-2">Risks & details →</button>
                    <button type="button" onClick={() => p.onToggleCompare(o.id)} aria-pressed={inCmp}
                      className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${inCmp ? 'border-lavender-primary bg-lavender-primary/10 text-lavender-primary' : 'border-lavender-text/15 text-lavender-text/80 hover:border-lavender-primary/40'}`}>
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
