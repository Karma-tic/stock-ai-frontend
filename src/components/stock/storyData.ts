import { useEffect, useState } from 'react';
import { getStock, getStockStory } from '../../lib/api';

export type Evidence = {
  title: string;
  summary?: string;
  category?: string;
  severity?: string;
  source_name: string;
  source_url: string;
  published_at?: string;
  why_matters?: string;
  verified?: boolean;
};

export type Story = {
  ticker?: string;
  company_name?: string;
  price_context: { current_price?: number; day_change_pct?: number; position_in_52w?: number; week52_high?: number; week52_low?: number };
  trend?: { status: string; returns_pct?: Record<string, number | null>; drawdown_from_52w_high_pct?: number | null; source_name?: string; source_url?: string; latest_date?: string };
  earnings: { period?: string | null; metrics: { label: string; change_pct: number; basis: string }[] };
  evidence: { support: Evidence[]; challenge: Evidence[]; watch: Evidence[] };
  watch_next: string[];
  disclaimer: string;
  generated_at?: string;
};

export type Quote = {
  display_ticker?: string;
  company_name?: string;
  sector?: string;
  industry?: string;
  current_price?: number;
  price_change_pct?: number;
  pe_ratio?: number | null;
  pb_ratio?: number | null;
  dividend_yield_pct?: number | null;
  market_cap_cr?: number | null;
  week52_high?: number | null;
  week52_low?: number | null;
  day_high?: number | null;
  day_low?: number | null;
  error?: string;
};

// Loads the public quote and the source-linked story for one ticker.
export function useStockData(ticker: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [status, setStatus] = useState<{ quote: 'loading' | 'ready' | 'error'; story: 'loading' | 'ready' | 'error' }>({ quote: 'loading', story: 'loading' });

  useEffect(() => {
    let alive = true;
    setQuote(null);
    setStory(null);
    setStatus({ quote: 'loading', story: 'loading' });
    getStock(ticker)
      .then((r) => alive && (setQuote(r.data), setStatus((s) => ({ ...s, quote: r.data?.error ? 'error' : 'ready' }))))
      .catch(() => alive && setStatus((s) => ({ ...s, quote: 'error' })));
    getStockStory(ticker)
      .then((r) => alive && (setStory(r.data), setStatus((s) => ({ ...s, story: 'ready' }))))
      .catch(() => alive && setStatus((s) => ({ ...s, story: 'error' })));
    return () => {
      alive = false;
    };
  }, [ticker]);

  return { quote, story, status };
}

// The latest developments across all evidence buckets, newest first, without duplicates.
export function latestEvents(story: Story | null, n = 3): Evidence[] {
  if (!story) return [];
  const all = [...story.evidence.support, ...story.evidence.challenge, ...story.evidence.watch];
  const seen = new Set<string>();
  return all
    .filter((e) => {
      const k = `${e.source_url}|${e.title}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
    .slice(0, n);
}

export function allSources(story: Story | null): Evidence[] {
  return latestEvents(story, 50);
}

export const isFiling = (e: Evidence) => /nse|bse|exchange/i.test(e.source_name || '');

export function shortDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const fmtCr = (v?: number | null) =>
  v == null ? 'n/a' : v >= 100000 ? `₹${(v / 100000).toFixed(2)} lakh cr` : `₹${Math.round(v).toLocaleString('en-IN')} cr`;
