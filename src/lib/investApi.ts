// src/lib/investApi.ts — Invest Explorer data access.
// Public endpoints use plain axios so a failed call never triggers the login redirect in lib/api.ts.
import axios from 'axios';
import { BASE } from './api';
import { supabase } from './supabase';
import {
  BUNDLED_OPTIONS,
  BUNDLED_RATES,
  CATEGORIES,
  InvestOption,
  InvestRate,
  LivePayload,
  RatesPayload,
  RateGroupStatus,
} from '../data/investCatalog';

const http = axios.create({ baseURL: BASE, timeout: 12000 });

export async function fetchOptions(): Promise<{ categories: Record<string, string>; options: InvestOption[] }> {
  const { data } = await http.get('/api/invest/options');
  return { categories: data.categories || CATEGORIES, options: data.options };
}

export async function fetchRates(): Promise<RatesPayload> {
  const { data } = await http.get('/api/invest/rates');
  return data;
}

export async function fetchLive(): Promise<LivePayload> {
  const { data } = await http.get('/api/invest/live');
  return data;
}

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export type QuizAnswers = Record<string, number>;

export async function fetchSavedProfile(): Promise<QuizAnswers | null> {
  const headers = await authHeader();
  if (!headers) return null;
  const { data } = await http.get('/api/invest/profile', { headers });
  return data.profile?.answers ?? null;
}

export async function saveProfile(answers: QuizAnswers): Promise<void> {
  const headers = await authHeader();
  if (!headers) return;
  await http.put('/api/invest/profile', { answers }, { headers });
}

// ── Offline fallback: same freshness rules as backend/invest_explorer.rate_status ──
const FD_STALE_DAYS = 45;

function todayIST(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function computeRateStatus(rows: InvestRate[], today = todayIST()): RatesPayload['status'] {
  const status: RatesPayload['status'] = {};
  const ss = rows.filter(r => r.kind === 'small_savings');
  if (ss.length) {
    const ends = ss.map(r => r.effective_to).filter(Boolean).sort() as string[];
    const end = ends[0];
    const stale = !!end && today > end;
    status.small_savings = {
      stale,
      effective_to: end ?? null,
      message: !end ? 'Validity date not set.' : stale
        ? `The quarter these rates cover ended on ${fmtDate(end)}. New rates are being confirmed.`
        : `Valid until ${fmtDate(end)}.`,
    } as RateGroupStatus;
  }
  const fd = rows.filter(r => r.kind === 'bank_fd');
  if (fd.length) {
    const oldest = fd.map(r => r.as_of).sort()[0];
    const age = Math.round((Date.parse(today) - Date.parse(oldest)) / 86400000);
    const stale = age > FD_STALE_DAYS;
    status.bank_fd = {
      stale,
      oldest_as_of: oldest,
      message: stale ? `Some FD rates were last checked ${age} days ago and may have changed.` : `Checked within the last ${Math.max(age, 0)} days.`,
    };
  }
  return status;
}

export function bundledRates(): RatesPayload {
  const rates = { small_savings: [], bank_fd: [], policy: [] } as RatesPayload['rates'];
  BUNDLED_RATES.forEach(r => rates[r.kind].push(r));
  Object.values(rates).forEach(list => list.sort((a, b) => b.rate - a.rate));
  return { rates, status: computeRateStatus(BUNDLED_RATES), source: 'bundled' };
}

export const bundledCatalog = { categories: CATEGORIES, options: BUNDLED_OPTIONS };
