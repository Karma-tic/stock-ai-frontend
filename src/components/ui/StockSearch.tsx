import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

// Every NSE equity (symbol + name), shipped as a small static file and only
// downloaded the first time someone focuses a search box.
type Sym = { s: string; n: string; nl: string };
let symbolsPromise: Promise<Sym[]> | null = null;

export function loadSymbols(): Promise<Sym[]> {
  if (!symbolsPromise) {
    symbolsPromise = fetch(`${process.env.PUBLIC_URL || ''}/data/nse-symbols.txt`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((txt) =>
        txt
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [s, n = ''] = line.split('|');
            return { s, n, nl: n.toLowerCase() };
          }),
      )
      .catch((e) => {
        symbolsPromise = null; // allow a retry later
        throw e;
      });
  }
  return symbolsPromise;
}

function rank(list: Sym[], query: string, limit: number) {
  const q = query.trim();
  if (!q) return [];
  const qu = q.toUpperCase();
  const ql = q.toLowerCase();
  const scored: { item: Sym; score: number }[] = [];
  for (const item of list) {
    let score = 0;
    if (item.s === qu) score = 100;
    else if (item.s.startsWith(qu)) score = 80 - Math.min(item.s.length - qu.length, 20);
    else if (item.nl.startsWith(ql)) score = 60;
    else if (item.nl.includes(` ${ql}`)) score = 45;
    else if (ql.length > 2 && item.nl.includes(ql)) score = 30;
    else if (qu.length > 2 && item.s.includes(qu)) score = 25;
    if (score) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score || a.item.s.length - b.item.s.length);
  return scored.slice(0, limit).map((x) => x.item);
}

const TICKER_RE = /^[A-Z0-9&-]{2,12}$/;

export default function StockSearch({
  size = 'lg',
  autoFocus = false,
  placeholder = 'Search any NSE stock, e.g. TCS or Reliance',
  onNavigate,
  className = '',
  inputClassName = '',
}: {
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  placeholder?: string;
  onNavigate?: () => void;
  className?: string;
  inputClassName?: string;
}) {
  const navigate = useNavigate();
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [symbols, setSymbols] = useState<Sym[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const warm = () => {
    if (symbols || failed) return;
    loadSymbols().then(setSymbols).catch(() => setFailed(true));
  };

  useEffect(() => {
    if (autoFocus) {
      warm();
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const results = useMemo(() => (symbols ? rank(symbols, query, 7) : []), [symbols, query]);
  const typed = query.trim().toUpperCase();
  const showOpenTyped = typed && TICKER_RE.test(typed) && !results.some((r) => r.s === typed);
  const options = [...results.map((r) => ({ s: r.s, n: r.n })), ...(showOpenTyped ? [{ s: typed, n: 'Open this ticker' }] : [])];

  useEffect(() => setActive(0), [query]);

  const go = (symbol: string) => {
    setOpen(false);
    setQuery('');
    onNavigate?.();
    navigate(`/stock/${encodeURIComponent(symbol)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(options.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = options[active] || (typed && TICKER_RE.test(typed) ? { s: typed } : null);
      if (pick) go(pick.s);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;
  const tall = size === 'lg';

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={`${id}-input`} className="sr-only">
        Search NSE stocks
      </label>
      <div
        className={`flex items-center gap-2 rounded-control border border-line bg-surface px-3 transition focus-within:border-accent/60 ${
          tall ? 'h-14' : 'h-11'
        }`}
      >
        <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && options[active] ? `${id}-opt-${active}` : undefined}
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            warm();
            setOpen(true);
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={`h-full min-w-0 flex-1 bg-transparent text-ink placeholder:text-muted/80 focus:outline-none ${
            tall ? 'text-base' : 'text-[15px]'
          } ${inputClassName}`}
        />
        <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:inline">Enter</kbd>
      </div>

      <p className="sr-only" aria-live="polite">
        {showList ? `${options.length} result${options.length === 1 ? '' : 's'}` : ''}
      </p>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[min(60vh,360px)] overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-lift"
        >
          {!symbols && !failed && <li className="px-3 py-3 text-sm text-muted">Loading stock list…</li>}
          {failed && options.length === 0 && <li className="px-3 py-3 text-sm text-muted">Type a ticker and press Enter.</li>}
          {symbols && options.length === 0 && <li className="px-3 py-3 text-sm text-muted">No NSE stock matches “{query.trim()}”.</li>}
          {options.map((o, i) => (
            <li
              key={`${o.s}-${i}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(o.s)}
              className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-control px-3 py-2 ${
                i === active ? 'bg-accent/10' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="num block text-sm font-semibold text-ink">{o.s}</span>
                <span className="block truncate text-xs text-muted">{o.n}</span>
              </span>
              <ArrowRight className={`h-4 w-4 shrink-0 ${i === active ? 'text-accent' : 'text-muted/50'}`} aria-hidden="true" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
