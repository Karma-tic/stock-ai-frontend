// src/components/TrendingStocks.tsx
// Today's biggest movers across the whole NSE market. Gainers and losers side by side on wide
// screens (one at a time on phones); each row's bar shows the size of the move against the
// day's biggest, so the list reads at a glance.
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { RefreshCw, Star, TrendingDown, TrendingUp } from 'lucide-react';
import AnalysisModal from './AnalysisModal';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';
import Price from './ui/Price';
import { addToWatchlist, removeFromWatchlist } from '../lib/api';
import { haptic, toastAdded, toastRemoved } from '../lib/toast';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
type Side = 'up' | 'down';

const crore = (v?: number | null) => {
  if (!v) return null;
  const cr = v / 1e7;
  return cr >= 100 ? `₹${Math.round(cr).toLocaleString('en-IN')} Cr` : `₹${cr.toFixed(cr >= 10 ? 0 : 1)} Cr`;
};

export default function TrendingStocks() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [side, setSide] = useState<Side>('up');
  const [spinning, setSpinning] = useState(false);

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get(`${BASE}/api/market/trending`);
      setData(res.data);
    } catch (e) {
      console.error(e);
      if (!quiet) setLoadError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // The server recomputes every 5 minutes; follow it while the tab is visible.
    const t = window.setInterval(() => { if (document.visibilityState === 'visible') load(true); }, 5 * 60 * 1000);
    return () => window.clearInterval(t);
  }, []);

  const refresh = async () => {
    setSpinning(true);
    await load(true);
    window.setTimeout(() => setSpinning(false), 400);
  };

  const gainers: any[] = useMemo(() => (data?.most_bought || []).slice(0, 10), [data]);
  const losers: any[] = useMemo(() => (data?.most_sold || []).slice(0, 10), [data]);
  // One scale for both columns, so a 19% fall and a 19% rise look the same size.
  const maxAbs = useMemo(
    () => Math.max(1, ...[...gainers, ...losers].map(s => Math.abs(Number(s.price_change_pct) || 0))),
    [gainers, losers],
  );

  const open = !!data?.market_open;
  const asOf = data?.as_of
    ? new Date(data.as_of).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit',
        ...(open ? {} : { day: 'numeric', month: 'short' }),
      })
    : null;
  const empty = !gainers.length && !losers.length;

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em] text-ink">
            Today's biggest movers
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${open ? 'bg-up/10 text-up' : 'bg-ink/[0.06] text-muted'}`}>
              <span className={`relative h-1.5 w-1.5 rounded-full ${open ? 'bg-up' : 'bg-muted'}`}>
                {open && <span className="absolute inset-0 animate-ping rounded-full bg-up/60 motion-reduce:hidden" />}
              </span>
              {open ? 'Live' : 'Market closed'}
            </span>
          </h2>
          <p className="mt-1 text-xs text-muted">
            {data?.scope || 'NSE stocks'}
            {asOf && <> · {open ? 'as of' : 'last close,'} <span className="num">{asOf}</span> IST</>}
            {' · '}refreshes every 5 min
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Segmented<Side> label="Movers" value={side} onChange={setSide}
              options={[{ value: 'up', label: '▲ Gainers' }, { value: 'down', label: '▼ Losers' }]} />
          </div>
          <button type="button" onClick={refresh} aria-label="Refresh movers"
            className="grid h-9 w-9 place-items-center rounded-control border border-line text-muted transition hover:border-ink/25 hover:text-ink">
            <RefreshCw className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="mt-4">
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2" aria-hidden="true">
            {[0, 1].map(c => (
              <div key={c} className={`space-y-2 ${c ? 'hidden lg:block' : ''}`}>
                {Array.from({ length: 8 }).map((_, i) => <span key={i} className="skeleton block h-12" />)}
              </div>
            ))}
          </div>
        ) : loadError || empty ? (
          <div className="py-10 text-center">
            <p className="text-base font-semibold text-ink">{loadError ? 'Movers could not be loaded' : 'No movers yet today'}</p>
            <p className="mt-1 text-sm text-muted">{loadError ? 'Check your connection and try again.' : 'The list fills in once the market opens at 9:15 am IST.'}</p>
            <Button variant="ghost" className="mt-4" onClick={() => load()}>Retry</Button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-6 lg:grid-cols-2">
            <Column title="Top gainers" Icon={TrendingUp} up rows={gainers} maxAbs={maxAbs} onOpen={setSelected}
              className={side === 'up' ? '' : 'hidden lg:block'} />
            <Column title="Top losers" Icon={TrendingDown} up={false} rows={losers} maxAbs={maxAbs} onOpen={setSelected}
              className={side === 'down' ? '' : 'hidden lg:block'} />
          </div>
        )}
      </div>

      {!loading && !empty && (
        <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
          Source: {data?.source || 'NSE'}. Stocks under ₹10 or with less than ₹1 crore traded today are left out. What happened, not a forecast.
        </p>
      )}

      {selected && <AnalysisModal stock={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Column({ title, Icon, up, rows, maxAbs, onOpen, className = '' }: {
  title: string; Icon: typeof TrendingUp; up: boolean; rows: any[]; maxAbs: number; onOpen: (s: any) => void; className?: string;
}) {
  return (
    <section aria-label={title} className={className}>
      <h3 className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${up ? 'text-up' : 'text-down'}`}>
        <Icon className="h-4 w-4" aria-hidden="true" /> {title}
      </h3>
      {rows.length ? (
        <ol>
          {rows.map((s, i) => <MoverRow key={s.display_ticker} stock={s} rank={i + 1} up={up} maxAbs={maxAbs} onOpen={onOpen} />)}
        </ol>
      ) : (
        <p className="py-6 text-sm text-muted">{up ? 'No stock is up today.' : 'No stock is down today.'}</p>
      )}
    </section>
  );
}

