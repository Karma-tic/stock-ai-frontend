// src/components/invest/InvestExplorer.tsx — the /invest page.
// Every way to invest from India: typical returns, risks, tax, live prices, current rates and global routes.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, ShieldCheck } from 'lucide-react';
import SEO from '../SEO';
import { getPortfolio } from '../../lib/api';
import {
  bundledCatalog, bundledRates, fetchLive, fetchOptions, fetchRates, fetchSavedProfile, saveProfile, QuizAnswers,
} from '../../lib/investApi';
import { InvestOption, LivePayload, RatesPayload } from '../../data/investCatalog';
import ExploreTab, { DEFAULT_FILTERS, ExploreFilters } from './ExploreTab';
import OptionDrawer from './OptionDrawer';
import GoalsTab from './GoalsTab';
import { Goal } from './goals';
import RiskProfileTab from './RiskProfileTab';
import CompareTab from './CompareTab';
import GrowthTab, { Series } from './GrowthTab';
import RatesTab from './RatesTab';
import GlobalTab from './GlobalTab';
import { fmtPrice, midReturn, safeStorage, saveStorage, scoreProfile } from './investShared';

// Four tabs in the bar; the tools (quiz, projector, abroad) open from links and keep their URLs.
const TABS = [
  { id: 'goals', label: 'Start with a goal' },
  { id: 'all', label: 'All options' },
  { id: 'compare', label: 'Compare' },
  { id: 'rates', label: 'Today\'s rates' },
] as const;
const TOOLS = { profile: 'Risk profile', growth: 'Growth projector', global: 'Investing abroad' } as const;
type TabId = (typeof TABS)[number]['id'] | keyof typeof TOOLS;
const ALL_TABS: string[] = [...TABS.map(t => t.id), ...Object.keys(TOOLS)];

const LS_COMPARE = 'invest_compare';
const LS_ANSWERS = 'invest_profile_answers';

function PulseItem({ label, value, sub, live }: { label: string; value: string; sub?: React.ReactNode; live?: boolean }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <p className="flex items-center gap-1.5 truncate text-[11px] font-medium text-muted">
        {live && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-up" aria-hidden />}
        {label}
      </p>
      <p className="num text-lg font-semibold text-ink">{value}</p>
      {sub && <p className="text-[11px] num">{sub}</p>}
    </div>
  );
}

const pct = (v: number) => (
  <span className={v >= 0 ? 'text-up' : 'text-down'}>{v >= 0 ? '+' : ''}{v.toFixed(2)}% today</span>
);

