// src/components/SearchDialog.tsx
// Search everywhere (command palette): ⌘K / Ctrl K / "/" on desktop, the Search
// tab on phones (full screen). Groups: Your watchlist, Stocks, Pages, Recent.
// Enter opens the Evidence Board; ⌘Enter / Ctrl Enter opens the full stock page.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Clock, CornerDownLeft, FileText, Search, Star, TrendingUp, X } from 'lucide-react';
import { getWatchlist } from '../lib/api';
import { supabase } from '../lib/supabase';
import { cleanTicker } from '../lib/evidence';
import { loadSymbols } from './ui/StockSearch';

type Sym = { s: string; n: string; nl: string };
type Recent = { kind: 'stock' | 'page'; value: string; label: string };

const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC'];
const PAGES = [
  { to: '/today', label: 'Today: news for your stocks', words: 'today radar alerts filings' },
  { to: '/market-wrap', label: 'Market wrap', words: 'market wrap nifty sensex close daily' },
  { to: '/ipos', label: 'IPO tracker', words: 'ipo gmp listing subscription' },
  { to: '/?tab=portfolio', label: 'Portfolio', words: 'portfolio holdings' },
  { to: '/stocks/screener', label: 'Stock screener', words: 'screener filter pe' },
  { to: '/stocks/dividends', label: 'Dividend tracker', words: 'dividend yield record date' },
  { to: '/invest', label: 'Explore investments', words: 'invest fd mutual fund gold bonds' },
  { to: '/learn', label: 'Learn the basics', words: 'learn guide beginner course' },
  { to: '/tools/sip-calculator', label: 'SIP calculator', words: 'sip calculator mutual fund' },
  { to: '/tools/lumpsum-calculator', label: 'Lumpsum calculator', words: 'lumpsum calculator' },
  { to: '/tools/brokerage-calculator', label: 'Brokerage calculator', words: 'brokerage charges calculator' },
  { to: '/tools/fno-calculator', label: 'F&O calculator', words: 'fno futures options margin calculator' },
  { to: '/tools/stock-comparison', label: 'Compare stocks', words: 'compare comparison' },
];
const RECENT_KEY = 'bp_palette_recent';

