import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, Eye, ExternalLink, FileText, Minus, Newspaper, Star, TrendingDown, TrendingUp, X } from 'lucide-react';
import { analyzeStock, addToWatchlist, removeFromWatchlist, getWatchlist } from '../lib/api';
import { EvidencePoint, cleanTicker, evidenceBalance, evidencePoints, factor, relDay } from '../lib/evidence';
import UpgradeModal from './UpgradeModal';
import ShareableSignal from './ShareableSignal';
import Price, { Change } from './ui/Price';
import DotScale from './ui/DotScale';
import Segmented from './ui/Segmented';
import Skeleton from './ui/Skeleton';
import { Button } from './ui/Button';

// ── Watchlist toggle ──
function WatchlistButton({ ticker, companyName }: { ticker: string; companyName: string }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [busy, setBusy] = useState(false);
  const clean = cleanTicker(ticker);

  useEffect(() => {
    getWatchlist()
      .then((res) => setInWatchlist(res.data.watchlist.map((w: any) => cleanTicker(w.ticker)).includes(clean)))
      .catch(() => {});
  }, [clean]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(clean);
        setInWatchlist(false);
      } else {
        await addToWatchlist(clean, companyName);
        setInWatchlist(true);
      }
    } catch (e) {
      console.error('Watchlist update failed', e);
    }
    setBusy(false);
  };

  return (
    <Button variant={inWatchlist ? 'primary' : 'ghost'} size="sm" onClick={toggle} disabled={busy} aria-pressed={inWatchlist}>
      <Star className={`h-4 w-4 ${inWatchlist ? 'fill-current' : ''}`} strokeWidth={1.75} />
      {inWatchlist ? 'Watching' : 'Watchlist'}
    </Button>
  );
}

