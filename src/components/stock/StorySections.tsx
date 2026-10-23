import { AlertTriangle, ExternalLink, Eye, FileText, Newspaper, TrendingDown, TrendingUp } from 'lucide-react';
import { Change } from '../ui/Price';
import Skeleton from '../ui/Skeleton';
import PriceChart from './PriceChart';
import { Evidence, Quote, Story, allSources, fmtCr, isFiling, latestEvents, shortDate } from './storyData';

// The six parts of a stock's story. Used as swipeable cards on phones and as page
// sections on larger screens, so both always show the same evidence.

export function SourceTag({ e }: { e: Evidence }) {
  const filing = isFiling(e);
  const Icon = filing ? FileText : Newspaper;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
      <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
      {e.source_name}
      {e.published_at ? ` · ${shortDate(e.published_at)}` : ''}
    </span>
  );
}

function EvidenceItem({ e }: { e: Evidence }) {
  return (
    <li>
      <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="group block rounded-control border border-line p-3 transition hover:border-accent/40">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-3 text-sm font-medium text-ink">{e.title}</p>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted group-hover:text-accent" aria-hidden="true" />
        </div>
        {e.why_matters && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{e.why_matters}</p>}
        <div className="mt-2">
          <SourceTag e={e} />
        </div>
      </a>
    </li>
  );
}

// Shown when the data could not be fetched. "Unavailable", never "nothing happened".
export const Unavailable = ({ what }: { what: string }) => (
  <div className="rounded-control border border-dashed border-line p-4 text-sm text-muted">
    {what} could not be loaded right now.{' '}
    <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-[36px] items-center font-semibold text-accent hover:underline">
      Try again
    </button>
  </div>
);

const Loading = () => (
  <div className="space-y-2">
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-16 w-full" />
  </div>
);