function readRecent(): Recent[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 6);
  } catch {
    return [];
  }
}
function remember(item: Recent) {
  try {
    const next = [item, ...readRecent().filter((r) => !(r.kind === item.kind && r.value === item.value))].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

/** Fuzzy enough for people: ticker prefix, name words in order ("hdfc bank"), or a near-complete ticker ("relianc"). */
function matchStocks(list: Sym[], query: string, limit = 8): Sym[] {
  const q = query.trim();
  if (!q) return [];
  const qu = q.toUpperCase().replace(/\s+/g, '');
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored: { item: Sym; score: number }[] = [];
  for (const item of list) {
    let score = 0;
    if (item.s === qu) score = 100;
    else if (item.s.startsWith(qu)) score = 80 - Math.min(item.s.length - qu.length, 20);
    else if (item.nl.startsWith(words[0]) && words.every((w) => item.nl.includes(w))) score = 55;
    else if (words.every((w) => item.nl.includes(w))) score = 40;
    else if (qu.length >= 3 && item.s.includes(qu)) score = 30;
    if (score) scored.push({ item, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.item.s.length - b.item.s.length).slice(0, limit).map((x) => x.item);
}

const itemCls =
  'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-control px-3 text-sm text-ink data-[selected=true]:bg-accent/10 data-[selected=true]:text-ink';
const groupCls =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted';

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [symbols, setSymbols] = useState<Sym[] | null>(null);
  const [watch, setWatch] = useState<{ ticker: string; name: string; price?: number; pct?: number }[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const metaHeld = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setRecent(readRecent());
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    loadSymbols().then(setSymbols).catch(() => setSymbols([]));
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      if (!data.session) return;
      getWatchlist()
        .then((r) =>
          setWatch(
            (r.data?.watchlist || []).map((w: any) => ({
              ticker: cleanTicker(w.display_ticker || w.ticker),
              name: w.company_name || '',
              price: Number(w.current_price),
              pct: Number(w.price_change_pct),
            })),
          ),
        )
        .catch(() => setWatch([]));
    });
    const onKey = (e: KeyboardEvent) => {
      metaHeld.current = e.metaKey || e.ctrlKey;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    const onUp = (e: KeyboardEvent) => (metaHeld.current = e.metaKey || e.ctrlKey);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('keyup', onUp, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('keyup', onUp, true);
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const stockHits = useMemo(() => (symbols ? matchStocks(symbols, query) : []), [symbols, query]);
  const watchHits = useMemo(
    () => (q ? watch.filter((w) => w.ticker.toLowerCase().includes(q.replace(/\s+/g, '')) || w.name.toLowerCase().includes(q)) : watch).slice(0, 6),
    [watch, q],
  );
  const pageHits = useMemo(() => (q ? PAGES.filter((p) => `${p.label} ${p.words}`.toLowerCase().includes(q)) : PAGES.slice(0, 4)), [q]);
  const watchSet = new Set(watch.map((w) => w.ticker));

  if (!open) return null;

  const openStock = (ticker: string, name = '') => {
    remember({ kind: 'stock', value: ticker, label: name || ticker });
    onClose();
    // The Evidence Board opens on the signed-in home; visitors get the public stock page.
    navigate(metaHeld.current || !signedIn ? `/stock/${ticker}` : `/?analyze=${encodeURIComponent(ticker)}`);
  };
  const openPage = (to: string, label: string) => {
    remember({ kind: 'page', value: to, label });
    onClose();
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center sm:p-6 sm:pt-[12vh]">
      <button type="button" aria-label="Close search" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-canvas/70 backdrop-blur-sm" />
      <Command
        label="Search stocks and pages"
        shouldFilter={false}
        loop
        className="board-panel relative flex h-[100dvh] w-full flex-col bg-canvas pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:h-auto sm:max-h-[70vh] sm:max-w-xl sm:rounded-card sm:border sm:border-line sm:bg-surface sm:shadow-lift"
      >
        <div className="flex items-center gap-2 border-b border-line px-3">
          <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search any NSE stock or page"
            inputMode="search"
            enterKeyHint="search"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <Command.List className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {symbols === null && q ? <Command.Loading className="px-3 py-3 text-sm text-muted">Loading the stock list…</Command.Loading> : null}
          {q && symbols && !stockHits.length && !watchHits.length && !pageHits.length ? (
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">Nothing matches “{query}”. Try a ticker like TCS or a company name.</Command.Empty>
          ) : null}

          {!q && recent.length > 0 && (
            <Command.Group heading="Recent" className={groupCls}>
              {recent.map((r) => (
                <Command.Item
                  key={`${r.kind}:${r.value}`}
                  value={`recent:${r.kind}:${r.value}`}
                  onSelect={() => (r.kind === 'stock' ? openStock(r.value, r.label) : openPage(r.value, r.label))}
                  className={itemCls}
                >
                  <Clock className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  {r.kind === 'stock' ? <span className="num font-semibold">{r.value}</span> : <span>{r.label}</span>}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {watchHits.length > 0 && (
            <Command.Group heading="Your watchlist" className={groupCls}>
              {watchHits.map((w) => (
                <Command.Item key={`w:${w.ticker}`} value={`watch:${w.ticker}`} onSelect={() => openStock(w.ticker, w.name)} className={itemCls}>
                  <Star className="h-4 w-4 shrink-0 fill-current text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="num block font-semibold">{w.ticker}</span>
                    {w.name && <span className="block truncate text-xs text-muted">{w.name}</span>}
                  </span>
                  {Number.isFinite(w.price) && w.price ? (
                    <span className="num shrink-0 text-right text-xs tabular-nums">
                      <span className="block text-ink">₹{w.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      {Number.isFinite(w.pct) && (
                        <span className={(w.pct || 0) >= 0 ? 'text-up' : 'text-down'}>
                          {(w.pct || 0) >= 0 ? '+' : ''}
                          {(w.pct || 0).toFixed(2)}%
                        </span>
                      )}
                    </span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {(q ? stockHits.filter((s) => !watchSet.has(s.s)).length > 0 : true) && (
            <Command.Group heading={q ? 'Stocks' : 'Popular this week'} className={groupCls}>
              {(q ? stockHits.filter((s) => !watchSet.has(s.s)) : POPULAR.map((s) => ({ s, n: '', nl: '' }))).map((s) => (
                <Command.Item key={`s:${s.s}`} value={`stock:${s.s}`} onSelect={() => openStock(s.s, s.n)} className={itemCls}>
                  <TrendingUp className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="num block font-semibold">{s.s}</span>
                    {s.n && <span className="block truncate text-xs text-muted">{s.n}</span>}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {pageHits.length > 0 && (
            <Command.Group heading="Pages" className={groupCls}>
              {pageHits.map((p) => (
                <Command.Item key={`p:${p.to}`} value={`page:${p.to}`} onSelect={() => openPage(p.to, p.label)} className={itemCls}>
                  <FileText className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  {p.label}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        <p className="hidden items-center gap-3 border-t border-line px-4 py-2.5 text-xs text-muted sm:flex">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-line px-1 font-mono">
              <CornerDownLeft className="inline h-3 w-3" aria-hidden="true" />
            </kbd>
            Evidence Board
          </span>
          <span>
            <kbd className="rounded border border-line px-1 font-mono">⌘</kbd>
            <kbd className="ml-0.5 rounded border border-line px-1 font-mono">
              <CornerDownLeft className="inline h-3 w-3" aria-hidden="true" />
            </kbd>{' '}
            Full stock page
          </span>
          <span className="ml-auto">
            <kbd className="rounded border border-line px-1 font-mono">Esc</kbd> close
          </span>
        </p>
      </Command>
    </div>
  );
}
