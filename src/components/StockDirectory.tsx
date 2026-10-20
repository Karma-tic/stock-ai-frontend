import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { STOCK_PROFILES } from '../data/stockProfiles';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import SearchField from './ui/SearchField';
import { ButtonLink } from './ui/Button';

export default function StockDirectory({ user }: { user?: any }) {
  const [q, setQ] = useState('');
  const stocks = useMemo(() => Object.values(STOCK_PROFILES).sort((a, b) => a.symbol.localeCompare(b.symbol)), []);
  const shown = stocks.filter((s) => !q.trim() || `${s.symbol} ${s.name} ${s.sector}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Indian Stock Directory | NSE Stock Profiles | Stock AI"
        description="Browse Indian stock profiles with business overviews, fundamental analysis guides, risks, and opportunities for popular NSE stocks."
        canonicalPath="/stocks"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader eyebrow="Stocks" icon={BookOpen} title="NSE stock profiles" intro="What each company does, how to read its numbers, and its main risks. Open any profile for the live price and source-linked news." />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField value={q} onChange={setQ} placeholder="Filter by name, symbol or sector" className="sm:w-80" />
          <div className="flex gap-4 text-sm font-semibold">
            <Link to="/stocks/screener" className="text-accent hover:underline">Quick filters</Link>
            <Link to="/stocks/dividends" className="text-accent hover:underline">Dividend tracker</Link>
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">No profile matches “{q}”. You can still analyse any NSE stock from the search bar.</p>
        ) : (
          <ul className="overflow-hidden rounded-card border border-line bg-surface">
            {shown.map((stock) => (
              <li key={stock.symbol} className="border-b border-line last:border-0">
                <Link to={`/stock/${stock.symbol}`} className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-ink/[0.03] sm:px-5">
                  <span className="min-w-0 flex-1">
                    <span className="num block text-[15px] font-semibold text-ink group-hover:text-accent">{stock.symbol}</span>
                    <span className="block truncate text-xs text-muted">{stock.name}</span>
                  </span>
                  <span className="hidden text-right text-xs text-muted sm:block">
                    {stock.sector}
                    <span className="block">{stock.marketCapRank}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section className="mt-10 flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-ink">Looking for another stock?</h2>
            <p className="mt-1 text-sm text-muted">Search any NSE stock to see its Evidence Board: what supports it and what worries, each point with its source.</p>
          </div>
          <ButtonLink to={user ? '/' : '/login'} className="shrink-0">
            {user ? 'Search a stock' : 'Start free'}
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
