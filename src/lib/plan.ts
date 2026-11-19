// src/lib/plan.ts
// One shared source for plan and allowance, so the header, home and Evidence Board agree
// and the server is asked once. Call refreshPlan()/refreshAllowance() after anything that changes them.
import { useEffect, useState } from 'react';
import { api } from './api';
import { supabase } from './supabase';

export type PlanState = {
  loading: boolean;
  plan: 'free' | 'pro';
  isPro: boolean;
  validUntil: string | null;
  daysLeft: number | null;
  /** Pro ran out; the server just moved the account back to free. */
  expired: boolean;
};
export type Allowance = { freeLeft: number | null; perDay: number; bonus: number } | null;

let plan: PlanState = { loading: true, plan: 'free', isPro: false, validUntil: null, daysLeft: null, expired: false };
let allowance: Allowance = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
let planReq: Promise<void> | null = null;
let allowReq: Promise<void> | null = null;

async function signedIn() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export function refreshPlan() {
  planReq = (async () => {
    if (!(await signedIn())) {
      plan = { ...plan, loading: false };
      return emit();
    }
    try {
      const r = await api.get('/api/payment/status');
      const d = r.data || {};
      const isPro = d.plan === 'pro';
      plan = { loading: false, plan: isPro ? 'pro' : 'free', isPro, validUntil: d.valid_until || null, daysLeft: typeof d.days_left === 'number' ? d.days_left : null, expired: !!d.expired };
    } catch {
      plan = { ...plan, loading: false };
    }
    emit();
  })();
  return planReq;
}

export function refreshAllowance() {
  allowReq = (async () => {
    if (!(await signedIn())) return;
    try {
      const r = await api.get('/api/me/allowance');
      const d = r.data || {};
      allowance = d.is_pro ? null : { freeLeft: typeof d.free_left_today === 'number' ? d.free_left_today : null, perDay: d.free_per_day || 2, bonus: d.bonus || 0 };
    } catch {
      allowance = null;
    }
    emit();
  })();
  return allowReq;
}

function useStore<T>(read: () => T, kick: () => void, started: () => boolean) {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    subs.add(f);
    if (!started()) kick();
    return () => {
      subs.delete(f);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return read();
}

export const usePlanState = () => useStore(() => plan, refreshPlan, () => !!planReq);
export const useAllowance = () => useStore(() => allowance, refreshAllowance, () => !!allowReq);

// Sign-in or sign-out changes both.
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    allowance = null;
    refreshPlan();
    refreshAllowance();
  }
});
