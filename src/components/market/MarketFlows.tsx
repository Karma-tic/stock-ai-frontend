import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getMarketFlows } from '../../lib/api';
import { Change } from '../ui/Price';

type Flow = { trade_date: string; category: 'FII' | 'DII'; net_cr: number | null; buy_cr?: number | null; sell_cr?: number | null };
type Day = { date: string; fii: number | null; dii: number | null };
type Index = { last: number | null; change_pct: number | null };
type View = { latest: Flow[]; history: Day[]; indices: { nifty?: Index; vix?: Index }; sources: { name: string; url: string }[]; note: string };

const crore = (v: number) => `₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
const signed = (v: number) => `${v >= 0 ? '+' : '−'}${crore(v)}`;
const shortDay = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

function NetFigure({ label, who, value }: { label: string; who: string; value: number | null | undefined }) {
  const ok = typeof value === 'number';
  const up = ok && value! >= 0;
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className={`num mt-0.5 text-lg font-semibold ${!ok ? 'text-muted' : up ? 'text-up' : 'text-down'}`}>
        {ok ? (
          <>
            <span aria-hidden="true" className="text-[0.75em]">{up ? '▲' : '▼'}</span> {signed(value!)}
          </>
        ) : (
          'n/a'
        )}
      </p>
      <p className="text-[11px] text-muted">{ok ? `${who} ${up ? 'bought more than they sold' : 'sold more than they bought'}` : 'Not published yet'}</p>
    </div>
  );
}

// Diverging bars for the last sessions: above the line = net buying, below = net selling.
function FlowBars({ days, pick, label }: { days: Day[]; pick: 'fii' | 'dii'; label: string }) {
  const vals = days.map((d) => d[pick]).filter((v): v is number => typeof v === 'number');
  if (vals.length < 2) return null;
  const max = Math.max(...vals.map(Math.abs), 1);
  return (
    <div>
      <p className="text-[11px] font-medium text-muted">{label}</p>
      <div className="mt-1.5 flex h-14 items-stretch gap-1" role="img" aria-label={`${label}, last ${days.length} sessions: ${days.map((d) => `${shortDay(d.date)} ${typeof d[pick] === 'number' ? signed(d[pick]!) : 'n/a'}`).join(', ')}`}>
        {days.map((d) => {
          const v = d[pick];
          const h = typeof v === 'number' ? Math.max(2, (Math.abs(v) / max) * 50) : 0;
          return (
            <div key={d.date} className="relative flex-1" title={`${shortDay(d.date)}: ${typeof v === 'number' ? signed(v) : 'n/a'}`}>
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
              {typeof v === 'number' && (
                <span
                  className={`absolute inset-x-0 rounded-[2px] ${v >= 0 ? 'bg-up/70' : 'bg-down/70'}`}
                  style={v >= 0 ? { bottom: '50%', height: `${h}%` } : { top: '50%', height: `${h}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// "Market today": who bought and sold, plus Nifty and the fear gauge. Facts, not a forecast.
export default function MarketFlows({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<View | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getMarketFlows()
      .then((r) => alive && setData(r.data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return null;
  if (!data) return <div className={`skeleton ${compact ? 'h-28' : 'h-44'}`} aria-hidden="true" />;

  const fii = data.latest.find((f) => f.category === 'FII');
  const dii = data.latest.find((f) => f.category === 'DII');
  const date = fii?.trade_date || dii?.trade_date;
  const { nifty, vix } = data.indices || {};
  if (!fii && !dii && !nifty) return null;

  const read =
    typeof fii?.net_cr === 'number' && typeof dii?.net_cr === 'number'
      ? `Foreign investors ${fii.net_cr >= 0 ? 'bought' : 'sold'} a net ${crore(fii.net_cr)} and domestic institutions ${dii.net_cr >= 0 ? 'bought' : 'sold'} ${crore(dii.net_cr)}${
          Math.sign(fii.net_cr) !== Math.sign(dii.net_cr) ? ', pulling in opposite directions.' : '.'
        }`
      : null;

  if (compact)
    return (
      <section aria-label="Market today" className="rounded-card border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink">Big money{date ? ` · ${shortDay(date)}` : ''}</h2>
          <Link to="/today" className="text-xs font-semibold text-accent hover:underline">
            Details
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NetFigure label="Foreign (FII)" who="FIIs" value={fii?.net_cr} />
          <NetFigure label="Domestic (DII)" who="DIIs" value={dii?.net_cr} />
        </div>
        {vix?.last != null && (
          <p className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
            India VIX (fear gauge) <span className="num text-ink">{vix.last.toFixed(2)} {vix.change_pct != null && <Change value={vix.change_pct} className="text-[11px]" />}</span>
          </p>
        )}
      </section>
    );

  return (
    <section aria-labelledby="flows-heading" className="mb-6 rounded-card border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="flows-heading" className="text-sm font-semibold text-ink">
          Market today{date ? <span className="font-normal text-muted"> · flows for {shortDay(date)}</span> : null}
        </h2>
        <span className="text-[11px] text-muted">{data.note}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        <NetFigure label="Foreign investors (FII)" who="FIIs" value={fii?.net_cr} />
        <NetFigure label="Domestic institutions (DII)" who="DIIs" value={dii?.net_cr} />
        <div>
          <p className="text-xs text-muted">Nifty 50</p>
          <p className="num mt-0.5 text-lg font-semibold text-ink">{nifty?.last != null ? nifty.last.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : 'n/a'}</p>
          {nifty?.change_pct != null && <Change value={nifty.change_pct} className="text-xs" />}
        </div>
        <div>
          <p className="text-xs text-muted">India VIX</p>
          <p className="num mt-0.5 text-lg font-semibold text-ink">{vix?.last != null ? vix.last.toFixed(2) : 'n/a'}</p>
          <p className="text-[11px] text-muted">
            Expected swings; higher = more fear{vix?.change_pct != null && <> · <Change value={vix.change_pct} className="text-[11px]" /></>}
          </p>
        </div>
      </div>

      {read && <p className="mt-4 text-sm leading-relaxed text-ink/85">{read}</p>}

      {data.history.length >= 2 && (
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <FlowBars days={data.history} pick="fii" label={`Foreign investors, last ${data.history.length} sessions`} />
          <FlowBars days={data.history} pick="dii" label={`Domestic institutions, last ${data.history.length} sessions`} />
        </div>
      )}

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        {data.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink hover:underline">
            {s.name} <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </p>
    </section>
  );
}
