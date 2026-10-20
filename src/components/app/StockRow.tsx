import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Star } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist } from '../../lib/api';
import { cleanTicker } from '../../lib/evidence';
import Price, { Change } from '../ui/Price';
import { Button } from '../ui/Button';

// A dense list row: ticker, name, price, change, then actions. Every action is a visible button.
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

  const toggle = async () => {
    if (busy) return;
    if (!watched && !canAddToWatchlist) {
      onUpgradeNeeded?.();
      return;
    }
    setBusy(true);
    try {
      if (watched) {
        await removeFromWatchlist(ticker);
        setWatched(false);
      } else {
        await addToWatchlist(ticker, stock.company_name || ticker);
        setWatched(true);
        ReactGA.event({ category: 'Watchlist', action: 'stock_added', label: ticker });
      }
      onWatchlistChange?.();
    } catch (e: any) {
      console.error('Watchlist error:', e?.response?.data || e?.message);
    }
    setBusy(false);
  };

  return (
    <li className={`flex items-center gap-3 border-b border-line last:border-0 ${compact ? 'py-2.5' : 'py-3'}`}>
      <Link to={`/stock/${ticker}`} className="min-w-0 flex-1">
        <span className="num block text-sm font-semibold text-ink">{ticker}</span>
        <span className="block truncate text-xs text-muted">{stock.company_name || stock.sector || ''}</span>
      </Link>
      <div className="shrink-0 text-right">
        {Number.isFinite(price) && price > 0 ? <Price value={price} className="block text-sm font-medium text-ink" /> : <span className="text-sm text-muted">n/a</span>}
        {Number.isFinite(pct) && <Change value={pct} className="text-xs" />}
      </div>
      {!compact && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            aria-pressed={watched}
            aria-label={watched ? `Remove ${ticker} from watchlist` : `Add ${ticker} to watchlist`}
            className={`flex h-11 w-11 items-center justify-center rounded-control transition hover:bg-ink/[0.06] ${watched ? 'text-accent' : 'text-muted'}`}
          >
            <Star className={`h-[18px] w-[18px] ${watched ? 'fill-current' : ''}`} strokeWidth={1.75} />
          </button>
          <Button size="sm" variant="ghost" onClick={() => onAnalyze(stock)}>
            Analyze
          </Button>
        </div>
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
          <span className="skeleton block h-9 w-24" />
        </li>
      ))}
    </ul>
  );
}
