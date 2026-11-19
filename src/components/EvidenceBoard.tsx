import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { Drawer } from 'vaul';
import { AlertTriangle, ArrowUpRight, BarChart3, Bell, BellRing, CalendarDays, Lock, ExternalLink, Eye, FileText, Minus, Newspaper, Star, TrendingDown, TrendingUp, X } from 'lucide-react';
import { analyzeStock, addToWatchlist, removeFromWatchlist, getWatchlist, getStockEvents, getNotificationPreferences, saveNotificationPreferences } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { noteBoardSeen, noteNotNow } from '../lib/paywall';
import { refreshAllowance, refreshPlan } from '../lib/plan';
import { toast } from '../lib/toast';
import { EvidencePoint, PointSource, SourceKind, cleanTicker, evidenceBalance, evidencePoints, factor, relDay, sourceKind } from '../lib/evidence';
import { usePhone } from '../lib/useMedia';
import { hasVerdictWords, shortHeadline } from '../lib/researchLanguage';
import UpgradeModal from './UpgradeModal';
import ShareableSignal from './ShareableSignal';
import Price, { Change } from './ui/Price';
import Segmented from './ui/Segmented';
import Skeleton from './ui/Skeleton';
import { Button } from './ui/Button';
import { haptic, toastAdded, toastRemoved } from '../lib/toast';
import { relativeTime } from '../lib/relativeTime';

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

  const setWatch = async (on: boolean, quiet = false) => {
    setBusy(true);
    try {
      if (!on) {
        await removeFromWatchlist(clean);
        setInWatchlist(false);
        if (!quiet) toastRemoved(clean, () => setWatch(true, true));
      } else {
        await addToWatchlist(clean, companyName);
        setInWatchlist(true);
        if (!quiet) toastAdded(clean);
      }
    } catch (e) {
      console.error('Watchlist update failed', e);
    }
    setBusy(false);
  };
  const toggle = () => {
    haptic();
    setWatch(!inWatchlist);
  };

  return (
    <Button variant={inWatchlist ? 'primary' : 'ghost'} size="sm" onClick={toggle} disabled={busy} aria-pressed={inWatchlist}>
      <Star className={`h-4 w-4 ${inWatchlist ? 'fill-current' : ''}`} strokeWidth={1.75} />
      {inWatchlist ? 'Watching' : 'Watchlist'}
    </Button>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

function Section({ title, icon, children, note }: { title: string; icon?: ReactNode; children: ReactNode; note?: string }) {
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

type Side = 'support' | 'concern';
const itemId = (ticker: string, side: Side, i: number) => `ev-${ticker}-${side}-${i}`;

// Each point gets a tick on its own side of the track, nearest the centre first.
const tickPos = (side: Side, i: number, n: number) => (side === 'support' ? 50 + ((i + 1) * 46) / (n + 1) : 50 - ((i + 1) * 46) / (n + 1));

// The balance meter: the dot starts at the centre and springs to where the evidence leans.
// Every point has a tick; hovering a point lights its tick, tapping a tick jumps to the point.
function BalanceMeter({
  support,
  concern,
  active,
  onTick,
}: {
  support: number;
  concern: number;
  active: string | null;
  onTick: (side: Side, i: number) => void;
}) {
  const reduce = useReducedMotion();
  const b = evidenceBalance(support, concern);
  const pos = 50 + b.lean * 46;
  const ticks: { side: Side; i: number; at: number }[] = [
    ...Array.from({ length: concern }, (_, i) => ({ side: 'concern' as Side, i, at: tickPos('concern', i, concern) })),
    ...Array.from({ length: support }, (_, i) => ({ side: 'support' as Side, i, at: tickPos('support', i, support) })),
  ];
  return (
    <div>
      <p className="text-base font-semibold text-ink">{b.label}</p>
      <div className="relative mt-4 h-2 rounded-full bg-ink/10" role="img" aria-label={`Evidence balance: ${b.label}`}>
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/25" aria-hidden="true" />
        <m.div
          className="pointer-events-none absolute inset-0"
          initial={reduce ? false : { x: '0%' }}
          animate={{ x: `${pos - 50}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22, delay: 0.15 }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-accent shadow" />
        </m.div>
      </div>
      {ticks.length > 0 && (
        <div className="relative h-7" aria-label="Jump to a point">
          {ticks.map((t) => {
            const key = `${t.side}-${t.i}`;
            const on = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onTick(t.side, t.i)}
                aria-label={`${t.side === 'support' ? 'Supporting' : 'Concerning'} point ${t.i + 1}`}
                className="group absolute top-0 grid h-7 w-6 -translate-x-1/2 place-items-start justify-center"
                style={{ left: `${t.at}%` }}
              >
                <span
                  className={`mt-1 block h-2.5 w-0.5 rounded-full transition duration-150 group-hover:scale-y-150 group-hover:bg-ink ${
                    on ? 'scale-y-150 bg-accent' : t.side === 'support' ? 'bg-up/70' : 'bg-down/70'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
      <div className="flex justify-between text-xs text-muted">
        <span>More concerns</span>
        <span>More support</span>
      </div>
    </div>
  );
}

type SourceInfo = { when?: string; outlet?: string };

// A source chip. Hover or focus shows what the source is and the point it backs up.
function SourceChip({ src, point, info }: { src: PointSource; point: string; info?: SourceInfo }) {
  const kind = src.kind || sourceKind(undefined, src.name);
  const Icon = KIND_ICON[kind];
  const ref = useRef<HTMLSpanElement>(null);
  const [alignRight, setAlignRight] = useState(false);
  const measure = () => {
    const r = ref.current?.getBoundingClientRect();
    const box = ref.current?.closest('[data-board-scroll]')?.getBoundingClientRect();
    if (r && box) setAlignRight(r.left + 272 > box.right - 8);
  };
  return (
    <span ref={ref} className="group/chip relative inline-flex max-w-full" onMouseEnter={measure} onFocus={measure}>
      <a
        href={src.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[24px] max-w-full items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent transition active:scale-[0.97] hover:bg-accent/15"
      >
        <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">{src.name}</span>
        <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
      </a>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-30 mb-2 hidden w-64 rounded-card border border-line bg-surface p-3 text-left shadow-lift sm:group-hover/chip:block sm:group-focus-within/chip:block ${
          alignRight ? 'right-0' : 'left-0'
        }`}
      >
        <span className="block text-[13px] font-semibold leading-snug text-ink">{src.shortTitle || src.title || src.name}</span>
        <span className="mt-1 flex flex-wrap gap-x-1.5 text-[11px] text-muted">
          <span className="font-semibold text-ink/75">{KIND_LABEL[kind]}</span>
          <span>{info?.outlet || src.name}</span>
          {info?.when ? <span>· {relDay(info.when)}</span> : null}
        </span>
        <span className="mt-2 block border-l-2 border-accent/40 pl-2 text-[12px] leading-snug text-ink/80 line-clamp-2">{point}</span>
      </span>
    </span>
  );
}

function PointList({
  points,
  kind,
  ticker,
  active,
  setActive,
  sourceInfo,
}: {
  points: EvidencePoint[];
  kind: Side;
  ticker: string;
  active: string | null;
  setActive: (k: string | null) => void;
  sourceInfo: Record<string, SourceInfo>;
}) {
  const reduce = useReducedMotion();
  if (!points.length) return <p className="text-sm text-muted">None stated in this analysis.</p>;
  return (
    <ul className="space-y-2">
      {points.map((p, i) => {
        const key = `${kind}-${i}`;
        return (
          <m.li
            key={i}
            id={itemId(ticker, kind, i)}
            tabIndex={0}
            onMouseEnter={() => setActive(key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(key)}
            onBlur={() => setActive(null)}
            // Supporting points arrive from the right, concerns from the left, after the meter settles.
            initial={reduce ? false : { opacity: 0, x: kind === 'support' ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 0.35 + i * 0.05, duration: 0.24, ease: EASE }}
            className={`flex scroll-mt-24 items-start gap-2.5 rounded-control border px-3 py-2.5 text-sm leading-relaxed text-ink/90 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent ${
              active === key ? 'border-accent/50 bg-accent/[0.04]' : 'border-line'
            }`}
          >
            {kind === 'support' ? (
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-up" strokeWidth={2} aria-label="Supporting" />
            ) : (
              <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-down" strokeWidth={2} aria-label="Concerning" />
            )}
            <div className="min-w-0">
              <p>{p.text}</p>
              {p.sources.length > 0 && (
                <p className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.sources.map((src) => (
                    <SourceChip key={src.url} src={src} point={p.text} info={sourceInfo[src.url]} />
                  ))}
                </p>
              )}
            </div>
          </m.li>
        );
      })}
    </ul>
  );
}

// A factor as a small instrument: the word first, a 5-step meter second, and why on tap.
function FactorTile({ label, word, steps, note }: { label: string; word: string; steps?: number; note?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-control border border-line bg-surface/60 p-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1">
        <span className="block text-sm font-semibold capitalize text-ink">{word}</span>
        {typeof steps === 'number' && (
          <span className="mt-2 flex gap-1" role="img" aria-label={`${label}: ${steps} of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < steps ? 'bg-accent' : 'bg-ink/15'}`} />
            ))}
          </span>
        )}
        {note && (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="mt-2 inline-flex min-h-[28px] items-center text-xs font-semibold text-accent hover:underline"
            >
              {open ? 'Hide why' : 'Why?'}
            </button>
            {open && <span className="mt-0.5 block text-xs leading-relaxed text-ink/80">{note}</span>}
          </>
        )}
      </dd>
    </div>
  );
}

// "Remind me": turns on email alerts for this stock (watchlist + filing alerts), for everyone.
// A full free watchlist is the one paywall here.
function RemindMe({ ticker, companyName, onWatchlistFull }: { ticker: string; companyName: string; onWatchlistFull: () => void }) {
  const [state, setState] = useState<'idle' | 'busy' | 'on'>('idle');
  const turnOn = async () => {
    if (state !== 'idle') return;
    setState('busy');
    try {
      const wl = await getWatchlist();
      const has = (wl.data?.watchlist || []).some((w: any) => cleanTicker(w.ticker) === ticker);
      if (!has) await addToWatchlist(ticker, companyName);
      const prefs = (await getNotificationPreferences()).data?.preferences || {};
      if (!prefs.high_priority_alerts) {
        await saveNotificationPreferences({
          email_digest: !!prefs.email_digest,
          high_priority_alerts: true,
          minimum_severity: prefs.minimum_severity || 'high',
        });
      }
      setState('on');
      trackEvent('alert_create', { ticker, source: 'watch_for' });
      toast.success(`Alerts on. We'll email you when ${ticker} files something important.`);
    } catch (e: any) {
      setState('idle');
      if (e?.response?.data?.detail === 'FREE_LIMIT_REACHED') onWatchlistFull();
      else toast.error('Could not turn on alerts. Please try again.');
    }
  };
  return (
    <button
      type="button"
      onClick={turnOn}
      aria-pressed={state === 'on'}
      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
        state === 'on' ? 'border-accent/50 bg-accent/10 text-accent' : 'border-line text-ink hover:border-accent/50'
      }`}
    >
      {state === 'on' ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
      {state === 'on' ? 'Alerts on' : state === 'busy' ? 'Turning on…' : 'Remind me'}
    </button>
  );
}

// Free allowance used up: the rest of the board sits behind a soft blur with one offer card.
// The hidden points never reach the browser; the blur covers placeholder lines.
function LockedRest({ total, onUnlock }: { total: number; onUnlock: () => void }) {
  const [hidden, setHidden] = useState(false);
  return (
    <section className="relative border-t border-line px-5 py-5">
      <p className="sr-only">Locked with Pro: {total} more points and every source.</p>
      <div className="select-none space-y-2 blur-[8px]" aria-hidden="true">
        {Array.from({ length: Math.min(6, Math.max(3, total)) }, (_, i) => (
          <div key={i} className="rounded-control border border-line px-3 py-3">
            <span className="block h-3 w-11/12 rounded bg-ink/20" />
            <span className="mt-2 block h-3 w-2/3 rounded bg-ink/15" />
          </div>
        ))}
      </div>
      {!hidden && (
        <div className="absolute inset-x-5 top-8 rounded-card border border-line bg-surface p-5 text-center shadow-lift">
          <Lock className="mx-auto h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
          <p className="mt-2 text-base font-semibold text-ink">See all {total} points and every source.</p>
          <p className="mt-1 text-sm text-muted">Pro, ₹99 for 30 days. No auto-renewal.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={onUnlock}>Unlock</Button>
            <button
              type="button"
              onClick={() => {
                noteNotNow();
                setHidden(true);
              }}
              className="h-11 rounded-control px-4 text-sm font-medium text-muted hover:text-ink"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </section>
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

const KIND_ICON: Record<SourceKind, typeof FileText> = { filing: FileText, news: Newspaper, data: BarChart3 };
const KIND_LABEL: Record<SourceKind, string> = { filing: 'Filing', news: 'News', data: 'Data' };

type StockEvent = { label: string; short_title: string; event_date?: string; source_url?: string; source_name?: string };

const fmtDay = (d: string) => {
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
};

// The Evidence Board: what supports a stock, what concerns it, and where that came from.
// A draggable bottom sheet on phones (55% and 95%), a right-side panel on larger screens.
export default function EvidenceBoard({ stock, onClose }: { stock: any; onClose: () => void }) {
  const phone = usePhone();
  const ticker = cleanTicker(stock.display_ticker || stock.ticker);
  const close = useCallback(() => onClose(), [onClose]);
  const [snap, setSnap] = useState<number | string | null>(0.55);

  if (phone) {
    return (
      <Drawer.Root
        open
        onOpenChange={(o) => !o && close()}
        snapPoints={[0.55, 0.95]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        fadeFromIndex={0}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[80] bg-[#0B0F14]/55" />
          <Drawer.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-[81] flex h-[95dvh] flex-col rounded-t-card border border-b-0 border-line bg-canvas outline-none"
          >
            <Drawer.Title className="sr-only">Evidence board for {ticker}</Drawer.Title>
            <span className="mx-auto mt-2.5 block h-1 w-10 shrink-0 rounded-full bg-ink/20" aria-hidden="true" />
            <BoardBody stock={stock} ticker={ticker} close={close} scrollable={snap === 0.95} onWantMore={() => setSnap(0.95)} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return <DesktopShell ticker={ticker} close={close}>{<BoardBody stock={stock} ticker={ticker} close={close} scrollable />}</DesktopShell>;
}

function DesktopShell({ ticker, close, children }: { ticker: string; close: () => void; children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Esc closes; focus stays inside; page behind does not scroll.
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

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-[#0B0F14]/55 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Evidence board for ${ticker}`}
        className="board-slide absolute inset-y-0 right-0 flex w-[560px] max-w-full flex-col border-l border-line bg-canvas shadow-lift outline-none"
      >
        {children}
      </div>
    </div>
  );
}

function BoardBody({
  stock,
  ticker,
  close,
  scrollable,
  onWantMore,
}: {
  stock: any;
  ticker: string;
  close: () => void;
  scrollable: boolean;
  onWantMore?: () => void;
}) {
  const reduce = useReducedMotion();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limitHit, setLimitHit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [side, setSide] = useState<Side>('support');
  const [asOf, setAsOf] = useState<Date | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [events, setEvents] = useState<StockEvent[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [upgradeContext, setUpgradeContext] = useState<{ text: string; moment: string } | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    analyzeStock(stock.display_ticker || stock.ticker)
      .then((res) => {
        if (!alive) return;
        setResult(res.data);
        setAsOf(new Date());
        const planName = res.data?.plan?.is_pro ? 'pro' : 'free';
        if (res.data?.locked) {
          trackEvent('analysis_locked_view', { ticker, plan: planName });
        } else {
          trackEvent('analysis_open', { ticker, plan: planName });
          noteBoardSeen();
        }
        refreshAllowance();
      })
      .catch((e: any) => {
        if (!alive) return;
        const detail = e?.response?.data?.detail;
        if (detail === 'DAILY_LIMIT_REACHED') {
          trackEvent('analysis_locked_view', { ticker, plan: 'free', source: 'not_researched_today' });
          refreshAllowance();
          setLimitHit(true);
          setError('You have used your free analyses for today. They reset at midnight.');
        } else {
          setError(typeof detail === 'string' ? detail : 'The analysis could not be completed. Please try again.');
        }
      })
      .finally(() => alive && setLoading(false));
    getStockEvents(ticker)
      .then((res) => alive && setEvents(res.data?.upcoming || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [stock, ticker, reloadKey]);

  const sig = result?.signal || {};
  const analysis = sig.analysis || {};
  const ratings = sig.ratings || {};
  const notes: Record<string, string> = analysis.factor_notes || {};
  const support = evidencePoints(analysis, 'bull');
  const flags: any[] = useMemo(() => result?.news?.red_flags || [], [result]);
  const concern: EvidencePoint[] = [
    ...evidencePoints(analysis, 'bear'),
    ...flags.map((f) => ({
      text: `Official disclosure: ${f.short_title || f.category || shortHeadline(f.title || '')}`,
      sources:
        typeof f.link === 'string' && /^https?:/i.test(f.link)
          ? [{ name: f.source || 'NSE India', url: f.link, title: f.title, shortTitle: f.short_title, kind: 'filing' as SourceKind }]
          : [],
    })),
  ];
  const watchNote = analysis.what_to_watch ? String(analysis.what_to_watch) : '';
  const sources: { title: string; original: string; link: string; source: string; when: string; kind: SourceKind }[] = [
    ...flags.map((f) => ({
      title: f.short_title || f.category || shortHeadline(f.title || ''),
      original: f.title || '',
      link: f.link,
      source: f.source || 'NSE India',
      when: f.date || '',
      kind: 'filing' as SourceKind,
    })),
    ...((result?.news?.news as any[]) || []).slice(0, 6).map((n) => ({
      title: n.short_title || shortHeadline(n.title || ''),
      original: n.title || '',
      link: n.link,
      source: n.source || 'News',
      when: n.published || '',
      kind: sourceKind(n.kind, n.source || ''),
    })),
  ];
  // Dates and outlets for source previews, matched by link.
  const sourceInfo: Record<string, SourceInfo> = {};
  for (const n of [...((result?.news?.news as any[]) || []), ...flags]) {
    if (n?.link) sourceInfo[n.link] = { when: n.published || n.date, outlet: n.source };
  }
  // The one-liner never reads as a call; if it would, show the first point on each side instead.
  const oneLiner = analysis.short_summary && !hasVerdictWords(analysis.short_summary) ? String(analysis.short_summary) : '';
  const oneLinerFallback = [support[0]?.text, concern[0]?.text].filter(Boolean) as string[];
  const tone = NEWS_TONE[ratings.news_sentiment] || NEWS_TONE.NEUTRAL;
  const price = result?.stock?.current_price ?? stock.current_price;
  const pct = result?.stock?.price_change_pct ?? stock.price_change_pct;

  const jumpTo = (s: Side, i: number) => {
    setSide(s);
    onWantMore?.();
    setActive(`${s}-${i}`);
    window.setTimeout(() => {
      const el = document.getElementById(itemId(ticker, s, i));
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
    }, 60);
  };
  const listProps = { ticker, active, setActive, sourceInfo };
  // On phones the sheet opens fully first, so the upgrade sheet inside it is fully on screen.
  const openUpgrade = (text?: string, moment = 'evidence_board') => {
    onWantMore?.();
    setUpgradeContext({ text: text || (limitHit || locked ? `Unlock the full Evidence Board for ${ticker}` : 'Unlimited Evidence Boards'), moment });
    setShowUpgrade(true);
  };
  const locked = !!result?.locked;
  const lockedCounts = result?.counts || { support: support.length, concern: concern.length };
  const meterSupport = locked ? lockedCounts.support : support.length;
  const meterConcern = locked ? lockedCounts.concern : concern.length;

  const technical = factor('technical', ratings.technical_score);
  const valuation = factor('valuation', ratings.value_score);
  const momentum = factor('momentum', ratings.momentum_score);

  return (
    <>
      {/* 1. Header */}
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 pb-4 pt-3 sm:pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="min-w-0">
          <p className="num text-lg font-semibold text-ink">{ticker}</p>
          <p className="truncate text-sm text-muted">{stock.company_name || result?.stock?.company_name}</p>
          {typeof price === 'number' && (
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Price value={price} className="text-xl font-semibold text-ink" />
              {typeof pct === 'number' && <Change value={pct} className="text-sm font-medium" />}
              {asOf && <span className="text-xs text-muted">researched {relativeTime(asOf)}</span>}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <WatchlistButton ticker={ticker} companyName={stock.company_name || ''} />
          <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-control text-muted transition active:scale-[0.94] hover:bg-ink/[0.06] hover:text-ink">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div data-board-scroll className={`flex-1 overscroll-contain pb-[env(safe-area-inset-bottom)] ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {loading && <BoardSkeleton ticker={ticker} />}

        {!loading && error && (
          <div className="px-5 py-8">
            <p className="flex items-start gap-2 text-sm text-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-caution" strokeWidth={2} />
              {error}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {limitHit ? (
                <Button onClick={() => openUpgrade()}>Go Pro for unlimited analyses</Button>
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
            {/* Free plan: how many analyses are left today, with the way to unlimited */}
            {result?.plan && !result.plan.is_pro && typeof result.plan.free_left_today === 'number' && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-accent/[0.05] px-5 py-2.5 text-sm">
                <span className="text-ink">
                  {result.plan.free_left_today > 0
                    ? `${result.plan.free_left_today} free ${result.plan.free_left_today === 1 ? 'analysis' : 'analyses'} left today`
                    : 'That was your last free analysis today'}
                </span>
                <button type="button" onClick={() => openUpgrade()} className="font-semibold text-accent hover:underline">
                  Go unlimited
                </button>
              </div>
            )}

            {/* 2. In one line */}
            <section className="px-5 py-5">
              <p className="text-xs font-medium text-muted">In one line</p>
              {oneLiner ? (
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{oneLiner}</p>
              ) : oneLinerFallback.length ? (
                <ul className="mt-1.5 space-y-1.5 text-[15px] leading-relaxed text-ink">
                  {oneLinerFallback.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      {i === 0 && support[0] ? (
                        <TrendingUp className="mt-1 h-4 w-4 shrink-0 text-up" strokeWidth={2} aria-label="Supporting" />
                      ) : (
                        <TrendingDown className="mt-1 h-4 w-4 shrink-0 text-down" strokeWidth={2} aria-label="Concerning" />
                      )}
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">No summary was returned for this analysis.</p>
              )}
            </section>

            {/* 3. Evidence balance: how the sourced points weigh up. No verdict, no targets. */}
            <section className="border-t border-line px-5 py-5">
              <BalanceMeter
                support={meterSupport}
                concern={meterConcern}
                active={active}
                onTick={(sd, i) => (locked && i > 0 ? openUpgrade(undefined, 'locked_board') : jumpTo(sd, i))}
              />
            </section>

            {locked ? (
              <>
                <section className="border-t border-line px-5 py-5">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Supporting ({lockedCounts.support})</h3>
                      <div className="mt-3">
                        <PointList points={support.slice(0, 1)} kind="support" {...listProps} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Concerning ({lockedCounts.concern})</h3>
                      <div className="mt-3">
                        <PointList points={concern.slice(0, 1)} kind="concern" {...listProps} />
                      </div>
                    </div>
                  </div>
                </section>
                <LockedRest
                  total={lockedCounts.support + lockedCounts.concern}
                  onUnlock={() => openUpgrade(`Unlock the full Evidence Board for ${ticker}`, 'locked_board')}
                />
              </>
            ) : (
              <>
                {/* 4. Supporting and concerning: stacked on larger screens, tabs on phones */}
            <section className="border-t border-line px-5 py-5">
              <div className="sm:hidden">
                <Segmented<Side>
                  label="Evidence"
                  value={side}
                  onChange={setSide}
                  options={[
                    { value: 'support', label: `Supporting (${support.length})` },
                    { value: 'concern', label: `Concerning (${concern.length})` },
                  ]}
                />
                <div className="mt-4">
                  <PointList key={side} points={side === 'support' ? support : concern} kind={side} {...listProps} />
                </div>
              </div>
              <div className="hidden space-y-6 sm:block">
                <div>
                  <h3 className="text-sm font-semibold text-ink">Supporting ({support.length})</h3>
                  <div className="mt-3">
                    <PointList points={support} kind="support" {...listProps} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Concerning ({concern.length})</h3>
                  <div className="mt-3">
                    <PointList points={concern} kind="concern" {...listProps} />
                  </div>
                </div>
              </div>
            </section>

                {/* 5. Factor checks: small instruments, word first */}
            <Section title="Factor checks">
              <dl className="grid grid-cols-2 gap-2.5">
                <FactorTile label="Technical" word={technical.word} steps={technical.dots} note={notes.technical} />
                <FactorTile label="Valuation" word={valuation.word} steps={valuation.dots} note={notes.valuation} />
                <FactorTile label="Momentum" word={momentum.word} steps={momentum.dots} note={notes.momentum} />
                <div className="rounded-control border border-line bg-surface/60 p-3">
                  <dt className="text-xs text-muted">News tone</dt>
                  <dd className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold ${tone.cls}`}>
                    <tone.Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {tone.word}
                  </dd>
                </div>
                {(
                  [
                    ['Dividend potential', ratings.dividend_potential],
                    ['Growth potential', ratings.growth_potential],
                    ['Risk level', ratings.risk_level],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([label, v]) => (
                    <FactorTile key={label} label={label} word={String(v).toLowerCase()} />
                  ))}
              </dl>
            </Section>

                {/* 6. Watch for: dated events first, then the ongoing thing to keep an eye on */}
                {(events.length > 0 || watchNote) && (
              <Section title="Watch for" icon={<Eye className="h-4 w-4 text-accent" strokeWidth={1.75} />} note="Dates and developments that could change this picture.">
                <ol className="relative ml-1.5 border-l border-line">
                  {events.map((ev, i) => (
                    <li key={i} className="relative pb-4 pl-5 last:pb-1">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-accent" aria-hidden="true" />
                      <p className="num text-xs font-semibold text-accent">{ev.event_date ? fmtDay(ev.event_date) : 'Soon'}</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">{ev.label}</p>
                      {ev.short_title && ev.short_title !== ev.label && <p className="text-xs leading-relaxed text-muted">{ev.short_title}</p>}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <RemindMe
                          ticker={ticker}
                          companyName={stock.company_name || ''}
                          onWatchlistFull={() => openUpgrade('Free watchlists hold 5. Pro has no limit.', 'watchlist_limit')}
                        />
                      {ev.source_url && (
                        <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-[28px] items-center gap-1 text-xs font-semibold text-accent hover:underline">
                          {ev.source_name || 'Source'} <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                      </div>
                    </li>
                  ))}
                  {watchNote && (
                    <li className="relative pl-5">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-caution" aria-hidden="true" />
                      <p className="text-xs font-semibold text-caution">
                        <CalendarDays className="mr-1 inline h-3 w-3 align-[-1px]" aria-hidden="true" />
                        Ongoing
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink/90">{watchNote}</p>
                    </li>
                  )}
                </ol>
              </Section>
            )}

                {/* 7. Sources: the filings and news this analysis read */}
                {sources.length > 0 && (
              <Section title="Sources this analysis read" note="Open any item to check it yourself.">
                <ul className="space-y-2">
                  {sources.map((src, i) => {
                    const Icon = KIND_ICON[src.kind];
                    const showOriginal = src.original && src.original.trim() !== src.title.trim();
                    return (
                      <li key={i} className="rounded-control border border-line px-3 py-2.5 transition hover:border-accent/40">
                        <a href={src.link} target="_blank" rel="noreferrer" className="group flex items-start gap-3">
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${src.kind === 'filing' ? 'text-accent' : 'text-muted'}`} strokeWidth={1.75} aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-ink/90 group-hover:text-ink">{src.title}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
                              <span className="rounded-full bg-ink/[0.06] px-1.5 py-0.5 font-semibold text-ink/75">{KIND_LABEL[src.kind]}</span>
                              <span>{src.source}</span>
                              {src.when ? <span>· {relDay(src.when)}</span> : null}
                            </span>
                          </span>
                          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted/60 group-hover:text-accent" strokeWidth={1.75} aria-label="Opens in a new tab" />
                        </a>
                        {showOriginal && (
                          <details className="mt-2 pl-7">
                            <summary className="cursor-pointer text-xs font-semibold text-accent hover:underline">Show original</summary>
                            <p className="mt-1.5 text-xs leading-relaxed text-muted">{src.original}</p>
                          </details>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

                {/* 8. Share */}
                <Section title="Share">
                  <ShareableSignal signal={sig} stock={result.stock || stock} support={support.map((p) => p.text)} concern={concern.map((p) => p.text)} />
                </Section>

              </>
            )}

            <section className="border-t border-line px-5 py-5">
              <p className="text-xs leading-relaxed text-muted">{sig.disclaimer || 'Research, not advice. Stock AI is not SEBI-registered and this is not a personal recommendation.'}</p>
              <Link to={`/stock/${ticker}`} onClick={close} className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-accent">
                Open the full stock page <ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>
          </>
        )}
      </div>

      {showUpgrade && (
        <UpgradeModal
          context={upgradeContext?.text || (limitHit ? `Keep researching ${ticker} today` : 'Unlimited Evidence Boards')}
          moment={upgradeContext?.moment || (limitHit ? 'daily_limit' : 'evidence_board')}
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => {
            // The locked content opens in place behind the success sheet.
            refreshPlan();
            setLimitHit(false);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}
