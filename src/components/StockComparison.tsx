import { useEffect, useMemo, useState } from 'react';
import { Plus, Scale, Search, X } from 'lucide-react';
import { getStock } from '../lib/api';
import { STOCK_PROFILES } from '../data/stockProfiles';
import SEO from './SEO';

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
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
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
  const [symbols, setSymbols] = useState(DEFAULT_SYMBOLS);
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

  return (
    <div className="min-h-screen bg-lavender-surface px-4 sm:px-6 py-14 sm:py-16">
      <SEO
        title="Stock Comparison Tool India | Compare NSE Stocks | Stock AI"
        description="Compare Indian NSE stocks by price, PE ratio, dividend yield, 52-week position, market cap, and a simple educational quality score."
        canonicalPath="/tools/stock-comparison"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-white/50 mb-4">
            <Scale className="w-7 h-7 text-lavender-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-lavender-text mb-3">Stock Comparison Tool</h1>
          <p className="text-lavender-text/70 max-w-2xl mx-auto text-base sm:text-lg">
            Compare up to four NSE stocks side by side using live price data, valuation, dividend yield,
            52-week position, and a simple educational score.
          </p>
        </div>

        <div className="app-card p-4 sm:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-start justify-between">
            <div className="flex flex-wrap gap-2">
              {symbols.map(symbol => (
                <span key={symbol} className="inline-flex items-center gap-2 bg-lavender-base border border-lavender-text/10 text-lavender-text px-3 py-2 rounded-2xl text-sm font-semibold">
                  {symbol}
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="text-lavender-text/50 hover:text-down"
                    aria-label={`Remove ${symbol}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-lavender-text/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                  onKeyDown={e => { if (e.key === 'Enter') addSymbol(); }}
                  placeholder="Search stock or symbol"
                  className="w-full bg-surface border border-lavender-text/10 shadow-sm rounded-2xl pl-9 pr-4 py-3 text-sm text-lavender-text focus:outline-none focus:border-lavender-primary"
                />
                {showSuggestions && symbols.length < 4 && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-30 app-card overflow-hidden">
                    {suggestions.map(stock => (
                      <button
                        key={stock.symbol}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          addSymbol(stock.symbol);
                        }}
                        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left hover:bg-lavender-surface transition border-b border-lavender-text/5 last:border-b-0"
                      >
                        <span>
                          <span className="block text-sm font-bold text-lavender-text">{stock.symbol}</span>
                          <span className="block text-xs text-lavender-text/60 leading-snug">{stock.name}</span>
                        </span>
                        <span className="text-[11px] text-lavender-primary bg-accent/10 border border-accent/10 rounded-full px-2 py-1 shrink-0">
                          NSE
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => addSymbol()}
                disabled={symbols.length >= 4 || !input.trim()}
                className="inline-flex items-center justify-center gap-2 bg-gradient-lavender disabled:opacity-40 text-white px-5 py-3 rounded-2xl text-sm font-semibold w-full sm:w-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-lavender-text/60">
            Tip: type a company name like Tata, HDFC, Reliance, or a ticker. You can compare up to four stocks.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {symbols.map(symbol => (
              <div key={symbol} className="app-card p-6 animate-pulse h-56" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-down/10 border border-down/30 rounded-2xl p-6 text-down text-center">{error}</div>
        ) : (
          <>
            {best && (
              <div className="bg-gradient-to-r from-up/10 to-surface border border-up/30 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
                <p className="text-up font-semibold">
                  Highest educational score: {best.display_ticker} ({scoreStock(best)}/100)
                </p>
                <p className="text-lavender-text/70 text-sm mt-1">
                  This is a simplified comparison score, not investment advice. Always read the underlying metrics.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stocks.map(stock => (
                <div key={stock.display_ticker} className="app-card p-5 hover:border-lavender-primary/20 transition">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-black text-lavender-text">{stock.display_ticker}</h2>
                      <p className="text-lavender-text/60 text-xs">{stock.company_name}</p>
                    </div>
                    <span className="bg-lavender-primary/10 text-lavender-primary rounded-full px-2 py-1 text-xs font-bold">
                      {scoreStock(stock)}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-lavender-text mb-1">{formatCurrency(stock.current_price)}</p>
                  <p className={`text-sm font-semibold ${(stock.price_change_pct || 0) >= 0 ? 'text-up' : 'text-down'}`}>
                    {(stock.price_change_pct || 0) >= 0 ? '+' : ''}{stock.price_change_pct || 0}%
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                    {[
                      ['PE', stock.pe_ratio ?? 'N/A'],
                      ['Div%', `${stock.dividend_yield_pct || 0}%`],
                      ['52W', `${stock.position_in_52w || 0}%`],
                      ['MCap', stock.market_cap_cr ? `₹${stock.market_cap_cr} Cr` : 'N/A'],
                    ].map(([label, value]) => (
                      <div key={label} className="app-tile p-2">
                        <p className="text-lavender-text/60 text-xs">{label}</p>
                        <p className="text-lavender-text text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="app-card overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-lavender-base text-lavender-text/70">
                  <tr>
                    <th className="p-3 text-left">Metric</th>
                    {stocks.map(stock => <th key={stock.display_ticker} className="p-3 text-left">{stock.display_ticker}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Company', 'company_name'],
                    ['Sector', 'sector'],
                    ['Current Price', 'current_price'],
                    ['PE Ratio', 'pe_ratio'],
                    ['EPS', 'eps'],
                    ['Dividend Yield', 'dividend_yield_pct'],
                    ['52W High', 'week52_high'],
                    ['52W Low', 'week52_low'],
                    ['Day High', 'day_high'],
                    ['Day Low', 'day_low'],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-lavender-text/5">
                      <td className="p-3 font-semibold text-lavender-text">{label}</td>
                      {stocks.map(stock => (
                        <td key={`${stock.display_ticker}-${key}`} className="p-3 text-lavender-text/80">
                          {key.includes('price') || key.includes('high') || key.includes('low')
                            ? formatCurrency(stock[key])
                            : key === 'dividend_yield_pct'
                              ? `${stock[key] || 0}%`
                              : stock[key] ?? 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <article className="mt-12 prose prose-invert max-w-none prose-headings:text-lavender-text prose-p:text-lavender-text/80">
          <h2 className="text-2xl font-bold text-lavender-text">How to Compare Stocks Sensibly</h2>
          <p>
            A stock comparison should not stop at price. Two companies with the same share price can have completely
            different earnings, dividend policies, risk levels, and valuation. Use this page as a first-pass checklist,
            then read company filings and independent research before making decisions.
          </p>
        </article>
      </div>
    </div>
  );
}
