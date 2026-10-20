// src/components/Portfolio.tsx
import { useState, useEffect } from 'react';
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../lib/api';
import { usePlan } from '../lib/usePlan';
import UpgradeModal from './UpgradeModal';
import { Coins, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Portfolio() {
    const { isPro } = usePlan();
const [showUpgrade, setShowUpgrade] = useState(false);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ticker: '', quantity: '', avg_buy_price: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadPortfolio(); }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await getPortfolio();
      setPortfolio(res.data.portfolio || []);
      setSummary({
        total_invested: res.data.total_invested,
        current_value:  res.data.current_value,
        total_pnl:      res.data.total_pnl,
        total_pnl_pct:  res.data.total_pnl_pct,
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAdd = async () => {
     if (!isPro && portfolio.length >= 3) {
    setShowUpgrade(true);
    return;
  }

  if (!form.ticker || !form.quantity || !form.avg_buy_price) {
    setError('All fields required'); return;
  }
    if (!form.ticker || !form.quantity || !form.avg_buy_price) {
      setError('All fields required'); return;
    }
    setAdding(true); setError('');
    try {
      await addToPortfolio({
        ticker:        form.ticker.toUpperCase().replace('.NS','').replace('.BO',''),
        quantity:      parseInt(form.quantity),
        avg_buy_price: parseFloat(form.avg_buy_price),
      });
      setForm({ ticker: '', quantity: '', avg_buy_price: '' });
      setShowAdd(false);
      await loadPortfolio();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to add stock');
    }
    setAdding(false);
  };

  const handleRemove = async (ticker: string) => {
    try {
      await removeFromPortfolio(ticker);
      await loadPortfolio();
    } catch (e) { console.error(e); }
  };

  const isProfitable = (summary.total_pnl || 0) >= 0;

  if (loading) return (
    <div className="text-center py-20">
      <Coins className="w-10 h-10 mx-auto mb-4 animate-spin text-lavender-primary" />
      <p className="text-lavender-text/70">Loading portfolio...</p>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">

      {/* Summary Cards */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Invested', value: `₹${(summary.total_invested||0).toLocaleString('en-IN')}`, color: 'text-lavender-text' },
            { label: 'Current', value: `₹${(summary.current_value||0).toLocaleString('en-IN')}`, color: 'text-lavender-primary' },
            { label: 'P&L', value: `${isProfitable ? '+' : ''}₹${(summary.total_pnl||0).toLocaleString('en-IN')}`, color: isProfitable ? 'text-up' : 'text-down' },
            { label: 'Return', value: `${isProfitable ? '+' : ''}${(summary.total_pnl_pct||0).toFixed(2)}%`, color: isProfitable ? 'text-up' : 'text-down' },
          ].map(item => (
            <div key={item.label} className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-3 text-center">
              <p className="text-lavender-text/60 text-xs mb-1">{item.label}</p>
              <p className={`font-bold text-lg ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Stock Button */}
<div className="flex justify-between items-center mb-4">
  <h2 className="text-lavender-text font-bold text-lg flex items-center gap-2">
  <Coins className="w-5 h-5" />
  My Portfolio
</h2>
  <div className="flex items-center gap-2">
    {!isPro && (
      <span className="text-lavender-text/60 text-xs">
        {portfolio.length}/3 free
      </span>
    )}
    <button
      onClick={() => {
        if (!isPro && portfolio.length >= 3) {
          setShowUpgrade(true);
          return;
        }
        setShowAdd(!showAdd);
      }}
      className="bg-gradient-lavender hover:opacity-90 text-white text-sm px-4 py-2 rounded-2xl font-semibold transition"
    >
      {showAdd ? 'Cancel' : 'Add Stock'}
    </button>
  </div>
</div>

      {/* Add Stock Form */}
      {showAdd && (
        <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-4 mb-4">
          <h3 className="text-lavender-text font-semibold mb-3">Add Stock to Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-lavender-text/70 text-xs mb-1 block">NSE Symbol</label>
              <input
                type="text"
                placeholder="e.g. RELIANCE"
                value={form.ticker}
                onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                className="w-full bg-surface border border-lavender-text/10 shadow-sm rounded-2xl px-3 py-2 text-lavender-text focus:outline-none focus:border-white/50 text-sm"
              />
            </div>
            <div>
              <label className="text-lavender-text/70 text-xs mb-1 block">Quantity (shares)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                className="w-full bg-surface border border-lavender-text/10 shadow-sm rounded-2xl px-3 py-2 text-lavender-text focus:outline-none focus:border-white/50 text-sm"
              />
            </div>
            <div>
              <label className="text-lavender-text/70 text-xs mb-1 block">Avg Buy Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1450.50"
                value={form.avg_buy_price}
                onChange={e => setForm({ ...form, avg_buy_price: e.target.value })}
                className="w-full bg-surface border border-lavender-text/10 shadow-sm rounded-2xl px-3 py-2 text-lavender-text focus:outline-none focus:border-white/50 text-sm"
              />
            </div>
          </div>
          {error && (
  <p className="text-down text-sm mb-3 flex items-center gap-1">
    <AlertTriangle className="w-4 h-4" />
    {error}
  </p>
)}
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-up/15 hover:bg-up/15 disabled:opacity-50 text-lavender-text px-6 py-2 rounded-2xl font-semibold text-sm transition"
          >
            {adding ? 'Adding...' : 'Add to Portfolio'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {portfolio.length === 0 && !showAdd && (
        <div className="text-center py-16 bg-surface border border-lavender-text/10 shadow-sm rounded-2xl">
          <Coins className="w-12 h-12 mx-auto mb-4 text-lavender-primary" />
          <p className="text-lavender-text font-semibold text-lg mb-2">No stocks yet</p>
          <p className="text-lavender-text/70 text-sm mb-4">Add your stocks to track live P&L</p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-gradient-lavender hover:opacity-90 text-white px-6 py-2 rounded-2xl font-semibold transition"
          >
            + Add First Stock
          </button>
        </div>
      )}

      {/* Portfolio Table */}
      {portfolio.length > 0 && (
        <div className="space-y-3">
          {portfolio.map((item: any) => {
            const pnlUp = (item.pnl || 0) >= 0;
            return (
              <div key={item.ticker} className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  {/* Left — stock info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lavender-text text-lg">{item.ticker}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
 (item.price_change_pct||0) >= 0
 ? 'bg-up/20 text-up'
 : 'bg-down/20 text-down'
 }`}>
                       <div className="flex items-center gap-1">
  <TrendingUp className={`w-3 h-3 ${(item.price_change_pct||0) >= 0 ? '' : 'rotate-180'}`} />
  {Math.abs(item.price_change_pct||0)}%
</div>
                      </span>
                    </div>
                    <p className="text-lavender-text/70 text-xs">{item.company_name}</p>
                  </div>

                  {/* Right — P&L */}
                  <div className="text-right">
                    <p className={`font-bold text-lg ${pnlUp ? 'text-up' : 'text-down'}`}>
                      {pnlUp ? '+' : ''}₹{(item.pnl||0).toLocaleString('en-IN')}
                    </p>
                    <p className={`text-sm ${pnlUp ? 'text-up' : 'text-down'}`}>
                      {pnlUp ? '+' : ''}{(item.pnl_pct||0).toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    { label: 'Qty', value: item.quantity },
                    { label: 'Avg Price', value: `₹${item.avg_buy_price}` },
                    { label: 'CMP', value: `₹${(item.current_price||0).toLocaleString('en-IN')}` },
                    { label: 'Curr Value', value: `₹${(item.current_value||0).toLocaleString('en-IN')}` },
                  ].map(stat => (
                    <div key={stat.label} className="bg-lavender-surface rounded-2xl p-2 text-center">
                      <p className="text-lavender-text/60 text-xs">{stat.label}</p>
                      <p className="text-lavender-text text-sm font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Invested vs Current bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-lavender-text/60 mb-1">
                    <span>Invested: ₹{(item.invested_value||0).toLocaleString('en-IN')}</span>
                    <span>Current: ₹{(item.current_value||0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-1.5 bg-lavender-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pnlUp ? 'bg-up/15' : 'bg-down/15'}`}
                      style={{
                        width: `${Math.min(((item.current_value||0) / (item.invested_value||1)) * 100, 150)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.ticker)}
                  className="mt-3 text-lavender-text/60 hover:text-down text-xs transition"
                >
                  <span className="flex items-center gap-1">
  <AlertTriangle className="w-3 h-3" />
  Remove from portfolio
</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-muted text-xs text-center mt-6">
        <span className="flex items-center justify-center gap-1">
  <AlertTriangle className="w-3 h-3" />
  P&L is indicative only. Not SEBI-registered advice.
</span>
      </p>
      {showUpgrade && (
  <UpgradeModal
    onClose={() => setShowUpgrade(false)}
    onSuccess={() => window.location.reload()}
  />
)}
    </div>
  );
}