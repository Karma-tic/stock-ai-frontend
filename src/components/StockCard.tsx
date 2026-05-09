// src/components/StockCard.tsx
import { useState } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../lib/api';
import ReactGA from 'react-ga4';

interface Props {
  stock: any;
  onAnalyze: (stock: any) => void;
  inWatchlist?: boolean;
  onWatchlistChange?: () => void;
  onUpgradeNeeded?: () => void;
  canAddToWatchlist?: boolean;
}

export default function StockCard({
  stock,
  onAnalyze,
  inWatchlist,
  onWatchlistChange,
  onUpgradeNeeded,
  canAddToWatchlist
}: Props) {
  const [loading, setLoading] = useState(false);
  const [localWatchlist, setLocalWatchlist] = useState(inWatchlist || false);
  const isUp = (stock.price_change || 0) >= 0;

  const getTicker = () => {
    return (stock.display_ticker || stock.ticker || '')
      .toUpperCase()
      .replace('.NS', '')
      .replace('.BO', '')
      .trim();
  };

const handleWatchlist = async () => {
  if (loading) return;
  const ticker = getTicker();

  // If trying to add and limit reached
  if (!localWatchlist && !canAddToWatchlist) {
    onUpgradeNeeded?.();
    return;
  }
    console.log('Watchlist clicked:', ticker, '| currently in watchlist:', localWatchlist);
    setLoading(true);

    try {
      if (localWatchlist) {
        console.log('Removing:', ticker);
        const res = await removeFromWatchlist(ticker);
        console.log('Remove response:', res.data);
        setLocalWatchlist(false);
      } else {
        console.log('Adding:', ticker);
        const res = await addToWatchlist(ticker, stock.company_name || ticker);
console.log('Add response:', res.data);
setLocalWatchlist(true);

// Track watchlist add
ReactGA.event({
  category: "Watchlist",
  action: "stock_added",
  label: ticker
});
      }
      onWatchlistChange?.();
    } catch (err: any) {
      console.error('Watchlist error:', err?.response?.data || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl p-4 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onAnalyze(stock)}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg">{stock.display_ticker}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(stock.price_change_pct || 0)}%
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[150px]">{stock.company_name}</p>
        </div>

        {/* Star button — completely isolated from card click */}
        <button
          type="button"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleWatchlist();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700 transition"
        >
          <span className={`text-xl ${loading ? 'opacity-50' : ''} ${localWatchlist ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}>
            {loading ? '⏳' : localWatchlist ? '★' : '☆'}
          </span>
        </button>
      </div>

      {/* Price — clickable */}
      <div className="mb-3 cursor-pointer" onClick={() => onAnalyze(stock)}>
        <span className="text-2xl font-bold text-white">
          ₹{(stock.current_price || 0).toLocaleString('en-IN')}
        </span>
        <span className={`ml-2 text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{stock.price_change || 0}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center" onClick={() => onAnalyze(stock)}>
        <div className="bg-slate-900 rounded-lg p-2 cursor-pointer">
          <p className="text-slate-500 text-xs">PE</p>
          <p className="text-white text-sm font-semibold">{stock.pe_ratio ?? 'N/A'}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2 cursor-pointer">
          <p className="text-slate-500 text-xs">Div%</p>
          <p className="text-green-400 text-sm font-semibold">{stock.dividend_yield_pct || 0}%</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2 cursor-pointer">
          <p className="text-slate-500 text-xs">52W%</p>
          <p className="text-blue-400 text-sm font-semibold">{stock.position_in_52w || 0}%</p>
        </div>
        
      </div>

      {/* Analyze button */}
      <button
        type="button"
        onClick={() => onAnalyze(stock)}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded-lg font-semibold transition"
      >
        🤖 AI Analysis
      </button>
      
    </div>
  );
}