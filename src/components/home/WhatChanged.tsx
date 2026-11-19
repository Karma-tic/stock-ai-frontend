// src/components/home/WhatChanged.tsx
// The heart of the signed-in home: one card per followed stock with something new
// since the last visit. Swipe right (or "Mark read") to clear, left (or "Later")
// to snooze until tomorrow. With no watchlist, "Pick 3" fills it in seconds.
// Read and snooze state live in this browser only (no account data changes).
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, PanInfo, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Clock, FileText, Newspaper, Plus } from 'lucide-react';
import { addToWatchlist, getEventRadar } from '../../lib/api';
import { evidenceBalance } from '../../lib/evidence';
import { relativeTime } from '../../lib/relativeTime';
import { haptic, toast } from '../../lib/toast';
import { Change } from '../ui/Price';
import { loadSymbols } from '../ui/StockSearch';

type Ev = {
  id: string;
  ticker: string;
  title: string;
  why_matters?: string;
  severity?: string;
  source_name?: string;
  source_url?: string;
  published_at?: string;
  category?: string;
};
type Card = { ticker: string; latest: Ev; events: Ev[] };
export type Balance = { support: number; concern: number };

const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'LT', 'MARUTI', 'ETERNAL', 'BAJFINANCE'];
const FIRST_VISIT_WINDOW_MS = 36 * 3600 * 1000;

const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: state lasts for this page view */
    }
  },
};

/** The moment this visit counts "new" from: the previous visit, fixed for the whole tab session. */
function sinceForSession(uid: string) {
  const sessionKey = `bp_home_since:${uid}`;
  try {
    const kept = sessionStorage.getItem(sessionKey);
    if (kept) return Number(kept);
  } catch {
    /* ignore */
  }
  const last = store.get<number>(`bp_home_seen:${uid}`, 0);
  const since = last || Date.now() - FIRST_VISIT_WINDOW_MS;
  store.set(`bp_home_seen:${uid}`, Date.now());
  try {
    sessionStorage.setItem(sessionKey, String(since));
  } catch {
    /* ignore */
  }
  return since;
}

function tomorrowMorningIST() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const offset = ist.getTime() - now.getTime();
  const next = new Date(ist);
  next.setDate(ist.getDate() + 1);
  next.setHours(6, 0, 0, 0);
  return next.getTime() - offset;
}

function nextUpdateLine() {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const weekday = ist.getDay() >= 1 && ist.getDay() <= 5;
  return weekday && mins < 16 * 60 + 15 ? 'Next update at 4:15 PM with the market wrap.' : 'Next update tomorrow before the open.';
}

function BalancePill({ b }: { b: Balance }) {
  const bal = evidenceBalance(b.support, b.concern);
  const tone = bal.lean >= 0.15 ? 'bg-up/10 text-up' : bal.lean <= -0.15 ? 'bg-down/10 text-down' : 'bg-ink/[0.06] text-ink/75';
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{bal.label}</span>;
}