export default function InvestExplorer({ user }: { user: any }) {
  const [params, setParams] = useSearchParams();
  const rawTab = params.get('tab');
  const tabParam = rawTab === 'explore' ? 'all' : rawTab; // old links
  const tab: TabId = tabParam && ALL_TABS.includes(tabParam) ? (tabParam as TabId) : 'goals';
  const goalId = params.get('goal');
  const setTab = useCallback((t: TabId) => {
    setParams(t === 'goals' ? (goalId ? { goal: goalId } : {}) : { tab: t }, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setParams, goalId]);
  const setGoal = useCallback((g: string | null) => setParams(g ? { goal: g } : {}, { replace: true }), [setParams]);

  // Data: render bundled copy immediately, then replace with server data.
  const [catalog, setCatalog] = useState(bundledCatalog);
  const [rates, setRates] = useState<RatesPayload>(bundledRates);
  const [live, setLive] = useState<LivePayload | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchOptions().then(setCatalog).catch(() => setOffline(true));
    fetchRates().then(setRates).catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () => { if (document.visibilityState === 'visible') fetchLive().then(d => alive && setLive(d)).catch(() => {}); };
    load();
    const t = window.setInterval(load, 60000);
    return () => { alive = false; window.clearInterval(t); };
  }, []);

  // Compare list
  const [compare, setCompare] = useState<string[]>(() => safeStorage<string[]>(LS_COMPARE, []));
  const toggleCompare = useCallback((id: string) => {
    setCompare(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(-4);
      saveStorage(LS_COMPARE, next);
      return next;
    });
  }, []);

  // Risk profile: device copy first, account copy wins when signed in.
  const [answers, setAnswers] = useState<QuizAnswers>(() => safeStorage(LS_ANSWERS, {}));
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const profile = useMemo(() => scoreProfile(answers), [answers]);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    fetchSavedProfile().then(a => { if (a) { setAnswers(a); saveStorage(LS_ANSWERS, a); } }).catch(() => {});
  }, [user]);

  const onAnswer = (key: string, value: number) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    saveStorage(LS_ANSWERS, next);
    if (user && scoreProfile(next)) {
      window.clearTimeout(saveTimer.current);
      setSaving('saving');
      saveTimer.current = window.setTimeout(() => {
        saveProfile(next).then(() => setSaving('saved')).catch(() => setSaving('error'));
      }, 600);
    }
  };

  // Explore filters + drawer
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);
  const [open, setOpen] = useState<InvestOption | null>(null);
  const closeDrawer = useCallback(() => setOpen(null), []);

  // Growth projector
  const [series, setSeries] = useState<Series[]>([{ id: 'fd', rate: 6.5 }, { id: 'ppf', rate: 7.1 }, { id: 'index', rate: 11.5 }]);
  const project = (o: InvestOption) => {
    setSeries(s => [s[0], s[1], { id: o.id, rate: midReturn(o) }]);
    setOpen(null);
    setTab('growth');
  };
  const seeAll = (g: Goal | null) => {
    setFilters({ ...DEFAULT_FILTERS, ...(g?.filters || {}) });
    setTab('all');
  };

  // Stock AI tie-in: what the user's tracked portfolio looks like.
  const [holdings, setHoldings] = useState<{ value: number; count: number } | null>(null);
  useEffect(() => {
    if (!user) return;
    getPortfolio()
      .then(r => {
        const rows = r.data?.portfolio || [];
        const value = r.data?.current_value || r.data?.total_invested || 0;
        if (rows.length && value > 0) setHoldings({ value, count: rows.length });
      })
      .catch(() => {});
  }, [user]);

  const byId = (id: string) => catalog.options.find(o => o.id === id);
  const compareItems = compare.map(byId).filter(Boolean) as InvestOption[];

  const repo = rates.rates.policy?.find(r => r.key === 'repo');
  const ppf = rates.rates.small_savings?.find(r => r.key === 'ppf');
  const topFd = rates.rates.bank_fd?.[0];
  const nifty = live?.prices.NIFTYBEES;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Invest Explorer: Every Investment Option in India | Stock AI"
        description="Compare FDs, PPF, SCSS, mutual funds, gold, REITs, bonds, NPS and global investing from India by return, risk, lock-in and tax, with current rates."
        canonicalPath="/invest"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
        <header className="max-w-2xl space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Compass className="h-4 w-4" aria-hidden="true" /> Invest Explorer</p>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink text-balance sm:text-[2.5rem] sm:leading-[1.1]">Where should your money go?</h1>
          <p className="text-muted">Pick what the money is for and see three options worth a look, with typical returns, risks and tax. Or browse all {catalog.options.length}, from FDs to global funds.</p>
        </header>

        {/* Four numbers people check most; the full list lives under Today's rates */}
        <section aria-label="Key rates and live prices">
          <div className="grid grid-cols-2 divide-line overflow-hidden rounded-card border border-line bg-surface sm:grid-cols-4 sm:divide-x">
            <PulseItem label="RBI repo rate" value={repo ? `${repo.rate.toFixed(2)}%` : '—'} />
            <PulseItem label="PPF" value={ppf ? `${ppf.rate.toFixed(2)}%` : '—'} sub={<span className="text-muted">tax-free</span>} />
            <PulseItem label="Top bank FD" value={topFd ? `${topFd.rate.toFixed(2)}%` : '—'} sub={<span className="text-muted">{topFd?.label.replace(' Small Finance Bank', ' SFB')}</span>} />
            <PulseItem live label="Nifty 50 ETF" value={nifty ? fmtPrice(nifty.price) : '—'} sub={nifty ? pct(nifty.change_pct) : <span className="text-muted">loading</span>} />
          </div>
          {rates.status.small_savings?.stale && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-caution" aria-hidden="true" />{rates.status.small_savings.message}
            </p>
          )}
        </section>

        {/* Portfolio tie-in */}
        {holdings && (
          <section className="rounded-card border border-line bg-surface flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold text-ink">Your Stock AI portfolio: {fmtPrice(holdings.value).replace(/\.\d+$/, '')} across {holdings.count} stock{holdings.count > 1 ? 's' : ''}, all Indian equity.</p>
                <p className="text-sm text-muted">Explore the safer options people pair with stocks to cushion a market fall.</p>
              </div>
            </div>
            <button type="button" onClick={() => { setFilters({ ...DEFAULT_FILTERS, needs: ['safe'] }); setTab('all'); }}
              className="inline-flex min-h-[44px] items-center justify-center rounded-control border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-ink/30">
              See low-risk options
            </button>
          </section>
        )}

        {/* Tabs */}
        <nav className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Invest Explorer sections">
          {TABS.map(t => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-4 ${tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              {t.id === 'all' ? `All ${catalog.options.length} options` : t.label}
              {t.id === 'compare' && compare.length ? <span className="ml-1 num text-accent">({compare.length})</span> : null}
            </button>
          ))}
        </nav>

        {tab in TOOLS && (
          <button type="button" onClick={() => setTab('goals')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline underline-offset-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to goals
            <span className="font-normal text-muted">/ {TOOLS[tab as keyof typeof TOOLS]}</span>
          </button>
        )}

        <div role="tabpanel">
          {tab === 'goals' && (
            <GoalsTab goalId={goalId} onGoal={setGoal} options={catalog.options} categories={catalog.categories} live={live} compare={compare}
              profile={profile} onToggleCompare={toggleCompare} onOpen={setOpen} onSeeAll={seeAll}
              onQuiz={() => setTab('profile')} onGrowth={() => setTab('growth')} onGlobal={() => setTab('global')} />
          )}
          {tab === 'all' && (
            <ExploreTab options={catalog.options} categories={catalog.categories} profile={profile} live={live} compare={compare}
              filters={filters} setFilters={setFilters} onToggleCompare={toggleCompare} onOpen={setOpen} />
          )}
          {tab === 'profile' && (
            <RiskProfileTab answers={answers} profile={profile} options={catalog.options} signedIn={!!user} saving={saving} onAnswer={onAnswer}
              onSeeMatches={() => { if (profile) setFilters({ ...DEFAULT_FILTERS, maxRisk: profile.maxRisk, sort: 'fit' }); setTab('all'); }} />
          )}
          {tab === 'compare' && <CompareTab items={compareItems} onRemove={toggleCompare} onBrowse={() => setTab('goals')} />}
          {tab === 'growth' && <GrowthTab options={catalog.options} series={series} setSeries={setSeries} defaultRate={midReturn} />}
          {tab === 'rates' && <RatesTab data={rates} />}
          {tab === 'global' && <GlobalTab live={live} />}
        </div>

        <footer className="border-t border-line pt-6 text-xs text-muted space-y-1 max-w-4xl">
          <p><b>For education only.</b> Stock AI is not SEBI-registered and does not give personal investment advice. Returns are typical or historical ranges and are not guaranteed.</p>
          <p>Verify every rate with the issuer before investing. {offline && 'Showing the last saved rates while live data is unavailable. '}See our <Link to="/disclaimer" className="underline">disclaimer</Link>.</p>
        </footer>
      </div>

      {/* Compare tray: the options you picked collect here while you browse */}
      {(tab === 'goals' || tab === 'all') && compareItems.length > 0 && (
        <div className={`fixed inset-x-0 z-40 border-t border-line bg-canvas/90 backdrop-blur-[16px] ${user ? 'bottom-[calc(57px+env(safe-area-inset-bottom))] lg:bottom-0' : 'bottom-0 pb-[env(safe-area-inset-bottom)]'}`}>
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <p className="hidden shrink-0 text-xs font-medium text-muted sm:block">Comparing</p>
            <ul className="fade-x-end flex min-w-0 flex-1 gap-2 overflow-x-auto pr-6 scrollbar-hide" aria-label="Options to compare">
              {compareItems.map(o => (
                <li key={o.id} className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface py-1 pl-3 pr-1 text-xs font-medium text-ink">
                  <span className="max-w-[10rem] truncate">{o.name}</span>
                  <button type="button" onClick={() => toggleCompare(o.id)} aria-label={`Remove ${o.name} from compare`} className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-ink/[0.06] hover:text-ink">×</button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setTab('compare')} className="inline-flex h-10 shrink-0 items-center rounded-control bg-cobalt px-4 text-sm font-semibold text-white">
              Compare ({compareItems.length})
            </button>
          </div>
        </div>
      )}

      <OptionDrawer option={open} categories={catalog.categories} live={live} inCompare={!!open && compare.includes(open.id)}
        onClose={closeDrawer} onToggleCompare={toggleCompare} onProject={project} />
    </div>
  );
}
