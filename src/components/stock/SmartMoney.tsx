import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Lock } from 'lucide-react';
import { getSmartMoney } from '../../lib/api';
import Skeleton from '../ui/Skeleton';
import { usePlan } from '../../lib/usePlan';
import { downloadCsv, today } from '../../lib/csv';
import UpgradeModal from '../UpgradeModal';

type Holding = { quarter: string; quarter_end: string; promoters: number | null; fiis: number | null; diis: number | null; government: number | null; public: number | null; shareholders: number | null };
type Summary = Record<'promoters' | 'fiis' | 'diis' | 'public', { latest: number | null; change_1q: number | null; change_4q: number | null }>;
type Deal = { deal_date: string; kind: string; client_name: string; side: 'buy' | 'sell'; quantity: number; price: number; value_cr: number | null };
type Insider = {
  person_name: string; person_category: string; transaction_type: string; mode: string; quantity: number | null; value_inr: number | null;
  holding_before_pct: number | null; holding_after_pct: number | null; trade_from: string | null; filed_at: string; source_url: string;
};
type Source = { name: string; url: string };
type Data = { holdings: Holding[]; holdings_summary: Partial<Summary>; deals: Deal[]; insider_trades: Insider[]; sources: Record<'holdings' | 'deals' | 'insider_trades', Source>; coverage_note: string; limited?: boolean; hidden?: { quarters: number; deals: number; insider_trades: number } };

const GROUPS = [
  { key: 'promoters', label: 'Promoters', short: 'Promoters', shade: 'bg-cobalt' },
  { key: 'fiis', label: 'Foreign investors (FII)', short: 'FIIs', shade: 'bg-cobalt/70' },
  { key: 'diis', label: 'Domestic institutions (DII)', short: 'DIIs', shade: 'bg-cobalt/45' },
  { key: 'public', label: 'Public', short: 'Public', shade: 'bg-cobalt/25' },
] as const;

