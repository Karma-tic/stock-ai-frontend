// src/components/ipos/ipoData.ts
// The IPO record as /api/market/ipos returns it, plus small date helpers (IST).
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE } from '../../lib/api';

export type IpoStage = 'open' | 'upcoming' | 'closed' | 'listed';

export interface Ipo {
  id: string;
  company_name: string;
  category?: 'SME' | 'Mainboard' | string;
  exchange?: string | null;
  stage: IpoStage;
  status?: string;
  price_band?: string;
  issue_price?: number | null;
  lot_size?: string;
  min_investment?: number | null;
  issue_size?: string;
  gmp?: string;
  gmp_known?: boolean;
  gmp_value?: number | null;
  gmp_percent?: number | null;
  gmp_low?: number | null;
  gmp_high?: number | null;
  gmp_at_listing?: number | null;
  subscription?: string;
  subscription_times?: number | null;
  pe_ratio?: string;
  anchor_available?: boolean;
  open_date?: string;
  close_date?: string;
  allotment_date?: string;
  listing_date?: string;
  listing_price?: number | null;
  listing_gain_percent?: number | null;
  source?: string;
  source_url?: string;
  source_updated_at?: string;
  brief?: { favour: string[]; check: string[] };
}

const CACHE_KEY = 'byteplay:ipos:v2';
const TTL = 5 * 60 * 1000;

export function useIpos() {
  const [state, setState] = useState<{ ipos: Ipo[]; loading: boolean; error: string }>(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (Array.isArray(c?.data)) return { ipos: c.data, loading: false, error: '' };
    } catch {}
    return { ipos: [], loading: true, error: '' };
  });

  useEffect(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.cachedAt < TTL) return;
    } catch {}
    axios
      .get(`${BASE}/api/market/ipos`)
      .then((r) => {
        if (r.data.status === 'success' && Array.isArray(r.data.ipos)) {
          setState({ ipos: r.data.ipos, loading: false, error: '' });
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: r.data.ipos, cachedAt: Date.now() }));
          } catch {}
        } else setState((s) => ({ ...s, loading: false, error: s.ipos.length ? '' : 'IPO data is temporarily unavailable.' }));
      })
      .catch(() => setState((s) => ({ ...s, loading: false, error: s.ipos.length ? '' : 'IPO data is temporarily unavailable.' })));
  }, []);

  return state;
}

/** Today in India as YYYY-MM-DD. */
export function todayIST(): string {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

export const isISODate = (v?: string | null): v is string => !!v && /^\d{4}-\d{2}-\d{2}/.test(v);

/** Whole days from today (IST) to an ISO date; null if not a date. */
export function daysFromToday(v?: string | null): number | null {
  if (!isISODate(v)) return null;
  return Math.round((Date.parse(v.slice(0, 10)) - Date.parse(todayIST())) / 86400000);
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'Mon 23 Nov' */
export function dayLabel(v?: string | null): string {
  if (!isISODate(v)) return v || 'TBA';
  const d = new Date(`${v.slice(0, 10)}T00:00:00Z`);
  return `${WEEKDAY[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH[d.getUTCMonth()]}`;
}

/** 'today', 'tomorrow', 'in 3 days', 'on Mon 23 Nov' */
export function relDay(v?: string | null): string {
  const n = daysFromToday(v);
  if (n == null) return v || 'TBA';
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  if (n > 1 && n <= 6) return `in ${n} days`;
  return `on ${dayLabel(v)}`;
}

/** ₹ with Indian grouping: 1,47,000 */
export const inr = (n?: number | null) =>
  n == null ? 'TBA' : `₹${Math.round(n).toLocaleString('en-IN')}`;

export const known = (v?: string | null) => (v && !/^\s*(-|–|tba|tbd|n\/?a)?\s*$/i.test(v) ? v : null);

/** One sentence on where an IPO is in its life. */
export function stageLine(ipo: Ipo): string {
  if (ipo.stage === 'open') return `Open now · bidding closes ${relDay(ipo.close_date)}`;
  if (ipo.stage === 'upcoming') return `Opens ${relDay(ipo.open_date)}`;
  if (ipo.stage === 'closed') {
    const a = daysFromToday(ipo.allotment_date);
    return a != null && a >= 0 ? `Bidding closed · allotment ${relDay(ipo.allotment_date)}` : `Bidding closed · lists ${relDay(ipo.listing_date)}`;
  }
  return `Listed ${dayLabel(ipo.listing_date)}`;
}
