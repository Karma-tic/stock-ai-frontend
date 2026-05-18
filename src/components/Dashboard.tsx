// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { getTopStocks, getWatchlist, searchStocks, getStock } from '../lib/api';
import StockCard from './StockCard';
import AnalysisModal from './AnalysisModal';
import LatestSignals from './LatestSignals';
import Portfolio from './Portfolio';
import AdBanner from './AdBanner';
import { usePlan } from '../lib/usePlan';
import UpgradeModal from './UpgradeModal';
import PennyStocks from './PennyStocks';

export default function Dashboard() {
  const { isPro } = usePlan();
const [showUpgrade, setShowUpgrade] = useState(false);
//const [analysisCount, setAnalysisCount] = useState(0);
  const [stocks, setStocks] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
 const [tab, setTab] = useState<'market' | 'watchlist' | 'portfolio' | 'penny'>('market');
 const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);

  useEffect(() => {
  // Preload stock data in background
  const preload = async () => {
    try {
      await getTopStocks();
    } catch {}
  };
  preload();
}, []);

  useEffect(() => { loadTopStocks(); loadWatchlist(); }, []);

  const loadTopStocks = async () => {
    try {
      const res = await getTopStocks();
      setStocks(res.data.stocks);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

const loadWatchlist = async () => {
  try {
    const res = await getWatchlist();
    setWatchlistStocks(res.data.watchlist);
    setWatchlist(
      res.data.watchlist.map((w: any) =>
        (w.ticker || '').toUpperCase().replace('.NS','').replace('.BO','')
      )
    );
  } catch (e) { console.error(e); }
};

const handleSearch = async (q: string) => {
  setSearch(q);
  if (q.length < 2) { setSearchResults([]); return; }
  try {
    const res = await searchStocks(q);
    setSearchResults(res.data.results); // backend already limits
  } catch (e) {
    setSearchResults([]);
  }
};

  const handleSearchSelect = async (symbol: string) => {
    setSearch('');
    setSearchResults([]);
    try {
      const res = await getStock(symbol);
      setSelected(res.data);
    } catch (e) { console.error(e); }
  };

const handleAnalyze = (stock: any) => {
  setSelected(stock);
};

  const displayStocks = tab === 'market' ? stocks : watchlistStocks;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Search bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-[57px] z-40">
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="🔍 Search stocks... (RELIANCE, TCS, HDFC)"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden shadow-xl z-50">
              {searchResults.map((r: any) => (
                <button key={r.symbol} onClick={() => handleSearchSelect(r.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0">
                  <span className="font-bold">{r.symbol}</span>
                  <span className="text-slate-400 ml-2 text-xs">{r.yf_ticker}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
<div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto">
  {[
    { id: 'market',    label: '📊 Market' },
    { id: 'watchlist', label: `⭐ Watchlist (${watchlist.length})` },
    { id: 'portfolio', label: '💼 Portfolio' },
    { id: 'penny',     label: '💸 Penny Stocks' },
  ].map(t => (
    <button key={t.id} onClick={() => setTab(t.id as any)}
      className={`flex-shrink-0 flex-1 py-3 text-sm font-semibold transition px-3 ${
        tab === t.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'
      }`}>
      {t.label}
    </button>
  ))}
</div>


     
{/* Latest AI Signals Banner */}
<LatestSignals />
{/* Stocks grid or Portfolio */}
<div className="p-4 max-w-4xl mx-auto">
  {tab === 'penny' ? (
    <PennyStocks />
  ) : tab === 'portfolio' ? (
    <Portfolio />
  ) : loading ? (
    <div className="text-center py-20">
      <div className="text-4xl mb-4 animate-pulse">📊</div>
      <p className="text-slate-400">Loading live market data...</p>
    </div>
  ) : displayStocks.length === 0 ? (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">☆</div>
      <p className="text-slate-400">{tab === 'watchlist' ? 'No stocks in watchlist yet.' : 'No stocks found.'}</p>
    </div>
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
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <AdBanner slot="YOUR_AD_SLOT_ID" />
      </div>
    )}
  </>
))}
    </div>
  )}
</div>

{/* Analysis Modal */}
{selected && (
  <AnalysisModal
    stock={selected}
    onClose={() => setSelected(null)}
  />
)}

{/* Upgrade Modal */}
{showUpgrade && (
  <UpgradeModal
    onClose={() => setShowUpgrade(false)}
    onSuccess={() => window.location.reload()}
  />
)}

</div>
);
}