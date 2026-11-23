// src/components/invest/goals.ts
// Goal-first entry to Invest Explorer. Each goal narrows 35 options to three worth a look,
// with one factual reason each. Not a ranking or a recommendation.
import type { LucideIcon } from 'lucide-react';
import { Armchair, CalendarClock, Coins, Receipt, Sprout, Umbrella } from 'lucide-react';
import type { ExploreFilters } from './ExploreTab';

export interface Goal {
  id: string;
  label: string;
  /** Finishes "Three options to look at for…" */
  forText: string;
  hint: string;
  icon: LucideIcon;
  /** One plain fact about this goal, shown above the short list. */
  note: string;
  picks: { id: string; why: string }[];
  /** Filters for "see every option for this goal". */
  filters: Partial<ExploreFilters>;
}

export const GOALS: Goal[] = [
  {
    id: 'emergency',
    label: 'Emergency fund',
    forText: 'an emergency fund',
    hint: 'Money you may need any day',
    icon: Umbrella,
    note: 'A common rule of thumb is three to six months of expenses, kept where you can withdraw it within a day.',
    picks: [
      { id: 'liquid', why: 'No lock-in; money usually reaches your bank the next working day.' },
      { id: 'sav', why: 'Instant access over UPI, insured up to ₹5 lakh per bank.' },
      { id: 'fd', why: 'Can be broken early for a small penalty; insured up to ₹5 lakh.' },
    ],
    filters: { maxRisk: 2, needs: ['liquid'] },
  },
  {
    id: 'soon',
    label: 'Goal in 1 to 3 years',
    forText: 'a goal 1 to 3 years away',
    hint: 'Car, wedding, fees, a trip',
    icon: CalendarClock,
    note: 'Money needed soon is usually kept out of shares, which can fall 20 to 30% in a single year.',
    picks: [
      { id: 'fd', why: 'Known amount on a known date; insured up to ₹5 lakh per bank.' },
      { id: 'sfbfd', why: 'Higher FD rates. Keeping under ₹5 lakh per bank stays within insurance.' },
      { id: 'debtmf', why: 'No lock-in and easy part-withdrawals; taxed at your slab like an FD.' },
    ],
    filters: { maxRisk: 2, horizon: 3 },
  },
  {
    id: 'income',
    label: 'Regular income',
    forText: 'regular income',
    hint: 'Monthly or quarterly payouts',
    icon: Coins,
    note: 'Payout schemes pay you interest on a schedule while your capital stays invested.',
    picks: [
      { id: 'scss', why: 'For people 60 and over. Government-backed, pays every quarter.' },
      { id: 'mis', why: 'Pays every month, government-backed, up to ₹9 lakh per person.' },
      { id: 'reit', why: 'Pays rent-like distributions; the unit price moves with the market.' },
    ],
    filters: { needs: ['income'] },
  },
  {
    id: 'tax',
    label: 'Save tax (80C)',
    forText: 'saving tax under 80C',
    hint: 'Old tax regime only',
    icon: Receipt,
    note: 'Section 80C only helps if you file under the old tax regime. The limit is ₹1.5 lakh a year across all 80C options.',
    picks: [
      { id: 'ppf', why: 'Interest and maturity are tax-free. Locked for 15 years.' },
      { id: 'elss', why: 'The shortest 80C lock-in, 3 years, but returns move with the market.' },
      { id: 'nps', why: 'An extra ₹50,000 deduction on top of 80C under section 80CCD(1B).' },
    ],
    filters: { needs: ['tax'] },
  },
  {
    id: 'grow',
    label: 'Grow wealth',
    forText: 'growing wealth',
    hint: 'Five or more years away',
    icon: Sprout,
    note: 'Over five years or more, shares have historically beaten FDs in India, with some years of losses along the way.',
    picks: [
      { id: 'index', why: "Owns India's 50 largest companies at a very low cost." },
      { id: 'hybrid', why: 'Mixes shares and bonds, so falls are usually smaller than pure equity.' },
      { id: 'goldetf', why: 'Often rises when shares fall, which steadies a portfolio.' },
    ],
    filters: { cats: ['equity', 'gold', 'global'], maxRisk: 4 },
  },
  {
    id: 'retire',
    label: 'Retirement',
    forText: 'retirement',
    hint: 'Fifteen or more years away',
    icon: Armchair,
    note: 'Retirement money can ride out market falls, and lock-ins stop it being spent early.',
    picks: [
      { id: 'nps', why: 'Low-cost, mixes equity and bonds, locked until 60.' },
      { id: 'epf', why: 'For salaried staff. VPF lets you add more at the same declared rate.' },
      { id: 'ppf', why: 'Tax-free, government-backed base that pairs with equity.' },
    ],
    filters: { cats: ['retire', 'govt', 'equity'] },
  },
];
