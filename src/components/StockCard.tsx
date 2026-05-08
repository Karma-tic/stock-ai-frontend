// src/components/StockCard.tsx
import { useState } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../lib/api';

interface Props {
  stock: any;
  onAnalyze: (stock: any) => void;
  inWatchlist?: boolean;
  onWatchlistChange?: () => void;
}

export default function StockCard({ stock, onAnalyze, inWatchlist, onWatchlistChange }: Props) {
  const [loading, setLoading] = useState(false);
  const isUp = stock.price_change >= 0;

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (inWatchlist) {
        const cleanTicker = (stock.display_ticker || stock.ticker || '')
  .replace('.NS','').replace('.BO','');
await removeFromWatchlist(cleanTicker);
      } else {
        await addToWatchlist(stock.display_ticker, stock.company_name);
      }
      onWatchlistChange?.();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div
      onClick={() => onAnalyze(stock)}
      className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg">{stock.display_ticker}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(stock.price_change_pct)}%
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[150px]">{stock.company_name}</p>
        </div>
        <button
          onClick={toggleWatchlist}
          disabled={loading}
          className={`text-xl transition ${inWatchlist ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`}
        >
          {loading ? '⏳' : inWatchlist ? '★' : '☆'}
        </button>
      </div>

      {/* Price */}
      <div className="mb-3">
        <span className="text-2xl font-bold text-white">₹{stock.current_price?.toLocaleString('en-IN')}</span>
        <span className={`ml-2 text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{stock.price_change}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900 rounded-lg p-2">
          <p className="text-slate-500 text-xs">PE</p>
          <p className="text-white text-sm font-semibold">{stock.pe_ratio ?? 'N/A'}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2">
          <p className="text-slate-500 text-xs">Div%</p>
          <p className="text-green-400 text-sm font-semibold">{stock.dividend_yield_pct}%</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2">
          <p className="text-slate-500 text-xs">52W%</p>
          <p className="text-blue-400 text-sm font-semibold">{stock.position_in_52w}%</p>
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={(e) => { e.stopPropagation(); onAnalyze(stock); }}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded-lg font-semibold transition"
      >
        🤖 AI Analysis
      </button>
    </div>
  );
}