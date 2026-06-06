// src/components/PennyStocks.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import AnalysisModal from './AnalysisModal';
import { Coins, AlertTriangle, TrendingUp } from 'lucide-react';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PennyStocks() {
  const [stocks, setStocks]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
 const [watchlist] = useState<string[]>([]);

  useEffect(() => { loadPennyStocks(); }, []);

  const loadPennyStocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/market/penny-stocks`);
      setStocks(res.data.stocks || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <h2 className="text-yellow-400 font-bold text-lg mb-1">
          <span className="inline-flex items-center gap-2">
  <Coins className="w-5 h-5" />
  Penny Stocks — Under ₹100
</span>
        </h2>
        <p className="text-slate-400 text-sm">
          High risk, high reward. These stocks trade below ₹100 on NSE.
          Always do your research before investing in penny stocks.
        </p>
        <p className="text-red-400 text-xs mt-2">
         <span className="inline-flex items-center gap-1">
  <AlertTriangle className="w-4 h-4" />
  Penny stocks are highly volatile and risky.
</span>
        </p>
      </div>

      {/* Stats bar */}
      {!loading && stocks.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-slate-500 text-xs">Total Stocks</p>
            <p className="text-white font-bold text-xl">{stocks.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-slate-500 text-xs">Cheapest</p>
            <p className="text-green-400 font-bold text-xl">
              ₹{Math.min(...stocks.map(s => s.current_price || 999)).toFixed(1)}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-slate-500 text-xs">Most stocks up</p>
            <p className="text-blue-400 font-bold text-xl">
             <span className="inline-flex items-center gap-1 justify-center">
  {stocks.filter(s => (s.price_change || 0) > 0).length}
  <TrendingUp className="w-4 h-4" />
</span>
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <Coins className="w-10 h-10 mx-auto mb-4 animate-pulse text-yellow-400" />
          <p className="text-slate-400">Loading penny stocks...</p>
          <p className="text-slate-500 text-sm mt-2">
            Fetching live prices for all stocks under ₹100
          </p>
        </div>
      )}

      {/* Stocks grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock: any) => (
            <StockCard
              key={stock.display_ticker}
              stock={stock}
              onAnalyze={setSelected}
              inWatchlist={watchlist.includes(stock.display_ticker)}
              onWatchlistChange={() => {}}
              canAddToWatchlist={true}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && stocks.length === 0 && (
        <div className="text-center py-20">
         <Coins className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
          <p className="text-white font-semibold">No penny stocks found right now</p>
          <p className="text-slate-400 text-sm mt-2">
            Check back during market hours
          </p>
        </div>
      )}

      {selected && (
        <AnalysisModal stock={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}