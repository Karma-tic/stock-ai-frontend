import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStock } from '../lib/api';
import SEO from './SEO';

const SCREENER_SYMBOLS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN',
  'BAJFINANCE', 'ITC', 'LT', 'AXISBANK', 'ZOMATO', 'SUZLON',
  'IRFC', 'IREDA', 'JIOFIN', 'TATAMOTORS', 'POWERGRID', 'ONGC',
];

type FilterType = 'all' | 'value' | 'dividend' | 'momentum' | 'nearLow' | 'penny';

const FILTERS: { id: FilterType; label: string; helper: string }[] = [
  { id: 'all', label: 'All', helper: 'All loaded stocks' },
  { id: 'value', label: 'Value', helper: 'PE below 25' },
  { id: 'dividend', label: 'Dividend', helper: 'Yield above 1%' },
  { id: 'momentum', label: 'Momentum', helper: 'Positive today' },
  { id: 'nearLow', label: 'Near 52W Low', helper: 'Below 35% of range' },
  { id: 'penny', label: 'Under ₹100', helper: 'Low-priced stocks' },
];

function passesFilter(stock: any, filter: FilterType) {
  if (filter === 'all') return true;
  if (filter === 'value') return Number(stock.pe_ratio) > 0 && Number(stock.pe_ratio) < 25;
  if (filter === 'dividend') return Number(stock.dividend_yield_pct) > 1;
  if (filter === 'momentum') return Number(stock.price_change_pct) > 0;
  if (filter === 'nearLow') return Number(stock.position_in_52w) > 0 && Number(stock.position_in_52w) < 35;
  if (filter === 'penny') return Number(stock.current_price) > 0 && Number(stock.current_price) < 100;
  return true;
}

export default function StockScreener() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const results = await Promise.all(
        SCREENER_SYMBOLS.map(symbol => getStock(symbol).then(res => res.data).catch(() => null))
      );
      if (alive) {
        setStocks(results.filter(Boolean));
        setLastUpdated(new Date());
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.toUpperCase().trim();
    return stocks
      .filter(stock => passesFilter(stock, filter))
      .filter(stock => {
        if (!q) return true;
        return `${stock.display_ticker} ${stock.company_name} ${stock.sector}`.toUpperCase().includes(q);
      })
      .sort((a, b) => (Number(b.price_change_pct) || 0) - (Number(a.price_change_pct) || 0));
  }, [filter, query, stocks]);

  return (
    <div className="min-h-screen bg-lavender-surface px-6 py-16">
      <SEO
        title="Popular Indian Stock Quick Filters | Stock AI"
        description="Quickly compare 18 popular Indian stocks by valuation, dividend yield, momentum, 52-week position, and price."
        canonicalPath="/stocks/screener"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-white/50 mb-4">
            <Filter className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-lavender-text mb-3">Popular Stock Quick Filters</h1>
          <p className="text-lavender-text/70 max-w-2xl mx-auto">
            Compare 18 widely followed Indian stocks and open any result for deeper research.
            This is a focused discovery list—not a full-market screener or recommendation.
          </p>
        </div>

        <div className="app-card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold transition ${
                    filter === item.id
                      ? 'bg-gradient-lavender text-white'
                      : 'bg-lavender-base border border-lavender-text/10 text-lavender-text/70 hover:text-lavender-text'
                  }`}
                  title={item.helper}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-lavender-text/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search symbol, company, sector"
                className="w-full lg:w-72 bg-white border border-lavender-text/10 shadow-sm rounded-2xl pl-9 pr-4 py-2 text-sm text-lavender-text focus:outline-none focus:border-lavender-primary"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="app-card p-5 h-44 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-lavender-text/70">
              <span>Showing {filtered.length} of {stocks.length} popular stocks</span>
              {lastUpdated && (
                <span className="inline-flex items-center gap-1.5 text-xs text-lavender-text/50">
                  <Clock3 className="h-3.5 w-3.5" />
                  Refreshed {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(stock => (
                <Link to={`/stock/${stock.display_ticker}`} key={stock.display_ticker} className="app-card group p-5 hover:border-green-500/25 hover:-translate-y-0.5 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-black text-lavender-text">{stock.display_ticker}</h2>
                      <p className="text-lavender-text/60 text-xs">{stock.company_name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${(stock.price_change_pct || 0) >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      {(stock.price_change_pct || 0) >= 0 ? '+' : ''}{stock.price_change_pct || 0}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-lavender-text">₹{(stock.current_price || 0).toLocaleString('en-IN')}</p>
                  <p className="text-lavender-text/60 text-xs mt-1">{stock.sector || 'Sector unavailable'}</p>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="app-tile p-2">
                      <p className="text-lavender-text/60 text-xs">PE</p>
                      <p className="font-semibold text-lavender-text">{stock.pe_ratio ?? 'N/A'}</p>
                    </div>
                    <div className="app-tile p-2">
                      <p className="text-lavender-text/60 text-xs">Div%</p>
                      <p className="font-semibold text-green-600">{stock.dividend_yield_pct || 0}%</p>
                    </div>
                    <div className="app-tile p-2">
                      <p className="text-lavender-text/60 text-xs">52W</p>
                      <p className="font-semibold text-lavender-primary">{stock.position_in_52w || 0}%</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-lavender-primary">
                    View stock research <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 rounded-2xl border border-lavender-text/10 bg-white p-4 text-sm leading-6 text-lavender-text/65">
          Use these filters only to create a research shortlist. Check company filings, results, risks and valuation before making a decision.
        </div>
      </div>
    </div>
  );
}
