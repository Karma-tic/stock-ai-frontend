// src/components/AnalysisModal.tsx
import { useState, useEffect } from 'react';
import { analyzeStock, addToWatchlist, removeFromWatchlist, getWatchlist } from '../lib/api';

import UpgradeModal from './UpgradeModal';
import ShareableSignal from './ShareableSignal';
function splitIntoPoints(text?: unknown): string[] {
  // Handle non-string inputs gracefully — cached signals may have
  // bull_case/bear_case as arrays, objects, or other unexpected types
  if (!text) return [];

  if (Array.isArray(text)) {
    return text.map(t => String(t).trim()).filter(Boolean);
  }

  if (typeof text !== 'string') {
    return [String(text)];
  }

  // First try splitting on periods followed by a capital letter (proper sentences)
  let points = text.split(/\.\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);

  // If that didn't split anything (one giant blob), try splitting on
  // a lowercase letter immediately followed by an uppercase letter —
  // this catches concatenated phrases with no punctuation at all,
  // e.g. "...value zoneStrong dividend..."
  if (points.length <= 1) {
    points = text.split(/(?<=[a-z%])(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
  }

  // Clean trailing periods and ensure each point ends cleanly
  return points.map(p => p.replace(/\.$/, '').trim());
}


// ── Watchlist Button ──────────────────────────────────────────────────────
function WatchlistButton({ ticker, companyName }: { ticker: string; companyName: string }) {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [result, setResult] = useState<any>(null);
 const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-unused-vars  
const [error, setError] = useState('');

  // Clean ticker once at component level
  const clean = ticker.toUpperCase().replace('.NS', '').replace('.BO', '').trim();

  useEffect(() => {
    getWatchlist().then(res => {
      const tickers = res.data.watchlist.map((w: any) =>
        (w.ticker || '').toUpperCase().replace('.NS', '').replace('.BO', '')
      );
      console.log('Watchlist tickers:', tickers, '| checking:', clean);
      setInWatchlist(tickers.includes(clean));
    }).catch(() => {});
  }, [clean]);

  const toggle = async () => {
    setLoading(true);
    try {
      console.log('WatchlistButton toggle:', clean, '| inWatchlist:', inWatchlist);
      if (inWatchlist) {
        await removeFromWatchlist(clean);
        setInWatchlist(false);
      } else {
        await addToWatchlist(clean, companyName);
        setInWatchlist(true);
      }
    } catch (e) {
      console.error('WatchlistButton error:', e);
    }
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
        inWatchlist
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
          : 'bg-slate-700 text-slate-400 border border-slate-600 hover:border-yellow-500 hover:text-yellow-400'
      }`}>
      {loading ? '⏳' : inWatchlist ? '★ Watching' : '☆ Watchlist'}
    </button>
  );
}

export default function AnalysisModal({ stock, onClose }: { stock: any; onClose: () => void }) {
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await analyzeStock(stock.display_ticker);
        setResult(res.data);
        
      } catch (e: any) {
        const detail = e?.response?.data?.detail;
        if (detail === 'DAILY_LIMIT_REACHED') {
          setError('🔒 You have used your 2 free analyses today.');
          setShowUpgrade(true);
        } else {
          setError(detail || 'Analysis failed');
        }
      }
      setLoading(false);
    };
    run();
  }, [stock]);

  const signal = result?.signal?.signal;
const colorMap: Record<string, string> = { BUY: 'text-green-400', HOLD: 'text-yellow-400', SELL: 'text-red-400' };
const bgMap: Record<string, string> = { BUY: 'bg-green-500/20 border-green-500', HOLD: 'bg-yellow-500/20 border-yellow-500', SELL: 'bg-red-500/20 border-red-500' };
const signalColor = colorMap[signal] || 'text-white';
const signalBg = bgMap[signal] || 'bg-slate-700 border-slate-600';
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
{/* Header */}
<div className="flex justify-between items-center p-4 border-b border-slate-700 sticky top-0 bg-slate-900">
  <div>
    <h2 className="font-bold text-xl text-white">{stock.display_ticker}</h2>
    <p className="text-slate-400 text-sm">{stock.company_name}</p>
  </div>
  <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
</div>

{/* Live Price Bar */}
<div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">

  <div className="flex items-center gap-3">
    <span className="text-2xl font-black text-white">
      ₹{stock.current_price?.toLocaleString('en-IN')}
    </span>

    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
      stock.price_change >= 0
        ? 'bg-green-500/20 text-green-400'
        : 'bg-red-500/20 text-red-400'
    }`}>
      {stock.price_change >= 0 ? '▲' : '▼'} {Math.abs(stock.price_change_pct)}%
    </span>

    
  </div>

  <WatchlistButton
    ticker={stock.display_ticker}
    companyName={stock.company_name}
  />
</div>

        <div className="p-4">
          {/* Replace loading state */}
{loading && (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">
      <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-slate-400 font-medium">Analyzing {stock.display_ticker}...</p>
    <p className="text-slate-500 text-sm mt-1">Reading news and market data</p>
  </div>
)}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-red-400">
              ❌ {error}
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-4">
              {/* Signal */}
              <div className={`border rounded-xl p-4 text-center ${signalBg}`}>
                <p className={`text-4xl font-black ${signalColor}`}>{signal}</p>
                <p className="text-slate-400 text-sm mt-1">Confidence: {result.signal?.confidence}%</p>
                <p className="text-slate-300 text-sm mt-2">{result.signal?.analysis?.short_summary}</p>
              </div>

              {/* Price targets */}
              <div className="bg-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">📊 Price Targets</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Buy At', value: `₹${result.signal?.entry_strategy?.suggested_buy_price}`, color: 'text-blue-400' },
                    { label: 'Target 1', value: `₹${result.signal?.entry_strategy?.target_price_1}`, color: 'text-green-400' },
                    { label: 'Target 2', value: `₹${result.signal?.entry_strategy?.target_price_2}`, color: 'text-green-300' },
                    { label: 'Stop Loss', value: `₹${result.signal?.entry_strategy?.stop_loss}`, color: 'text-red-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-500 text-xs">{item.label}</p>
                      <p className={`font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">Upside</p>
                    <p className="font-bold text-green-400">+{result.signal?.entry_strategy?.upside_pct}%</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">Downside Risk</p>
                    <p className="font-bold text-red-400">-{result.signal?.entry_strategy?.downside_risk_pct}%</p>
                  </div>
                </div>
              </div>

              {/* Quantity guide */}
              <div className="bg-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">🛒 How Many Shares to Buy</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '₹10,000', value: result.signal?.quantity_guide?.for_10000_inr },
                    { label: '₹25,000', value: result.signal?.quantity_guide?.for_25000_inr },
                    { label: '₹50,000', value: result.signal?.quantity_guide?.for_50000_inr },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-900 rounded-lg p-3 text-center">
                      <p className="text-slate-500 text-xs">{item.label}</p>
                      <p className="font-bold text-white text-lg">{item.value}</p>
                      <p className="text-slate-500 text-xs">shares</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 text-xs">⏰ Best time: {result.signal?.quantity_guide?.best_time_to_buy?.replace(/_/g, ' ')}</p>
                  <p className="text-slate-400 text-xs mt-1">{result.signal?.quantity_guide?.best_time_reason}</p>
                </div>
              </div>

              {/* Conviction Meter */}
              <div className="bg-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-1">🎯 Conviction Meter</h3>
                <p className="text-slate-500 text-xs mb-4">
                  Not all signals are equal — here's what's actually driving this confidence score
                </p>

                {/* Bar scores */}
                <div className="space-y-3 mb-4">
                  {[
                    { label: 'Technical Setup', value: result.signal?.ratings?.technical_score, color: 'bg-blue-500' },
                    { label: 'Valuation',       value: result.signal?.ratings?.value_score,     color: 'bg-yellow-500' },
                    { label: 'Momentum',        value: result.signal?.ratings?.momentum_score,  color: 'bg-purple-500' },
                  ].map(item => {
                    const score = Number(item.value) || 0;
                    const pct   = Math.max(0, Math.min(100, score * 10));
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-slate-300 text-xs font-medium">{item.label}</p>
                          <p className="text-slate-400 text-xs font-bold">{score}/10</p>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* News sentiment badge */}
                <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 mb-3">
                  <p className="text-slate-400 text-xs">News Sentiment</p>
                  {(() => {
                    const sentiment = result.signal?.ratings?.news_sentiment || 'NEUTRAL';
                    const sentimentColors: Record<string, string> = {
                      POSITIVE: 'bg-green-500/20 text-green-400',
                      NEGATIVE: 'bg-red-500/20 text-red-400',
                      NEUTRAL:  'bg-slate-600/30 text-slate-300',
                    };
                    return (
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${sentimentColors[sentiment] || sentimentColors.NEUTRAL}`}>
                        {sentiment}
                      </span>
                    );
                  })()}
                </div>

                {/* Dividend / Growth / Risk badges */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Dividend', value: result.signal?.ratings?.dividend_potential },
                    { label: 'Growth',   value: result.signal?.ratings?.growth_potential },
                    { label: 'Risk',     value: result.signal?.ratings?.risk_level },
                  ].map(item => {
                    const ratingMap: Record<string, string> = {
                      HIGH:   item.label === 'Risk' ? 'text-red-400'   : 'text-green-400',
                      MEDIUM: 'text-yellow-400',
                      LOW:    item.label === 'Risk' ? 'text-green-400' : 'text-red-400',
                    };
                    const color = ratingMap[item.value] || 'text-white';
                    return (
                      <div key={item.label} className="bg-slate-900 rounded-lg p-3 text-center">
                        <p className="text-slate-500 text-xs">{item.label}</p>
                        <p className={`font-bold text-sm ${color}`}>{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bull/Bear */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 font-semibold text-sm mb-1">🟢 Bull Case</p>
                 <ul className="text-slate-300 text-sm space-y-1.5 list-disc list-inside">
                    {splitIntoPoints(result.signal?.analysis?.bull_case).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 font-semibold text-sm mb-1">🔴 Bear Case</p>
                  <ul className="text-slate-300 text-sm space-y-1.5 list-disc list-inside">
                    {splitIntoPoints(result.signal?.analysis?.bear_case).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What Would Prove This Wrong */}
              {Array.isArray(result.signal?.analysis?.invalidation_triggers) &&
                result.signal.analysis.invalidation_triggers.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-orange-400 font-semibold text-sm mb-1">
                    ⚠️ What Would Prove This Wrong
                  </p>
                  <p className="text-slate-500 text-xs mb-3">
                    No signal is certain — here's what would invalidate this call
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1.5 list-disc list-inside">
                    {result.signal.analysis.invalidation_triggers.map((trigger: string, i: number) => (
                      <li key={i}>{trigger}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.signal?.analysis?.what_to_watch && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">👁️ What to watch</p>
                  <p className="text-slate-200 text-sm font-medium">
                    {result.signal.analysis.what_to_watch}
                  </p>
                </div>
              )}

              {/* News */}
              {result.news?.news?.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3">📰 Latest News</h3>
                  <div className="space-y-2">
                    {result.news.news.slice(0, 5).map((item: any, i: number) => (
                      <a key={i} href={item.link} target="_blank" rel="noreferrer"
                        className="block bg-slate-900 rounded-lg p-3 hover:bg-slate-700 transition">
                        <p className="text-slate-300 text-xs">{item.title}</p>
                        <p className="text-slate-500 text-xs mt-1">{item.source}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
{/* Share Signal Card */}
<div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
  <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
    Share This Signal
  </h3>
  <ShareableSignal signal={result.signal} stock={result.stock} />
</div>

              {/* Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-yellow-400 text-xs">⚠️ {result.signal?.disclaimer}</p>
              </div>
            </div>
          )}
{showUpgrade && (
  <UpgradeModal
    onClose={() => {
      setShowUpgrade(false);
      onClose();
    }}
    onSuccess={() => window.location.reload()}
  />
)}

</div>
</div>
</div>
);
}
