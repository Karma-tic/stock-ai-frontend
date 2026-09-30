import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react';
import { Ipo, MarketWrap, TopStocks, changeClass, fmtDay, fmtINR, fmtPct, pickIpos, useApi, useInView } from './hooks';

function Ticker({ data }: { data: TopStocks | null }) {
  if (!data?.stocks?.length) {
    return (
      <div className="flex gap-8 overflow-hidden py-4" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-40 shrink-0 animate-pulse rounded bg-lavender-text/10 motion-reduce:animate-none" />
        ))}
      </div>
    );
  }
  const items = data.stocks.map((s) => (
    <Link
      key={s.display_ticker}
      to={`/stock/${s.display_ticker}`}
      className="flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-lg px-1 text-sm tabular-nums hover:text-lavender-primary"
    >
      <span className="font-semibold text-lavender-text">{s.display_ticker}</span>
      <span className="text-lavender-text/70">{fmtINR(s.current_price)}</span>
      <span className={`font-medium ${changeClass(s.price_change_pct)}`}>{fmtPct(s.price_change_pct)}</span>
    </Link>
  ));
  return (
    <div className="ticker-mask group relative overflow-hidden py-4">
      <div className="ticker-track flex w-max gap-10 group-hover:[animation-play-state:paused]">
        <div className="flex gap-10">{items}</div>
        <div className="flex gap-10" aria-hidden="true">
          {data.stocks.map((s) => (
            <span key={s.display_ticker} className="flex shrink-0 items-baseline gap-2 whitespace-nowrap px-1 text-sm tabular-nums">
              <span className="font-semibold text-lavender-text">{s.display_ticker}</span>
              <span className="text-lavender-text/70">{fmtINR(s.current_price)}</span>
              <span className={`font-medium ${changeClass(s.price_change_pct)}`}>{fmtPct(s.price_change_pct)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardShell({ to, icon, eyebrow, children }: { to: string; icon: React.ReactNode; eyebrow: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-start gap-4 rounded-2xl border border-lavender-text/10 bg-white p-4 transition hover:border-lavender-primary/30 hover:shadow-lavender dark:border-lavender-text/15 sm:p-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lavender-primary/10 text-lavender-primary">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lavender-text/55">{eyebrow}</p>
        {children}
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-lavender-text/40 transition group-hover:translate-x-0.5 group-hover:text-lavender-primary" />
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="mt-2 space-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-lavender-text/10 motion-reduce:animate-none" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-lavender-text/10 motion-reduce:animate-none" />
    </div>
  );
}

export default function ProofStrip() {
  const [ref, inView] = useInView<HTMLElement>('300px');
  const top = useApi<TopStocks>('/api/market/top', inView);
  const wraps = useApi<{ wraps: MarketWrap[] }>('/api/market-wraps', inView);
  const ipos = useApi<{ ipos: Ipo[] }>('/api/market/ipos', inView, 20000);

  const wrap = wraps.data?.wraps?.[0];
  const { open, upcoming } = pickIpos(ipos.data?.ipos || []);
  const leadIpo = open[0] || upcoming[0];

  return (
    <section ref={ref} aria-labelledby="today-heading" className="border-b border-lavender-text/10 bg-lavender-base">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-6">
          <h2 id="today-heading" className="text-sm font-semibold text-lavender-text">Today on NSE</h2>
          <Link to="/stocks" className="text-sm font-medium text-lavender-primary hover:underline">Browse stocks →</Link>
        </div>
        {top.status === 'error' ? (
          <p className="py-4 text-sm text-lavender-text/60">Prices will be back shortly.</p>
        ) : (
          <Ticker data={top.data} />
        )}

        <div className="grid gap-3 pb-6 md:grid-cols-2 md:gap-4">
          <CardShell to="/market-wrap" icon={<Newspaper className="h-5 w-5" />} eyebrow="Latest market wrap">
            {wrap ? (
              <>
                <p className="mt-1 truncate font-semibold text-lavender-text">{wrap.title.replace(/^Market Wrap:\s*/i, '')}</p>
                <p className="text-sm text-lavender-text/60">{fmtDay(wrap.date)} · 500-word summary of the day</p>
              </>
            ) : wraps.status === 'error' || wraps.status === 'ready' ? (
              <p className="mt-1 font-semibold text-lavender-text">Read the daily market wrap</p>
            ) : (
              <Skeleton />
            )}
          </CardShell>

          <CardShell to="/ipos" icon={<CalendarDays className="h-5 w-5" />} eyebrow={open.length ? `${open.length} IPO${open.length > 1 ? 's' : ''} open now` : 'IPO tracker'}>
            {leadIpo ? (
              <>
                <p className="mt-1 truncate font-semibold text-lavender-text">{leadIpo.company_name}</p>
                <p className="text-sm text-lavender-text/60">
                  {[leadIpo.category, leadIpo.price_band, open.includes(leadIpo) && leadIpo.close_date ? `closes ${fmtDay(leadIpo.close_date)}` : leadIpo.open_date ? `opens ${fmtDay(leadIpo.open_date)}` : null]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </>
            ) : ipos.status === 'error' || ipos.status === 'ready' ? (
              <p className="mt-1 font-semibold text-lavender-text">See open and upcoming IPOs</p>
            ) : (
              <Skeleton />
            )}
          </CardShell>
        </div>
      </div>
    </section>
  );
}