function MoverRow({ stock, rank, up, maxAbs, onOpen }: { stock: any; rank: number; up: boolean; maxAbs: number; onOpen: (s: any) => void }) {
  const ticker: string = stock.display_ticker || String(stock.ticker || '').replace(/\.(NS|BO)$/, '');
  const pct = Number(stock.price_change_pct) || 0;
  const price = Number(stock.current_price);
  const width = Math.max(4, (Math.abs(pct) / maxAbs) * 100);
  const traded = crore(stock.turnover);
  const [watched, setWatched] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleWatch = async () => {
    if (busy) return;
    haptic();
    setBusy(true);
    try {
      if (watched) {
        await removeFromWatchlist(ticker);
        setWatched(false);
        toastRemoved(ticker, () => addToWatchlist(ticker, stock.company_name || ticker).then(() => setWatched(true)));
      } else {
        await addToWatchlist(ticker, stock.company_name || ticker);
        setWatched(true);
        ReactGA.event({ category: 'Watchlist', action: 'stock_added', label: ticker });
        toastAdded(ticker);
      }
    } catch (e: any) {
      console.error('Watchlist error:', e?.response?.data || e?.message);
    }
    setBusy(false);
  };

  return (
    <li className="group relative grid grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-line py-2.5 last:border-0">
      <button type="button" onClick={() => onOpen(stock)} aria-label={`Open the Evidence Board for ${ticker}`}
        className="absolute inset-0 z-0 -mx-2 rounded-control transition hover:bg-ink/[0.03] focus-visible:bg-ink/[0.05]" />
      <span className={`num pointer-events-none relative text-center text-xs font-semibold ${rank <= 3 ? (up ? 'text-up' : 'text-down') : 'text-muted'}`}>{rank}</span>

      <div className="pointer-events-none relative min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="num truncate text-sm font-semibold text-ink">{ticker}</span>
          <span className="hidden truncate text-xs text-muted sm:inline">{stock.company_name}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
            <span className={`tool-bar block h-full rounded-full ${up ? 'bg-up' : 'bg-down'}`}
              style={{ width: `${width}%`, '--d': `${rank * 40}ms` } as CSSProperties} />
          </span>
          <span className={`num w-[4.5rem] shrink-0 text-right text-xs font-semibold ${up ? 'text-up' : 'text-down'}`}>
            {up ? '▲ +' : '▼ −'}{Math.abs(pct).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="pointer-events-none relative text-right">
        {Number.isFinite(price) && price > 0 ? <Price value={price} className="block text-sm font-medium text-ink" /> : <span className="text-sm text-muted">n/a</span>}
        {traded && <span className="num block text-[11px] text-muted">{traded} traded</span>}
      </div>

      <button type="button" onClick={toggleWatch} disabled={busy} aria-pressed={watched}
        aria-label={watched ? `Remove ${ticker} from watchlist` : `Add ${ticker} to watchlist`}
        className={`relative z-10 grid h-10 w-10 place-items-center rounded-control transition hover:bg-ink/[0.06] ${watched ? 'text-accent' : 'text-muted'}`}>
        <Star className={`h-[17px] w-[17px] ${watched ? 'fill-current' : ''}`} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </li>
  );
}
