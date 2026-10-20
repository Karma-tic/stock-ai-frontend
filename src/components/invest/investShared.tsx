// src/components/invest/investShared.tsx — helpers shared by the Invest Explorer tabs.
import { InvestOption, LiveQuote, RiskLevel } from '../../data/investCatalog';

export const RISK_NAME: Record<RiskLevel, string> = { 1: 'Very low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Very high' };

// Tailwind classes per risk level (full strings so Tailwind's scanner keeps them).
export const RISK_TEXT: Record<RiskLevel, string> = {
  1: 'text-up dark:text-up',
  2: 'text-up dark:text-up',
  3: 'text-caution dark:text-caution',
  4: 'text-caution dark:text-caution',
  5: 'text-down dark:text-down',
};
export const RISK_BAR: Record<RiskLevel, string> = {
  1: 'bg-up/15', 2: 'bg-up/15', 3: 'bg-caution/15', 4: 'bg-caution/15', 5: 'bg-down/15',
};

export function RiskMeter({ risk }: { risk: RiskLevel }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Risk ${risk} of 5, ${RISK_NAME[risk]}`}>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={`h-1.5 w-4 rounded-sm ${i <= risk ? RISK_BAR[risk] : 'bg-lavender-text/10'}`} />
        ))}
      </span>
      <span className={`text-xs font-semibold ${RISK_TEXT[risk]}`}>{RISK_NAME[risk]} risk</span>
    </span>
  );
}

export const fmtReturn = (o: InvestOption) =>
  o.return_label ?? (o.return_low === o.return_high ? `${o.return_low}%` : `${o.return_low}–${o.return_high}%`);

export const midReturn = (o: InvestOption) => (o.return_low < 0 ? 12 : Math.round(((o.return_low + o.return_high) / 2) * 10) / 10);

export const inr = (v: number) =>
  v >= 1e7 ? `₹${(v / 1e7).toFixed(2)} Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(2)} L` : `₹${Math.round(v).toLocaleString('en-IN')}`;

export const fmtPrice = (v: number) => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

export function LiveTag({ symbol, quote }: { symbol: string; quote?: LiveQuote }) {
  if (!quote) return null;
  const up = quote.change_pct >= 0;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-lavender-text/70 tabular-nums">
      <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-up/15 opacity-60 animate-ping motion-reduce:hidden" /><span className="relative inline-flex h-2 w-2 rounded-full bg-up" /></span>
      {symbol} {fmtPrice(quote.price)}
      <span className={up ? 'text-up dark:text-up' : 'text-down dark:text-down'}>
        {up ? '+' : ''}{quote.change_pct.toFixed(2)}%
      </span>
    </span>
  );
}

// Future value: lump sum compounded yearly + monthly SIP at the equivalent monthly rate, paid at month start.
export function futureValue(lump: number, sip: number, ratePct: number, years: number) {
  const i = Math.pow(1 + ratePct / 100, 1 / 12) - 1;
  const m = years * 12;
  const l = lump * Math.pow(1 + ratePct / 100, years);
  const s = i === 0 ? sip * m : sip * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
  return l + s;
}

// ── Risk profile ────────────────────────────────────────────────────────────
export const QUIZ: { key: string; q: string; a: [string, number][] }[] = [
  { key: 'age', q: 'Your age', a: [['Under 30', 3], ['30–45', 2], ['45–60', 1], ['60+', 0]] },
  { key: 'hz', q: 'When will you need most of this money?', a: [['Within 1 year', 0], ['1–3 years', 1], ['3–7 years', 2], ['7+ years', 3]] },
  { key: 'fall', q: 'Your portfolio drops 25% in a year. You would…', a: [['Sell everything', 0], ['Sell some', 1], ['Hold and wait', 2], ['Buy more', 3]] },
  { key: 'inc', q: 'How steady is your income?', a: [['Irregular / none', 0], ['Somewhat steady', 1], ['Very stable salary', 2], ['Multiple sources', 3]] },
  { key: 'exp', q: 'Your investing experience', a: [['Only FDs / savings', 0], ['Some mutual funds', 1], ['Stocks & funds for years', 2], ['Active investor', 3]] },
];

export type ProfileKey = 'conservative' | 'moderate' | 'aggressive';
export interface Profile { key: ProfileKey; name: string; score: number; maxRisk: RiskLevel; text: string; mix: [string, number, string][] }

const PROFILES: Record<ProfileKey, Omit<Profile, 'key' | 'score'>> = {
  conservative: {
    name: 'Conservative', maxRisk: 2,
    text: 'Protecting capital matters more than growth. Government schemes and FDs form the base, with a small equity slice so inflation does not erode savings.',
    mix: [['Fixed income & govt schemes', 70, 'bg-up/15'], ['Equity', 15, 'bg-lavender-primary'], ['Gold', 10, 'bg-caution/15'], ['Cash', 5, 'bg-lavender-text/40']],
  },
  moderate: {
    name: 'Moderate', maxRisk: 3,
    text: 'You accept some ups and downs for better growth. Hybrid and index funds for growth, with government schemes and FDs as the stable base.',
    mix: [['Fixed income & govt schemes', 45, 'bg-up/15'], ['Equity', 40, 'bg-lavender-primary'], ['Gold', 10, 'bg-caution/15'], ['Cash', 5, 'bg-lavender-text/40']],
  },
  aggressive: {
    name: 'Growth-seeking', maxRisk: 5,
    text: 'Long horizon and a strong stomach for swings. Index and flexi-cap funds at the core, global funds for diversification, a small safe base.',
    mix: [['Fixed income', 20, 'bg-up/15'], ['Indian equity', 55, 'bg-lavender-primary'], ['Global equity', 15, 'bg-cobalt'], ['Gold', 10, 'bg-caution/15']],
  },
};

// Same bands as backend/invest_explorer.score_profile
export function scoreProfile(answers: Record<string, number>): Profile | null {
  if (QUIZ.some(q => answers[q.key] === undefined)) return null;
  const score = QUIZ.reduce((s, q) => s + answers[q.key], 0);
  const key: ProfileKey = score <= 5 ? 'conservative' : score <= 10 ? 'moderate' : 'aggressive';
  return { key, score, ...PROFILES[key] };
}

export function fitScore(o: InvestOption, p: Profile | null) {
  if (!p) return 0;
  let s = o.risk <= p.maxRisk ? 3 : 0;
  s -= Math.max(0, o.risk - p.maxRisk) * 2;
  if (p.key === 'conservative' && o.tags.includes('safe')) s += 2;
  if (p.key === 'moderate' && (o.risk === 2 || o.risk === 3)) s += 2;
  if (p.key === 'aggressive' && o.tags.includes('growth')) s += 2;
  if (o.tags.includes('warning')) s -= 5;
  return s;
}
export const matchesProfile = (o: InvestOption, p: Profile | null) => !!p && fitScore(o, p) >= 4;

export function safeStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function saveStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}
