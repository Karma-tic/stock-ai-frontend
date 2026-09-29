// src/data/investCatalog.ts
// Types for Invest Explorer plus a built-in copy of the catalog and rates.
// The page renders from this copy instantly, then swaps in /api/invest/* data.
// Generated from backend/invest_seed.json (29 Sep 2026) — regenerate when the seed changes.

export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export interface InvestOption {
  id: string;
  name: string;
  category: string;
  return_low: number;
  return_high: number;
  return_label: string | null;
  risk: RiskLevel;
  liquidity: string;
  lock_in: string;
  minimum: string;
  min_horizon_years: number;
  tax: string;
  best_for: string;
  pros: string[];
  risks: string[];
  how_to_invest: string;
  tags: string[];
  live_symbol: string | null;
  sort_order: number;
}

export type RateKind = 'small_savings' | 'bank_fd' | 'policy';

export interface InvestRate {
  kind: RateKind;
  key: string;
  label: string;
  tenure: string | null;
  rate: number;
  institution_type: string | null;
  source_name: string;
  source_url: string | null;
  effective_from: string | null;
  effective_to: string | null;
  as_of: string;
}

export interface RateGroupStatus {
  stale: boolean;
  message: string;
  effective_to?: string | null;
  oldest_as_of?: string;
}

export interface RatesPayload {
  rates: Record<RateKind, InvestRate[]>;
  status: Partial<Record<'small_savings' | 'bank_fd', RateGroupStatus>>;
  source: 'db' | 'seed' | 'bundled';
}

export interface LiveQuote { price: number; previous_close: number; change_pct: number }
export interface LivePayload { prices: Record<string, LiveQuote>; usd_inr: LiveQuote | null; fetched_at: string }

export const CATEGORIES: Record<string, string> = {
  "bank": "Bank deposits",
  "govt": "Govt schemes",
  "debt": "Bonds & debt",
  "equity": "Equity & funds",
  "gold": "Gold & silver",
  "real": "Real estate",
  "retire": "Retirement",
  "global": "Global",
  "alt": "High-risk / alternative"
};

export const NEEDS: Record<string, string> = {
  "safe": "Capital safety",
  "liquid": "Easy exit",
  "income": "Regular income",
  "tax": "Tax saving",
  "growth": "Long-term growth",
  "global": "Global"
};

