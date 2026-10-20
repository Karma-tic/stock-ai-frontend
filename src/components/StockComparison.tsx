import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Scale, Search, X } from 'lucide-react';
import { getStock } from '../lib/api';
import { STOCK_PROFILES } from '../data/stockProfiles';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import { Button } from './ui/Button';
import { Change } from './ui/Price';
import { ShareResult } from './calc/CalcKit';

const DEFAULT_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK'];
const EXTRA_STOCK_OPTIONS = [
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', sector: 'NBFC' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Infrastructure' },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', sector: 'Banking' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobile' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India', sector: 'Power' },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation', sector: 'Energy' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', sector: 'Diversified' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automobile' },
  { symbol: 'TITAN', name: 'Titan Company Limited', sector: 'Consumer' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', sector: 'Paints' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG' },
];

const STOCK_OPTIONS = [
  ...Object.values(STOCK_PROFILES).map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
  })),
  ...EXTRA_STOCK_OPTIONS,
].filter((stock, index, list) => list.findIndex(item => item.symbol === stock.symbol) === index);

function formatCurrency(value: number | null | undefined) {
  if (!value) return 'n/a';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

function scoreStock(stock: any) {
  let score = 50;
  const pe = Number(stock.pe_ratio) || 0;
  const div = Number(stock.dividend_yield_pct) || 0;
  const change = Number(stock.price_change_pct) || 0;
  const pos52 = Number(stock.position_in_52w) || 0;

  if (pe > 0 && pe < 20) score += 15;
  else if (pe > 0 && pe < 35) score += 8;
  else if (pe > 60) score -= 10;
  if (div > 2) score += 10;
  if (change > 0) score += Math.min(change * 2, 10);
  if (pos52 > 20 && pos52 < 80) score += 8;
  if (pos52 >= 90) score -= 6;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function StockComparison() {
  // The chosen stocks live in the link (?s=TCS,INFY) so a comparison can be shared
  const [params, setParams] = useSearchParams();
  const [symbols, setSymbolsState] = useState<string[]>(() => {
    const fromUrl = (params.get('s') || '')
      .split(',')
      .map((x) => x.trim().toUpperCase())
      .filter((x) => /^[A-Z0-9&-]{1,20}$/.test(x));
    const unique = fromUrl.filter((x, i) => fromUrl.indexOf(x) === i).slice(0, 4);
    return unique.length >= 2 ? unique : DEFAULT_SYMBOLS;
  });
  const setSymbols = (next: string[]) => {
    setSymbolsState(next);
    const p = new URLSearchParams(window.location.search);
    p.set('s', next.join(','));
    setParams(p, { replace: true });
  };
  const [input, setInput] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const results = await Promise.all(
          symbols.map(symbol => getStock(symbol).then(res => res.data).catch(() => null))
        );
        if (alive) setStocks(results.filter(Boolean));
      } catch {
        if (alive) setError('Unable to load comparison data right now.');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [symbols]);

  const best = useMemo(() => {
    if (!stocks.length) return null;
    return [...stocks].sort((a, b) => scoreStock(b) - scoreStock(a))[0];
  }, [stocks]);

  const suggestions = useMemo(() => {
    const q = input.toUpperCase().replace('.NS', '').replace('.BO', '').trim();
    const available = STOCK_OPTIONS.filter(stock => !symbols.includes(stock.symbol));
    if (!q) return available.slice(0, 6);

    return available
      .filter(stock => `${stock.symbol} ${stock.name} ${stock.sector}`.toUpperCase().includes(q))
      .slice(0, 6);
  }, [input, symbols]);

  const addSymbol = (nextSymbol = input) => {
    const clean = nextSymbol.toUpperCase().replace('.NS', '').replace('.BO', '').trim();
    if (!clean || symbols.includes(clean) || symbols.length >= 4) return;
    setSymbols([...symbols, clean]);
    setInput('');
    setShowSuggestions(false);
  };

  const removeSymbol = (symbol: string) => {
    if (symbols.length <= 2) return;
    setSymbols(symbols.filter(s => s !== symbol));
  };

  const ROWS = [
    ['Price', (x: any) => <span className="num">{formatCurrency(x.current_price)}</span>],
    ['Today', (x: any) => <Change value={Number(x.price_change_pct) || 0} className="text-sm" />],
    ['Sector', (x: any) => x.sector || 'n/a'],
    ['Market cap', (x: any) => <span className="num">{x.market_cap_cr ? `₹${Number(x.market_cap_cr).toLocaleString('en-IN')} Cr` : 'n/a'}</span>],
    ['P/E ratio', (x: any) => <span className="num">{x.pe_ratio ?? 'n/a'}</span>],
    ['EPS', (x: any) => <span className="num">{x.eps ?? 'n/a'}</span>],
    ['Dividend yield', (x: any) => <span className="num">{x.dividend_yield_pct ? `${x.dividend_yield_pct}%` : '–'}</span>],
    ['52-week range', (x: any) => {
      const pos = Math.max(0, Math.min(100, Number(x.position_in_52w) || 0));
      return (
        <span className="block">
          <span className="relative mt-1 block h-1.5 w-full max-w-[9rem] rounded-full bg-ink/10" aria-label={`At ${pos}% of its 52-week range`}>
            <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pos}%` }} />
          </span>
          <span className="num mt-1.5 block text-xs text-muted">{formatCurrency(x.week52_low)} – {formatCurrency(x.week52_high)}</span>
        </span>
      );
    }],
    ['Day range', (x: any) => <span className="num text-sm">{formatCurrency(x.day_low)} – {formatCurrency(x.day_high)}</span>],
    ['Simple score', (x: any) => <span className="num">{scoreStock(x)}<span className="text-muted">/100</span></span>],
  ] as [string, (x: any) => React.ReactNode][];

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Stock Comparison Tool India | Compare NSE Stocks | Stock AI"
        description="Compare Indian NSE stocks by price, PE ratio, dividend yield, 52-week position, market cap, and a simple educational quality score."
        canonicalPath="/tools/stock-comparison"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader eyebrow="Compare" icon={Scale} title="Compare stocks side by side" intro="Up to four NSE stocks on live price, valuation, dividend yield and where they sit in their 52-week range. The link updates so you can share it." />

        <section className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Stocks being compared">
              {symbols.map((symbol) => (
                <li key={symbol} className="num inline-flex min-h-[36px] items-center gap-1 rounded-full border border-line pl-3 pr-1 text-sm font-semibold text-ink">
                  {symbol}
                  <button
                    type="button"
                    onClick={() => removeSymbol(symbol)}
                    disabled={symbols.length <= 2}
                    className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-ink/[0.06] hover:text-down disabled:opacity-30"
                    aria-label={`Remove ${symbol}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex w-full gap-2 lg:w-auto">
              <div className="relative min-w-0 flex-1 lg:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addSymbol();
                  }}
                  disabled={symbols.length >= 4}
                  placeholder={symbols.length >= 4 ? 'Remove one to add another' : 'Add a stock, e.g. Infosys'}
                  aria-label="Add a stock"
                  className="h-10 w-full rounded-control border border-line bg-canvas pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
                />
                {showSuggestions && symbols.length < 4 && suggestions.length > 0 && (
                  <ul className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-card border border-line bg-surface shadow-lift">
                    {suggestions.map((stock) => (
                      <li key={stock.symbol}>
                        <button
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            addSymbol(stock.symbol);
                          }}
                          className="flex w-full items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-left last:border-0 hover:bg-ink/[0.04]"
                        >
                          <span className="min-w-0">
                            <span className="num block text-sm font-semibold text-ink">{stock.symbol}</span>
                            <span className="block truncate text-xs text-muted">{stock.name}</span>
                          </span>
                          <Plus className="h-4 w-4 shrink-0 text-accent" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button onClick={() => addSymbol()} disabled={symbols.length >= 4 || !input.trim()} className="shrink-0">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-card border border-line bg-surface">
          {loading ? (
            <div aria-hidden="true" className="space-y-px">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="skeleton block h-12 rounded-none" />
              ))}
            </div>
          ) : error ? (
            <p className="p-8 text-center text-sm text-muted">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="sticky left-0 z-10 w-32 bg-surface px-4 py-3 text-xs font-medium text-muted sm:w-40 sm:px-5">
                      <span className="sr-only">Metric</span>
                    </th>
                    {stocks.map((x) => (
                      <th key={x.display_ticker} scope="col" className="min-w-[150px] px-3 py-3 align-top">
                        <Link to={`/stock/${x.display_ticker}`} className="num text-base font-semibold text-ink hover:text-accent">
                          {x.display_ticker}
                        </Link>
                        <span className="block truncate text-xs font-normal text-muted">{x.company_name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ROWS.map(([label, render]) => (
                    <tr key={label}>
                      <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-3 text-xs font-medium text-muted sm:px-5">
                        {label}
                      </th>
                      {stocks.map((x) => (
                        <td key={x.display_ticker} className="px-3 py-3 text-ink/90">
                          {render(x)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            {best && <>Highest simple score here: <span className="num font-semibold text-ink">{best.display_ticker}</span>. </>}
            The simple score adds points for a moderate P/E, a dividend above 2%, a positive day and a mid-range 52-week position. It is a teaching aid, not advice.
          </p>
          <ShareResult />
        </div>

        <article className="calc-article mx-auto mt-16 max-w-[70ch] text-[15px] leading-relaxed text-ink/85">
          <h2 className="text-2xl font-bold text-ink">How to compare stocks sensibly</h2>
          <p className="mt-3">
            A comparison should not stop at price. Two companies with the same share price can have very different earnings, dividend policies, risk levels and valuations. Use this page as a first-pass checklist, then read company filings and independent research before you decide.
          </p>
        </article>
      </div>
    </div>
  );
}
