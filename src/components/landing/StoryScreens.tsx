import { FileText, Radar, Scale } from 'lucide-react';
import { InvestRates, TopStocks, changeClass, fmtINR, fmtPct, fmtRate, useApi } from './hooks';

// Three sample product screens for the scroll story. They reuse live prices and rates
// when available and fall back to values captured on 30 Sep 2026.

function Frame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-lavender-text/10 bg-white shadow-[0_30px_80px_-30px_rgba(45,36,74,0.45)] dark:border-lavender-text/15 dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-lavender-text/10 bg-lavender-surface/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-lavender-text/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-lavender-text/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-lavender-text/15" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-lavender-text/[0.06] px-2.5 py-1 text-[11px] text-lavender-text/55">{url}</span>
        <span className="shrink-0 rounded-full border border-lavender-text/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lavender-text/50">Sample screen</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function SourceChip({ children }: { children: React.ReactNode }) {
  return <span className="shrink-0 rounded-md bg-lavender-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-lavender-primary">{children}</span>;
}

const RELIANCE_FALLBACK = { current_price: 1185.1, price_change_pct: 0.26, pe_ratio: 21.5, week52_high: 1611.8, week52_low: 1181.7, dividend_yield_pct: 0.51 };

export function StockScreen({ load = true }: { load?: boolean }) {
  const top = useApi<TopStocks>('/api/market/top', load);
  const s = { ...RELIANCE_FALLBACK, ...(top.data?.stocks.find((x) => x.display_ticker === 'RELIANCE') || {}) };
  const low = s.week52_low ?? 0;
  const high = s.week52_high ?? 0;
  const pos = high > low ? Math.min(1, Math.max(0, (s.current_price - low) / (high - low))) : 0.5;

  return (
    <Frame url="byteplay.org/stock/RELIANCE">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-lavender-text/55">RELIANCE · NSE · Energy</p>
          <p className="truncate text-lg font-bold text-lavender-text">Reliance Industries</p>
        </div>
        <div className="text-right tabular-nums">
          <p className="text-lg font-bold text-lavender-text">{fmtINR(s.current_price)}</p>
          <p className={`text-xs font-semibold ${changeClass(s.price_change_pct)}`}>{fmtPct(s.price_change_pct)} today</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-lavender-surface p-2.5">
          <p className="text-[10px] text-lavender-text/55">P/E ratio</p>
          <p className="text-sm font-bold tabular-nums text-lavender-text">{s.pe_ratio ?? '—'}</p>
        </div>
        <div className="rounded-xl bg-lavender-surface p-2.5">
          <p className="text-[10px] text-lavender-text/55">Dividend yield</p>
          <p className="text-sm font-bold tabular-nums text-lavender-text">{s.dividend_yield_pct != null ? `${s.dividend_yield_pct}%` : '—'}</p>
        </div>
        <div className="rounded-xl bg-lavender-surface p-2.5">
          <p className="text-[10px] text-lavender-text/55">52-week range</p>
          <div className="relative mt-2 h-1.5 rounded-full bg-lavender-text/10">
            <span className="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-lavender-primary" style={{ left: `calc(${pos * 100}% - 2px)` }} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-lavender-text/55">What the latest filings say</p>
      <ul className="mt-2 space-y-2">
        {[
          ['Credit ratings from CARE and CRISIL disclosed to the exchanges', 'NSE filing'],
          ['Dissolution of a step-down subsidiary confirmed', 'NSE filing'],
          ['Nifty 50 closed 0.28% higher on the day of the filings', 'Market wrap'],
        ].map(([text, source]) => (
          <li key={text} className="flex items-start justify-between gap-3 rounded-lg border border-lavender-text/10 px-3 py-2">
            <span className="flex min-w-0 items-start gap-2 text-xs text-lavender-text/80">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lavender-text/40" />
              {text}
            </span>
            <SourceChip>{source}</SourceChip>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const SEVERITY = {
  High: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  Low: 'bg-lavender-text/10 text-lavender-text/60',
} as const;

export function RadarScreen(_: { load?: boolean }) {
  const rows: [string, string, keyof typeof SEVERITY][] = [
    ['HDFCBANK', 'Board meeting to consider quarterly results', 'High'],
    ['TCS', 'Results date announced', 'Medium'],
    ['ITC', 'Record date set for interim dividend', 'Medium'],
    ['INFY', 'Investor presentation filed', 'Low'],
  ];
  return (
    <Frame url="byteplay.org/today">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-bold text-lavender-text">
          <Radar className="h-4 w-4 text-lavender-primary" /> Event radar
        </p>
        <p className="text-xs text-lavender-text/55">Your watchlist · 4 stocks</p>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map(([ticker, text, level]) => (
          <li key={ticker} className="flex items-center gap-3 rounded-xl border border-lavender-text/10 px-3 py-2.5">
            <span className="w-20 shrink-0 text-xs font-bold text-lavender-text">{ticker}</span>
            <span className="min-w-0 flex-1 text-xs text-lavender-text/75">{text}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${SEVERITY[level]}`}>{level}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-lavender-text/50">Sorted by how much each event could matter. Every row links to its filing.</p>
    </Frame>
  );
}

const RISK_BAR = ['', 'bg-emerald-500', 'bg-lime-500', 'bg-amber-500', 'bg-orange-500', 'bg-rose-500'];

export function ExplorerScreen(_: { load?: boolean }) {
  const rates = useApi<InvestRates>('/api/invest/rates');
  const fd = rates.data?.rates.bank_fd?.[0]?.rate ?? 8.25;
  const scss = rates.data?.rates.small_savings?.find((r) => r.key === 'scss')?.rate ?? 8.2;
  const ppf = rates.data?.rates.small_savings?.find((r) => r.key === 'ppf')?.rate ?? 7.1;
  const rows: [string, string, number][] = [
    ['Small finance bank FD', `up to ${fmtRate(fd)}`, 2],
    ['Senior Citizen Savings', fmtRate(scss), 1],
    ['Public Provident Fund', `${fmtRate(ppf)} tax-free`, 1],
    ['Gold ETF', '8–11% typical', 3],
    ['Nifty 50 index fund', '10–13% typical', 4],
  ];
  return (
    <Frame url="byteplay.org/invest">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-bold text-lavender-text">
          <Scale className="h-4 w-4 text-lavender-primary" /> Invest Explorer
        </p>
        <p className="text-xs text-lavender-text/55">35 options compared</p>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-lavender-text/10">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-lavender-surface/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-lavender-text/55">
          <span>Option</span>
          <span className="text-right">Return / yr</span>
          <span className="w-16 text-right">Risk</span>
        </div>
        {rows.map(([name, ret, risk]) => (
          <div key={name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-lavender-text/10 px-3 py-2.5 text-xs">
            <span className="min-w-0 truncate font-medium text-lavender-text">{name}</span>
            <span className="text-right font-semibold tabular-nums text-lavender-text">{ret}</span>
            <span className="flex w-16 justify-end gap-0.5" aria-label={`Risk ${risk} of 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`h-1.5 w-2.5 rounded-sm ${i <= risk ? RISK_BAR[risk] : 'bg-lavender-text/10'}`} />
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-lavender-text/50">Rates update from government notifications and bank websites.</p>
    </Frame>
  );
}
