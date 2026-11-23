// src/components/invest/ExploreTab.tsx — every option as a compact list, grouped by risk.
import { useMemo, useState } from 'react';
import { Check, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { InvestOption, LivePayload, NEEDS, RiskLevel } from '../../data/investCatalog';
import { fitScore, fmtReturn, LiveTag, matchesProfile, midReturn, Profile, RiskMeter, RISK_NAME } from './investShared';

type Sort = 'fit' | 'retHi' | 'riskLo';

export interface ExploreFilters { cats: string[]; needs: string[]; maxRisk: RiskLevel; horizon: number; q: string; sort: Sort }
export const DEFAULT_FILTERS: ExploreFilters = { cats: [], needs: [], maxRisk: 5, horizon: 99, q: '', sort: 'riskLo' };

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

  const activeCount = f.needs.length + (f.maxRisk < 5 ? 1 : 0) + (f.horizon < 99 ? 1 : 0);
  const grouped = f.sort === 'riskLo';
  const groups = grouped
    ? ([1, 2, 3, 4, 5] as RiskLevel[]).map(r => ({ risk: r, items: list.filter(o => o.risk === r) })).filter(g => g.items.length)
    : [{ risk: 0 as const, items: list }];

  return (
    <div className="space-y-4">
      {/* Search, sort and the one filter row people use most: category */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" inputMode="search" enterKeyHint="search" id="invest-search" value={f.q}
            onChange={e => setFilters({ ...f, q: e.target.value })} placeholder="Tax saving, gold, monthly income" aria-label="Search options"
            className="h-10 w-full rounded-control border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25" />
        </div>
        <select id="invest-sort" aria-label="Sort by" value={f.sort} onChange={e => setFilters({ ...f, sort: e.target.value as Sort })}
          className="h-10 rounded-control border border-line bg-surface px-3 text-sm text-ink">
          <option value="riskLo">Lowest risk first</option>
          <option value="retHi">Highest typical return</option>
          {p.profile && <option value="fit">Best fit for my risk profile</option>}
        </select>
        <button type="button" onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} aria-controls="invest-more-filters"
          className={`inline-flex h-10 items-center gap-2 rounded-control border px-3 text-sm font-medium transition ${showFilters || activeCount ? 'border-cobalt text-ink' : 'border-line bg-surface text-ink'}`}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> More filters{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
        <button type="button" aria-pressed={!f.cats.length} className={`shrink-0 ${chip(!f.cats.length)}`} onClick={() => setFilters({ ...f, cats: [] })}>All</button>
        {Object.entries(p.categories).map(([k, v]) => (
          <button key={k} type="button" aria-pressed={f.cats.includes(k)} className={`shrink-0 ${chip(f.cats.includes(k))}`}
            onClick={() => setFilters({ ...f, cats: toggle(f.cats, k) })}>{v}</button>
        ))}
      </div>

      {showFilters && (
        <div id="invest-more-filters" className="grid gap-5 rounded-card border border-line bg-surface p-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="invest-max-risk" className="flex justify-between text-xs font-medium text-muted">
              <span>Highest risk I'll take</span><span className="text-accent">{RISK_NAME[f.maxRisk]}</span>
            </label>
            <input id="invest-max-risk" type="range" min={1} max={5} value={f.maxRisk}
              onChange={e => setFilters({ ...f, maxRisk: Number(e.target.value) as RiskLevel })} className="w-full accent-cobalt" />
          </div>
          <div className="space-y-2">
            <label htmlFor="invest-horizon" className="text-xs font-medium text-muted">I need the money in</label>
            <select id="invest-horizon" value={f.horizon} onChange={e => setFilters({ ...f, horizon: Number(e.target.value) })}
              className="h-10 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink">
              <option value={99}>Any time</option>
              <option value={1}>Under 1 year</option>
              <option value={3}>1 to 3 years</option>
              <option value={5}>3 to 5 years</option>
              <option value={10}>5 to 10 years</option>
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Must have</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(NEEDS).map(([k, v]) => (
                <button key={k} type="button" aria-pressed={f.needs.includes(k)} className={chip(f.needs.includes(k))}
                  onClick={() => setFilters({ ...f, needs: toggle(f.needs, k) })}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted">
        <span><b className="num text-ink">{list.length}</b> of {p.options.length} options. Returns are typical yearly ranges, not promises.</span>
        {(activeCount > 0 || f.cats.length > 0 || f.q) && (
          <button type="button" onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: f.sort })} className="font-semibold text-accent underline underline-offset-2">Clear all</button>
        )}
      </p>

      {list.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center text-muted">Nothing matches all of these. Raise the risk limit or remove a “Must have”.</div>
      ) : (
        <div className="space-y-6">
          {groups.map(g => (
            <section key={g.risk} aria-label={g.risk ? `${RISK_NAME[g.risk as RiskLevel]} risk` : 'Options'}>
              {g.risk > 0 && (
                <h3 className="mb-2 flex items-center gap-3 text-sm font-semibold text-ink">
                  <RiskMeter risk={g.risk as RiskLevel} />
                  <span className="num text-xs font-normal text-muted">{g.items.length}</span>
                </h3>
              )}
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
                {g.items.map(o => {
                  const inCmp = p.compare.includes(o.id);
                  const fit = matchesProfile(o, p.profile);
                  return (
                    <li key={o.id} className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 transition hover:bg-ink/[0.025] sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:px-5">
                      <div className="min-w-0">
                        <button type="button" onClick={() => p.onOpen(o)} className="text-left text-[15px] font-semibold leading-snug text-ink after:absolute after:inset-0 hover:text-accent">
                          {o.name}
                        </button>
                        <p className="truncate text-xs text-muted">
                          {p.categories[o.category]} · {o.best_for}
                          {fit && <span className="ml-1.5 font-semibold text-accent">· Fits your profile</span>}
                          {o.tags.includes('warning') && <span className="ml-1.5 font-semibold text-caution">· Caution</span>}
                        </p>
                      </div>
                      <p className="col-start-1 row-start-2 text-sm sm:col-start-auto sm:row-start-auto">
                        <span className="num font-semibold text-ink">{fmtReturn(o)}</span>
                        {!grouped && <span className="ml-2 sm:hidden"><RiskMeter risk={o.risk} /></span>}
                        <span className="text-muted sm:hidden"> · {o.lock_in === 'None' ? 'No lock-in' : `Lock-in ${o.lock_in}`}</span>
                        {o.live_symbol && p.live?.prices[o.live_symbol] && <span className="block"><LiveTag symbol={o.live_symbol} quote={p.live.prices[o.live_symbol]} /></span>}
                      </p>
                      <p className="hidden min-w-0 text-sm text-ink/85 sm:block">
                        {!grouped && <span className="mb-1 block"><RiskMeter risk={o.risk} /></span>}
                        <span className="block truncate">{o.lock_in === 'None' ? 'No lock-in' : `Lock-in ${o.lock_in}`}</span>
                      </p>
                      <button type="button" onClick={() => p.onToggleCompare(o.id)} aria-pressed={inCmp} aria-label={`${inCmp ? 'Remove' : 'Add'} ${o.name} ${inCmp ? 'from' : 'to'} compare`}
                        className={`relative z-[1] col-start-2 row-span-2 row-start-1 grid h-9 w-9 place-items-center rounded-full border transition sm:col-start-auto sm:row-span-1 sm:row-start-auto ${inCmp ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-ink/30 hover:text-ink'}`}>
                        {inCmp ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
