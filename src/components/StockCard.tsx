// src/components/StockCard.tsx
import { useState } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../lib/api';
import ReactGA from 'react-ga4';
import { Brain } from 'lucide-react';


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
    <div className="bg-lavender-surface border border-white/50 hover:border-white/50 rounded-2xl p-4 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onAnalyze(stock)}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-lavender-text text-lg">{stock.display_ticker}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isUp ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(stock.price_change_pct || 0)}%
            </span>
          </div>
          <p className="text-lavender-text/70 text-xs mt-0.5 truncate max-w-[150px]">{stock.company_name}</p>
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
          className="w-9 h-9 flex items-center justify-center rounded-2xl hover:bg-gray-200 transition"
        >
          <span className={`text-xl ${loading ? 'opacity-50' : ''} ${localWatchlist ? 'text-yellow-400' : 'text-lavender-text/60 hover:text-yellow-400'}`}>
            {loading ? '⏳' : localWatchlist ? '★' : '☆'}
          </span>
        </button>
      </div>

      {/* Price — clickable */}
      <div className="mb-3 cursor-pointer" onClick={() => onAnalyze(stock)}>
        <span className="text-2xl font-bold text-lavender-text">
          ₹{(stock.current_price || 0).toLocaleString('en-IN')}
        </span>
        <span className={`ml-2 text-sm ${isUp ? 'text-green-600' : 'text-red-600'}`}>
          {isUp ? '+' : ''}{stock.price_change || 0}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center" onClick={() => onAnalyze(stock)}>
        <div className="bg-lavender-surface rounded-2xl p-2 cursor-pointer">
          <p className="text-lavender-text/60 text-xs">PE</p>
          <p className="text-lavender-text text-sm font-semibold">{stock.pe_ratio ?? 'N/A'}</p>
        </div>
        <div className="bg-lavender-surface rounded-2xl p-2 cursor-pointer">
          <p className="text-lavender-text/60 text-xs">Div%</p>
          <p className="text-green-600 text-sm font-semibold">{stock.dividend_yield_pct || 0}%</p>
        </div>
        <div className="bg-lavender-surface rounded-2xl p-2 cursor-pointer">
          <p className="text-lavender-text/60 text-xs">52W%</p>
          <p className="text-lavender-primary text-sm font-semibold">{stock.position_in_52w || 0}%</p>
        </div>
        
      </div>

      {/* Analyze button */}
      <button
  onClick={() => onAnalyze(stock)}
  className="mt-3 w-full bg-gradient-lavender hover:opacity-90 text-white text-sm py-2 rounded-2xl font-semibold transition flex items-center justify-center gap-2 shadow-lavender"
>
  <Brain className="w-4 h-4" />
  AI Analysis
</button>
      
    </div>
  );
}