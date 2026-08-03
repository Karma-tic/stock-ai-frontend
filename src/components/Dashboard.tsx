import { useState, useEffect, useRef } from 'react';
import {  Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getTopStocks, getWatchlist, searchStocks, getStock } from '../lib/api';
import { usePlan } from '../lib/usePlan';

import StockCard from './StockCard';
import AnalysisModal from './AnalysisModal';
import LatestSignals from './LatestSignals';
import Portfolio from './Portfolio';
import AdBanner from './AdBanner';
import UpcomingIpos from './UpcomingIpos';
import UpgradeModal from './UpgradeModal';
import PennyStocks from './PennyStocks';
import TrendingStocks from './TrendingStocks';

export default function Dashboard() {
  const { isPro } = usePlan();

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [stocks, setStocks] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= SEARCH STATE ================= */
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* ================================================ */

  const [tab, setTab] = useState<
    'market' | 'watchlist' | 'portfolio' | 'trending' | 'penny' | 'ipos'
  >('market');

  /* ================= PRELOAD ================= */
  useEffect(() => {
    const preload = async () => {
      try {
        await getTopStocks();
      } catch {}
    };
    preload();
  }, []);

  useEffect(() => {
    loadTopStocks();
    loadWatchlist();
  }, []);
  /* =========================================== */

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearch('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  /* ================================================ */

  const loadTopStocks = async () => {
    setLoading(true);
    try {
      const res = await getTopStocks();
      setStocks(res.data.stocks);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setWatchlistStocks(res.data.watchlist);
      setWatchlist(
        res.data.watchlist.map((w: any) =>
          (w.ticker || '').toUpperCase().replace('.NS', '').replace('.BO', '')
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= DEBOUNCED SEARCH ================= */
  const handleSearch = (q: string) => {
    setSearch(q);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

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
    }, 400);
  };

  const handleSearchSelect = async (symbol: string) => {
    setSearch('');
    setSearchResults([]);

    try {
      const res = await getStock(symbol);
      setSelected(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
  };
  /* ================================================= */

  const handleAnalyze = (stock: any) => {
    setSelected(stock);
  };

  const displayStocks = tab === 'market' ? stocks : watchlistStocks;

  return (
    <div className="min-h-screen bg-lavender-surface pb-20">
      {/* ================= SEARCH BAR ================= */}
      <div className="px-4 py-3 bg-lavender-secondary/10 border-b border-lavender-text/10 sticky top-[57px] z-40 backdrop-blur-md">
        <div ref={searchRef} className="relative max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lavender-text/60 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search stocks... (RELIANCE, TCS, ZOMATO)"
              className="w-full bg-white border border-lavender-text/20 rounded-2xl pl-9 pr-9 py-2.5 text-lavender-text placeholder-lavender-text/40 focus:outline-none focus:border-lavender-primary/50 focus:ring-1 focus:ring-lavender-primary/50 text-sm shadow-sm transition-all"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-text/60 hover:text-lavender-text transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(searchResults.length > 0 || searchLoading) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-lavender-text/10 rounded-2xl shadow-lavender z-50 overflow-hidden">
              {searchLoading && (
                <div className="px-4 py-3 text-lavender-text/70 text-sm flex gap-2 items-center">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              )}

              {!searchLoading &&
                searchResults.map((r: any) => (
                  <button
                    key={r.symbol}
                    onClick={() => handleSearchSelect(r.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-lavender-secondary/10 text-lavender-text text-sm border-b border-lavender-text/5 last:border-0 transition-colors"
                  >
                    <span className="font-bold">{r.symbol}</span>
                    <span className="text-lavender-text/70 ml-2 text-xs">
                      {r.yf_ticker}
                    </span>
                  </button>
                ))}

              {!searchLoading &&
                search.length >= 2 &&
                searchResults.length === 0 && (
                  <div className="px-4 py-3 text-lavender-text/60 text-sm">
                    No stocks found for "{search}"
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      {/* ============================================== */}

      {/* Tabs */}
     {/* Sliding Tab Navigation */}
<div className="bg-lavender-surface border-b border-lavender-text/10 px-4 py-3">
  <div
    className="
      flex gap-2 pb-1
      overflow-x-auto scrollbar-hide
      md:overflow-visible
      md:justify-between
    "
  >
    {[
      { id: 'market',    label: 'Market',       color: 'bg-gradient-lavender',   activeText: 'text-white' },
      { id: 'watchlist', label: `Watchlist (${watchlist.length})`, color: 'bg-yellow-500', activeText: 'text-black' },
      { id: 'trending',  label: 'Trending',     color: 'bg-orange-500', activeText: 'text-white' },
      { id: 'ipos',      label: 'Upcoming IPOs',color: 'bg-emerald-500',activeText: 'text-white' },
      { id: 'portfolio', label: 'Portfolio',    color: 'bg-indigo-500', activeText: 'text-white' },
      { id: 'penny',     label: 'Penny Stocks', color: 'bg-green-600',  activeText: 'text-white' },
    ].map(t => (
      <button
        key={t.id}
        onClick={() => setTab(t.id as any)}
        className={`
          flex-shrink-0
          md:flex-1
          px-4 py-2
          rounded-full
          text-sm font-semibold
          transition-all
          text-center
          ${
            tab === t.id
              ? `${t.color} ${t.activeText} shadow-lavender scale-105`
              : 'bg-white border border-lavender-text/10 text-lavender-text/70 hover:bg-lavender-secondary/10 hover:border-lavender-text/20 hover:text-lavender-text'
          }
        `}
      >
        {t.label}
      </button>
    ))}
  </div>
</div>

      <LatestSignals />

      {/* Daily Market Wrap Preview */}
      <div className="p-4 max-w-4xl mx-auto -mt-2">
        <Link to="/market-wrap" className="block w-full bg-gradient-to-r from-amber-50 to-white border border-white/50 rounded-2xl p-6 hover:border-lavender-text/20 hover:shadow-lavender transition group shadow-lavender">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lavender-text text-xl font-bold mb-1 group-hover:text-amber-700 transition">
                🗞️ Daily Market Wrap-Up
              </h3>
              <p className="text-lavender-text/80 text-sm">
                Get a concise, 500-word daily summary of the Nifty 50, Sensex, and top market news. Updated every weekday at 4:15 PM IST.
              </p>
            </div>
            <span className="shrink-0 bg-gradient-lavender group-hover:opacity-90 text-white font-semibold px-4 py-2 rounded-2xl transition text-sm shadow-lavender">
              Read Latest →
            </span>
          </div>
        </Link>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {tab === 'trending' ? (
          <TrendingStocks />
        ) : tab === 'penny' ? (
          <PennyStocks />
        ) : tab === 'ipos' ? (
          <UpcomingIpos />
        ) : tab === 'portfolio' ? (
          <Portfolio />
        ) : loading ? (
          <div className="text-center text-lavender-text/70 py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayStocks.map((stock: any, index: number) => (
              <>
                <StockCard
                  key={stock.display_ticker || stock.ticker}
                  stock={stock}
                  onAnalyze={handleAnalyze}
                  inWatchlist={watchlist.includes(
                    (stock.display_ticker || stock.ticker || '')
                      .toUpperCase()
                      .replace('.NS', '')
                      .replace('.BO', '')
                  )}
                  onWatchlistChange={loadWatchlist}
                  onUpgradeNeeded={() => setShowUpgrade(true)}
                  canAddToWatchlist={isPro || watchlist.length < 3}
                />

                {index === 5 && (
                  <div className="col-span-full">
                    <AdBanner slot="YOUR_AD_SLOT_ID" />
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <AnalysisModal stock={selected} onClose={() => setSelected(null)} />
      )}

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}