// src/components/Portfolio.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus, Trash2, X } from 'lucide-react';
import { downloadCsv, today } from '../lib/csv';
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../lib/api';
import { usePlan } from '../lib/usePlan';
import UpgradeModal from './UpgradeModal';
import Price, { Change } from './ui/Price';
import { Button } from './ui/Button';
import PortfolioHealth from './portfolio/PortfolioHealth';

const FREE_LIMIT = 3;
const money = (v: number) => `₹${(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const signedMoney = (v: number) => `${v >= 0 ? '+' : '−'}${money(Math.abs(v || 0))}`;
// Cobalt shades for the allocation bar, darkest first (the same family as the calculators)
const SHADES = ['bg-cobalt', 'bg-cobalt/75', 'bg-cobalt/55', 'bg-cobalt/40', 'bg-cobalt/25', 'bg-cobalt/15'];

const field =
  'h-11 w-full rounded-control border border-line bg-canvas px-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25';

export default function Portfolio() {
  const { isPro } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ticker: '', quantity: '', avg_buy_price: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const confirmTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    loadPortfolio();
    return () => window.clearTimeout(confirmTimer.current);
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await getPortfolio();
      setPortfolio(res.data.portfolio || []);
      setSummary({
        total_invested: res.data.total_invested,
        current_value: res.data.current_value,
        total_pnl: res.data.total_pnl,
        total_pnl_pct: res.data.total_pnl_pct,
      });
    } catch (e) {
      console.error(e);
      setLoadError(true);
    }
    setLoading(false);
  };

  const atLimit = !isPro && portfolio.length >= FREE_LIMIT;

  const openAdd = () => {
    if (atLimit) return setShowUpgrade(true);
    setError('');
    setShowAdd(true);
  };

  const handleAdd = async () => {
    if (atLimit) return setShowUpgrade(true);
    const qty = parseInt(form.quantity, 10);
    const avg = parseFloat(form.avg_buy_price);
    if (!form.ticker.trim() || !(qty > 0) || !(avg > 0)) {
      setError('Enter a symbol, a quantity above 0 and an average price above 0.');
      return;
    }
    setAdding(true);
    setError('');
    try {
      await addToPortfolio({
        ticker: form.ticker.trim().toUpperCase().replace('.NS', '').replace('.BO', ''),
        quantity: qty,
        avg_buy_price: avg,
      });
      setForm({ ticker: '', quantity: '', avg_buy_price: '' });
      setShowAdd(false);
      await loadPortfolio();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Could not add this stock. Check the symbol and try again.');
    }
    setAdding(false);
  };

  // Two taps to remove, so a stray tap never deletes a holding
  const handleRemove = async (ticker: string) => {
    if (confirming !== ticker) {
      setConfirming(ticker);
      window.clearTimeout(confirmTimer.current);
      confirmTimer.current = window.setTimeout(() => setConfirming(null), 4000);
      return;
    }
    setConfirming(null);
    try {
      await removeFromPortfolio(ticker);
      await loadPortfolio();
    } catch (e) {
      console.error(e);
    }
  };

  const exportPortfolio = () =>
    downloadCsv(`portfolio-${today()}.csv`, [
      {
        header: ['Symbol', 'Company', 'Quantity', 'Avg buy price', 'Current price', 'Invested', 'Current value', 'Profit or loss', 'P&L %', 'Weight %'],
        rows: portfolio.map((h) => [h.ticker, h.company_name, h.quantity, h.avg_buy_price, h.current_price, h.invested_value, h.current_value, h.pnl, h.pnl_pct, totalValue ? (((h.current_value || 0) / totalValue) * 100).toFixed(2) : '']),
      },
    ]);

  const totalValue = portfolio.reduce((s, h) => s + (h.current_value || 0), 0);
  const allocation = [...portfolio].sort((a, b) => (b.current_value || 0) - (a.current_value || 0));

  if (loading)
    return (
      <div aria-hidden="true">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skeleton block h-[68px]" />
          ))}
        </div>
        <span className="skeleton mt-6 block h-4 w-32" />
        {[0, 1, 2].map((i) => (
          <span key={i} className="skeleton mt-3 block h-14" />
        ))}
      </div>
    );

  if (loadError)
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted">Your portfolio could not be loaded.</p>
        <Button variant="ghost" className="mt-3" onClick={loadPortfolio}>
          Retry
        </Button>
      </div>
    );

  return (
    <div>
      {/* Summary */}
      {portfolio.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-control bg-surface2/60 p-3">
            <dt className="text-xs text-muted">Invested</dt>
            <dd className="num mt-1 text-lg font-semibold text-ink">{money(summary.total_invested)}</dd>
          </div>
          <div className="rounded-control bg-surface2/60 p-3">
            <dt className="text-xs text-muted">Current value</dt>
            <dd className="mt-1 text-lg font-semibold text-ink">
              <Price value={summary.current_value || 0} />
            </dd>
          </div>
          <div className={`col-span-2 rounded-control p-3 sm:col-span-1 ${(summary.total_pnl || 0) >= 0 ? 'bg-up/10' : 'bg-down/10'}`}>
            <dt className="text-xs text-muted">Total profit or loss</dt>
            <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className={`num text-lg font-semibold ${(summary.total_pnl || 0) >= 0 ? 'text-up' : 'text-down'}`}>{signedMoney(summary.total_pnl || 0)}</span>
              <Change value={summary.total_pnl_pct || 0} className="text-sm" />
            </dd>
          </div>
        </dl>
      )}

      {/* Allocation */}
      {portfolio.length > 1 && totalValue > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted">Where your money is</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-ink/[0.06]" role="img" aria-label={allocation.map((h) => `${h.ticker} ${(((h.current_value || 0) / totalValue) * 100).toFixed(0)}%`).join(', ')}>
            {allocation.map((h, i) => (
              <span key={h.ticker} className={`${SHADES[Math.min(i, SHADES.length - 1)]} border-r border-surface last:border-0`} style={{ width: `${((h.current_value || 0) / totalValue) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {allocation.map((h, i) => (
              <li key={h.ticker} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-sm ${SHADES[Math.min(i, SHADES.length - 1)]}`} aria-hidden="true" />
                <span className="num text-ink">{h.ticker}</span> {(((h.current_value || 0) / totalValue) * 100).toFixed(0)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health check */}
      {portfolio.length > 0 && <PortfolioHealth refreshKey={portfolio.map((h) => `${h.ticker}:${h.quantity}`).join(',')} />}

      {/* Header + add */}
      <div className={`flex items-center justify-between gap-3 ${portfolio.length ? 'mt-7' : ''}`}>
        <h2 className="text-sm font-semibold text-ink">
          Holdings{portfolio.length > 0 && <span className="num font-normal text-muted"> · {portfolio.length}</span>}
        </h2>
        <div className="flex items-center gap-3">
          {!isPro && (
            <span className="num text-xs text-muted">
              {portfolio.length}/{FREE_LIMIT} on the free plan
            </span>
          )}
          {portfolio.length > 0 && (
            <button
              type="button"
              onClick={() => (isPro ? exportPortfolio() : setShowUpgrade(true))}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-control px-2 text-xs font-medium text-muted hover:bg-ink/[0.06] hover:text-ink"
              aria-label={isPro ? 'Download portfolio as CSV' : 'CSV export is a Pro feature'}
            >
              <Download className="h-3.5 w-3.5" /> CSV{!isPro && <span className="rounded bg-accent/10 px-1 text-[10px] font-semibold text-accent">Pro</span>}
            </button>
          )}
          {!showAdd && portfolio.length > 0 && (
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" strokeWidth={2} /> Add holding
            </Button>
          )}
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          className="mt-4 rounded-card border border-line bg-canvas/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Add a holding</h3>
            <button type="button" onClick={() => setShowAdd(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink">NSE symbol</span>
              <input
                type="text"
                placeholder="e.g. RELIANCE"
                value={form.ticker}
                autoFocus
                autoCapitalize="characters"
                onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                className={`${field} num`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink">Quantity (shares)</span>
              <input type="number" inputMode="numeric" min={1} placeholder="e.g. 10" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={`${field} num`} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink">Average buy price (₹)</span>
              <input type="number" inputMode="decimal" min={0} step="0.01" placeholder="e.g. 1450.50" value={form.avg_buy_price} onChange={(e) => setForm({ ...form, avg_buy_price: e.target.value })} className={`${field} num`} />
            </label>
          </div>
          {error && (
            <p role="alert" className="mt-3 rounded-control bg-down/10 px-3 py-2 text-sm text-down">
              {error}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={adding}>
              {adding ? 'Adding…' : 'Add to portfolio'}
            </Button>
            <Button variant="quiet" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {portfolio.length === 0 && !showAdd && (
        <div className="py-10 text-center">
          <p className="text-base font-semibold text-ink">No holdings yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">Add the shares you own to see their live value and your profit or loss in one place.</p>
          <Button className="mt-5" onClick={openAdd}>
            <Plus className="h-4 w-4" strokeWidth={2} /> Add your first holding
          </Button>
        </div>
      )}

      {/* Holdings */}
      {portfolio.length > 0 && (
        <ul className="mt-3">
          {portfolio.map((item: any) => {
            const pnl = item.pnl || 0;
            const up = pnl >= 0;
            return (
              <li key={item.ticker} className="border-b border-line py-3.5 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <Link to={`/stock/${item.ticker}`} className="num text-[15px] font-semibold text-ink hover:text-accent">
                        {item.ticker}
                      </Link>
                      {item.price_change_pct != null && <Change value={item.price_change_pct || 0} className="text-xs" />}
                      <span className="text-[11px] text-muted">today</span>
                    </div>
                    <p className="truncate text-xs text-muted">{item.company_name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`num text-[15px] font-semibold ${up ? 'text-up' : 'text-down'}`}>{signedMoney(pnl)}</p>
                    <Change value={item.pnl_pct || 0} className="text-xs" />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <p className="num text-xs text-muted">
                    {item.quantity} × avg {money(item.avg_buy_price)} · now <Price value={item.current_price || 0} className="text-ink" /> · value {money(item.current_value)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.ticker)}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-control px-2 text-xs font-medium transition ${
                      confirming === item.ticker ? 'bg-down/10 text-down' : 'text-muted hover:text-down'
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {confirming === item.ticker ? 'Tap again to remove' : 'Remove'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-xs text-muted">Values use the latest NSE price and are indicative. Not SEBI-registered advice.</p>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={() => window.location.reload()} />}
    </div>
  );
}