const day = (iso?: string | null) => (iso ? new Date(iso.length > 10 ? iso : `${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const money = (inr: number | null | undefined) => {
  if (!inr) return 'value not stated';
  const cr = inr / 1e7;
  return cr >= 1 ? `₹${cr.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr` : `₹${(inr / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh`;
};

function Pts({ v }: { v: number | null | undefined }) {
  if (v == null) return <span className="text-muted">–</span>;
  if (Math.abs(v) < 0.005) return <span className="text-muted">no change</span>;
  const up = v > 0;
  return (
    <span className={`num ${up ? 'text-up' : 'text-down'}`}>
      <span aria-hidden="true" className="text-[0.8em]">{up ? '▲' : '▼'}</span>
      {up ? '+' : '−'}
      {Math.abs(v).toFixed(2)} pts
    </span>
  );
}

function Spark({ values }: { values: (number | null)[] }) {
  const pts = values.map((v, i) => [i, v] as const).filter(([, v]) => v != null) as [number, number][];
  if (pts.length < 2) return null;
  const ys = pts.map(([, v]) => v);
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const span = hi - lo || 1;
  const W = 96;
  const H = 24;
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => 2 + (1 - (v - lo) / span) * (H - 4);
  const d = pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-6 w-24 shrink-0 text-accent" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function SourceLink({ s }: { s?: Source }) {
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink hover:underline">
      {s.name} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

// Plain-language summary of the last year's ownership moves. Describes, never predicts.
function oneYearRead(sum: Partial<Summary>) {
  const parts: string[] = [];
  (['fiis', 'diis', 'promoters'] as const).forEach((k) => {
    const c = sum[k]?.change_4q;
    if (c == null || Math.abs(c) < 0.5) return;
    const name = k === 'fiis' ? 'foreign investors' : k === 'diis' ? 'domestic institutions' : 'promoters';
    parts.push(`${name} ${c > 0 ? 'raised' : 'cut'} their stake by ${Math.abs(c).toFixed(1)} points`);
  });
  if (!parts.length) return 'Over the last year, no big group changed its stake by more than half a point.';
  const s = parts.join(', and ');
  return `Over the last year, ${s}.`;
}

function depthNote(d: Data) {
  if (!d.limited) return `Full history: ${d.holdings.length} quarters of ownership, with deals and insider trades for up to 3 years.`;
  const h = d.hidden || { quarters: 0, deals: 0, insider_trades: 0 };
  const more = [h.quarters ? `${h.quarters} more ${h.quarters === 1 ? 'quarter' : 'quarters'} of ownership` : '', h.deals ? `${h.deals} older ${h.deals === 1 ? 'deal' : 'deals'}` : '', h.insider_trades ? `${h.insider_trades} older insider ${h.insider_trades === 1 ? 'trade' : 'trades'}` : ''].filter(Boolean);
  return `Showing the last year of ownership and 90 days of trades. ${more.length ? `Pro adds ${more.join(', ')}, ` : 'Pro shows up to 3 years, '}plus alerts when these investors move.`;
}

function exportCsv(ticker: string, d: Data) {
  downloadCsv(`${ticker}-big-investors-${today()}.csv`, [
    { title: `Shareholding pattern (%) · ${ticker} · ${d.sources.holdings?.name || ''}`, header: ['Quarter', 'Promoters', 'FIIs', 'DIIs', 'Government', 'Public', 'Shareholders'], rows: d.holdings.map((h) => [h.quarter, h.promoters, h.fiis, h.diis, h.government, h.public, h.shareholders]) },
    { title: 'Insider and promoter trades', header: ['Filed', 'Trade date', 'Person', 'Category', 'Type', 'Mode', 'Quantity', 'Value (INR)', 'Holding before %', 'Holding after %', 'Filing'], rows: d.insider_trades.map((t) => [t.filed_at?.slice(0, 10), t.trade_from, t.person_name, t.person_category, t.transaction_type, t.mode, t.quantity, t.value_inr, t.holding_before_pct, t.holding_after_pct, t.source_url]) },
    { title: 'Bulk and block deals', header: ['Date', 'Kind', 'Client', 'Side', 'Quantity', 'Price', 'Value (Cr)'], rows: d.deals.map((x) => [x.deal_date, x.kind, x.client_name, x.side, x.quantity, x.price, x.value_cr]) },
  ]);
}

export default function SmartMoney({ ticker }: { ticker: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const { isPro } = usePlan();
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null);
    setFailed(false);
    getSmartMoney(ticker)
      .then((r) => alive && setData(r.data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [ticker, isPro]);

  if (failed) return <p className="text-sm text-muted">Ownership and deal data could not be loaded right now.</p>;
  if (!data)
    return (
      <div aria-hidden="true">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-5 h-24 w-full" />
        <Skeleton className="mt-5 h-16 w-full" />
      </div>
    );

  const latest = data.holdings[data.holdings.length - 1];
  const sum = data.holdings_summary || {};

  return (
    <div>
      {/* Who owns it now */}
      {latest ? (
        <div>
          <p className="text-xs font-medium text-muted">Who owns {ticker} · {latest.quarter}</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-ink/[0.06]" role="img" aria-label={GROUPS.map((g) => `${g.label} ${latest[g.key] ?? 0}%`).join(', ')}>
            {GROUPS.map((g) => (
              <span key={g.key} className={`${g.shade} border-r border-surface last:border-0`} style={{ width: `${latest[g.key] || 0}%` }} />
            ))}
          </div>

          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th scope="col" className="pb-2 text-left font-medium">Group</th>
                <th scope="col" className="pb-2 text-right font-medium">Holds</th>
                <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Last quarter</th>
                <th scope="col" className="pb-2 text-right font-medium">Last year</th>
                <th scope="col" className="hidden pb-2 pl-4 text-left font-medium md:table-cell">
                  <span className="sr-only">Trend</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {GROUPS.map((g) => (
                <tr key={g.key}>
                  <th scope="row" className="py-2.5 pr-2 text-left font-normal">
                    <span className="flex items-center gap-2 text-ink">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${g.shade}`} aria-hidden="true" />
                      <span className="sm:hidden">{g.short}</span>
                      <span className="hidden sm:inline">{g.label}</span>
                    </span>
                  </th>
                  <td className="num py-2.5 text-right font-medium text-ink">{latest[g.key] != null ? `${latest[g.key]!.toFixed(2)}%` : '–'}</td>
                  <td className="hidden py-2.5 text-right text-xs sm:table-cell">
                    <Pts v={sum[g.key]?.change_1q} />
                  </td>
                  <td className="py-2.5 text-right text-xs">
                    <Pts v={sum[g.key]?.change_4q} />
                  </td>
                  <td className="hidden py-2.5 pl-4 md:table-cell">
                    <Spark values={data.holdings.map((h) => h[g.key])} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm leading-relaxed text-ink/85">{oneYearRead(sum)}</p>
          <div className="mt-2">
            <SourceLink s={data.sources.holdings} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Shareholding data is not available for this stock yet.</p>
      )}

      {/* Insider and promoter trades */}
      <div className="mt-7 border-t border-line pt-5">
        <h3 className="text-sm font-semibold text-ink">Insider and promoter trades</h3>
        <p className="mt-0.5 text-xs text-muted">Filed under SEBI's insider trading rules, {data.limited ? 'last 90 days' : 'last 3 years'}.</p>
        {data.insider_trades.length ? (
          <ul className="mt-3 divide-y divide-line">
            {data.insider_trades.slice(0, 8).map((t, i) => {
              const buy = /^buy/i.test(t.transaction_type || '');
              const sell = /^sell/i.test(t.transaction_type || '');
              return (
                <li key={i} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{t.person_name}</p>
                    <p className="text-xs text-muted">
                      {t.person_category} · {t.mode || 'mode not stated'} · {day(t.trade_from || t.filed_at)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`num whitespace-nowrap text-sm font-medium ${buy ? 'text-up' : sell ? 'text-down' : 'text-ink'}`}>
                      {buy ? '▲ ' : sell ? '▼ ' : ''}
                      {money(t.value_inr)}
                    </p>
                    <p className="text-[11px] text-muted">
                      {buy ? 'Bought' : sell ? 'Sold' : t.transaction_type}
                      {t.source_url && (
                        <>
                          {' · '}
                          <a href={t.source_url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                            Filing
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No insider trades on record for this period.</p>
        )}
        <div className="mt-2">
          <SourceLink s={data.sources.insider_trades} />
        </div>
      </div>

      {/* Bulk and block deals */}
      <div className="mt-7 border-t border-line pt-5">
        <h3 className="text-sm font-semibold text-ink">Bulk and block deals</h3>
        <p className="mt-0.5 text-xs text-muted">Single trades of 0.5% of the company or more, or ₹10 Cr+ on the block window. {data.limited ? 'Last 90 days.' : 'Last 3 years.'}</p>
        {data.deals.length ? (
          <ul className="mt-3 divide-y divide-line">
            {data.deals.slice(0, 8).map((d, i) => (
              <li key={i} className="flex items-start justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{d.client_name}</p>
                  <p className="text-xs text-muted">
                    {d.kind === 'block' ? 'Block' : 'Bulk'} deal · {day(d.deal_date)} · {d.quantity?.toLocaleString('en-IN')} shares at ₹{d.price?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`num whitespace-nowrap text-sm font-medium ${d.side === 'buy' ? 'text-up' : 'text-down'}`}>
                    {d.side === 'buy' ? '▲ ' : '▼ '}
                    {d.value_cr != null ? `₹${d.value_cr.toLocaleString('en-IN')} Cr` : ''}
                  </p>
                  <p className="text-[11px] text-muted">{d.side === 'buy' ? 'Bought' : 'Sold'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No bulk or block deals on record for this period.</p>
        )}
        <div className="mt-2">
          <SourceLink s={data.sources.deals} />
        </div>
      </div>

      {/* Depth: Pro history and export */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-control bg-accent/[0.06] px-3 py-2.5">
        <p className="text-xs leading-relaxed text-ink/85">{depthNote(data)}</p>
        <button
          type="button"
          onClick={() => (isPro ? exportCsv(ticker, data) : setUpgrade(true))}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-control px-2 text-xs font-semibold text-accent hover:bg-accent/10"
        >
          {isPro ? <Download className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {isPro ? 'Download CSV' : data.limited ? 'See 3 years with Pro' : 'CSV export with Pro'}
        </button>
      </div>
      {upgrade && <UpgradeModal onClose={() => setUpgrade(false)} onSuccess={() => window.location.reload()} />}

      <p className="mt-4 text-xs leading-relaxed text-muted">
        What big investors did, from public filings. It is not a forecast: they can be wrong, and their filings arrive after they trade. {data.coverage_note}{' '}
        <Link to="/studies" className="font-medium text-accent hover:underline">
          What happened after past promoter buys and stake changes
        </Link>
      </p>
    </div>
  );
}
