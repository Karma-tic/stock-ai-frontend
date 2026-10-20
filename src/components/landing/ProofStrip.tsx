import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Newspaper, Pause, Play } from 'lucide-react';
import { Change } from '../ui/Price';
import Skeleton from '../ui/Skeleton';
import { Ipo, MarketWrap, TopStocks, fmtDay, fmtINR, pickIpos, useApi, useInView } from './hooks';

function TickerItems({ data, hidden }: { data: TopStocks; hidden?: boolean }) {
  return (
    <div className="flex gap-10" aria-hidden={hidden || undefined}>
      {data.stocks.map((s) =>
        hidden ? (
          <span key={s.display_ticker} className="flex shrink-0 items-baseline gap-2 whitespace-nowrap px-1 text-sm">
            <span className="num font-semibold text-ink">{s.display_ticker}</span>
            <span className="num text-muted">{fmtINR(s.current_price)}</span>
            <Change value={s.price_change_pct} className="text-xs font-medium" />
          </span>
        ) : (
          <Link
            key={s.display_ticker}
            to={`/stock/${s.display_ticker}`}
            className="flex min-h-[32px] shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-1 text-sm hover:text-accent"
          >
            <span className="num font-semibold text-ink">{s.display_ticker}</span>
            <span className="num text-muted">{fmtINR(s.current_price)}</span>
            <Change value={s.price_change_pct} className="text-xs font-medium" />
          </Link>
        ),
      )}
    </div>
  );
}

// The page's only marquee. It pauses on hover and keyboard focus, and has a visible pause button.
function Ticker({ data }: { data: TopStocks | null }) {
  const [paused, setPaused] = useState(false);
  if (!data?.stocks?.length) {
    return (
      <div className="flex h-[56px] items-center gap-8 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-40 shrink-0" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="ticker-mask group relative min-w-0 flex-1 overflow-hidden py-3">
        <div className={`ticker-track flex w-max gap-10 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] ${paused ? 'is-paused' : ''}`}>
          <TickerItems data={data} />
          <TickerItems data={data} hidden />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Play price ticker' : 'Pause price ticker'}
        className="ticker-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:text-ink"
      >
        {paused ? <Play className="h-4 w-4" strokeWidth={1.75} /> : <Pause className="h-4 w-4" strokeWidth={1.75} />}
      </button>
    </div>
  );
}

function CardShell({ to, icon, label, children }: { to: string; icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group flex min-w-0 items-start gap-4 rounded-card border border-line bg-surface p-4 transition duration-ui hover:border-accent/40 sm:p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-accent/10 text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">{label}</p>
        {children}
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted/60 transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}

function Lines() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export default function ProofStrip() {
  const [ref, inView] = useInView<HTMLElement>('300px');
  const top = useApi<TopStocks>('/api/market/top', inView);
  const wraps = useApi<{ wraps: MarketWrap[] }>('/api/market-wraps', inView);
  const ipos = useApi<{ ipos: Ipo[] }>('/api/market/ipos', inView, 40000);

  const wrap = wraps.data?.wraps?.[0];
  const { open, upcoming } = pickIpos(ipos.data?.ipos || []);
  const leadIpo = open[0] || upcoming[0];

  return (
    <section ref={ref} aria-labelledby="today-heading" className="border-y border-line bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-5">
          <h2 id="today-heading" className="text-sm font-semibold text-ink">
            Today on NSE
          </h2>
          <Link to="/stocks" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-accent hover:underline">
            Browse stocks <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {top.status === 'error' ? <p className="py-4 text-sm text-muted">Prices will be back shortly.</p> : <Ticker data={top.data} />}

        <div className="grid gap-3 pb-6 md:grid-cols-2 md:gap-4">
          <CardShell to="/market-wrap" icon={<Newspaper className="h-5 w-5" strokeWidth={1.75} />} label="Latest market wrap">
            {wrap ? (
              <>
                <p className="mt-1 truncate font-semibold text-ink">{wrap.title.replace(/^Market Wrap:\s*/i, '')}</p>
                <p className="text-sm text-muted">{fmtDay(wrap.date)} · a 500-word summary of the day</p>
              </>
            ) : wraps.status === 'error' || wraps.status === 'ready' ? (
              <p className="mt-1 font-semibold text-ink">Read the daily market wrap</p>
            ) : (
              <Lines />
            )}
          </CardShell>

          <CardShell
            to="/ipos"
            icon={<CalendarDays className="h-5 w-5" strokeWidth={1.75} />}
            label={open.length ? `${open.length} IPO${open.length > 1 ? 's' : ''} open now` : 'IPO tracker'}
          >
            {leadIpo ? (
              <>
                <p className="mt-1 truncate font-semibold text-ink">{leadIpo.company_name}</p>
                <p className="text-sm text-muted">
                  {[
                    leadIpo.category,
                    leadIpo.price_band,
                    open.includes(leadIpo) && leadIpo.close_date ? `closes ${fmtDay(leadIpo.close_date)}` : leadIpo.open_date ? `opens ${fmtDay(leadIpo.open_date)}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </>
            ) : ipos.status === 'error' || ipos.status === 'ready' ? (
              <p className="mt-1 font-semibold text-ink">See open and upcoming IPOs</p>
            ) : (
              <Lines />
            )}
          </CardShell>
        </div>
      </div>
    </section>
  );
}
