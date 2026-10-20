import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, Clock3, Coins, ExternalLink, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDividendTracker } from '../lib/api';
import SEO from './SEO';

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
  { id: 'tenYears', label: '10Y+ record' },
  { id: 'growth', label: 'Dividend growth' },
  { id: 'upcoming', label: 'Upcoming' },
];

const money = (value?: number | null) => value == null ? 'Unavailable' : `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

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

  return (
    <div className="min-h-screen bg-lavender-surface px-4 py-10 sm:px-6 sm:py-16">
      <SEO title="Indian Dividend Tracker | Stock AI" description="Compare dividend yield, cash paid, payment consistency and upcoming dividend events for widely followed Indian stocks." canonicalPath="/stocks/dividends" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-up/20 bg-up/10"><Coins className="h-7 w-7 text-up" /></div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-up">Dividend research</p>
          <h1 className="text-3xl font-black text-lavender-text sm:text-4xl">Dividend Tracker</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-lavender-text/65 sm:text-base">See what companies actually paid, how consistently they paid it, and what has already been declared next. Facts first—not a recommendation.</p>
        </div>

        <div className="app-card mb-6 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(item => <button key={item.id} onClick={() => setFilter(item.id)} className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition ${filter === item.id ? 'bg-gradient-lavender text-white' : 'border border-lavender-text/10 bg-lavender-base text-lavender-text/70 hover:text-lavender-text'}`}>{item.label}</button>)}
            </div>
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lavender-text/45" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search company or symbol" className="w-full rounded-2xl border border-lavender-text/10 bg-surface py-2 pl-9 pr-4 text-sm text-lavender-text focus:border-lavender-primary focus:outline-none lg:w-72" />
            </label>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-lavender-text/55">
          <span>{loading ? 'Loading verified dividend records…' : `${filtered.length} companies shown`}</span>
          {generatedAt && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />Updated {new Date(generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
        </div>

        {error ? <div className="app-card p-6 text-center text-down">{error}</div> : loading ? (
          <div className="grid gap-4 md:grid-cols-2">{[...Array(6)].map((_, index) => <div key={index} className="app-card h-64 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="app-card p-8 text-center"><CalendarDays className="mx-auto mb-3 h-7 w-7 text-lavender-primary" /><h2 className="font-bold text-lavender-text">No matching verified records</h2><p className="mt-2 text-sm text-lavender-text/60">Try another filter or company name. Missing history is never treated as zero.</p></div>
        ) : (
          <div className="grid items-start gap-4 md:grid-cols-2">
            {filtered.map(stock => {
              const isOpen = expanded === stock.ticker;
              const growth = stock.dividend_growth_5y_pct;
              return <article key={stock.ticker} className="app-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><h2 className="text-xl font-black text-lavender-text">{stock.ticker}</h2><p className="mt-0.5 text-xs text-lavender-text/55">{stock.company_name}</p></div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-up/10 px-2.5 py-1 text-xs font-bold text-up"><CheckCircle2 className="h-3.5 w-3.5" />{stock.consecutive_years ? `${stock.consecutive_years}Y consistent` : 'Current payer'}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="app-tile p-3"><p className="text-[11px] text-lavender-text/50">TTM yield</p><p className="mt-1 font-bold text-up">{stock.dividend_yield_pct == null ? 'N/A' : `${stock.dividend_yield_pct}%`}</p></div>
                    <div className="app-tile p-3"><p className="text-[11px] text-lavender-text/50">Cash / share</p><p className="mt-1 font-bold text-lavender-text">{money(stock.trailing_dividend_per_share)}</p></div>
                    <div className="app-tile p-3"><p className="text-[11px] text-lavender-text/50">Payments</p><p className="mt-1 font-bold text-lavender-text">{stock.payments_last_12m ?? 'N/A'}</p></div>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-lavender-base p-3"><p className="text-xs text-lavender-text/50">Latest dividend</p><p className="mt-1 font-semibold text-lavender-text">{stock.latest_dividend ? `${money(stock.latest_dividend.amount)} · ${new Date(stock.latest_dividend.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Unavailable'}</p></div>
                    <div className="rounded-xl bg-lavender-base p-3"><p className="text-xs text-lavender-text/50">5Y dividend growth</p><p className={`mt-1 inline-flex items-center gap-1 font-semibold ${growth == null ? 'text-lavender-text/55' : growth >= 0 ? 'text-up' : 'text-down'}`}>{growth == null ? 'Insufficient comparable history' : <>{growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{growth}% CAGR</>}</p></div>
                  </div>
                  {stock.upcoming_event && <a href={stock.upcoming_event.source_url || '#'} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-xl border border-lavender-primary/20 bg-lavender-primary/10 p-3"><p className="text-xs font-bold uppercase tracking-wide text-lavender-primary">Upcoming declared event · {new Date(stock.upcoming_event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p><p className="mt-1 line-clamp-2 text-sm text-lavender-text">{stock.upcoming_event.title}</p></a>}
                  <button onClick={() => setExpanded(isOpen ? null : stock.ticker)} className="mt-4 flex w-full items-center justify-between rounded-xl border border-lavender-text/10 px-3 py-2 text-sm font-semibold text-lavender-text/70 hover:text-lavender-text"><span>Payment history</span>{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
                </div>
                {isOpen && <div className="border-t border-lavender-text/10 bg-lavender-base/60 p-5">
                  <div className="space-y-2">{(stock.annual_history || []).map(year => <div key={year.fiscal_year_start} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl bg-surface p-3 text-sm"><span className="font-semibold text-lavender-text">{year.fiscal_year}</span><span className="text-lavender-text/60">{year.payments} payment{year.payments === 1 ? '' : 's'}</span><span className="font-bold text-up">{money(year.total_dividend)}</span></div>)}</div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <a href={stock.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-lavender-primary">View payment source <ExternalLink className="h-3.5 w-3.5" /></a>
                    <Link to={`/stock/${stock.ticker}`} className="inline-flex items-center gap-1 text-xs font-semibold text-lavender-primary">Open stock research <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>}
              </article>;
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-lavender-text/10 bg-surface p-4 text-sm leading-6 text-lavender-text/60">
          <p className="font-semibold text-lavender-text">How to read this tracker</p>
          <p className="mt-1">{methodology || 'Dividend yield changes with price. A high historical yield does not guarantee another dividend.'} Special or one-time dividends can raise trailing yield, and past payments do not guarantee future distributions.</p>
        </div>
      </div>
    </div>
  );
}
