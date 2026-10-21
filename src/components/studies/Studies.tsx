// "What happened after": backtests of big-investor signals, published as they came out.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FlaskConical } from 'lucide-react';
import SEO from '../SEO';
import PageHeader from '../ui/PageHeader';
import { getStudies } from '../../lib/api';

type Row = { horizon: string; label: string; n: number; median_return?: number; median_benchmark?: number; median_excess?: number; mean_excess?: number; beat_share?: number; up_share?: number; p10?: number; p90?: number; median_peers?: number; median_vs_peers?: number; beat_peers_share?: number };
type Example = { symbol: string; date: string; entry: string; value_inr?: number; change_pts?: number; quarter?: string; '6m'?: number; '6m_bench'?: number; '6m_peers'?: number; source_url?: string };
type Study = {
  id: string; title: string; definition: string; benchmark: string; events_found: number; events_priced: number;
  period_from?: string; period_to?: string; summary: Row[]; headline: string; examples: Example[];
  sources: { name: string; url: string }[]; computed_at: string; universe?: string; peer_universe?: string;
};

const GROUPS: { title: string; intro: string; ids: string[] }[] = [
  { title: 'When promoters trade their own shares', intro: 'Promoters must disclose every trade within two trading days. These studies follow the stock from the day after the filing, when anyone could have acted on it.', ids: ['promoter_buy', 'promoter_buy_10cr', 'promoter_sell', 'promoter_pledge'] },
  { title: 'When institutions change their stake', intro: 'Shareholding patterns are filed within 21 days of each quarter end. These studies start from that deadline, not from the quarter end, so they only use what was public.', ids: ['fii_up', 'fii_down', 'dii_up'] },
];