function Section({ title, icon, children, note }: { title: string; icon?: React.ReactNode; children: React.ReactNode; note?: string }) {
  return (
    <section className="border-t border-line px-5 py-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        {icon}
        {title}
      </h3>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

// "More concerns ←→ More support", stated in words as well as position.
function BalanceScale({ support, concern }: { support: number; concern: number }) {
  const b = evidenceBalance(support, concern);
  const pos = 50 + b.lean * 46; // keep the marker inside the track
  return (
    <div>
      <p className="text-base font-semibold text-ink">{b.label}</p>
      <div className="relative mt-3 h-2 rounded-full bg-ink/10" role="img" aria-label={`Evidence balance: ${b.label}`}>
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/25" aria-hidden="true" />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-accent shadow transition-[left] duration-500 ease-ui"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>More concerns</span>
        <span>More support</span>
      </div>
    </div>
  );
}

function PointList({ points, kind }: { points: EvidencePoint[]; kind: 'support' | 'concern' }) {
  if (!points.length) return <p className="text-sm text-muted">None stated in this analysis.</p>;
  return (
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-2.5 rounded-control border border-line px-3 py-2.5 text-sm leading-relaxed text-ink/90">
          {kind === 'support' ? (
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-up" strokeWidth={2} aria-label="Supporting" />
          ) : (
            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-down" strokeWidth={2} aria-label="Concerning" />
          )}
          <div className="min-w-0">
            <p>{p.text}</p>
            {p.sources.length > 0 && (
              <p className="mt-1.5 flex flex-wrap gap-1.5">
                {p.sources.map((src) => {
                  const filing = /nse|bse|exchange/i.test(src.name);
                  const Icon = filing ? FileText : Newspaper;
                  return (
                    <a
                      key={src.url}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={src.title || src.name}
                      className="inline-flex min-h-[24px] max-w-full items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent hover:bg-accent/15"
                    >
                      <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate">{src.name}</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
                    </a>
                  );
                })}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Loading: the board's own shape, with a thread drawing across as the progress line.
function BoardSkeleton({ ticker }: { ticker: string }) {
  return (
    <div className="px-5 py-5" role="status" aria-label={`Analysing ${ticker}`}>
      <div className="relative h-0.5 overflow-hidden rounded-full bg-ink/10">
        <span className="board-thread absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent" />
      </div>
      <p className="mt-3 text-sm text-muted">Reading filings, news and market data for {ticker}…</p>
      <Skeleton className="mt-6 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-6 h-2 w-full" />
      <div className="mt-8 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

const NEWS_TONE: Record<string, { word: string; cls: string; Icon: typeof TrendingUp }> = {
  POSITIVE: { word: 'Positive', cls: 'text-up', Icon: TrendingUp },
  NEGATIVE: { word: 'Negative', cls: 'text-down', Icon: TrendingDown },
  NEUTRAL: { word: 'Neutral', cls: 'text-muted', Icon: Minus },
};

// The Evidence Board: what supports a stock, what concerns it, and where that came from.
// A right-side drawer on larger screens, a full-screen sheet on phones.
export default function EvidenceBoard({ stock, onClose }: { stock: any; onClose: () => void }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limitHit, setLimitHit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [side, setSide] = useState<'support' | 'concern'>('support');
  const [asOf, setAsOf] = useState<Date | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const ticker = cleanTicker(stock.display_ticker || stock.ticker);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    analyzeStock(stock.display_ticker || stock.ticker)
      .then((res) => {
        if (!alive) return;
        setResult(res.data);
        setAsOf(new Date());
      })
      .catch((e: any) => {
        if (!alive) return;
        const detail = e?.response?.data?.detail;
        if (detail === 'DAILY_LIMIT_REACHED') {
          setLimitHit(true);
          setError('You have used your 2 free analyses for today.');
        } else {
          setError(typeof detail === 'string' ? detail : 'The analysis could not be completed. Please try again.');
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [stock]);

  // Esc closes; focus stays inside; page behind does not scroll.
  const close = useCallback(() => onClose(), [onClose]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const back = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      back?.focus?.();
    };
  }, [close]);

  const sig = result?.signal || {};
  const analysis = sig.analysis || {};
  const ratings = sig.ratings || {};
  const support = evidencePoints(analysis, 'bull');
  const flags: any[] = result?.news?.red_flags || [];
  const concern: EvidencePoint[] = [
    ...evidencePoints(analysis, 'bear'),
    ...flags.map((f) => ({
      text: `Official disclosure: ${f.title}`,
      sources: typeof f.link === 'string' && /^https?:/i.test(f.link) ? [{ name: f.source || 'NSE India', url: f.link, title: f.title }] : [],
    })),
  ];
  const watch: string[] = [
    ...(Array.isArray(analysis.invalidation_triggers) ? analysis.invalidation_triggers.map(String) : []),
    ...(analysis.what_to_watch ? [String(analysis.what_to_watch)] : []),
  ];
  const sources: { title: string; link: string; source: string; when: string; filing: boolean }[] = [
    ...flags.map((f) => ({ title: f.title, link: f.link, source: f.source || 'NSE India', when: f.date || '', filing: true })),
    ...((result?.news?.news as any[]) || []).slice(0, 6).map((n) => ({
      title: n.title,
      link: n.link,
      source: n.source || 'News',
      when: n.published || '',
      filing: /nse|bse/i.test(n.source || ''),
    })),
  ];
  const tone = NEWS_TONE[ratings.news_sentiment] || NEWS_TONE.NEUTRAL;
  const price = result?.stock?.current_price ?? stock.current_price;
  const pct = result?.stock?.price_change_pct ?? stock.price_change_pct;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-[#0B0F14]/55 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Evidence board for ${ticker}`}
        className="board-panel absolute inset-0 flex flex-col bg-canvas outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[560px] sm:border-l sm:border-line sm:shadow-lift"
      >
        {/* 1. Header */}
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="min-w-0">
            <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-ink/15 sm:hidden" aria-hidden="true" />
            <p className="num text-lg font-semibold text-ink">{ticker}</p>
            <p className="truncate text-sm text-muted">{stock.company_name || result?.stock?.company_name}</p>
            {typeof price === 'number' && (
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Price value={price} className="text-xl font-semibold text-ink" />
                {typeof pct === 'number' && <Change value={pct} className="text-sm font-medium" />}
                {asOf && <span className="text-xs text-muted">as of {asOf.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <WatchlistButton ticker={ticker} companyName={stock.company_name || ''} />
            <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink">
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          {loading && <BoardSkeleton ticker={ticker} />}

          {!loading && error && (
            <div className="px-5 py-8">
              <p className="flex items-start gap-2 text-sm text-ink">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-caution" strokeWidth={2} />
                {error}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {limitHit ? (
                  <Button onClick={() => setShowUpgrade(true)}>Go Pro for unlimited analyses</Button>
                ) : (
                  <Button onClick={() => window.location.reload()}>Try again</Button>
                )}
                <Link to={`/stock/${ticker}`} className="inline-flex h-11 items-center px-3 text-sm font-semibold text-accent" onClick={close}>
                  Read the free stock page
                </Link>
              </div>
            </div>
          )}

          {!loading && result && (
            <>
              {/* 2. In one line */}
              <section className="px-5 py-5">
                <p className="text-xs font-medium text-muted">In one line</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{analysis.short_summary || 'No summary was returned for this analysis.'}</p>
              </section>

              {/* 3. Evidence balance: how the sourced points weigh up. No verdict, no targets. */}
              <section className="border-t border-line px-5 py-5">
                <BalanceScale support={support.length} concern={concern.length} />
              </section>

              {/* 4. Supporting and concerning: stacked on larger screens, tabs on phones */}
              <section className="border-t border-line px-5 py-5">
                <div className="sm:hidden">
                  <Segmented<'support' | 'concern'>
                    label="Evidence"
                    value={side}
                    onChange={setSide}
                    options={[
                      { value: 'support', label: `Supporting (${support.length})` },
                      { value: 'concern', label: `Concerning (${concern.length})` },
                    ]}
                  />
                  <div className="mt-4">
                    <PointList points={side === 'support' ? support : concern} kind={side} />
                  </div>
                </div>
                <div className="hidden space-y-6 sm:block">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Supporting ({support.length})</h3>
                    <div className="mt-3">
                      <PointList points={support} kind="support" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Concerning ({concern.length})</h3>
                    <div className="mt-3">
                      <PointList points={concern} kind="concern" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Factor checks */}
              <Section title="Factor checks">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {(
                    [
                      ['Technical', factor('technical', ratings.technical_score)],
                      ['Valuation', factor('valuation', ratings.value_score)],
                      ['Momentum', factor('momentum', ratings.momentum_score)],
                    ] as const
                  ).map(([label, f]) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <dt className="text-sm text-ink/85">{label}</dt>
                      <dd className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{f.word}</span>
                        <DotScale value={f.dots} label={`${label} ${f.word}`} />
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-sm text-ink/85">News tone</dt>
                    <dd className={`inline-flex items-center gap-1.5 text-sm font-medium ${tone.cls}`}>
                      <tone.Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      {tone.word}
                    </dd>
                  </div>
                  {[
                    ['Dividend potential', ratings.dividend_potential],
                    ['Growth potential', ratings.growth_potential],
                    ['Risk level', ratings.risk_level],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, v]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <dt className="text-sm text-ink/85">{label}</dt>
                        <dd className="text-sm font-medium capitalize text-ink">{String(v).toLowerCase()}</dd>
                      </div>
                    ))}
                </dl>
              </Section>

              {/* 6. Watch for */}
              {watch.length > 0 && (
                <Section title="Watch for" icon={<Eye className="h-4 w-4 text-accent" strokeWidth={1.75} />} note="What would change this picture.">
                  <ul className="space-y-2">
                    {watch.map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" aria-hidden="true" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* 7. Sources: the filings and news this analysis read */}
              {sources.length > 0 && (
                <Section title="Sources this analysis read" note="Open any item to check it yourself.">
                  <ul className="space-y-2">
                    {sources.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-start gap-3 rounded-control border border-line px-3 py-2.5 transition hover:border-accent/40"
                        >
                          {s.filing ? (
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                          ) : (
                            <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-sm text-ink/90 group-hover:text-ink">{s.title}</span>
                            <span className="mt-1 block text-xs text-muted">
                              {s.filing ? 'Filing' : 'News'} · {s.source}
                              {s.when ? ` · ${relDay(s.when)}` : ''}
                            </span>
                          </span>
                          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted/60 group-hover:text-accent" strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* 8. Share */}
              <Section title="Share">
                <ShareableSignal signal={sig} stock={result.stock || stock} support={support.map((p) => p.text)} concern={concern.map((p) => p.text)} />
              </Section>

              <section className="border-t border-line px-5 py-5">
                <p className="text-xs leading-relaxed text-muted">{sig.disclaimer || 'Research, not advice. Stock AI is not SEBI-registered and this is not a personal recommendation.'}</p>
                <Link to={`/stock/${ticker}`} onClick={close} className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-accent">
                  Open the full stock page <ArrowUpRight className="h-4 w-4" />
                </Link>
              </section>
            </>
          )}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={() => window.location.reload()} />}
    </div>
  );
}
