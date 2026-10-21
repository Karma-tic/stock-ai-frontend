import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Newspaper, Search, X } from 'lucide-react';

import { getTopStocks, getWatchlist, searchStocks, getStock } from '../lib/api';
import { usePlan } from '../lib/usePlan';
import { cleanTicker } from '../lib/evidence';

import EvidenceBoard from './EvidenceBoard';
import LatestSignals from './LatestSignals';
import Portfolio from './Portfolio';
import AdBanner from './AdBanner';
import UpcomingIpos from './UpcomingIpos';
import UpgradeModal from './UpgradeModal';
import TrendingStocks from './TrendingStocks';
import TodayRadar from './TodayRadar';
import StockRow, { StockRowSkeleton } from './app/StockRow';
import NextUp from './app/NextUp';
import Segmented from './ui/Segmented';

type DashboardTab = 'market' | 'watchlist' | 'portfolio' | 'trending' | 'ipos' | 'radar';
const TABS: DashboardTab[] = ['market', 'watchlist', 'radar', 'trending', 'ipos', 'portfolio'];
const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN'];

export default function Dashboard({ initialTab = 'market' }: { initialTab?: DashboardTab }) {
  const { isPro } = usePlan();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as DashboardTab | null;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [stocks, setStocks] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);
  const [watchLoaded, setWatchLoaded] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [tab, setTabState] = useState<DashboardTab>(urlTab && TABS.includes(urlTab) ? urlTab : initialTab);

  // Search (signed-in search covers the whole NSE list and opens the Evidence Board)
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (urlTab && TABS.includes(urlTab)) setTabState(urlTab);
    else setTabState(initialTab);
  }, [initialTab, urlTab]);

  const setTab = (t: DashboardTab) => {
    setTabState(t);
    if (initialTab === 'radar') return; // /today keeps its own URL
    const next = new URLSearchParams(searchParams);
    if (t === 'market') next.delete('tab');
    else next.set('tab', t);
    setSearchParams(next, { replace: true });
  };

  const loadTopStocks = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await getTopStocks();
      setStocks(res.data.stocks || []);
    } catch (e) {
      console.error(e);
      setLoadError(true);
    }
    setLoading(false);
  };

  const loadWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setWatchlistStocks(res.data.watchlist || []);
      setWatchlist((res.data.watchlist || []).map((w: any) => cleanTicker(w.ticker)));
    } catch (e) {
      console.error(e);
    }
    setWatchLoaded(true);
  };

  useEffect(() => {
    loadTopStocks();
    loadWatchlist();
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchResults([]);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleSearch = (q: string) => {
    setSearch(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchStocks(q);
        setSearchResults(res.data.results || []);
      } catch {
        setSearchResults([]);
      }
      setSearchLoading(false);
    }, 350);
  };

  const openAnalysis = async (symbol: string) => {
    setSearch('');
    setSearchResults([]);
    try {
      const res = await getStock(symbol);
      setSelected(res.data);
    } catch (e) {
      console.error(e);
      setSelected({ display_ticker: symbol, company_name: '' });
    }
  };

  // Deep link: /?analyze=TICKER opens the Evidence Board
  useEffect(() => {
    const symbol = searchParams.get('analyze');
    if (!symbol) return;
    openAnalysis(symbol).finally(() => {
      const next = new URLSearchParams(searchParams);
      next.delete('analyze');
      setSearchParams(next, { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowProps = (stock: any) => ({
    stock,
    onAnalyze: setSelected,
    inWatchlist: watchlist.includes(cleanTicker(stock.display_ticker || stock.ticker)),
    canAddToWatchlist: isPro || watchlist.length < 5,
    onWatchlistChange: loadWatchlist,
    onUpgradeNeeded: () => setShowUpgrade(true),
  });

  const list = tab === 'market' ? stocks : watchlistStocks;

  const renderList = () => {
    if (tab === 'market' && loading) return <StockRowSkeleton rows={8} />;
    if (tab === 'market' && loadError)
      return (
        <div className="py-10 text-center">
          <p className="text-sm text-muted">Prices could not be loaded.</p>
          <button type="button" onClick={loadTopStocks} className="mt-3 inline-flex min-h-[44px] items-center rounded-control border border-line px-4 text-sm font-semibold text-ink hover:bg-ink/[0.06]">
            Retry
          </button>
        </div>
      );
    if (tab === 'watchlist' && !watchLoaded) return <StockRowSkeleton rows={4} />;
    if (tab === 'watchlist' && !list.length)
      return (
        <div className="py-8">
          <p className="text-base font-semibold text-ink">Your watchlist is empty</p>
          <p className="mt-1 text-sm text-muted">Add stocks to follow their prices and get them on your radar. Tap one to start:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => openAnalysis(t)}
                className="num inline-flex min-h-[40px] items-center rounded-full border border-line px-3 text-xs font-semibold text-ink hover:border-accent/50 hover:text-accent"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      );
    return (
      <ul>
        {list.map((stock: any, index: number) => (
          <Fragment key={stock.display_ticker || stock.ticker}>
            <StockRow {...rowProps(stock)} />
            {index === 5 && (
              <li className="list-none border-b border-line py-3">
                {/* Reserved height so the ad never shifts the list */}
                <div className="min-h-[100px]">
                  <AdBanner slot={process.env.REACT_APP_ADSENSE_IN_FEED_SLOT || ''} />
                </div>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-canvas pb-24 lg:pb-12">
      {/* Tabs: one segmented control, sticky under the top bar */}
      <div className="sticky top-[var(--nav-h,64px)] z-30 border-b border-line bg-canvas/90 backdrop-blur-[16px]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
          <Segmented<DashboardTab>
            label="Dashboard"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'market', label: 'Market' },
              { value: 'watchlist', label: `Watchlist (${watchlist.length})` },
              { value: 'radar', label: 'Today' },
              { value: 'trending', label: 'Trending' },
              { value: 'ipos', label: 'IPOs' },
              { value: 'portfolio', label: 'Portfolio' },
            ]}
          />
        </div>
      </div>

      <div className={`mx-auto grid max-w-7xl gap-6 px-4 pt-6 sm:px-6 ${tab === 'radar' ? '' : 'lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]'}`}>
        {/* Left rail: watchlist (larger screens) */}
        <aside className={tab === 'radar' ? 'hidden' : 'hidden lg:block'}>
          <div className="sticky top-[calc(var(--nav-h,64px)+72px)] rounded-card border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Watchlist</h2>
              <button type="button" onClick={() => setTab('watchlist')} className="min-h-[36px] text-xs font-semibold text-accent">
                Open
              </button>
            </div>
            {!watchLoaded ? (
              <div className="mt-2 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="skeleton block h-10 w-full" />
                ))}
              </div>
            ) : watchlistStocks.length ? (
              <ul className="mt-1">
                {watchlistStocks.slice(0, 12).map((s: any) => (
                  <StockRow key={s.display_ticker || s.ticker} {...rowProps(s)} compact />
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Star a stock to follow it here.</p>
            )}
          </div>
        </aside>

        {/* Centre: the current tab */}
        <main className="min-w-0">
          {tab === 'radar' ? (
            <TodayRadar onBrowseStocks={() => setTab('market')} />
          ) : (
            <>
              {(tab === 'market' || tab === 'watchlist') && (
                <div ref={searchRef} className="relative mb-4">
                  <label htmlFor="dash-search" className="sr-only">
                    Search any NSE stock to analyze
                  </label>
                  <div className="flex h-12 items-center gap-2 rounded-control border border-line bg-surface px-3 focus-within:border-accent/60">
                    <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                    <input
                      id="dash-search"
                      type="search"
                      autoComplete="off"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Analyze any NSE stock, e.g. RELIANCE"
                      className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/80 focus:outline-none"
                    />
                    {search && (
                      <button type="button" onClick={() => handleSearch('')} aria-label="Clear search" className="flex h-9 w-9 items-center justify-center rounded-control text-muted hover:text-ink">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {(searchResults.length > 0 || searchLoading || (search.length >= 2 && !searchLoading)) && search.length >= 2 && (
                    <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-card border border-line bg-surface shadow-lift">
                      {searchLoading ? (
                        <p className="px-4 py-3 text-sm text-muted">Searching…</p>
                      ) : searchResults.length ? (
                        searchResults.map((r: any) => (
                          <button
                            key={r.symbol}
                            type="button"
                            onClick={() => openAnalysis(r.symbol)}
                            className="flex min-h-[48px] w-full items-center justify-between gap-3 border-b border-line px-4 text-left last:border-0 hover:bg-accent/10"
                          >
                            <span className="min-w-0">
                              <span className="num block text-sm font-semibold text-ink">{r.symbol}</span>
                              {r.name && <span className="block truncate text-xs text-muted">{r.name}</span>}
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-accent">Analyze</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-muted">No NSE stock matches “{search}”.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === 'market' && <LatestSignals />}

              <section className="rounded-card border border-line bg-surface px-4 sm:px-5">
                {tab === 'trending' ? (
                  <div className="py-4">
                    <TrendingStocks />
                  </div>
                ) : tab === 'ipos' ? (
                  <div className="py-4">
                    <UpcomingIpos />
                  </div>
                ) : tab === 'portfolio' ? (
                  <div className="py-4">
                    <Portfolio />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pt-4">
                      <h2 className="text-sm font-semibold text-ink">{tab === 'market' ? 'Top stocks today' : 'Your watchlist'}</h2>
                      {tab === 'watchlist' && !isPro && <span className="num text-xs text-muted">{watchlist.length}/5 on the free plan</span>}
                    </div>
                    {renderList()}
                  </>
                )}
              </section>

              {tab === 'market' && (
                <Link to="/market-wrap" className="group mt-4 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-4 transition hover:border-accent/40 sm:p-5">
                  <span className="flex min-w-0 items-start gap-3">
                    <Newspaper className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                    <span>
                      <span className="block font-semibold text-ink">Daily market wrap</span>
                      <span className="block text-sm text-muted">The Nifty 50, the Sensex and why they moved. Weekdays at 4:15 PM IST.</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              )}
            </>
          )}
        </main>

        {/* Right rail: market status and what is next for your stocks (wide screens) */}
        <aside className={tab === 'radar' ? 'hidden' : 'hidden xl:block'}>
          <div className="sticky top-[calc(var(--nav-h,64px)+72px)]">
            <NextUp />
          </div>
        </aside>
      </div>

      {selected && <EvidenceBoard stock={selected} onClose={() => setSelected(null)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={() => window.location.reload()} />}
    </div>
  );
}
