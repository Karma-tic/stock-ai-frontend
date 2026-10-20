import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Coins, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStock } from '../lib/api';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import Segmented from './ui/Segmented';
import SearchField from './ui/SearchField';
import { Change } from './ui/Price';

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
  { id: 'nearLow', label: 'Near 52-week low', helper: 'Below 35% of range' },
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

  const helper = FILTERS.find((f) => f.id === filter)?.helper;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Popular Indian Stock Quick Filters | Stock AI"
        description="Quickly compare 18 popular Indian stocks by valuation, dividend yield, momentum, 52-week position, and price."
        canonicalPath="/stocks/screener"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Quick filters"
          icon={Filter}
          title="Filter 18 widely followed stocks"
          intro="A short discovery list, not a full-market screener or a recommendation. Open any stock for its evidence and sources."
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Segmented<FilterType> label="Filter" value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ value: f.id, label: f.label }))} />
          <SearchField value={query} onChange={setQuery} placeholder="Search symbol, company, sector" className="lg:w-72" />
        </div>

        <div className="mb-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            {loading ? 'Loading live prices…' : `${filtered.length} of ${stocks.length} stocks`}
            {helper && filter !== 'all' && <> · {helper}</>}
          </span>
          {lastUpdated && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" /> Refreshed {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <section className="overflow-hidden rounded-card border border-line bg-surface">
          {loading ? (
            <div aria-hidden="true" className="space-y-px">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="skeleton block h-14 rounded-none" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">No stock in this list matches. Try another filter.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Stock</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Price</th>
                  <th scope="col" className="hidden px-3 py-2.5 text-right font-medium sm:table-cell">P/E</th>
                  <th scope="col" className="hidden px-3 py-2.5 text-right font-medium sm:table-cell">Div. yield</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">52-week range</th>
                  <th scope="col" className="w-8 px-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((stock) => {
                  const pos = Math.max(0, Math.min(100, Number(stock.position_in_52w) || 0));
                  return (
                    <tr key={stock.display_ticker} className="group relative hover:bg-ink/[0.03]">
                      <td className="px-4 py-3 sm:px-5">
                        <Link to={`/stock/${stock.display_ticker}`} className="num font-semibold text-ink after:absolute after:inset-0 group-hover:text-accent">
                          {stock.display_ticker}
                        </Link>
                        <span className="block max-w-[11rem] truncate text-xs text-muted sm:max-w-[16rem]">{stock.company_name}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="num block font-medium text-ink">₹{(stock.current_price || 0).toLocaleString('en-IN')}</span>
                        <Change value={Number(stock.price_change_pct) || 0} className="text-xs" />
                      </td>
                      <td className="num hidden px-3 py-3 text-right text-ink/85 sm:table-cell">{stock.pe_ratio ?? 'n/a'}</td>
                      <td className="num hidden px-3 py-3 text-right text-ink/85 sm:table-cell">{stock.dividend_yield_pct ? `${stock.dividend_yield_pct}%` : '–'}</td>
                      <td className="hidden px-3 py-3 md:table-cell">
                        <span className="relative block h-1.5 w-28 rounded-full bg-ink/10" aria-label={`At ${pos}% of its 52-week range`}>
                          <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pos}%` }} />
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <Link to="/stocks/dividends" className="group mt-6 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-5 transition hover:border-accent/40">
          <span className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
              <Coins className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block font-semibold text-ink">Dividend tracker</span>
              <span className="mt-0.5 block text-sm text-muted">Yield, cash paid and year-by-year consistency, with the payment source.</span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" />
        </Link>

        <p className="mt-6 text-xs text-muted">Use these filters to build a research list. Check filings, results, risks and valuation before you decide.</p>
      </div>
    </div>
  );
}
