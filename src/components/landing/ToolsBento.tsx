import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CalendarDays, Coins, Compass, Newspaper, Search } from 'lucide-react';
import StockSearch from '../ui/StockSearch';
import Skeleton from '../ui/Skeleton';
import { InvestRates, Ipo, MarketWrap, fmtDay, fmtRate, pickIpos, useApi, useInView } from './hooks';

// Cursor spotlight (pointer devices only): a 10% cobalt glow follows the pointer.
// Why: it tells you the whole cell is clickable without adding chrome.
const onSpot = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

function Cell({ to, className = '', children, label }: { to: string; className?: string; children: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      onPointerMove={onSpot}
      className={`bento-cell group relative flex min-h-[148px] flex-col sm:min-h-[168px] overflow-hidden rounded-card border border-line bg-surface p-5 transition duration-ui ease-ui hover:-translate-y-0.5 hover:border-accent/40 motion-reduce:hover:translate-y-0 sm:p-6 ${className}`}
    >
      {children}
    </Link>
  );
}

function CellHead({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
        {title}
      </p>
      <ArrowRight className="h-4 w-4 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </div>
  );
}

// A tiny two-week strip: open IPO days filled, upcoming outlined.
function CalendarStrip({ ipos }: { ipos: Ipo[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const state = (d: Date) => {
    let s: 'open' | 'soon' | '' = '';
    for (const ipo of ipos) {
      if (!ipo.open_date) continue;
      const o = new Date(`${ipo.open_date.slice(0, 10)}T00:00:00`);
      const c = ipo.close_date ? new Date(`${ipo.close_date.slice(0, 10)}T00:00:00`) : o;
      if (d >= o && d <= c) s = /open/i.test(ipo.status || '') ? 'open' : s || 'soon';
    }
    return s;
  };
  return (
    <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }} aria-hidden="true">
      {days.map((d) => {
        const s = state(d);
        return (
          <span
            key={d.toISOString()}
            className={`h-6 rounded-[4px] ${s === 'open' ? 'bg-accent' : s === 'soon' ? 'border border-accent/70' : 'bg-ink/[0.06]'}`}
            title={d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          />
        );
      })}
    </div>
  );
}

const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK'];

export default function ToolsBento() {
  const [ref, near] = useInView<HTMLElement>('300px');
  const rates = useApi<InvestRates>('/api/invest/rates', near);
  const ipos = useApi<{ ipos: Ipo[] }>('/api/market/ipos', near, 40000);
  const wraps = useApi<{ wraps: MarketWrap[] }>('/api/market-wraps', near);
  const list = ipos.data?.ipos || [];
  const { open, upcoming } = pickIpos(list);
  const topFd = rates.data?.rates.bank_fd?.[0];
  const wrap = wraps.data?.wraps?.[0];

  return (
    <section ref={ref} aria-labelledby="tools-heading" className="bg-canvas py-20 sm:py-28 lg:pt-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="tools-heading" className="max-w-2xl text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
          Every tool in one place
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">Free to open. Most need no account.</p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          {/* Stock research: a working search, not a picture of one */}
          <div
            onPointerMove={onSpot}
            className="bento-cell bento-grid relative col-span-2 flex flex-col rounded-card border border-line bg-surface2/60 p-5 sm:p-7 lg:col-span-7 lg:row-span-2"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Search className="h-4 w-4 text-accent" strokeWidth={1.75} />
              Stock research
            </p>
            <p className="mt-3 max-w-md text-2xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.75rem]">
              Type a company. Get its numbers, filings and news in one page.
            </p>
            <StockSearch className="mt-6" />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Popular:</span>
              {POPULAR.map((t) => (
                <Link key={t} to={`/stock/${t}`} className="num inline-flex min-h-[36px] items-center rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink hover:border-accent/50 hover:text-accent">
                  {t}
                </Link>
              ))}
            </div>
            <Link to="/stocks" className="group mt-auto inline-flex min-h-[44px] items-center gap-1 pt-6 text-sm font-semibold text-accent">
              Or browse with filters <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <Cell to="/invest" label="Invest Explorer" className="col-span-1 lg:col-span-5">
            <CellHead icon={Compass} title="Invest Explorer" />
            <div className="mt-auto pt-6">
              {topFd ? (
                <>
                  <p className="tnum text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">{fmtRate(topFd.rate)}</p>
                  <p className="mt-1 text-sm text-muted">Best bank FD today{topFd.label ? `, ${topFd.label}` : ''}</p>
                </>
              ) : rates.status === 'error' ? (
                <p className="text-sm text-muted">FDs, PPF, gold and funds compared</p>
              ) : (
                <>
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="mt-2 h-4 w-40" />
                </>
              )}
            </div>
          </Cell>

          <Cell to="/ipos" label="IPO tracker" className="col-span-1 lg:col-span-5">
            <CellHead icon={CalendarDays} title="IPO tracker" />
            <div className="mt-auto pt-5">
              {ipos.data ? (
                <p className="tnum text-base font-semibold leading-snug text-ink sm:text-lg">
                  {open.length} open <span className="text-muted">·</span> <span className="whitespace-nowrap">{upcoming.length} upcoming</span>
                </p>
              ) : ipos.status === 'error' ? (
                <p className="text-sm text-muted">Mainboard and SME IPOs</p>
              ) : (
                <Skeleton className="h-6 w-40" />
              )}
              <CalendarStrip ipos={list} />
            </div>
          </Cell>

          <Cell to="/market-wrap" label="Market wrap" className="col-span-2 lg:col-span-4">
            <CellHead icon={Newspaper} title="Market wrap" />
            <div className="mt-auto pt-5">
              {wrap ? (
                <>
                  <p className="num text-xs text-muted">{fmtDay(wrap.date)}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-ink">{wrap.title.replace(/^Market Wrap:\s*/i, '')}</p>
                </>
              ) : (
                <p className="text-sm text-muted">The Nifty, the Sensex and why they moved. Weekdays at 4:15 PM.</p>
              )}
            </div>
          </Cell>

          <Cell to="/stocks/dividends" label="Dividends" className="col-span-1 lg:col-span-4">
            <CellHead icon={Coins} title="Dividends" />
            <p className="mt-auto pt-5 text-sm text-muted">Yield, payment history and upcoming record dates.</p>
          </Cell>

          <Cell to="/tools" label="Calculators" className="col-span-1 lg:col-span-4">
            <CellHead icon={Calculator} title="Calculators" />
            <p className="mt-auto pt-5 text-sm text-muted">SIP, lumpsum, brokerage and F&amp;O. No sign-up.</p>
          </Cell>
        </div>
      </div>
    </section>
  );
}