export const BUNDLED_OPTIONS: InvestOption[] = [
  {
    "id": "sav",
    "name": "Savings account",
    "category": "bank",
    "return_low": 2.5,
    "return_high": 4,
    "return_label": null,
    "risk": 1,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹0–10k",
    "min_horizon_years": 0,
    "tax": "Interest taxed at slab; ₹10k deduction (80TTA, old regime)",
    "best_for": "Emergency cash you may need tomorrow",
    "pros": [
      "Instant access, UPI-ready",
      "DICGC insured to ₹5 lakh"
    ],
    "risks": [
      "Returns usually below inflation, so real value shrinks",
      "Idle balance above needs is a lost opportunity"
    ],
    "how_to_invest": "Any bank. Some small-finance banks pay 6–7% on higher balances.",
    "tags": [
      "safe",
      "liquid"
    ],
    "live_symbol": null,
    "sort_order": 10
  },
  {
    "id": "fd",
    "name": "Bank fixed deposit (large banks)",
    "category": "bank",
    "return_low": 6,
    "return_high": 6.6,
    "return_label": null,
    "risk": 1,
    "liquidity": "Medium",
    "lock_in": "7 days–10 yrs",
    "minimum": "₹1,000",
    "min_horizon_years": 0,
    "tax": "Interest taxed at slab; TDS above ₹50k/yr (₹1 lakh seniors)",
    "best_for": "Known amount needed on a known date",
    "pros": [
      "Guaranteed rate for the term",
      "Insured to ₹5 lakh per bank",
      "Seniors get ~0.5% extra"
    ],
    "risks": [
      "After tax, real return can be close to zero",
      "Premature withdrawal penalty (usually 0.5–1%)",
      "Reinvestment risk: rates may be lower at renewal"
    ],
    "how_to_invest": "SBI, HDFC, ICICI, PNB, Axis. Peak rates sit on special tenures such as 444 days.",
    "tags": [
      "safe",
      "income"
    ],
    "live_symbol": null,
    "sort_order": 20
  },
  {
    "id": "sfbfd",
    "name": "Small finance bank FD",
    "category": "bank",
    "return_low": 7.2,
    "return_high": 8.25,
    "return_label": null,
    "risk": 2,
    "liquidity": "Medium",
    "lock_in": "7 days–10 yrs",
    "minimum": "₹1,000",
    "min_horizon_years": 1,
    "tax": "Interest taxed at slab",
    "best_for": "Higher FD rate, kept under ₹5 lakh per bank",
    "pros": [
      "Highest bank FD rates in India",
      "Same DICGC insurance as big banks"
    ],
    "risks": [
      "Smaller, less diversified banks",
      "Stay within ₹5 lakh per bank to remain fully insured"
    ],
    "how_to_invest": "Suryoday, Unity, Utkarsh, Jana, ESAF etc., directly or via FD apps.",
    "tags": [
      "income"
    ],
    "live_symbol": null,
    "sort_order": 30
  },
  {
    "id": "corpfd",
    "name": "Corporate / NBFC deposit",
    "category": "debt",
    "return_low": 7.2,
    "return_high": 8.8,
    "return_label": null,
    "risk": 3,
    "liquidity": "Low",
    "lock_in": "1–5 yrs",
    "minimum": "₹5,000–25,000",
    "min_horizon_years": 1,
    "tax": "Interest taxed at slab",
    "best_for": "Extra yield from AAA-rated issuers only",
    "pros": [
      "1–2% above bank FDs",
      "Monthly/quarterly payout options"
    ],
    "risks": [
      "No deposit insurance",
      "Credit risk: NBFC defaults have happened (DHFL, IL&FS)",
      "Hard to exit early"
    ],
    "how_to_invest": "Bajaj Finance, Shriram Finance, Mahindra Finance etc. Check CRISIL/ICRA rating.",
    "tags": [
      "income"
    ],
    "live_symbol": null,
    "sort_order": 40
  },
  {
    "id": "ppf",
    "name": "Public Provident Fund (PPF)",
    "category": "govt",
    "return_low": 7.1,
    "return_high": 7.1,
    "return_label": null,
    "risk": 1,
    "liquidity": "Locked",
    "lock_in": "15 yrs (partial from yr 7)",
    "minimum": "₹500/yr, max ₹1.5 lakh",
    "min_horizon_years": 15,
    "tax": "EEE: deposit (old regime 80C), interest and maturity all tax-free",
    "best_for": "Long-term, fully tax-free safe money",
    "pros": [
      "Sovereign guarantee",
      "Completely tax-free",
      "Loan and partial withdrawal allowed"
    ],
    "risks": [
      "Long lock-in",
      "Rate is revised quarterly and can fall",
      "₹1.5 lakh annual cap"
    ],
    "how_to_invest": "Post office or any major bank, online via net banking.",
    "tags": [
      "safe",
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 50
  },
  {
    "id": "ssy",
    "name": "Sukanya Samriddhi Yojana",
    "category": "govt",
    "return_low": 8.2,
    "return_high": 8.2,
    "return_label": null,
    "risk": 1,
    "liquidity": "Locked",
    "lock_in": "Till daughter turns 21",
    "minimum": "₹250/yr, max ₹1.5 lakh",
    "min_horizon_years": 15,
    "tax": "EEE (80C in old regime)",
    "best_for": "Parents of a girl child under 10",
    "pros": [
      "Highest small-savings rate",
      "Sovereign guarantee, tax-free"
    ],
    "risks": [
      "Only for girl child under 10",
      "Money locked till 18 (education) / 21"
    ],
    "how_to_invest": "Post office or authorised banks with daughter's birth certificate.",
    "tags": [
      "safe",
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 60
  },
  {
    "id": "scss",
    "name": "Senior Citizen Savings Scheme",
    "category": "govt",
    "return_low": 8.2,
    "return_high": 8.2,
    "return_label": null,
    "risk": 1,
    "liquidity": "Low",
    "lock_in": "5 yrs (+3 extension)",
    "minimum": "₹1,000, max ₹30 lakh",
    "min_horizon_years": 5,
    "tax": "Interest taxed at slab; deposit under 80C (old regime)",
    "best_for": "60+ needing steady quarterly income",
    "pros": [
      "Rate locked for 5 years at opening",
      "Quarterly payout",
      "Sovereign guarantee"
    ],
    "risks": [
      "Only for 60+ (55+ for some retirees)",
      "Interest is taxable",
      "Early closure penalty"
    ],
    "how_to_invest": "Post office or authorised banks.",
    "tags": [
      "safe",
      "income"
    ],
    "live_symbol": null,
    "sort_order": 70
  },
  {
    "id": "nsc",
    "name": "National Savings Certificate",
    "category": "govt",
    "return_low": 7.7,
    "return_high": 7.7,
    "return_label": null,
    "risk": 1,
    "liquidity": "Locked",
    "lock_in": "5 yrs",
    "minimum": "₹1,000",
    "min_horizon_years": 5,
    "tax": "80C (old regime); interest taxable at maturity",
    "best_for": "5-year safe savings with 80C benefit",
    "pros": [
      "Rate locked at purchase",
      "Can be pledged for loans"
    ],
    "risks": [
      "No early exit except death/court order",
      "Interest taxable"
    ],
    "how_to_invest": "Post office, online via IPPB / net banking.",
    "tags": [
      "safe",
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 80
  },
  {
    "id": "kvp",
    "name": "Kisan Vikas Patra",
    "category": "govt",
    "return_low": 7.5,
    "return_high": 7.5,
    "return_label": null,
    "risk": 1,
    "liquidity": "Low",
    "lock_in": "115 months (exit after 2.5 yrs)",
    "minimum": "₹1,000",
    "min_horizon_years": 5,
    "tax": "Interest taxable; no 80C",
    "best_for": "Money you want exactly doubled, safely",
    "pros": [
      "Doubles in 115 months",
      "Rate locked"
    ],
    "risks": [
      "No tax benefit",
      "Returns lag inflation after tax for high earners"
    ],
    "how_to_invest": "Post office and select banks.",
    "tags": [
      "safe"
    ],
    "live_symbol": null,
    "sort_order": 90
  },
  {
    "id": "mis",
    "name": "Post Office Monthly Income Scheme",
    "category": "govt",
    "return_low": 7.4,
    "return_high": 7.4,
    "return_label": null,
    "risk": 1,
    "liquidity": "Low",
    "lock_in": "5 yrs",
    "minimum": "₹1,000, max ₹9 lakh (₹15 lakh joint)",
    "min_horizon_years": 5,
    "tax": "Interest taxed at slab",
    "best_for": "Monthly income without market risk",
    "pros": [
      "Fixed monthly payout",
      "Rate locked"
    ],
    "risks": [
      "Taxable",
      "Penalty on exit before 3 years"
    ],
    "how_to_invest": "Any post office.",
    "tags": [
      "safe",
      "income"
    ],
    "live_symbol": null,
    "sort_order": 100
  },
  {
    "id": "potd",
    "name": "Post Office Time Deposit / RD",
    "category": "govt",
    "return_low": 6.7,
    "return_high": 7.5,
    "return_label": null,
    "risk": 1,
    "liquidity": "Medium",
    "lock_in": "1–5 yrs",
    "minimum": "₹100/month (RD), ₹1,000 (TD)",
    "min_horizon_years": 1,
    "tax": "Interest taxed; 5-yr TD qualifies for 80C",
    "best_for": "FD alternative with sovereign backing",
    "pros": [
      "Beats most big-bank FDs",
      "Full government guarantee"
    ],
    "risks": [
      "Taxable",
      "Branch-heavy process"
    ],
    "how_to_invest": "Post office; 5-yr TD 7.5%, 5-yr RD 6.7%.",
    "tags": [
      "safe"
    ],
    "live_symbol": null,
    "sort_order": 110
  },
  {
    "id": "frsb",
    "name": "RBI Floating Rate Savings Bond",
    "category": "govt",
    "return_low": 8.05,
    "return_high": 8.05,
    "return_label": null,
    "risk": 1,
    "liquidity": "Locked",
    "lock_in": "7 yrs",
    "minimum": "₹1,000",
    "min_horizon_years": 7,
    "tax": "Interest taxed at slab",
    "best_for": "Large safe sums with no upper cap",
    "pros": [
      "No investment ceiling",
      "Rate resets with NSC (+0.35%)"
    ],
    "risks": [
      "Rate can fall every 6 months",
      "Long lock-in, not tradable"
    ],
    "how_to_invest": "SBI and major banks, or RBI Retail Direct.",
    "tags": [
      "safe",
      "income"
    ],
    "live_symbol": null,
    "sort_order": 120
  },
  {
    "id": "gsec",
    "name": "Govt securities & T-bills",
    "category": "debt",
    "return_low": 5.4,
    "return_high": 7,
    "return_label": null,
    "risk": 1,
    "liquidity": "Medium",
    "lock_in": "91 days–40 yrs",
    "minimum": "₹10,000",
    "min_horizon_years": 0,
    "tax": "Interest taxed at slab",
    "best_for": "Direct sovereign debt, any tenure",
    "pros": [
      "Zero credit risk",
      "Tradable, choose exact maturity"
    ],
    "risks": [
      "Price falls if rates rise (if sold early)",
      "Thin retail liquidity"
    ],
    "how_to_invest": "RBI Retail Direct portal (free) or broker apps.",
    "tags": [
      "safe"
    ],
    "live_symbol": null,
    "sort_order": 130
  },
  {
    "id": "bonds",
    "name": "Listed corporate bonds",
    "category": "debt",
    "return_low": 8,
    "return_high": 12,
    "return_label": null,
    "risk": 3,
    "liquidity": "Low",
    "lock_in": "1–10 yrs",
    "minimum": "₹1,000–10,000",
    "min_horizon_years": 2,
    "tax": "Interest taxed at slab",
    "best_for": "Higher fixed income, for those who can read a rating",
    "pros": [
      "Fixed coupon, monthly payouts possible",
      "SEBI-regulated online bond platforms"
    ],
    "risks": [
      "Default risk rises sharply below AA",
      "Low liquidity; may not find a buyer",
      "High yields usually mean higher risk"
    ],
    "how_to_invest": "SEBI-registered OBPPs such as Wint Wealth, GoldenPi, IndiaBonds, Grip.",
    "tags": [
      "income"
    ],
    "live_symbol": null,
    "sort_order": 140
  },
  {
    "id": "liquid",
    "name": "Liquid & overnight funds",
    "category": "debt",
    "return_low": 5.5,
    "return_high": 6.5,
    "return_label": null,
    "risk": 1,
    "liquidity": "High",
    "lock_in": "None (T+1)",
    "minimum": "₹100–500",
    "min_horizon_years": 0,
    "tax": "Gains taxed at slab",
    "best_for": "Parking cash for days to months",
    "pros": [
      "Better than savings account",
      "Money back next working day"
    ],
    "risks": [
      "Not guaranteed, though losses are rare",
      "Taxed like FD interest"
    ],
    "how_to_invest": "Any AMC or app (Groww, Zerodha Coin, Kuvera).",
    "tags": [
      "liquid"
    ],
    "live_symbol": null,
    "sort_order": 150
  },
  {
    "id": "debtmf",
    "name": "Debt mutual funds",
    "category": "debt",
    "return_low": 6.5,
    "return_high": 8,
    "return_label": null,
    "risk": 2,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100–500",
    "min_horizon_years": 1,
    "tax": "Gains taxed at slab (post-2023 rules)",
    "best_for": "FD-like goals with better liquidity",
    "pros": [
      "Exit anytime, diversified",
      "Gilt funds gain when rates fall"
    ],
    "risks": [
      "Interest-rate risk in long-duration funds",
      "Credit-risk funds can lose money"
    ],
    "how_to_invest": "Short-duration, corporate bond, or target-maturity funds via any MF app.",
    "tags": [
      "liquid"
    ],
    "live_symbol": null,
    "sort_order": 160
  },
  {
    "id": "hybrid",
    "name": "Hybrid / balanced advantage funds",
    "category": "equity",
    "return_low": 8,
    "return_high": 11,
    "return_label": null,
    "risk": 3,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100–500",
    "min_horizon_years": 3,
    "tax": "Equity taxation if ≥65% equity: 12.5% LTCG above ₹1.25 lakh",
    "best_for": "First step into equity with a cushion",
    "pros": [
      "Automatic equity–debt rebalancing",
      "Smaller falls than pure equity"
    ],
    "risks": [
      "Can still fall 10–20% in crashes",
      "Fund-manager dependent"
    ],
    "how_to_invest": "Any MF platform; SIP from ₹100.",
    "tags": [
      "liquid"
    ],
    "live_symbol": null,
    "sort_order": 170
  },
  {
    "id": "index",
    "name": "Nifty 50 / Sensex index funds & ETFs",
    "category": "equity",
    "return_low": 10,
    "return_high": 13,
    "return_label": null,
    "risk": 4,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100",
    "min_horizon_years": 5,
    "tax": "STCG 20% (<1 yr); LTCG 12.5% above ₹1.25 lakh",
    "best_for": "Core long-term wealth building at low cost",
    "pros": [
      "Owns India's 50 largest companies",
      "Very low cost (0.1–0.3%)",
      "No fund-manager risk"
    ],
    "risks": [
      "Falls of 30–40% have happened (2008, 2020)",
      "Needs 5+ years to smooth out"
    ],
    "how_to_invest": "UTI, Navi, ICICI, HDFC index funds; or Nifty BeES ETF on a demat account.",
    "tags": [
      "liquid",
      "growth"
    ],
    "live_symbol": "NIFTYBEES",
    "sort_order": 180
  },
  {
    "id": "active",
    "name": "Active equity funds (flexi, mid, small cap)",
    "category": "equity",
    "return_low": 11,
    "return_high": 15,
    "return_label": null,
    "risk": 5,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100–500",
    "min_horizon_years": 7,
    "tax": "Same as equity: 20% STCG, 12.5% LTCG",
    "best_for": "Long horizon, can stomach big swings",
    "pros": [
      "Mid/small caps have beaten Nifty over long periods",
      "SIP averages the entry price"
    ],
    "risks": [
      "Small caps can fall 50%+",
      "Many active funds trail their index after fees",
      "Style and manager risk"
    ],
    "how_to_invest": "Any MF platform; choose direct plans to save ~1%/yr in fees.",
    "tags": [
      "liquid",
      "growth"
    ],
    "live_symbol": null,
    "sort_order": 190
  },
  {
    "id": "elss",
    "name": "ELSS tax-saving funds",
    "category": "equity",
    "return_low": 11,
    "return_high": 14,
    "return_label": null,
    "risk": 4,
    "liquidity": "Locked",
    "lock_in": "3 yrs",
    "minimum": "₹500",
    "min_horizon_years": 3,
    "tax": "80C deduction up to ₹1.5 lakh (old regime only); equity LTCG",
    "best_for": "Old-regime taxpayers wanting equity growth",
    "pros": [
      "Shortest 80C lock-in",
      "Equity returns"
    ],
    "risks": [
      "No tax benefit under the new regime",
      "Equity volatility during lock-in"
    ],
    "how_to_invest": "Any MF platform.",
    "tags": [
      "tax",
      "growth"
    ],
    "live_symbol": null,
    "sort_order": 200
  },
  {
    "id": "stocks",
    "name": "Direct stocks",
    "category": "equity",
    "return_low": -100,
    "return_high": 25,
    "return_label": "Varies widely",
    "risk": 5,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "1 share",
    "min_horizon_years": 5,
    "tax": "20% STCG; 12.5% LTCG above ₹1.25 lakh",
    "best_for": "People willing to research companies",
    "pros": [
      "Full control, no fund fee",
      "Dividends"
    ],
    "risks": [
      "A single company can go to zero",
      "Most retail stock pickers underperform the index",
      "Emotional decisions"
    ],
    "how_to_invest": "Demat + trading account with a SEBI broker (Zerodha, Groww, Upstox, ICICI Direct).",
    "tags": [
      "liquid",
      "growth"
    ],
    "live_symbol": null,
    "sort_order": 210
  },
  {
    "id": "fno",
    "name": "Futures & options trading",
    "category": "alt",
    "return_low": -100,
    "return_high": 50,
    "return_label": "Mostly losses",
    "risk": 5,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹10k+ margin",
    "min_horizon_years": 0,
    "tax": "Business income at slab",
    "best_for": "Not an investment; speculation",
    "pros": [
      "Hedging tool for large portfolios"
    ],
    "risks": [
      "SEBI studies found about 9 in 10 individual F&O traders lose money",
      "Leverage can wipe out capital in days"
    ],
    "how_to_invest": "Broker accounts. We show it so users can see the risk clearly.",
    "tags": [
      "warning"
    ],
    "live_symbol": null,
    "sort_order": 220
  },
  {
    "id": "goldetf",
    "name": "Gold ETFs & gold funds",
    "category": "gold",
    "return_low": 8,
    "return_high": 11,
    "return_label": null,
    "risk": 3,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "~₹100 (1 unit)",
    "min_horizon_years": 3,
    "tax": "12.5% LTCG after 1 yr (ETF) / 2 yrs (FoF); else slab",
    "best_for": "Hedge against rupee fall and crises",
    "pros": [
      "No making charges or purity worries",
      "Moves differently from equity"
    ],
    "risks": [
      "Long flat periods (gold was flat 2013–2018)",
      "No income"
    ],
    "how_to_invest": "Nippon Gold BeES, SBI Gold ETF on demat; gold FoFs via MF apps.",
    "tags": [
      "liquid"
    ],
    "live_symbol": "GOLDBEES",
    "sort_order": 230
  },
  {
    "id": "sgb",
    "name": "Sovereign Gold Bonds (secondary market)",
    "category": "gold",
    "return_low": 8,
    "return_high": 11,
    "return_label": "Gold price + 2.5%",
    "risk": 3,
    "liquidity": "Low",
    "lock_in": "8 yrs (exit after 5)",
    "minimum": "1 gram",
    "min_horizon_years": 5,
    "tax": "Maturity gain tax-free; 2.5% interest taxable",
    "best_for": "Long-term gold with extra interest",
    "pros": [
      "2.5% annual interest on top of gold price",
      "Tax-free at maturity"
    ],
    "risks": [
      "Government has not issued new tranches recently; buy only on exchange",
      "Often trade at a premium",
      "Thin trading volumes"
    ],
    "how_to_invest": "Buy existing SGB series on NSE/BSE via demat.",
    "tags": [
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 240
  },
  {
    "id": "silver",
    "name": "Silver ETFs",
    "category": "gold",
    "return_low": 5,
    "return_high": 14,
    "return_label": null,
    "risk": 4,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "~₹100",
    "min_horizon_years": 3,
    "tax": "Same as gold ETFs",
    "best_for": "Small satellite commodity holding",
    "pros": [
      "Industrial plus precious-metal demand"
    ],
    "risks": [
      "More volatile than gold",
      "Swings of 30%+ in a year are common"
    ],
    "how_to_invest": "Silver ETFs from Nippon, ICICI, HDFC on demat.",
    "tags": [
      "liquid"
    ],
    "live_symbol": "SILVERBEES",
    "sort_order": 250
  },
  {
    "id": "reit",
    "name": "REITs & InvITs",
    "category": "real",
    "return_low": 8,
    "return_high": 11,
    "return_label": null,
    "risk": 3,
    "liquidity": "Medium",
    "lock_in": "None",
    "minimum": "1 unit (~₹100–400)",
    "min_horizon_years": 3,
    "tax": "Dividend/interest mix; parts taxed at slab",
    "best_for": "Rental-style income without buying property",
    "pros": [
      "Regular payouts (90% of cash flow distributed)",
      "Exchange-traded, SEBI-regulated"
    ],
    "risks": [
      "Unit price moves with rates and occupancy",
      "Tax treatment is complex"
    ],
    "how_to_invest": "Embassy, Mindspace, Brookfield, Nexus REITs on stock exchanges.",
    "tags": [
      "income"
    ],
    "live_symbol": "EMBASSY",
    "sort_order": 260
  },
  {
    "id": "property",
    "name": "Physical real estate",
    "category": "real",
    "return_low": 5,
    "return_high": 9,
    "return_label": "Rent 2–3% + growth",
    "risk": 3,
    "liquidity": "Low",
    "lock_in": "Practically long",
    "minimum": "₹20 lakh+",
    "min_horizon_years": 10,
    "tax": "12.5% LTCG after 2 yrs; rent taxed at slab",
    "best_for": "Own-use home or large long-term capital",
    "pros": [
      "Tangible, can be leveraged with a loan",
      "Rent income"
    ],
    "risks": [
      "Hard to sell quickly",
      "Stamp duty, maintenance, legal and builder-delay risk",
      "Concentration of wealth in one asset"
    ],
    "how_to_invest": "RERA-registered projects; check title and approvals.",
    "tags": [],
    "live_symbol": null,
    "sort_order": 270
  },
  {
    "id": "nps",
    "name": "National Pension System (NPS)",
    "category": "retire",
    "return_low": 8,
    "return_high": 11,
    "return_label": null,
    "risk": 3,
    "liquidity": "Locked",
    "lock_in": "Till 60",
    "minimum": "₹1,000/yr",
    "min_horizon_years": 15,
    "tax": "Extra ₹50k deduction 80CCD(1B) (old regime); employer part under new regime too",
    "best_for": "Retirement savings with low cost",
    "pros": [
      "Very low fund fee",
      "Choose equity share up to 75%"
    ],
    "risks": [
      "Locked till 60",
      "40% must buy an annuity at exit (taxable pension)"
    ],
    "how_to_invest": "eNPS online, banks, or employer.",
    "tags": [
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 280
  },
  {
    "id": "epf",
    "name": "EPF / Voluntary PF",
    "category": "retire",
    "return_low": 8.25,
    "return_high": 8.25,
    "return_label": "~8.25% (declared yearly)",
    "risk": 1,
    "liquidity": "Locked",
    "lock_in": "Till retirement / job change rules",
    "minimum": "12% of basic",
    "min_horizon_years": 5,
    "tax": "Tax-free up to ₹2.5 lakh/yr employee contribution",
    "best_for": "Salaried employees; VPF to add more",
    "pros": [
      "High safe rate",
      "Employer matches contribution"
    ],
    "risks": [
      "Rate declared each year by EPFO",
      "Withdrawal rules are strict"
    ],
    "how_to_invest": "Through your employer; VPF by asking HR.",
    "tags": [
      "safe",
      "tax"
    ],
    "live_symbol": null,
    "sort_order": 290
  },
  {
    "id": "usstock",
    "name": "US stocks & ETFs (direct, via LRS)",
    "category": "global",
    "return_low": 8,
    "return_high": 14,
    "return_label": "S&P 500 long-run ~10% in USD",
    "risk": 4,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "$1 (fractional)",
    "min_horizon_years": 5,
    "tax": "Held <2 yrs: slab; ≥2 yrs: 12.5% LTCG. US 25% withholding on dividends (credit available)",
    "best_for": "Diversifying beyond India, into Apple, Nvidia, S&P 500",
    "pros": [
      "Access to global companies",
      "Rupee depreciation adds to returns"
    ],
    "risks": [
      "Currency swings both ways",
      "20% TCS above ₹10 lakh/yr ties up cash",
      "US estate tax exposure above $60k"
    ],
    "how_to_invest": "Vested, INDmoney, Appreciate, or global desks of Indian brokers.",
    "tags": [
      "global",
      "growth"
    ],
    "live_symbol": null,
    "sort_order": 300
  },
  {
    "id": "intlmf",
    "name": "International funds (Indian AMCs)",
    "category": "global",
    "return_low": 8,
    "return_high": 13,
    "return_label": null,
    "risk": 4,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100–1,000",
    "min_horizon_years": 5,
    "tax": "Taxed as non-equity: slab <2 yrs; 12.5% after",
    "best_for": "Global exposure in rupees, no LRS paperwork",
    "pros": [
      "No TCS, no LRS form",
      "SIP in rupees"
    ],
    "risks": [
      "Some funds pause fresh inflows when the industry's $7 bn overseas cap is hit",
      "Higher expense ratio than direct ETFs"
    ],
    "how_to_invest": "Motilal Nasdaq 100 FoF, Mirae NYSE FANG+, PPFAS Flexi Cap (partial global).",
    "tags": [
      "global",
      "liquid"
    ],
    "live_symbol": "MON100",
    "sort_order": 310
  },
  {
    "id": "gift",
    "name": "GIFT City (IFSC) funds & deposits",
    "category": "global",
    "return_low": 4,
    "return_high": 12,
    "return_label": "USD deposits to global funds",
    "risk": 3,
    "liquidity": "Medium",
    "lock_in": "Varies",
    "minimum": "~$5,000+",
    "min_horizon_years": 3,
    "tax": "Depends on product; some IFSC benefits",
    "best_for": "Larger investors wanting USD assets onshore",
    "pros": [
      "Dollar-denominated, regulated by IFSCA in India",
      "USD FDs and global fund feeders"
    ],
    "risks": [
      "Counts toward LRS",
      "Higher minimums; product range still growing"
    ],
    "how_to_invest": "IFSC banking units of large banks; IFSC fund platforms.",
    "tags": [
      "global"
    ],
    "live_symbol": null,
    "sort_order": 320
  },
  {
    "id": "p2p",
    "name": "P2P lending",
    "category": "alt",
    "return_low": 9,
    "return_high": 12,
    "return_label": null,
    "risk": 5,
    "liquidity": "Low",
    "lock_in": "Loan tenure",
    "minimum": "₹10,000",
    "min_horizon_years": 1,
    "tax": "Interest at slab",
    "best_for": "Small experimental allocation only",
    "pros": [
      "High advertised yields"
    ],
    "risks": [
      "Unsecured loans; defaults eat returns",
      "RBI tightened rules; platforms can freeze exits"
    ],
    "how_to_invest": "RBI-registered NBFC-P2P platforms only.",
    "tags": [
      "warning"
    ],
    "live_symbol": null,
    "sort_order": 330
  },
  {
    "id": "crypto",
    "name": "Crypto assets",
    "category": "alt",
    "return_low": -80,
    "return_high": 100,
    "return_label": "Extremely volatile",
    "risk": 5,
    "liquidity": "High",
    "lock_in": "None",
    "minimum": "₹100",
    "min_horizon_years": 5,
    "tax": "Flat 30% on gains, no loss set-off, 1% TDS",
    "best_for": "Only money you can afford to lose entirely",
    "pros": [
      "24/7 global market"
    ],
    "risks": [
      "Not regulated as a security in India",
      "Exchange hacks and collapses",
      "Heavy tax, losses can't offset gains"
    ],
    "how_to_invest": "FIU-registered Indian exchanges.",
    "tags": [
      "warning"
    ],
    "live_symbol": null,
    "sort_order": 340
  },
  {
    "id": "pms",
    "name": "PMS & AIFs",
    "category": "alt",
    "return_low": 8,
    "return_high": 18,
    "return_label": "Strategy-dependent",
    "risk": 4,
    "liquidity": "Low",
    "lock_in": "AIF: 3–7 yrs",
    "minimum": "PMS ₹50 lakh / AIF ₹1 crore",
    "min_horizon_years": 5,
    "tax": "Depends on structure",
    "best_for": "High-net-worth investors",
    "pros": [
      "Customised or niche strategies",
      "Access to private credit / pre-IPO"
    ],
    "risks": [
      "High fees (1.5–2.5% + profit share)",
      "Concentrated portfolios",
      "Illiquid"
    ],
    "how_to_invest": "SEBI-registered PMS and AIF managers.",
    "tags": [],
    "live_symbol": null,
    "sort_order": 350
  }
] as InvestOption[];

export const BUNDLED_RATES: InvestRate[] = [
  {
    "kind": "small_savings",
    "key": "ssy",
    "label": "Sukanya Samriddhi Yojana",
    "tenure": "Till 21 yrs",
    "rate": 8.2,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "scss",
    "label": "Senior Citizen Savings Scheme",
    "tenure": "5 yrs",
    "rate": 8.2,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "nsc",
    "label": "National Savings Certificate",
    "tenure": "5 yrs",
    "rate": 7.7,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "kvp",
    "label": "Kisan Vikas Patra",
    "tenure": "115 months",
    "rate": 7.5,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "potd5",
    "label": "PO Time Deposit",
    "tenure": "5 yrs",
    "rate": 7.5,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "mis",
    "label": "PO Monthly Income Scheme",
    "tenure": "5 yrs",
    "rate": 7.4,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "ppf",
    "label": "Public Provident Fund",
    "tenure": "15 yrs",
    "rate": 7.1,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "small_savings",
    "key": "rd5",
    "label": "PO Recurring Deposit",
    "tenure": "5 yrs",
    "rate": 6.7,
    "institution_type": "Govt",
    "source_name": "DEA notification (Jul–Sep 2026)",
    "source_url": "https://dea.gov.in/budget-division/475",
    "effective_from": "2026-07-01",
    "effective_to": "2026-09-30",
    "as_of": "2026-09-29"
  },
  {
    "kind": "bank_fd",
    "key": "suryoday",
    "label": "Suryoday Small Finance Bank",
    "tenure": "5 yrs",
    "rate": 8.25,
    "institution_type": "SFB",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "bank_fd",
    "key": "bandhan",
    "label": "Bandhan Bank",
    "tenure": "2–3 yrs",
    "rate": 7.45,
    "institution_type": "Private",
    "source_name": "Policybazaar",
    "source_url": "https://www.policybazaar.com/fd-interest-rates/",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-08-31"
  },
  {
    "kind": "bank_fd",
    "key": "idfcfirst",
    "label": "IDFC FIRST Bank",
    "tenure": "Best slab",
    "rate": 7.4,
    "institution_type": "Private",
    "source_name": "Upstox",
    "source_url": "https://upstox.com/hindi/news/personal-finance/latest-updates/fixed-deposit-fd-interest-rates-in-sept-2026-sbi-pnb-idfc-first-bank-bandhan-bank-axis-bank-hdfc-bank/article-199697/",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-02"
  },
  {
    "kind": "bank_fd",
    "key": "pnb",
    "label": "Punjab National Bank",
    "tenure": "444 days",
    "rate": 6.6,
    "institution_type": "PSU",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "bank_fd",
    "key": "hdfc",
    "label": "HDFC Bank",
    "tenure": "Best slab",
    "rate": 6.5,
    "institution_type": "Private",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "bank_fd",
    "key": "icici",
    "label": "ICICI Bank",
    "tenure": "3–10 yrs",
    "rate": 6.5,
    "institution_type": "Private",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "bank_fd",
    "key": "axis",
    "label": "Axis Bank",
    "tenure": "Best slab",
    "rate": 6.5,
    "institution_type": "Private",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "bank_fd",
    "key": "sbi",
    "label": "State Bank of India",
    "tenure": "444 days (Amrit Vrishti)",
    "rate": 6.45,
    "institution_type": "PSU",
    "source_name": "Zee Business",
    "source_url": "https://www.zeebiz.com/personal-finance/news-fd-rates-in-september-2026-sbi-hdfc-bank-icici-bank-pnb-axis-bank-bank-of-baroda-compared-check-latest-interest-rates-402571",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-16"
  },
  {
    "kind": "policy",
    "key": "repo",
    "label": "RBI repo rate",
    "tenure": null,
    "rate": 5.25,
    "institution_type": "RBI",
    "source_name": "CEIC / RBI",
    "source_url": "https://www.ceicdata.com/en/india/bank-interest-rate/repo-rate",
    "effective_from": null,
    "effective_to": null,
    "as_of": "2026-09-12"
  }
] as InvestRate[];
