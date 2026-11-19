import { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { ChevronRight, Star } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist } from '../../lib/api';
import { cleanTicker } from '../../lib/evidence';
import Price, { Change } from '../ui/Price';
import { toastAdded, toastRemoved, haptic } from '../../lib/toast';

// A dense list row. The whole row opens the Evidence Board; the star is its own
// 44 px button. When a refresh changes the price, its background flashes briefly.
export default function StockRow({
  stock,
  onAnalyze,
  inWatchlist = false,
  canAddToWatchlist = true,
  onWatchlistChange,
  onUpgradeNeeded,
  compact = false,
}: {
  stock: any;
  onAnalyze: (stock: any) => void;
  inWatchlist?: boolean;
  canAddToWatchlist?: boolean;
  onWatchlistChange?: () => void;
  onUpgradeNeeded?: () => void;
  compact?: boolean;
}) {
  const ticker = cleanTicker(stock.display_ticker || stock.ticker);
  const [watched, setWatched] = useState(inWatchlist);
  const [busy, setBusy] = useState(false);
  useEffect(() => setWatched(inWatchlist), [inWatchlist]);

  const price = Number(stock.current_price);
  const pct = Number(stock.price_change_pct);

  // Flash the price when a refresh changes it (green up, red down), then fade.
  const lastPrice = useRef(price);
  const [flash, setFlash] = useState<'' | 'up' | 'down'>('');
  useEffect(() => {
    const before = lastPrice.current;
    lastPrice.current = price;
    if (!Number.isFinite(before) || !Number.isFinite(price) || before === price || !before) return;
    setFlash(price > before ? 'up' : 'down');
    const t = window.setTimeout(() => setFlash(''), 600);
    return () => window.clearTimeout(t);
  }, [price]);

  const setWatch = async (on: boolean, quiet = false) => {
    setBusy(true);
    try {
      if (on) {
        await addToWatchlist(ticker, stock.company_name || ticker);
        setWatched(true);
        ReactGA.event({ category: 'Watchlist', action: 'stock_added', label: ticker });
        if (!quiet) toastAdded(ticker);
      } else {
        await removeFromWatchlist(ticker);
        setWatched(false);
        if (!quiet) toastRemoved(ticker, () => setWatch(true, true));
      }
      onWatchlistChange?.();
    } catch (e: any) {
      console.error('Watchlist error:', e?.response?.data || e?.message);
    }
    setBusy(false);
  };

  const toggle = () => {
    if (busy) return;
    if (!watched && !canAddToWatchlist) {
      onUpgradeNeeded?.();
      return;
    }
    haptic();
    setWatch(!watched);
  };

  return (
    <li className={`group relative flex items-center gap-3 border-b border-line last:border-0 ${compact ? 'py-2.5' : 'py-3'}`}>
      <button
        type="button"
        onClick={() => onAnalyze(stock)}
        aria-label={`Open the Evidence Board for ${ticker}`}
        className="absolute inset-0 z-0 rounded-control transition duration-150 hover:bg-ink/[0.03] focus-visible:bg-ink/[0.04] active:scale-[0.99]"
      />
      <div className="pointer-events-none relative min-w-0 flex-1">
        <span className="num block text-sm font-semibold text-ink">{ticker}</span>
        <span className="block truncate text-xs text-muted">{stock.company_name || stock.sector || ''}</span>
      </div>
      <div className={`price-flash pointer-events-none relative shrink-0 rounded-control px-1.5 py-0.5 text-right tabular-nums ${flash ? `is-${flash}` : ''}`}>
        {Number.isFinite(price) && price > 0 ? <Price value={price} className="block text-sm font-medium text-ink" /> : <span className="text-sm text-muted">n/a</span>}
        {Number.isFinite(pct) && <Change value={pct} className="text-xs" />}
      </div>
      {!compact && (
        <>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            aria-pressed={watched}
            aria-label={watched ? `Remove ${ticker} from watchlist` : `Add ${ticker} to watchlist`}
            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-control transition active:scale-[0.9] hover:bg-ink/[0.06] ${watched ? 'text-accent' : 'text-muted'}`}
          >
            <Star className={`h-[18px] w-[18px] ${watched ? 'fill-current' : ''}`} strokeWidth={1.75} />
          </button>
          <ChevronRight className="pointer-events-none relative h-4 w-4 shrink-0 text-muted/70 transition group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
        </>
      )}
    </li>
  );
}

export function StockRowSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
          <div className="flex-1 space-y-1.5">
            <span className="skeleton block h-4 w-24" />
            <span className="skeleton block h-3 w-40" />
          </div>
          <span className="skeleton block h-8 w-20" />
          <span className="skeleton block h-9 w-11" />
          <span className="block w-4" />
        </li>
      ))}
    </ul>
  );
}
