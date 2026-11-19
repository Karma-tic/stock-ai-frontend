import { useEffect, useMemo, useRef, useState } from 'react';
import { getStockEvents, getStockHistory } from '../../lib/api';
import Segmented from '../ui/Segmented';
import Skeleton from '../ui/Skeleton';

type Point = { d: string; c: number };
type History = { points: Point[]; source_name?: string; source_url?: string; interval?: string };
type ChartEvent = { label: string; short_title: string; published_at?: string; source_url?: string; source_name?: string };
type Built = { range: Range; pts: Point[]; x: (i: number) => number; y: (v: number) => number; line: string; area: string; min: number; max: number; change: number; up: boolean };
const RANGES = ['1m', '6m', '1y', '5y'] as const;
type Range = (typeof RANGES)[number];

const W = 600;
const H = 160;
const PAD_Y = 10;

const fmtDate = (iso: string, style: 'long' | 'day' | 'month') =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(
    'en-IN',
    style === 'long' ? { day: 'numeric', month: 'short', year: 'numeric' } : style === 'day' ? { day: 'numeric', month: 'short' } : { month: 'short', year: 'numeric' },
  );
const fmtPrice = (v: number) => `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Observed closing prices from the backend's history endpoint. Hidden entirely if the data is not available.
export default function PriceChart({ ticker }: { ticker: string }) {
  const [range, setRange] = useState<Range>('1y');
  const [cache, setCache] = useState<Partial<Record<Range, History | 'error'>>>({});
  const [hover, setHover] = useState<number | null>(null);
  const [events, setEvents] = useState<ChartEvent[]>([]);
  // The previous range's line stays on screen and fades out while the new one fades in.
  const [prev, setPrev] = useState<Built | null>(null);
  const lastChart = useRef<Built | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setCache({});
    setPrev(null);
    lastChart.current = null;
    let alive = true;
    getStockEvents(ticker)
      .then((r) => alive && setEvents((r.data?.past as ChartEvent[]) || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [ticker]);

  const data = cache[range];
  useEffect(() => {
    if (data) return;
    let alive = true;
    getStockHistory(ticker, range)
      .then((r) => alive && setCache((c) => ({ ...c, [range]: r.data?.points?.length > 1 ? r.data : 'error' })))
      .catch(() => alive && setCache((c) => ({ ...c, [range]: 'error' })));
    return () => {
      alive = false;
    };
  }, [ticker, range, data]);

  const chart = useMemo<Built | null>(() => {
    if (!data || data === 'error') return null;
    const pts = data.points;
    const prices = pts.map((p) => p.c);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    const x = (i: number) => (i / (pts.length - 1)) * W;
    const y = (v: number) => PAD_Y + (1 - (v - min) / span) * (H - PAD_Y * 2);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.c).toFixed(1)}`).join('');
    const first = pts[0].c;
    const last = pts[pts.length - 1].c;
    return { range, pts, x, y, line, area: `${line}L${W},${H}L0,${H}Z`, min, max, change: ((last - first) / first) * 100, up: last >= first };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!chart) return;
    const before = lastChart.current;
    lastChart.current = chart;
    if (!before || before.range === chart.range) return;
    setPrev(before);
    const t = window.setTimeout(() => setPrev(null), 260);
    return () => window.clearTimeout(t);
  }, [chart]);

  // Results dates and notable filings in this range, placed on the nearest trading day.
  const markers = useMemo(() => {
    if (!chart) return [];
    const firstDay = chart.pts[0].d;
    const lastDay = chart.pts[chart.pts.length - 1].d;
    const seen = new Set<number>();
    return events
      .map((ev) => {
        const day = (ev.published_at || '').slice(0, 10);
        if (!day || day < firstDay || day > lastDay) return null;
        let idx = chart.pts.findIndex((p) => p.d >= day);
        if (idx < 0) idx = chart.pts.length - 1;
        if (seen.has(idx)) return null;
        seen.add(idx);
        return { ...ev, idx, day };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.idx - b.idx)
      // Keep dots at least ~3% of the width apart so a busy month stays tappable.
      .filter((m: any, i: number, arr: any[]) => i === 0 || (m.idx - arr[i - 1].idx) / chart.pts.length >= 0.03)
      .slice(-12) as (ChartEvent & { idx: number; day: string })[];
  }, [chart, events]);

  // Every range failed (e.g. backend not deployed yet): show nothing rather than a broken box.
  if (data === 'error' && range === '1y') return null;

  const onMove = (e: React.PointerEvent) => {
    if (!chart || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    setHover(Math.round(ratio * (chart.pts.length - 1)));
  };

  const active = chart && hover != null ? chart.pts[hover] : null;
  const tone = chart?.up ? 'up' : 'down';

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-[2.5rem]">
          {chart && (
            <>
              <p className="text-xs font-medium text-muted">{active ? fmtDate(active.d, 'long') : `Change over ${range.toUpperCase()}`}</p>
              <p className="num text-sm font-semibold">
                {active ? (
                  <span className="text-ink">{fmtPrice(active.c)}</span>
                ) : (
                  <span className={chart.up ? 'text-up' : 'text-down'}>
                    {chart.up ? '▲ +' : '▼ −'}
                    {Math.abs(chart.change).toFixed(1)}%
                  </span>
                )}
              </p>
            </>
          )}
        </div>
        <Segmented<Range>
          label="Chart range"
          value={range}
          onChange={(r) => {
            setHover(null);
            setRange(r);
          }}
          options={RANGES.map((r) => ({ value: r, label: r.toUpperCase() }))}
        />
      </div>

      <div className="relative mt-3">
        {!data && !lastChart.current && <Skeleton className="h-40 w-full" />}
        {!data && lastChart.current && (
          // Loading another range: keep the last line, dimmed, so nothing flashes.
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-40 w-full opacity-40 transition-opacity duration-200" aria-hidden="true">
            <path d={lastChart.current.line} fill="none" stroke="rgb(var(--muted))" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        {prev && chart && (
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart-out pointer-events-none absolute inset-x-0 top-0 h-40 w-full" aria-hidden="true">
            <path d={prev.line} fill="none" stroke={`rgb(var(--${prev.up ? 'up' : 'down'}))`} strokeWidth="1.75" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
        )}
        {data === 'error' && <p className="flex h-40 items-center justify-center text-sm text-muted">No price history for this range.</p>}
        {chart && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            key={chart.range}
            className={`h-40 w-full touch-pan-y ${prev ? 'chart-in' : ''}`}
            role="img"
            aria-label={`${ticker} closing price over ${range}: from ${fmtPrice(chart.pts[0].c)} to ${fmtPrice(chart.pts[chart.pts.length - 1].c)}`}
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id={`pc-fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`rgb(var(--${tone}))`} stopOpacity="0.16" />
                <stop offset="100%" stopColor={`rgb(var(--${tone}))`} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={chart.area} fill={`url(#pc-fill-${tone})`} />
            <path d={chart.line} fill="none" stroke={`rgb(var(--${tone}))`} strokeWidth="1.75" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            {active && hover != null && (
              <>
                <line x1={chart.x(hover)} x2={chart.x(hover)} y1={0} y2={H} stroke="rgb(var(--text) / 0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </>
            )}
          </svg>
        )}
        {chart && active && hover != null && (
          // An HTML dot, so it stays round while the SVG stretches to the card width
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface ${chart.up ? 'bg-up' : 'bg-down'}`}
            style={{ left: `${(chart.x(hover) / W) * 100}%`, top: `${(chart.y(active.c) / H) * 100}%` }}
          />
        )}
        {chart && active && hover != null && (
          // Floating price and date, kept inside the card at both ends.
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap ${chart.y(active.c) / H < 0.4 ? 'bottom-1' : 'top-1'} rounded-control border border-line bg-surface2 px-2 py-1 text-center shadow-lift`}
            style={{ left: `${Math.min(88, Math.max(12, (chart.x(hover) / W) * 100))}%` }}
          >
            <span className="num block text-xs font-semibold text-ink">{fmtPrice(active.c)}</span>
            <span className="block text-[10px] text-muted">{fmtDate(active.d, 'long')}</span>
          </span>
        )}
      </div>

      {chart && markers.length > 0 && (
        <div className="relative mt-1 h-6" aria-label="Results and filings on this chart">
          {markers.map((m) => {
            const left = `${(chart.x(m.idx) / W) * 100}%`;
            const label = `${m.label}, ${fmtDate(m.day, 'long')}: ${m.short_title}`;
            const dot = <span className="block h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent transition group-hover:scale-125" />;
            return m.source_url ? (
              <a
                key={m.idx}
                href={m.source_url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={`${label}. Opens the source.`}
                className="group absolute top-0 grid h-6 w-6 -translate-x-1/2 place-items-center"
                style={{ left }}
              >
                {dot}
              </a>
            ) : (
              <span key={m.idx} title={label} className="group absolute top-0 grid h-6 w-6 -translate-x-1/2 place-items-center" style={{ left }}>
                {dot}
              </span>
            );
          })}
        </div>
      )}

      {chart && markers.length > 0 && (
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          Results and notable filings. Tap a dot to open it.
        </p>
      )}

      {chart && (
        <div className="num mt-2 flex items-center justify-between text-[11px] text-muted">
          <span>{fmtDate(chart.pts[0].d, range === '1m' ? 'day' : 'month')}</span>
          {data && data !== 'error' && data.source_url ? (
            <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="-my-2 inline-flex min-h-[36px] items-center font-sans hover:text-ink hover:underline">
              Closing prices · {data.source_name || 'Source'}
            </a>
          ) : null}
          <span>{fmtDate(chart.pts[chart.pts.length - 1].d, range === '1m' ? 'day' : 'month')}</span>
        </div>
      )}
    </div>
  );
}
