import { useEffect, useRef, useState } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ── Public API data, fetched once per page view and shared between sections ──
type Entry = { promise: Promise<unknown>; data?: unknown };
const cache = new Map<string, Entry>();

export function fetchOnce<T>(path: string, timeoutMs = 15000): Promise<T> {
  const hit = cache.get(path);
  if (hit) return hit.promise as Promise<T>;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const entry: Entry = { promise: Promise.resolve() };
  entry.promise = fetch(BASE + path, { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      entry.data = data;
      return data;
    })
    .catch((error) => {
      cache.delete(path); // let a later visit retry
      throw error;
    })
    .finally(() => window.clearTimeout(timer));
  cache.set(path, entry);
  return entry.promise as Promise<T>;
}

export type LoadState<T> = { data: T | null; status: 'idle' | 'loading' | 'ready' | 'error' };

export function useApi<T>(path: string, enabled = true, timeoutMs?: number): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>(() => {
    const data = cache.get(path)?.data as T | undefined;
    return data ? { data, status: 'ready' } : { data: null, status: 'idle' };
  });
  const ready = state.status === 'ready';

  useEffect(() => {
    if (!enabled || ready) return;
    let alive = true;
    setState((s) => ({ ...s, status: 'loading' }));
    fetchOnce<T>(path, timeoutMs)
      .then((data) => alive && setState({ data, status: 'ready' }))
      .catch(() => alive && setState({ data: null, status: 'error' }));
    return () => {
      alive = false;
    };
  }, [path, enabled, ready, timeoutMs]);

  return state;
}

// ── Viewport helpers ──
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, inView]);

  return [ref, inView] as const;
}

export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches);

  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

// ── API shapes used on the landing page ──
export interface LiveQuote {
  price: number;
  previous_close: number;
  change_pct: number;
}
export interface InvestLive {
  prices: Record<string, LiveQuote>;
  usd_inr: LiveQuote | null;
  fetched_at: string;
}
export interface InvestRate {
  key: string;
  label: string;
  rate: number;
  tenure?: string | null;
  institution_type?: string | null;
}
export interface InvestRates {
  rates: { small_savings?: InvestRate[]; bank_fd?: InvestRate[]; policy?: InvestRate[] };
  status?: { small_savings?: { stale: boolean; message: string }; bank_fd?: { stale: boolean; message: string } };
}
export interface TopStock {
  display_ticker: string;
  company_name: string;
  sector?: string;
  current_price: number;
  price_change_pct: number;
  pe_ratio?: number | null;
  week52_high?: number | null;
  week52_low?: number | null;
  dividend_yield_pct?: number | null;
}
export interface TopStocks {
  stocks: TopStock[];
  fetched_at?: string;
}
export interface MarketWrap {
  date: string;
  title: string;
}
export interface Ipo {
  id: string;
  company_name: string;
  category?: string;
  status?: string;
  price_band?: string;
  open_date?: string;
  close_date?: string;
}

// ── Formatting ──
export const fmtINR = (v: number, digits = 2) =>
  `₹${v.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const fmtPct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;

export const fmtRate = (v: number) => `${v.toFixed(2)}%`;

export const fmtTimeIST = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });

export const fmtDay = (isoDate: string) =>
  new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const changeClass = (v: number) =>
  v >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';

// Open IPOs first, then upcoming by opening date.
export function pickIpos(ipos: Ipo[]) {
  const open = ipos.filter((i) => /open/i.test(i.status || ''));
  const upcoming = ipos
    .filter((i) => /upcoming/i.test(i.status || ''))
    .sort((a, b) => (a.open_date || '').localeCompare(b.open_date || ''));
  return { open, upcoming };
}
