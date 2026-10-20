import { AlertTriangle, ArrowUpRight, Info, Radar, Scale } from 'lucide-react';
import DotScale from '../ui/DotScale';
import { SourceChip } from '../ui/Chip';
import { InvestRates, fmtRate, useApi } from './hooks';

// Sample product screens used by the "Filing unfolds" chapter. Rates are live when the API
// answers and fall back to values captured on 30 Sep 2026. Everything is labelled as a sample.

export function Frame({ title, icon, meta, children, className = '' }: { title: string; icon: React.ReactNode; meta?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-card border border-line bg-surface shadow-lift ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink">
          <span className="text-accent">{icon}</span>
          <span className="truncate">{title}</span>
        </p>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted">{meta || 'Sample'}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ── The sample filing (left of the stage) ──
export const FILING_POINTS = [
  { id: 'rev', kind: 'support' as const, text: 'Revenue up 12% on last year', source: 'Filing · p.1', sentence: 'Revenue from operations rose 12% year on year to ₹4,120 crore.' },
  { id: 'div', kind: 'support' as const, text: 'Final dividend of ₹6 a share proposed', source: 'Filing · p.1', sentence: 'The Board recommended a final dividend of ₹6 per equity share.' },
  { id: 'debt', kind: 'concern' as const, text: 'Net debt rose to fund new capacity', source: 'Filing · p.2', sentence: 'Net debt increased to ₹1,850 crore, mainly due to capacity expansion.' },
];

export function FilingDoc({ markClass = 'hl-mark' }: { markClass?: string }) {
  return (
    <article className="filing-doc relative overflow-hidden rounded-card border border-line bg-[#F7F8FA] p-5 text-[#0F1720] shadow-lift sm:p-6" aria-label="Sample exchange filing">
      <div className="flex items-start justify-between gap-3 border-b border-[#DCE2EA] pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4A5565]">Exchange filing</p>
          <p className="mt-1 text-sm font-bold">Outcome of Board Meeting</p>
          <p className="text-[11px] text-[#4A5565]">Example Industries Ltd · Q2 results</p>
        </div>
        <span className="rounded-full border border-[#DCE2EA] px-2 py-0.5 text-[10px] font-medium text-[#4A5565]">Sample filing</span>
      </div>
      <div className="mt-4 space-y-3 text-[12.5px] leading-[1.7] text-[#2A3442]">
        <p>
          Pursuant to Regulation 30, we inform you that the Board of Directors at its meeting held today approved the unaudited financial results for the
          quarter. <span className={markClass} data-mark="rev">{FILING_POINTS[0].sentence}</span> Operating margins were broadly stable.
        </p>
        <p>
          <span className={markClass} data-mark="div">{FILING_POINTS[1].sentence}</span> The record date will be announced separately.
        </p>
        <p>
          Capital expenditure for the half year was in line with plan. <span className={markClass} data-mark="debt">{FILING_POINTS[2].sentence}</span> The
          new lines are expected to start production next year.
        </p>
        <p className="text-[#4A5565]">The meeting commenced at 11:00 and concluded at 13:10.</p>
      </div>
    </article>
  );
}

// ── Phase 1: the summary the filing turns into ──
export function SummaryScreen({ pointRef }: { pointRef?: (id: string) => (el: HTMLLIElement | null) => void }) {
  return (
    <Frame title="Example Industries · summary" icon={<Info className="h-4 w-4" strokeWidth={1.75} />}>
      <p className="text-xs text-muted">From the latest filing, in plain words</p>
      <ul className="mt-3 space-y-2">
        {FILING_POINTS.map((p) => (
          <li
            key={p.id}
            ref={pointRef?.(p.id)}
            data-point={p.id}
            className="summary-point flex items-start justify-between gap-3 rounded-control border border-line px-3 py-2.5"
          >
            <span className="flex min-w-0 items-start gap-2 text-[13px] text-ink">
              {p.kind === 'support' ? (
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-up" strokeWidth={2} aria-label="Supporting" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution" strokeWidth={2} aria-label="Concern" />
              )}
              {p.text}
            </span>
            <SourceChip>{p.source}</SourceChip>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// ── Phase 2: the event radar ──
const SEVERITY = {
  High: { cls: 'text-down', icon: AlertTriangle },
  Medium: { cls: 'text-caution', icon: Info },
  Low: { cls: 'text-muted', icon: Info },
} as const;

export const RADAR_ROWS: { ticker: string; text: string; level: keyof typeof SEVERITY; source: string; kind: 'filing' | 'news' }[] = [
  { ticker: 'EXAMPLE', text: 'Q2 results filed: revenue up 12%', level: 'High', source: 'Filing', kind: 'filing' },
  { ticker: 'EXAMPLE', text: 'Final dividend proposed, record date to follow', level: 'Medium', source: 'Filing', kind: 'filing' },
  { ticker: 'EXAMPLE', text: 'Debt rises as new plant is built', level: 'Medium', source: 'News', kind: 'news' },
  { ticker: 'TCS', text: 'Results date announced', level: 'Low', source: 'Filing', kind: 'filing' },
];

export function RadarScreen() {
  return (
    <Frame title="Event radar" icon={<Radar className="h-4 w-4" strokeWidth={1.75} />}>
      <ul className="space-y-2">
        {RADAR_ROWS.map((row, i) => {
          const sev = SEVERITY[row.level];
          const Icon = sev.icon;
          return (
            <li key={i} data-radar={i} className="rounded-control border border-line px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="num text-xs font-semibold text-ink">{row.ticker}</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${sev.cls}`}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  {row.level}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="min-w-0 text-[13px] text-ink/85">{row.text}</span>
                <SourceChip kind={row.kind}>{row.source}</SourceChip>
              </div>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

// ── Phase 3: Invest Explorer, built from today's real rates ──
export function ExplorerScreen({ load = true }: { load?: boolean }) {
  const rates = useApi<InvestRates>('/api/invest/rates', load);
  const live = !!rates.data;
  const fd = rates.data?.rates.bank_fd?.[0]?.rate ?? 8.25;
  const scss = rates.data?.rates.small_savings?.find((r) => r.key === 'scss')?.rate ?? 8.2;
  const ppf = rates.data?.rates.small_savings?.find((r) => r.key === 'ppf')?.rate ?? 7.1;
  const rows: [string, string, number, string][] = [
    ['Small finance bank FD', `up to ${fmtRate(fd)}`, 2, 'Low'],
    ['Senior Citizen Savings', fmtRate(scss), 1, 'Very low'],
    ['Public Provident Fund', `${fmtRate(ppf)} tax-free`, 1, 'Very low'],
    ['Gold ETF', '8 to 11% typical', 3, 'Medium'],
    ['Nifty 50 index fund', '10 to 13% typical', 4, 'High'],
  ];
  return (
    <Frame title="Invest Explorer" icon={<Scale className="h-4 w-4" strokeWidth={1.75} />} meta={live ? "Today's rates" : 'Sample'}>
      <div className="overflow-hidden rounded-control border border-line">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-surface2/70 px-3 py-2 text-[11px] font-medium text-muted">
          <span>Option</span>
          <span className="text-right">Return a year</span>
          <span className="w-20 text-right">Risk</span>
        </div>
        {rows.map(([name, ret, risk, word]) => (
          <div key={name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-line px-3 py-2.5 text-[13px]">
            <span className="min-w-0 font-medium leading-snug text-ink">{name}</span>
            <span className="num whitespace-nowrap text-right text-xs text-ink">{ret}</span>
            <span className="flex w-20 flex-col items-end gap-1">
              <DotScale value={risk} label={`Risk ${word}`} />
              <span className="text-[10px] text-muted">{word}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">Rates update from government notifications and bank websites.</p>
    </Frame>
  );
}
