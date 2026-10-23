// src/components/invest/InvestExplorer.tsx — the /invest page.
// Every way to invest from India: typical returns, risks, tax, live prices, current rates and global routes.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';
import SEO from '../SEO';
import { getPortfolio } from '../../lib/api';
import {
  bundledCatalog, bundledRates, fetchLive, fetchOptions, fetchRates, fetchSavedProfile, saveProfile, QuizAnswers,
} from '../../lib/investApi';
import { InvestOption, LivePayload, RatesPayload } from '../../data/investCatalog';
import ExploreTab, { DEFAULT_FILTERS, ExploreFilters } from './ExploreTab';
import OptionDrawer from './OptionDrawer';
import RiskProfileTab from './RiskProfileTab';
import CompareTab from './CompareTab';
import GrowthTab, { Series } from './GrowthTab';
import RatesTab from './RatesTab';
import GlobalTab from './GlobalTab';
import { fmtPrice, midReturn, safeStorage, saveStorage, scoreProfile } from './investShared';

const TABS = [
  { id: 'explore', label: 'Explore options' },
  { id: 'profile', label: 'My risk profile' },
  { id: 'compare', label: 'Compare' },
  { id: 'growth', label: 'Growth projector' },
  { id: 'rates', label: 'Rates & offers' },
  { id: 'global', label: 'Invest globally' },
] as const;
type TabId = (typeof TABS)[number]['id'];

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
  const tabParam = params.get('tab') as TabId | null;
  const tab: TabId = TABS.some(t => t.id === tabParam) ? (tabParam as TabId) : 'explore';
  const setTab = useCallback((t: TabId) => {
    setParams(t === 'explore' ? {} : { tab: t }, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setParams]);

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
  const [compare, setCompare] = useState<string[]>(() => safeStorage(LS_COMPARE, ['ppf', 'sfbfd', 'index']));
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
  const scss = rates.rates.small_savings?.find(r => r.key === 'scss');
  const topFd = rates.rates.bank_fd?.[0];
  const nifty = live?.prices.NIFTYBEES;
  const gold = live?.prices.GOLDBEES;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Invest Explorer: Every Investment Option in India | Stock AI"
        description="Compare FDs, PPF, SCSS, mutual funds, gold, REITs, bonds, NPS and global investing from India by return, risk, lock-in and tax, with current rates."
        canonicalPath="/invest"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Compass className="h-4 w-4" /> Invest Explorer</p>
            <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl text-balance">Every way to invest from India, side by side</h1>
            <p className="text-muted">What each option typically returns, what can go wrong, how it is taxed, and today's best rates. Beyond stocks: FDs, government schemes, bonds, gold, REITs, retirement and global markets.</p>
          </div>
        </header>

        {/* Pulse strip */}
        <section aria-label="Key rates and live prices" className="rounded-card border border-line bg-surface grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          <PulseItem label="RBI repo rate" value={repo ? `${repo.rate.toFixed(2)}%` : '—'} />
          <PulseItem label="PPF" value={ppf ? `${ppf.rate.toFixed(2)}%` : '—'} sub={<span className="text-muted">tax-free</span>} />
          <PulseItem label="Senior Citizen Savings" value={scss ? `${scss.rate.toFixed(2)}%` : '—'} />
          <PulseItem label="Top bank FD" value={topFd ? `${topFd.rate.toFixed(2)}%` : '—'} sub={<span className="text-muted">{topFd?.label.replace(' Small Finance Bank', ' SFB')}</span>} />
          <PulseItem live label="Nifty 50 ETF" value={nifty ? fmtPrice(nifty.price) : '—'} sub={nifty ? pct(nifty.change_pct) : <span className="text-muted">loading</span>} />
          <PulseItem live label="Gold ETF" value={gold ? fmtPrice(gold.price) : '—'} sub={gold ? pct(gold.change_pct) : <span className="text-muted">loading</span>} />
        </section>
        {rates.status.small_savings?.stale && (
          <p className="rounded-control border border-caution/30 bg-caution/10 px-4 py-2.5 text-sm text-caution">{rates.status.small_savings.message}</p>
        )}

        {/* Portfolio tie-in */}
        {holdings && (
          <section className="rounded-card border border-accent/30 bg-accent/[0.06] flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold text-ink">Your Stock AI portfolio: {fmtPrice(holdings.value).replace(/\.\d+$/, '')} across {holdings.count} stock{holdings.count > 1 ? 's' : ''}, all Indian equity.</p>
                <p className="text-sm text-muted">Explore the safer options people pair with stocks to cushion a market fall.</p>
              </div>
            </div>
            <button type="button" onClick={() => { setFilters({ ...DEFAULT_FILTERS, needs: ['safe'] }); setTab('explore'); }}
              className="inline-flex min-h-[44px] items-center justify-center rounded-control bg-cobalt px-4 text-sm font-semibold text-white hover:brightness-110">
              See low-risk options
            </button>
          </section>
        )}

        {/* Tabs */}
        <nav className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Invest Explorer sections">
          {TABS.map(t => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 sm:px-4 text-sm font-semibold transition ${tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              {t.label}{t.id === 'compare' && compare.length ? <span className="ml-1 num text-accent">({compare.length})</span> : null}
            </button>
          ))}
        </nav>

        <div role="tabpanel">
          {tab === 'explore' && (
            <ExploreTab options={catalog.options} categories={catalog.categories} profile={profile} live={live} compare={compare}
              filters={filters} setFilters={setFilters} onToggleCompare={toggleCompare} onOpen={setOpen} onTakeQuiz={() => setTab('profile')} />
          )}
          {tab === 'profile' && (
            <RiskProfileTab answers={answers} profile={profile} options={catalog.options} signedIn={!!user} saving={saving} onAnswer={onAnswer}
              onSeeMatches={() => { if (profile) setFilters({ ...DEFAULT_FILTERS, maxRisk: profile.maxRisk }); setTab('explore'); }} />
          )}
          {tab === 'compare' && <CompareTab items={compareItems} onRemove={toggleCompare} onBrowse={() => setTab('explore')} />}
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
      {tab === 'explore' && compareItems.length > 0 && (
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
