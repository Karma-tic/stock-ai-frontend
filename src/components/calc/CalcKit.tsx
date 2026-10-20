import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Link2, Table2 } from 'lucide-react';

export const inr = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v || 0));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// A number kept in the URL (?amount=5000), so a result can be shared as a link.
export function useUrlNumber(key: string, fallback: number, min: number, max: number) {
  const [params, setParams] = useSearchParams();
  const raw = Number(params.get(key));
  const [value, setValue] = useState(() => (params.has(key) && Number.isFinite(raw) ? clamp(raw, min, max) : fallback));
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === fallback) next.delete(key);
          else next.set(key, String(value));
          return next;
        },
        { replace: true },
      );
    }, 250);
    return () => window.clearTimeout(timer.current);
  }, [value, key, fallback, setParams]);

  return [value, setValue] as const;
}

// Slider paired with an editable number input; both stay in sync.
export function NumberSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  minLabel: string;
  maxLabel: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Number(draft.replace(/[^\d.]/g, ''));
    if (Number.isFinite(n) && draft.trim() !== '') onChange(clamp(n, min, max));
    else setDraft(String(value));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`${id}-n`} className="text-sm font-medium text-ink">
          {label}
        </label>
        <div className="flex h-10 items-center rounded-control border border-line bg-surface px-3 focus-within:border-accent/60">
          {prefix && <span className="num text-sm text-muted">{prefix}</span>}
          <input
            id={`${id}-n`}
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            className="num w-24 bg-transparent text-right text-sm font-semibold text-ink focus:outline-none"
          />
          {suffix && <span className="num ml-1 text-sm text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer accent-cobalt"
      />
      <div className="num mt-1 flex justify-between text-xs text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

// A result that rolls to its new value (400ms). Off under reduced motion.
export function RollingNumber({ value, format = inr, className = '' }: { value: number; format?: (v: number) => string; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 400);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(a + (value - a) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return (
    <span className={`tnum ${className}`} aria-live="polite">
      {format(shown)}
    </span>
  );
}

export type YearPoint = { year: number; invested: number; value: number };

// Stacked area: what you put in (cobalt) and what it grew by (up). Has a data-table toggle.
export function GrowthChart({ points }: { points: YearPoint[] }) {
  const [table, setTable] = useState(false);
  const W = 640;
  const H = 220;
  const pad = { l: 8, r: 8, t: 12, b: 24 };
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => pad.l + (i / Math.max(1, points.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const line = (key: 'invested' | 'value') => points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const base = `L${x(points.length - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
  const investedArea = `${line('invested')} ${base}`;
  const valueArea = `${line('value')} ${points
    .slice()
    .reverse()
    .map((p, i) => `L${x(points.length - 1 - i).toFixed(1)},${y(p.invested).toFixed(1)}`)
    .join(' ')} Z`;
  const ticks = points.filter((_, i) => points.length <= 8 || i % Math.ceil(points.length / 6) === 0 || i === points.length - 1);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-cobalt" aria-hidden="true" /> Invested
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-up" aria-hidden="true" /> Growth
          </span>
        </div>
        <button type="button" onClick={() => setTable((t) => !t)} aria-pressed={table} className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-accent">
          <Table2 className="h-3.5 w-3.5" /> {table ? 'Show chart' : 'Show table'}
        </button>
      </div>
      {table ? (
        <div className="mt-3 max-h-64 overflow-auto rounded-control border border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Year</th>
                <th className="px-3 py-2 text-right font-medium">Invested</th>
                <th className="px-3 py-2 text-right font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="num">
              {points.map((p) => (
                <tr key={p.year} className="border-t border-line">
                  <td className="px-3 py-1.5">{p.year}</td>
                  <td className="px-3 py-1.5 text-right">{inr(p.invested)}</td>
                  <td className="px-3 py-1.5 text-right text-ink">{inr(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={`Value grows to ${inr(points[points.length - 1]?.value || 0)} over ${points.length - 1} years`}>
          <path d={investedArea} className="fill-cobalt/45" />
          <path d={valueArea} className="fill-up/35" />
          <path d={line('value')} fill="none" className="stroke-up" strokeWidth="2" />
          {ticks.map((p) => (
            <text key={p.year} x={x(points.indexOf(p))} y={H - 6} textAnchor="middle" className="fill-muted text-[11px]">
              {p.year}y
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}

export function ShareResult() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ url, title: document.title });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* user closed the share sheet */
    }
  };
  return (
    <button type="button" onClick={share} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-control border border-line px-3 text-sm font-medium text-ink hover:bg-ink/[0.06]">
      {copied ? <Check className="h-4 w-4 text-up" /> : <Link2 className="h-4 w-4" />}
      {copied ? 'Link copied' : 'Share this result'}
    </button>
  );
}
