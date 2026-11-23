// src/components/TrendingStocks.tsx
// Today's biggest movers across the whole NSE market, with the context a reader needs next:
// how the whole market did (breadth and sectors), what each move looked like through the day,
// whether it is unusual (circuit, 52-week extreme, volume), and the company's own filing.
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { ArrowUpRight, FileText, Flame, RefreshCw, Star, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import AnalysisModal from './AnalysisModal';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';
import Price from './ui/Price';
import { addToWatchlist, removeFromWatchlist } from '../lib/api';
import { haptic, toastAdded, toastRemoved } from '../lib/toast';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
type Side = 'up' | 'down';
type Filter = 'all' | 'large' | 'fno';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All NSE' },
  { value: 'large', label: 'Large caps' },
  { value: 'fno', label: 'F&O stocks' },
];

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
  const [filter, setFilter] = useState<Filter>('all');
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

  // v2 responses carry lists per filter; older ones only most_bought / most_sold.
  const lists = useMemo(() => data?.lists || { all: { gainers: data?.most_bought || [], losers: data?.most_sold || [] } }, [data]);
  const available = FILTERS.filter(f => lists[f.value]);
  const active: Filter = lists[filter] ? filter : 'all';
  const gainers: any[] = useMemo(() => (lists[active]?.gainers || []).slice(0, 10), [lists, active]);
  const losers: any[] = useMemo(() => (lists[active]?.losers || []).slice(0, 10), [lists, active]);
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
        <button type="button" onClick={refresh} aria-label="Refresh movers"
          className="grid h-9 w-9 place-items-center rounded-control border border-line text-muted transition hover:border-ink/25 hover:text-ink">
          <RefreshCw className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </header>

      {!loading && data?.market && <MarketPulse market={data.market} />}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        {available.length > 1 ? (
          <Segmented<Filter> label="Which stocks" value={active} onChange={setFilter} options={available} />
        ) : <span />}
        <div className="lg:hidden">
          <Segmented<Side> label="Movers" value={side} onChange={setSide}
            options={[{ value: 'up', label: '▲ Gainers' }, { value: 'down', label: '▼ Losers' }]} />
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2" aria-hidden="true">
            {[0, 1].map(c => (
              <div key={c} className={`space-y-2 ${c ? 'hidden lg:block' : ''}`}>
                {Array.from({ length: 7 }).map((_, i) => <span key={i} className="skeleton block h-16" />)}
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
          <div key={active} className="grid gap-x-8 gap-y-6 lg:grid-cols-2">
            <Column title="Top gainers" Icon={TrendingUp} up rows={gainers} onOpen={setSelected}
              className={side === 'up' ? '' : 'hidden lg:block'} />
            <Column title="Top losers" Icon={TrendingDown} up={false} rows={losers} onOpen={setSelected}
              className={side === 'down' ? '' : 'hidden lg:block'} />
          </div>
        )}
      </div>

      {!loading && !empty && (
        <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
          Source: {data?.source || 'NSE'}{data?.lists ? '; intraday line and usual volume from Yahoo Finance' : ''}. Filings are the
          company's latest exchange announcement and may not be the cause of the move. Stocks under ₹10 or with less than ₹1 crore
          traded are left out. What happened, not a forecast.
        </p>
      )}

      {selected && <AnalysisModal stock={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ── Whole-market strip: breadth and sectors ─────────────────────────────── */
function MarketPulse({ market }: { market: any }) {
  const b = market.breadth;
  const sectors: any[] = market.sectors || [];
  const total = b ? b.up + b.down + (b.unchanged || 0) : 0;
  const maxSector = Math.max(1, ...sectors.map(s => Math.abs(s.pct)));
  if (!b && !sectors.length) return null;
  const mood = b ? (b.up > b.down * 1.5 ? 'Most stocks are rising' : b.down > b.up * 1.5 ? 'Most stocks are falling' : 'A mixed day') : null;

  return (
    <section aria-label="How the whole market is doing" className="mt-4 grid gap-4 rounded-card bg-ink/[0.03] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
      {b && total > 0 && (
        <div>
          <p className="text-xs text-muted">{b.scope || 'Whole market'}</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">{mood}</p>
          <div className="mt-2.5 flex h-2.5 gap-px overflow-hidden rounded-full" role="img"
            aria-label={`${b.up} stocks up, ${b.down} down, ${b.unchanged || 0} unchanged`}>
            <span className="h-full bg-up" style={{ width: `${(b.up / total) * 100}%` }} />
            <span className="h-full bg-ink/20" style={{ width: `${((b.unchanged || 0) / total) * 100}%` }} />
            <span className="h-full bg-down" style={{ width: `${(b.down / total) * 100}%` }} />
          </div>
          <div className="num mt-1.5 flex justify-between text-xs">
            <span className="text-up">▲ {b.up.toLocaleString('en-IN')} up</span>
            <span className="text-muted">{(b.unchanged || 0).toLocaleString('en-IN')} flat</span>
            <span className="text-down">{b.down.toLocaleString('en-IN')} down ▼</span>
          </div>
        </div>
      )}
      {sectors.length > 0 && (
        <div className="min-w-0">
          <p className="text-xs text-muted">Sectors today</p>
          <ul className="scrollbar-hide mt-2 flex gap-1.5 overflow-x-auto pb-0.5 lg:flex-wrap">
            {sectors.map(s => {
              const up = s.pct >= 0;
              const a = 0.08 + (Math.abs(s.pct) / maxSector) * 0.3;
              return (
                <li key={s.index} title={s.index} className="shrink-0 rounded-control px-2.5 py-1.5"
                  style={{ background: `rgb(var(--${up ? 'up' : 'down'}) / ${a.toFixed(2)})` }}>
                  <span className="block text-[11px] leading-tight text-ink/85">{s.name}</span>
                  <span className={`num block text-xs font-semibold ${up ? 'text-up' : 'text-down'}`}>{up ? '+' : '−'}{Math.abs(s.pct).toFixed(2)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ── Lists ───────────────────────────────────────────────────────────────── */
function Column({ title, Icon, up, rows, onOpen, className = '' }: {
  title: string; Icon: typeof TrendingUp; up: boolean; rows: any[]; onOpen: (s: any) => void; className?: string;
}) {
  return (
    <section aria-label={title} className={className}>
      <h3 className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${up ? 'text-up' : 'text-down'}`}>
        <Icon className="h-4 w-4" aria-hidden="true" /> {title}
      </h3>
      {rows.length ? (
        <ol>{rows.map((s, i) => <MoverRow key={s.display_ticker} stock={s} rank={i + 1} up={up} onOpen={onOpen} />)}</ol>
      ) : (
        <p className="py-6 text-sm text-muted">{up ? 'No stock in this group is up today.' : 'No stock in this group is down today.'}</p>
      )}
    </section>
  );
}

const BADGE_STYLE: Record<string, { cls: string; Icon: typeof Zap }> = {
  upper_circuit: { cls: 'bg-up/10 text-up', Icon: Zap },
  lower_circuit: { cls: 'bg-down/10 text-down', Icon: Zap },
  high_52w: { cls: 'bg-accent/10 text-accent', Icon: ArrowUpRight },
  low_52w: { cls: 'bg-caution/15 text-caution', Icon: ArrowUpRight },
  volume: { cls: 'bg-ink/[0.07] text-ink/85', Icon: Flame },
};

function MoverRow({ stock, rank, up, onOpen }: { stock: any; rank: number; up: boolean; onOpen: (s: any) => void }) {
  const ticker: string = stock.display_ticker || String(stock.ticker || '').replace(/\.(NS|BO)$/, '');
  const pct = Number(stock.price_change_pct) || 0;
  const price = Number(stock.current_price);
  const traded = crore(stock.turnover);
  const badges: any[] = stock.badges || [];
  const why = stock.why;
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
    <li className="tool-rise group relative border-b border-line py-2.5 last:border-0" style={{ '--d': `${rank * 35}ms` } as CSSProperties}>
      <button type="button" onClick={() => onOpen(stock)} aria-label={`Open the Evidence Board for ${ticker}`}
        className="absolute inset-0 z-0 -mx-2 rounded-control transition hover:bg-ink/[0.03] focus-visible:bg-ink/[0.05]" />

      <div className="pointer-events-none relative grid grid-cols-[1.25rem_minmax(0,1fr)_auto_auto] items-center gap-x-3">
        <span className={`num text-center text-xs font-semibold ${rank <= 3 ? (up ? 'text-up' : 'text-down') : 'text-muted'}`}>{rank}</span>
        <div className="min-w-0">
          <p className="num truncate text-sm font-semibold text-ink">{ticker}</p>
          <p className="truncate text-xs text-muted">{stock.company_name}</p>
        </div>
        <Spark points={stock.spark} prev={stock.previous_close} up={up} />
        <div className="text-right">
          {Number.isFinite(price) && price > 0 ? <Price value={price} className="block text-sm font-medium text-ink" /> : <span className="text-sm text-muted">n/a</span>}
          <span className={`num inline-block rounded px-1.5 py-px text-xs font-semibold ${up ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
            {up ? '+' : '−'}{Math.abs(pct).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="relative ml-8 mt-1.5 flex flex-wrap items-center gap-1.5">
        {badges.map(b => {
          const st = BADGE_STYLE[b.kind] || BADGE_STYLE.volume;
          return (
            <span key={b.kind} className={`pointer-events-none inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
              <st.Icon className="h-3 w-3" aria-hidden="true" />{b.label}
            </span>
          );
        })}
        {traded && <span className="num pointer-events-none text-[11px] text-muted">{traded} traded</span>}
        {stock.why === null && <span className="pointer-events-none text-[11px] text-muted">· No new filing</span>}
        <button type="button" onClick={toggleWatch} disabled={busy} aria-pressed={watched}
          aria-label={watched ? `Remove ${ticker} from watchlist` : `Add ${ticker} to watchlist`}
          className={`relative z-10 -my-1 ml-auto grid h-8 w-8 place-items-center rounded-control transition hover:bg-ink/[0.06] ${watched ? 'text-accent' : 'text-muted'}`}>
          <Star className={`h-4 w-4 ${watched ? 'fill-current' : ''}`} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {why && (
        <a href={why.url || undefined} target="_blank" rel="noopener noreferrer" onClick={e => { if (!why.url) e.preventDefault(); }}
          className="relative z-10 ml-8 mt-1 flex items-start gap-1.5 rounded-control text-xs leading-snug text-ink/80 hover:text-accent">
          <FileText className="mt-px h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          <span className="line-clamp-2 min-w-0"><span className="font-semibold text-ink">{why.title}:</span> {why.detail}</span>
        </a>
      )}
    </li>
  );
}
/* Intraday line: 15-minute closes, dashed line at yesterday's close. */
function Spark({ points, prev, up }: { points?: number[]; prev?: number | null; up: boolean }) {
  if (!points || points.length < 2) return <span className="w-16 sm:w-20" aria-hidden="true" />;
  const W = 80, H = 26;
  const vals = prev ? [...points, prev] : points;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i: number) => (i / (points.length - 1)) * W;
  const y = (v: number) => H - 2 - ((v - lo) / span) * (H - 4);
  const d = points.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const color = up ? 'rgb(var(--up))' : 'rgb(var(--down))';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[26px] w-16 overflow-visible sm:w-20" role="img"
      aria-label={`Intraday: started near ₹${points[0]}, now ₹${points[points.length - 1]}`}>
      {prev ? <line x1="0" x2={W} y1={y(prev)} y2={y(prev)} stroke="currentColor" strokeDasharray="2 3" className="text-ink/25" /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="tool-draw" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="2.2" fill={color} />
    </svg>
  );
}
