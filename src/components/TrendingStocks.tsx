// src/components/TrendingStocks.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown } from 'lucide-react';
import StockCard from './StockCard';
import AnalysisModal from './AnalysisModal';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function TrendingStocks() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'bought' | 'sold'>('bought');

  useEffect(() => { loadTrending(); }, []);

  const loadTrending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/market/trending`);
      setData(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const stocks = activeTab === 'bought'
    ? (data?.most_bought || [])
    : (data?.most_sold   || []);

  return (
    <div className="p-4 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lavender-text font-bold text-xl mb-1">Today's Biggest Movers</h2>
        <p className="text-lavender-text/70 text-sm">
          Real-time gainers and losers across 150+ NSE stocks — refreshed every 30 min
        </p>
      </div>

      {/* Toggle tabs */}
      <div className="flex bg-lavender-surface rounded-2xl p-1 mb-6 max-w-xs">
        <button
          onClick={() => setActiveTab('bought')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-semibold transition ${
            activeTab === 'bought'
              ? 'bg-green-600 text-lavender-text'
              : 'text-lavender-text/70 hover:text-lavender-text'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Most Bought
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-semibold transition ${
            activeTab === 'sold'
              ? 'bg-red-600 text-lavender-text'
              : 'text-lavender-text/70 hover:text-lavender-text'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Most Sold
        </button>
      </div>

      {/* Info banner */}
      <div className={`rounded-2xl p-3 mb-4 border ${
  activeTab === 'bought'
    ? 'bg-green-500/10 border-green-500/30'
    : 'bg-red-500/10 border-red-500/30'
}`}>
  <p className={`text-sm font-medium ${
    activeTab === 'bought' ? 'text-green-600' : 'text-red-600'
  }`}>
    {activeTab === 'bought'
      ? 'Stocks gaining the most right now — not a prediction, this is happening live'
      : 'Stocks losing the most right now — not a prediction, this is happening live'
    }
  </p>
  <p className="text-lavender-text/60 text-xs mt-1">
    Scanned across our full stock universe • Refreshed every 30 min
  </p>
</div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-lavender-surface border border-white/50 rounded-2xl p-4 animate-pulse">
              <div className="h-5 w-24 bg-lavender-surface rounded mb-2" />
              <div className="h-3 w-32 bg-lavender-surface rounded mb-3" />
              <div className="h-8 w-28 bg-lavender-surface rounded mb-3" />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-12 bg-lavender-surface rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rank + Stock Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock: any, index: number) => (
            <div key={stock.display_ticker} className="relative">
              {/* Rank badge */}
              <div className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-lavender-text ${
                activeTab === 'bought' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                #{index + 1}
              </div>
              <StockCard
                stock={stock}
                onAnalyze={setSelected}
                inWatchlist={false}
                onWatchlistChange={() => {}}
                canAddToWatchlist={true}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && stocks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lavender-text font-semibold">No data available</p>
          <p className="text-lavender-text/70 text-sm mt-2">
            Check back during market hours
          </p>
          <button onClick={loadTrending}
            className="mt-4 bg-gradient-lavender text-white px-6 py-2 rounded-2xl text-sm font-semibold">
            Retry
          </button>
        </div>
      )}

      {selected && (
        <AnalysisModal stock={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}