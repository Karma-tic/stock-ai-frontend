// src/lib/usePlan.ts
// Kept for existing callers; reads the shared plan store in ./plan.
import { usePlanState } from './plan';

export function usePlan() {
  const p = usePlanState();
  return { plan: p.plan, isPro: p.isPro, loading: p.loading, daysLeft: p.daysLeft, expired: p.expired, validUntil: p.validUntil };
}