function ChangeCard({
  card,
  pct,
  balance,
  onRead,
  onLater,
  onOpen,
}: {
  card: Card;
  pct?: number;
  balance?: Balance;
  onRead: () => void;
  onLater: () => void;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const e = card.latest;
  const filing = /nse|bse|exchange/i.test(e.source_name || '');
  const Icon = filing ? FileText : Newspaper;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const width = (document.querySelector(`[data-card="${card.ticker}"]`) as HTMLElement | null)?.offsetWidth || 320;
    if (info.offset.x > width * 0.3) onRead();
    else if (info.offset.x < -width * 0.3) onLater();
  };

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: 0, height: 0, marginBottom: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      <motion.div
        data-card={card.ticker}
        drag={reduce ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        dragSnapToOrigin
        onDragEnd={onDragEnd}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        className="group relative cursor-grab touch-pan-y rounded-card border border-line bg-surface p-4 active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <span className="flex items-center gap-2">
              <span className="num text-sm font-semibold text-ink">{card.ticker}</span>
              {typeof pct === 'number' && Number.isFinite(pct) && <Change value={pct} className="text-xs" />}
              {card.events.length > 1 && <span className="text-[11px] text-muted">+{card.events.length - 1} more</span>}
            </span>
            <span className="mt-1 block text-[15px] leading-snug text-ink/90">{e.why_matters || e.title}</span>
          </button>
          {balance && (balance.support || balance.concern) ? <BalancePill b={balance} /> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {e.source_url ? (
            <a
              href={e.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={(ev) => ev.stopPropagation()}
              className="inline-flex min-h-[28px] max-w-full items-center gap-1 rounded-full bg-accent/10 px-2 text-[11px] font-semibold text-accent hover:bg-accent/15"
            >
              <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="truncate">{e.source_name || 'Source'}</span>
              {e.published_at ? <span className="font-medium text-accent/80">· {relativeTime(e.published_at)}</span> : null}
              <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
            </a>
          ) : (
            <span />
          )}
          <span className="flex gap-1 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button type="button" onClick={onLater} className="inline-flex min-h-[36px] items-center gap-1 rounded-control px-2.5 text-xs font-semibold text-muted hover:bg-ink/[0.06] hover:text-ink">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Later
            </button>
            <button type="button" onClick={onRead} className="inline-flex min-h-[36px] items-center gap-1 rounded-control px-2.5 text-xs font-semibold text-accent hover:bg-accent/10">
              <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Mark read
            </button>
          </span>
        </div>
      </motion.div>
    </motion.li>
  );
}

function PickThree({ onDone, freeLimit }: { onDone: () => void; freeLimit: number }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<{ s: string; n: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query.trim().toUpperCase();
    if (q.length < 2) {
      setMatches([]);
      return;
    }
    let alive = true;
    loadSymbols()
      .then((list) => {
        if (!alive) return;
        const ql = q.toLowerCase();
        setMatches(list.filter((x) => x.s.startsWith(q) || x.nl.includes(ql)).slice(0, 5));
      })
      .catch(() => setMatches([]));
    return () => {
      alive = false;
    };
  }, [query]);

  const toggle = (t: string) => {
    haptic();
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : p.length >= Math.min(3, freeLimit) ? p : [...p, t]));
  };

  const save = useCallback(async () => {
    setSaving(true);
    try {
      for (const t of picked) await addToWatchlist(t, t);
      toast.success(`Following ${picked.join(', ')}. Reading their latest news now.`);
      onDone();
    } catch {
      toast.error('Could not add those stocks. Please try again.');
      setSaving(false);
    }
  }, [picked, onDone]);

  return (
    <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">Pick 3 companies you own or watch</h2>
      <p className="mt-1 text-sm text-muted">We'll read their filings and news every morning and show you only what changed.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {POPULAR.map((t) => {
          const on = picked.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={on}
              className={`num inline-flex min-h-[40px] items-center gap-1 rounded-full border px-3 text-xs font-semibold transition active:scale-[0.97] ${
                on ? 'border-cobalt bg-cobalt text-white' : 'border-line text-ink hover:border-accent/50 hover:text-accent'
              }`}
            >
              {on ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
              {t}
            </button>
          );
        })}
      </div>
      <div className="relative mt-3">
        <label htmlFor="pick3-search" className="sr-only">
          Search another company
        </label>
        <input
          id="pick3-search"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Or search another company"
          className="h-11 w-full rounded-control border border-line bg-canvas px-3 text-[15px] text-ink placeholder:text-muted focus:border-cobalt focus:outline-none"
        />
        {matches.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-card border border-line bg-surface shadow-lift">
            {matches.map((m) => (
              <li key={m.s}>
                <button
                  type="button"
                  onClick={() => {
                    toggle(m.s);
                    setQuery('');
                  }}
                  className="flex min-h-[44px] w-full items-center justify-between gap-3 px-3 text-left hover:bg-accent/10"
                >
                  <span className="num text-sm font-semibold text-ink">{m.s}</span>
                  <span className="truncate text-xs text-muted">{m.n}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="num text-sm text-muted">{picked.length} of 3 picked</span>
        <button
          type="button"
          disabled={picked.length < 1 || saving}
          onClick={save}
          className="inline-flex h-11 items-center rounded-control bg-cobalt px-4 text-[15px] font-semibold text-white transition active:scale-[0.97] disabled:opacity-50"
        >
          {saving ? 'Adding…' : picked.length >= 3 ? 'Show me what changed' : 'Follow these'}
        </button>
      </div>
    </div>
  );
}

export default function WhatChanged({
  uid,
  watchCount,
  watchLoaded,
  prices,
  balances,
  freeLimit,
  onOpen,
  onWatchlistChange,
  onNewCount,
}: {
  uid: string;
  watchCount: number;
  watchLoaded: boolean;
  prices: Record<string, number>;
  balances: Record<string, Balance>;
  freeLimit: number;
  onOpen: (ticker: string) => void;
  onWatchlistChange: () => void;
  onNewCount?: (n: number) => void;
}) {
  const since = useMemo(() => sinceForSession(uid), [uid]);
  const [events, setEvents] = useState<Ev[] | null>(null);
  const [read, setRead] = useState<Record<string, number>>(() => store.get(`bp_read:${uid}`, {}));
  const [snoozed, setSnoozed] = useState<Record<string, number>>(() => store.get(`bp_snooze:${uid}`, {}));
  const [readThisVisit, setReadThisVisit] = useState(0);

  const load = useCallback((refresh = false) => {
    setEvents(null);
    getEventRadar(refresh)
      .then((r) => setEvents(r.data?.events || []))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (watchLoaded && watchCount > 0) load();
  }, [watchLoaded, watchCount, load]);

  const cards: Card[] = useMemo(() => {
    if (!events) return [];
    const now = Date.now();
    const byTicker = new Map<string, Ev[]>();
    for (const e of events) {
      const t = new Date(e.published_at || 0).getTime();
      if (!e.ticker || !(t > since) || read[e.id] || (snoozed[e.ticker] || 0) > now) continue;
      byTicker.set(e.ticker, [...(byTicker.get(e.ticker) || []), e]);
    }
    return Array.from(byTicker.entries())
      .map(([ticker, list]) => {
        const sorted = [...list].sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
        return { ticker, latest: sorted[0], events: sorted };
      })
      .sort((a, b) => new Date(b.latest.published_at || 0).getTime() - new Date(a.latest.published_at || 0).getTime());
  }, [events, since, read, snoozed]);

  useEffect(() => {
    if (events) onNewCount?.(cards.length + readThisVisit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const markRead = (card: Card) => {
    haptic();
    const next = { ...read };
    const cutoff = Date.now() - 7 * 86400000;
    Object.keys(next).forEach((k) => next[k] < cutoff && delete next[k]);
    card.events.forEach((e) => (next[e.id] = Date.now()));
    setRead(next);
    store.set(`bp_read:${uid}`, next);
    setReadThisVisit((n) => n + 1);
  };

  const later = (card: Card) => {
    haptic();
    const next = { ...snoozed, [card.ticker]: tomorrowMorningIST() };
    setSnoozed(next);
    store.set(`bp_snooze:${uid}`, next);
    toast(`${card.ticker} snoozed until tomorrow`);
  };

  if (!watchLoaded) return null;
  if (watchCount === 0)
    return (
      <div className="mb-4">
        <PickThree freeLimit={freeLimit} onDone={() => onWatchlistChange()} />
      </div>
    );

  return (
    <section aria-labelledby="changed-heading" className="mb-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 id="changed-heading" className="text-sm font-semibold text-ink">
          What changed for you
        </h2>
        {events && (cards.length > 0 || readThisVisit > 0) && (
          <span className="num text-xs text-muted">
            {cards.length} new · {readThisVisit} read
          </span>
        )}
      </div>
      {events === null ? (
        <div className="space-y-2" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-card border border-line bg-surface p-4">
              <span className="skeleton block h-4 w-24" />
              <span className="skeleton mt-2 block h-4 w-full" />
              <span className="skeleton mt-3 block h-6 w-32" />
            </div>
          ))}
          <p className="text-xs text-muted">Reading today's filings and news for your stocks…</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Check className="h-4 w-4 text-up" strokeWidth={2.5} aria-hidden="true" />
            You're up to date.
          </p>
          <p className="mt-1 text-sm text-muted">{nextUpdateLine()}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {cards.map((c) => (
              <ChangeCard
                key={c.ticker}
                card={c}
                pct={prices[c.ticker]}
                balance={balances[c.ticker]}
                onRead={() => markRead(c)}
                onLater={() => later(c)}
                onOpen={() => onOpen(c.ticker)}
              />
            ))}
          </AnimatePresence>
          <li className="list-none pt-1 text-center text-[11px] text-muted sm:hidden">Swipe right to mark read, left for later</li>
        </ul>
      )}
    </section>
  );
}