// 1. Price today
export function PriceToday({ ticker, quote, story, failed }: { ticker: string; quote: Quote | null; story: Story | null; failed?: boolean }) {
  const p = story?.price_context;
  const price = quote?.current_price ?? p?.current_price;
  const change = quote?.price_change_pct ?? p?.day_change_pct;
  const low = quote?.week52_low ?? p?.week52_low;
  const high = quote?.week52_high ?? p?.week52_high;
  const pos = low != null && high != null && high > low && price != null ? Math.min(1, Math.max(0, (price - low) / (high - low))) : null;
  const returns = Object.entries(story?.trend?.returns_pct || {}).filter(([, v]) => v != null) as [string, number][];
  const maxAbs = Math.max(5, ...returns.map(([, v]) => Math.abs(v)));

  if (price == null && !story) return failed ? <Unavailable what="The price" /> : <Loading />;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="tnum text-4xl font-semibold tracking-[-0.03em] text-ink">{price != null ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'n/a'}</p>
        {change != null && <Change value={change} className="text-base font-medium" />}
        <span className="text-xs text-muted">today</span>
      </div>

      <PriceChart ticker={ticker} />

      {pos != null && (
        <div className="mt-6">
          <p className="text-xs font-medium text-muted">52-week range</p>
          <div className="relative mt-3 h-2 rounded-full bg-ink/10" role="img" aria-label={`Price is at ${Math.round(pos * 100)}% of its 52-week range`}>
            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-accent" style={{ left: `${pos * 100}%` }} />
          </div>
          <div className="num mt-2 flex justify-between text-xs text-muted">
            <span>₹{low?.toLocaleString('en-IN')}</span>
            <span>₹{high?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {returns.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium text-muted">Observed returns (not a forecast)</p>
          <ul className="mt-3 space-y-2">
            {returns.map(([period, v]) => (
              <li key={period} className="grid grid-cols-[2.5rem_1fr_4.5rem] items-center gap-3">
                <span className="num text-xs uppercase text-muted">{period}</span>
                <span className="relative h-2 rounded-full bg-ink/[0.06]" aria-hidden="true">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-ink/20" />
                  <span
                    className={`absolute inset-y-0 rounded-full ${v >= 0 ? 'left-1/2 bg-up' : 'right-1/2 bg-down'}`}
                    style={{ width: `${(Math.abs(v) / maxAbs) * 50}%` }}
                  />
                </span>
                <Change value={v} className="justify-end text-xs" />
              </li>
            ))}
          </ul>
          {story?.trend?.drawdown_from_52w_high_pct != null && (
            <p className="mt-3 text-xs text-muted">
              <span className="num">{story.trend.drawdown_from_52w_high_pct}%</span> from its 52-week high.
            </p>
          )}
          {story?.trend?.source_url && (
            <a href={story.trend.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-accent">
              Price history from {story.trend.source_name || 'source'} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// 2. What happened
export function WhatHappened({ story, loading }: { story: Story | null; loading: boolean }) {
  if (loading) return <Loading />;
  if (!story) return <Unavailable what="Filings and news" />;
  const items = latestEvents(story, 3);
  if (!items.length) return <p className="text-sm text-muted">No new filings or news were found in the latest scan.</p>;
  return (
    <ul className="space-y-2">
      {items.map((e) => (
        <EvidenceItem key={`${e.source_url}|${e.title}`} e={e} />
      ))}
    </ul>
  );
}

// 3. Numbers that matter
export function KeyNumbers({ quote, story, failed }: { quote: Quote | null; story: Story | null; failed?: boolean }) {
  if (!quote && !story) return failed ? <Unavailable what="Key numbers" /> : <Loading />;
  const tiles: [string, string][] = [
    ['P/E ratio', quote?.pe_ratio != null ? String(quote.pe_ratio) : 'n/a'],
    ['Dividend yield', quote?.dividend_yield_pct != null ? `${quote.dividend_yield_pct}%` : 'n/a'],
    ['Market cap', fmtCr(quote?.market_cap_cr)],
    ['P/B ratio', quote?.pb_ratio != null ? String(quote.pb_ratio) : 'n/a'],
    ['52W high', quote?.week52_high != null ? `₹${quote.week52_high.toLocaleString('en-IN')}` : 'n/a'],
    ['52W low', quote?.week52_low != null ? `₹${quote.week52_low.toLocaleString('en-IN')}` : 'n/a'],
  ];
  const metrics = story?.earnings?.metrics || [];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-control border border-line p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="num mt-1 text-base font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      {metrics.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted">Latest results{story?.earnings?.period ? `, ${story.earnings.period}` : ''}</p>
          <ul className="mt-2 divide-y divide-line rounded-control border border-line">
            {metrics.slice(0, 4).map((m) => (
              <li key={m.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="text-sm text-ink">
                  {m.label} <span className="text-xs text-muted">· {m.basis}</span>
                </span>
                <Change value={m.change_pct} className="text-sm" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 4. Supporting vs concerning
export function SupportConcern({ story, loading }: { story: Story | null; loading: boolean }) {
  if (loading) return <Loading />;
  if (!story) return <Unavailable what="The evidence" />;
  const sup = story?.evidence.support || [];
  const con = story?.evidence.challenge || [];
  const Block = ({ title, items, up }: { title: string; items: Evidence[]; up: boolean }) => (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        {up ? <TrendingUp className="h-4 w-4 text-up" strokeWidth={2} aria-hidden="true" /> : <TrendingDown className="h-4 w-4 text-down" strokeWidth={2} aria-hidden="true" />}
        {title} ({items.length})
      </h3>
      {items.length ? (
        <ul className="mt-2 space-y-2">
          {items.slice(0, 4).map((e) => (
            <EvidenceItem key={`${e.source_url}|${e.title}`} e={e} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">Nothing source-linked in the latest scan.</p>
      )}
    </div>
  );
  return (
    <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
      <Block title="Supporting" items={sup} up />
      <Block title="Concerning" items={con} up={false} />
    </div>
  );
}

// 5. Watch for
export function WatchFor({ story, loading }: { story: Story | null; loading: boolean }) {
  if (loading) return <Loading />;
  if (!story) return <Unavailable what="This section" />;
  const next = story?.watch_next || [];
  if (!next.length) return <p className="text-sm text-muted">Nothing scheduled in the latest scan.</p>;
  return (
    <ul className="space-y-3">
      {next.map((w) => (
        <li key={w} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/90">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-caution" strokeWidth={1.75} aria-hidden="true" />
          {w}
        </li>
      ))}
    </ul>
  );
}

// 6. Sources
export function Sources({ story, loading }: { story: Story | null; loading: boolean }) {
  if (loading) return <Loading />;
  if (!story) return <Unavailable what="The source list" />;
  const items = allSources(story);
  return (
    <div>
      {items.length ? (
        <ul className="divide-y divide-line">
          {items.map((e) => (
            <li key={`${e.source_url}|${e.title}`}>
              <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-start justify-between gap-3 py-2.5 text-sm text-ink/90 hover:text-ink">
                <span className="min-w-0">
                  <span className="line-clamp-2">{e.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {isFiling(e) ? 'Filing' : 'News'} · {e.source_name}
                    {e.published_at ? ` · ${shortDate(e.published_at)}` : ''}
                  </span>
                </span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No sources in the latest scan.</p>
      )}
      {story?.disclaimer && (
        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {story.disclaimer}
        </p>
      )}
    </div>
  );
}

export const STORY_PARTS = [
  { id: 'price', title: 'Price today' },
  { id: 'happened', title: 'What happened' },
  { id: 'numbers', title: 'Numbers that matter' },
  { id: 'money', title: 'Big investors' },
  { id: 'evidence', title: 'Supporting vs concerning' },
  { id: 'watch', title: 'Watch for' },
  { id: 'sources', title: 'Sources' },
] as const;
