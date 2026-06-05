import { useState, useEffect, useRef } from 'react';
import {  Search, X } from 'lucide-react';

import { getTopStocks, getWatchlist, searchStocks, getStock } from '../lib/api';
import { usePlan } from '../lib/usePlan';

import StockCard from './StockCard';
import AnalysisModal from './AnalysisModal';
import LatestSignals from './LatestSignals';
import Portfolio from './Portfolio';
import AdBanner from './AdBanner';
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
    'market' | 'watchlist' | 'portfolio' | 'trending' | 'penny'
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
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* ================= SEARCH BAR ================= */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-[57px] z-40">
        <div ref={searchRef} className="relative max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search stocks... (RELIANCE, TCS, ZOMATO)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(searchResults.length > 0 || searchLoading) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
              {searchLoading && (
                <div className="px-4 py-3 text-slate-400 text-sm flex gap-2 items-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              )}

              {!searchLoading &&
                searchResults.map((r: any) => (
                  <button
                    key={r.symbol}
                    onClick={() => handleSearchSelect(r.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0"
                  >
                    <span className="font-bold">{r.symbol}</span>
                    <span className="text-slate-400 ml-2 text-xs">
                      {r.yf_ticker}
                    </span>
                  </button>
                ))}

              {!searchLoading &&
                search.length >= 2 &&
                searchResults.length === 0 && (
                  <div className="px-4 py-3 text-slate-500 text-sm">
                    No stocks found for "{search}"
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      {/* ============================================== */}

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'market', label: 'Market' },
            { id: 'watchlist', label: `Watchlist (${watchlist.length})` },
            { id: 'trending', label: 'Trending' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'penny', label: 'Penny Stocks' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                tab === t.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <LatestSignals />

      <div className="p-4 max-w-4xl mx-auto">
        {tab === 'trending' ? (
          <TrendingStocks />
        ) : tab === 'penny' ? (
          <PennyStocks />
        ) : tab === 'portfolio' ? (
          <Portfolio />
        ) : loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
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