import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Coins, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDividendTracker } from '../lib/api';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import Segmented from './ui/Segmented';
import SearchField from './ui/SearchField';
import { Change } from './ui/Price';

type AnnualDividend = {
  fiscal_year: string;
  fiscal_year_start: number;
  total_dividend: number;
  payments: number;
};

type DividendStock = {
  ticker: string;
  company_name: string;
  sector?: string;
  current_price?: number | null;
  trailing_dividend_per_share?: number | null;
  dividend_yield_pct?: number | null;
  consecutive_years?: number;
  payments_last_12m?: number;
  latest_dividend?: { amount: number; date: string } | null;
  dividend_growth_5y_pct?: number | null;
  annual_history?: AnnualDividend[];
  history_available_from?: string;
  source_name?: string;
  source_url?: string;
  upcoming_event?: { title: string; event_date: string; source_name?: string; source_url?: string } | null;
  status: string;
};

type Filter = 'consistent' | 'highYield' | 'tenYears' | 'growth' | 'upcoming';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'consistent', label: 'Consistency' },
  { id: 'highYield', label: 'High yield' },
  { id: 'tenYears', label: '10+ years' },
  { id: 'growth', label: 'Dividend growth' },
  { id: 'upcoming', label: 'Upcoming' },
];

const money = (value?: number | null) => value == null ? 'n/a' : `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function DividendTracker() {
  const [stocks, setStocks] = useState<DividendStock[]>([]);
  const [filter, setFilter] = useState<Filter>('consistent');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [methodology, setMethodology] = useState('');

  useEffect(() => {
    let alive = true;
    getDividendTracker()
      .then(response => {
        if (!alive) return;
        setStocks(response.data.stocks || []);
        setGeneratedAt(response.data.generated_at || null);
        setMethodology(response.data.methodology || '');
      })
      .catch(() => alive && setError('Dividend records are temporarily unavailable. Please try again shortly.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toUpperCase();
    const available = stocks.filter(stock => stock.status === 'available');
    const matching = available.filter(stock => !term || `${stock.ticker} ${stock.company_name} ${stock.sector || ''}`.toUpperCase().includes(term));
    if (filter === 'tenYears') return matching.filter(stock => (stock.consecutive_years || 0) >= 10).sort((a, b) => (b.consecutive_years || 0) - (a.consecutive_years || 0));
    if (filter === 'growth') return matching.filter(stock => (stock.dividend_growth_5y_pct || 0) > 0).sort((a, b) => (b.dividend_growth_5y_pct || 0) - (a.dividend_growth_5y_pct || 0));
    if (filter === 'upcoming') return matching.filter(stock => Boolean(stock.upcoming_event)).sort((a, b) => String(a.upcoming_event?.event_date).localeCompare(String(b.upcoming_event?.event_date)));
    if (filter === 'highYield') return matching.filter(stock => (stock.dividend_yield_pct || 0) >= 3).sort((a, b) => (b.dividend_yield_pct || 0) - (a.dividend_yield_pct || 0));
    return matching.sort((a, b) => (b.consecutive_years || 0) - (a.consecutive_years || 0) || (b.dividend_yield_pct || 0) - (a.dividend_yield_pct || 0));
  }, [filter, query, stocks]);

  const fmtDate = (iso: string, year = true) => new Date(iso).toLocaleDateString('en-IN', year ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' });

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO title="Indian Dividend Tracker | Stock AI" description="Compare dividend yield, cash paid, payment consistency and upcoming dividend events for widely followed Indian stocks." canonicalPath="/stocks/dividends" />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Dividend tracker"
          icon={Coins}
          title="What companies actually paid"
          intro="Cash paid per share, how consistently it was paid, and what has already been declared. Facts with the payment source, not a recommendation."
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Segmented<Filter> label="Sort and filter" value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ value: f.id, label: f.label }))} />
          <SearchField value={query} onChange={setQuery} placeholder="Search company or symbol" className="lg:w-72" />
        </div>

        <div className="mb-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>{loading ? 'Loading dividend records…' : error ? '' : `${filtered.length} ${filtered.length === 1 ? 'company' : 'companies'}`}</span>
          {generatedAt && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" /> Updated {new Date(generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          )}
        </div>

        {error ? (
          <p className="rounded-card border border-line bg-surface p-8 text-center text-sm text-muted">{error}</p>
        ) : loading ? (
          <div className="space-y-3" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="skeleton block h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-line p-8 text-center">
            <CalendarDays className="mx-auto h-6 w-6 text-muted" strokeWidth={1.75} />
            <p className="mt-2 font-semibold text-ink">No matching records</p>
            <p className="mt-1 text-sm text-muted">Try another filter or name. Missing history is never counted as zero.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((stock) => {
              const isOpen = expanded === stock.ticker;
              const growth = stock.dividend_growth_5y_pct;
              return (
                <li key={stock.ticker} className="overflow-hidden rounded-card border border-line bg-surface">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/stock/${stock.ticker}`} className="num text-[17px] font-semibold text-ink hover:text-accent">
                          {stock.ticker}
                        </Link>
                        <p className="truncate text-xs text-muted">{stock.company_name}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                        {stock.consecutive_years ? `Paid ${stock.consecutive_years} years in a row` : 'Current payer'}
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                      <div>
                        <dt className="text-xs text-muted">Yield, last 12 months</dt>
                        <dd className="num mt-0.5 font-semibold text-ink">{stock.dividend_yield_pct == null ? 'n/a' : `${stock.dividend_yield_pct}%`}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Cash per share</dt>
                        <dd className="num mt-0.5 font-semibold text-ink">
                          {money(stock.trailing_dividend_per_share)}
                          {stock.payments_last_12m != null && <span className="font-sans text-xs font-normal text-muted"> · {stock.payments_last_12m} paid</span>}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Latest</dt>
                        <dd className="num mt-0.5 text-sm font-medium text-ink">{stock.latest_dividend ? `${money(stock.latest_dividend.amount)} · ${fmtDate(stock.latest_dividend.date)}` : 'n/a'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">5-year growth a year</dt>
                        <dd className="mt-0.5 text-sm font-medium">{growth == null ? <span className="text-muted">Not enough history</span> : <Change value={growth} />}</dd>
                      </div>
                    </dl>

                    {stock.upcoming_event && (
                      <a
                        href={stock.upcoming_event.source_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-start justify-between gap-3 rounded-control bg-accent/[0.06] p-3 hover:bg-accent/10"
                      >
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-accent">Declared · {fmtDate(stock.upcoming_event.event_date, false)}</span>
                          <span className="mt-0.5 line-clamp-2 block text-sm text-ink">{stock.upcoming_event.title}</span>
                        </span>
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : stock.ticker)}
                      aria-expanded={isOpen}
                      className="mt-3 inline-flex min-h-[36px] items-center gap-1 text-sm font-semibold text-accent"
                    >
                      Year-by-year payments <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="border-t border-line bg-canvas/50 px-4 py-4 sm:px-5">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-muted">
                          <tr>
                            <th scope="col" className="pb-2 text-left font-medium">Financial year</th>
                            <th scope="col" className="pb-2 text-right font-medium">Payments</th>
                            <th scope="col" className="pb-2 text-right font-medium">Total per share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {(stock.annual_history || []).map((year) => (
                            <tr key={year.fiscal_year_start}>
                              <td className="py-2 text-ink">{year.fiscal_year}</td>
                              <td className="num py-2 text-right text-muted">{year.payments}</td>
                              <td className="num py-2 text-right font-medium text-ink">{money(year.total_dividend)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                        {stock.source_url && (
                          <a href={stock.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            Payment source{stock.source_name ? ` · ${stock.source_name}` : ''} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <Link to={`/stock/${stock.ticker}`} className="inline-flex items-center gap-1 text-accent hover:underline">
                          Open {stock.ticker} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-muted">
          <p className="font-semibold text-ink">How to read this</p>
          <p className="mt-1">
            {methodology || 'Dividend yield changes with price. A high past yield does not guarantee another dividend.'} Special or one-time dividends can raise the trailing yield, and past payments do not guarantee future ones.
          </p>
        </div>
      </div>
    </div>
  );
}