const pts = (v?: number) => (v == null ? '–' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}%`);
const tone = (v?: number) => (v == null ? 'text-muted' : v > 0 ? 'text-up' : v < 0 ? 'text-down' : 'text-ink');
const month = (iso?: string) => (iso ? new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '');
const day = (iso?: string) => (iso ? new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// Median excess return as a diverging bar around zero, scaled to ±15 points.
function ExcessBar({ v }: { v?: number }) {
  if (v == null) return null;
  const w = Math.min(Math.abs(v), 15) / 15 * 50;
  return (
    <span className="relative block h-1.5 w-full rounded-full bg-ink/[0.06]" aria-hidden="true">
      <span className="absolute left-1/2 top-[-2px] h-[10px] w-px bg-ink/30" />
      <span className={`absolute top-0 h-1.5 rounded-full ${v >= 0 ? 'bg-up' : 'bg-down'}`} style={v >= 0 ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }} />
    </span>
  );
}

function StudyCard({ s }: { s: Study }) {
  const [open, setOpen] = useState(false);
  const rows = s.summary.filter((r) => r.median_excess != null);
  return (
    <article id={s.id} className="scroll-mt-24 rounded-card border border-line bg-surface p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{s.definition}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">{s.headline}</p>

      {rows.length > 0 ? (
        <div className="mt-4">
          <table className="w-full text-sm">
            <caption className="sr-only">{s.title}: returns after the event compared with similar stocks over the same days, and with the {s.benchmark}</caption>
            <thead className="text-xs text-muted">
              <tr>
                <th scope="col" className="pb-2 text-left font-medium">After</th>
                <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Events</th>
                <th scope="col" className="pb-2 text-right font-medium"><span className="sm:hidden">These</span><span className="hidden sm:inline">These stocks</span></th>
                <th scope="col" className="pb-2 text-right font-medium"><span className="sm:hidden">Similar</span><span className="hidden sm:inline">Similar stocks</span></th>
                <th scope="col" className="pb-2 pl-3 text-right font-medium sm:pl-4 sm:text-left">Gap</th>
                <th scope="col" className="pb-2 text-right font-medium">Ahead</th>
                <th scope="col" className="hidden pb-2 pl-3 text-right font-medium md:table-cell">{s.benchmark}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const peers = r.median_vs_peers != null;
                const gap = peers ? r.median_vs_peers : r.median_excess;
                const ahead = peers ? r.beat_peers_share : r.beat_share;
                return (
                  <tr key={r.horizon}>
                    <th scope="row" className="py-2.5 text-left font-normal text-ink">{r.label}</th>
                    <td className="num hidden py-2.5 text-right text-muted sm:table-cell">{r.n.toLocaleString('en-IN')}</td>
                    <td className={`num py-2.5 text-right font-medium ${tone(r.median_return)}`}>{pts(r.median_return)}</td>
                    <td className={`num py-2.5 text-right ${tone(r.median_peers)}`}>{pts(r.median_peers)}</td>
                    <td className="py-2.5 pl-3 text-right sm:pl-4 sm:text-left">
                      <span className="inline-flex items-center gap-2">
                        <span className="hidden w-20 sm:block"><ExcessBar v={gap} /></span>
                        <span className={`num text-xs ${tone(gap)}`}>{pts(gap)}</span>
                      </span>
                    </td>
                    <td className="num py-2.5 text-right text-ink">{ahead?.toFixed(0)}%</td>
                    <td className={`num hidden py-2.5 pl-3 text-right text-xs md:table-cell ${tone(r.median_benchmark)}`}>{pts(r.median_benchmark)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Not enough events with full price history yet.</p>
      )}

      {rows.find((r) => r.horizon === '6m')?.p10 != null && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Range after 6 months: one in ten stocks did worse than {pts(rows.find((r) => r.horizon === '6m')?.p10)}, one in ten better than {pts(rows.find((r) => r.horizon === '6m')?.p90)}. Figures are medians. "Similar stocks" is the typical return of {s.peer_universe || 'the other stocks in this study'}, over exactly the same days; "Ahead" is the share of cases that beat it.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3 text-xs text-muted">
        <span className="num">
          {s.events_priced.toLocaleString('en-IN')} of {s.events_found.toLocaleString('en-IN')} events with prices · {month(s.period_from)} to {month(s.period_to)}
          {s.universe ? ` · ${s.universe}` : ''}
        </span>
        {s.examples?.length > 0 && (
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="font-semibold text-accent hover:underline">
            {open ? 'Hide recent cases' : 'Show recent cases'}
          </button>
        )}
      </div>

      {open && (
        <ul className="mt-3 divide-y divide-line text-sm">
          {s.examples.map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">
                <Link to={`/stock/${e.symbol}`} className="num font-semibold text-ink hover:text-accent">{e.symbol}</Link>
                <span className="ml-2 text-xs text-muted">
                  {day(e.date)}
                  {e.value_inr ? ` · ₹${(e.value_inr / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr` : ''}
                  {e.change_pts != null ? ` · ${e.change_pts > 0 ? '+' : ''}${e.change_pts} pts (${e.quarter})` : ''}
                </span>
              </span>
              <span className="num shrink-0 text-xs">
                <span className={tone(e['6m'])}>{pts(e['6m'])}</span>
                <span className="text-muted"> vs {pts(e['6m_peers'] ?? e['6m_bench'])}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Studies() {
  const [studies, setStudies] = useState<Study[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getStudies()
      .then((r) => setStudies(r.data.studies || []))
      .catch(() => setFailed(true));
  }, []);

  const byId = new Map((studies || []).map((s) => [s.id, s]));
  const updated = studies?.length ? studies.map((s) => s.computed_at).sort().slice(-1)[0] : null;
  const sources = Array.from(new Map((studies || []).flatMap((s) => s.sources).map((x) => [x.url, x])).values());

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SEO
        title="What Happened After Promoter Buying, Pledges and FII Stake Changes | Stock AI"
        description="Backtests on NSE stocks: how shares did 1, 3, 6 and 12 months after promoters bought, sold or pledged, and after FIIs or DIIs changed their stake, versus the Nifty 500."
        canonicalPath="/studies"
      />
      <PageHeader
        eyebrow="Studies"
        icon={FlaskConical}
        title="What happened after"
        intro="When promoters buy, or big funds raise their stake, does the stock do better? We checked every case on NSE over the last three years and publish the results as they came out, including when the signal did not help."
      />

      <section className="mb-10 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {[
          ['Compared with similar stocks', 'Each case is measured against the typical similar stock over exactly the same days, so a rising or falling market does not flatter the result. The Nifty 500 is shown too.'],
          ['Only what was public', 'Every case starts the trading day after the filing, when anyone could have acted.'],
          ['The typical case', 'We show the median and how many beat the market, so a few huge winners cannot carry the result.'],
        ].map(([t, d]) => (
          <div key={t} className="bg-surface p-4">
            <p className="text-sm font-semibold text-ink">{t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </section>

      {failed && <p className="text-sm text-muted">The studies could not be loaded right now.</p>}
      {!studies && !failed && (
        <div aria-hidden="true" className="space-y-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skeleton block h-56" />
          ))}
        </div>
      )}
      {studies && studies.length === 0 && <p className="text-sm text-muted">The first results are being calculated. Check back after the weekend run.</p>}

      {studies &&
        GROUPS.map((g) => {
          const items = g.ids.map((id) => byId.get(id)).filter(Boolean) as Study[];
          if (!items.length) return null;
          return (
            <section key={g.title} className="mb-12">
              <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink">{g.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{g.intro}</p>
              <div className="mt-5 space-y-4">
                {items.map((s) => (
                  <StudyCard key={s.id} s={s} />
                ))}
              </div>
            </section>
          );
        })}

      {studies && studies.length > 0 && (
        <section className="rounded-card border border-caution/30 bg-caution/[0.06] p-6">
          <h2 className="text-lg font-semibold text-ink">What these studies cannot tell you</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/85">
            <li>They describe groups of past cases. Any single stock can do the opposite, and the range above shows how wide the outcomes were.</li>
            <li>Three years is one market cycle. A pattern from a rising market may not hold in a falling one.</li>
            <li>Stocks that were delisted or suspended have no price history, so they drop out. That usually makes results look a little better than they were.</li>
            <li>Returns use adjusted closing prices and ignore brokerage, taxes and the price you could actually get.</li>
            <li>This is research, not advice. Stock AI is not registered with SEBI as an investment adviser or research analyst.</li>
          </ul>
          <p className="mt-4 text-xs text-muted">
            Recalculated every Sunday{updated ? ` · last run ${day(updated)}` : ''}. Sources:{' '}
            {sources.map((x, i) => (
              <span key={x.url}>
                {i > 0 && ' · '}
                <a href={x.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:text-ink hover:underline">
                  {x.name} <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
