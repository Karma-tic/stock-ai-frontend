// src/components/invest/GrowthTab.tsx — project a SIP + lump sum across up to three options.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { InvestOption } from '../../data/investCatalog';
import { futureValue, inr } from './investShared';

export interface Series { id: string; rate: number }
interface Props { options: InvestOption[]; series: Series[]; setSeries: (s: Series[]) => void; defaultRate: (o: InvestOption) => number }

// Series colours: cobalt, amber, ink. Green/red stay reserved for up/down.
const COLORS = ['text-accent', 'text-caution', 'text-ink/70'];
const SWATCH = ['bg-accent', 'bg-caution', 'bg-ink/70'];

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1))));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

function Slider({ id, label, value, display, min, max, step, onChange }: { id: string; label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex justify-between text-sm font-semibold text-ink">
        <span>{label}</span><span className="num text-accent">{display}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-cobalt" />
    </div>
  );
}

export default function GrowthTab({ options, series, setSeries, defaultRate }: Props) {
  const [lump, setLump] = useState(100000);
  const [sip, setSip] = useState(10000);
  const [years, setYears] = useState(15);
  const [infl, setInfl] = useState(5);

  const pickable = options.filter(o => !o.tags.includes('warning'));
  const byId = (id: string) => options.find(o => o.id === id);

  const data = useMemo(
    () => series.map(s => Array.from({ length: years + 1 }, (_, y) => futureValue(lump, sip, s.rate, y))),
    [series, lump, sip, years],
  );
  const invested = Array.from({ length: years + 1 }, (_, y) => lump + sip * 12 * y);
  const top = niceMax(Math.max(...data.flat(), ...invested));
  const W = 640, H = 300, L = 64, R = 16, T = 16, B = 32;
  const x = (y: number) => L + (W - L - R) * (y / years);
  const yv = (v: number) => T + (H - T - B) * (1 - v / top);
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${yv(v).toFixed(1)}`).join('');
  const step = years <= 10 ? 1 : years <= 20 ? 2 : 5;
  const inflF = Math.pow(1 + infl / 100, years);
  const totalIn = invested[years];

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink">What could it grow to?</h2>
        <p className="mt-1 text-muted">
          Compare up to three options at their typical return, before and after inflation. Market-linked results swing year to year; the line is a smoothed average.
          For a single SIP use the <Link to="/tools/sip-calculator" className="font-semibold text-accent underline underline-offset-2">SIP calculator</Link>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
        <div className="rounded-card border border-line bg-surface p-5 space-y-5">
          <Slider id="invest-lump" label="Lump sum today" value={lump} display={inr(lump)} min={0} max={2000000} step={10000} onChange={setLump} />
          <Slider id="invest-sip" label="Monthly SIP" value={sip} display={inr(sip)} min={0} max={100000} step={500} onChange={setSip} />
          <Slider id="invest-years" label="Years" value={years} display={`${years} yrs`} min={1} max={30} step={1} onChange={setYears} />
          <Slider id="invest-infl" label="Inflation assumption" value={infl} display={`${infl}%`} min={0} max={10} step={0.5} onChange={setInfl} />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Options (return % is editable)</p>
            {series.map((s, k) => (
              <div key={k} className="grid grid-cols-[10px_1fr_72px] items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${SWATCH[k]}`} />
                <select id={`invest-series-${k}`} aria-label={`Option ${k + 1}`} value={s.id} className="h-10 min-w-0 rounded-control border border-line bg-surface px-2 text-sm text-ink"
                  onChange={e => { const o = byId(e.target.value)!; const next = [...series]; next[k] = { id: o.id, rate: defaultRate(o) }; setSeries(next); }}>
                  {pickable.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <input id={`invest-rate-${k}`} aria-label={`Return % for option ${k + 1}`} type="number" step={0.1} min={-20} max={40} value={s.rate}
                  className="num h-10 rounded-control border border-line bg-surface px-2 text-sm text-ink"
                  onChange={e => { const next = [...series]; next[k] = { ...s, rate: parseFloat(e.target.value) || 0 }; setSeries(next); }} />
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-card border border-line bg-surface p-4 overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[480px] h-auto" role="img" aria-label="Projected growth by year">
              {[0, 1, 2, 3, 4].map(t => {
                const v = (top * t) / 4;
                return (
                  <g key={t} className="text-ink">
                    <line x1={L} x2={W - R} y1={yv(v)} y2={yv(v)} stroke="currentColor" strokeOpacity={0.1} />
                    <text x={L - 8} y={yv(v) + 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.6} className="num">{inr(v)}</text>
                  </g>
                );
              })}
              {Array.from({ length: Math.floor(years / step) + 1 }, (_, i) => i * step).map(y => (
                <text key={y} x={x(y)} y={H - 10} textAnchor="middle" fontSize={11} className="text-ink" fill="currentColor" fillOpacity={0.6}>{y}y</text>
              ))}
              <path d={path(invested)} fill="none" className="text-ink" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="4 4" />
              <text x={W - R} y={yv(invested[years]) - 6} textAnchor="end" fontSize={11} className="text-ink" fill="currentColor" fillOpacity={0.6}>invested</text>
              {data.map((arr, k) => (
                <g key={k} className={COLORS[k]}>
                  <path d={`${path(arr)} L${x(years)},${yv(0)} L${x(0)},${yv(0)} Z`} fill="currentColor" fillOpacity={0.07} />
                  <path d={path(arr)} fill="none" stroke="currentColor" strokeWidth={2.5} />
                  <circle cx={x(years)} cy={yv(arr[years])} r={4} fill="currentColor" />
                </g>
              ))}
            </svg>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {series.map((s, k) => {
              const v = data[k][years];
              return (
                <div key={k} className="rounded-control bg-ink/[0.04] p-4">
                  <p className="flex items-center gap-2 text-xs text-muted"><span className={`h-2.5 w-2.5 rounded-sm ${SWATCH[k]}`} />{byId(s.id)?.name} @ {s.rate}%</p>
                  <p className="mt-1 text-xl font-bold num text-ink">{inr(v)}</p>
                  <p className="text-xs text-muted">Gain {inr(v - totalIn)} · {inr(v / inflF)} in today's money</p>
                </div>
              );
            })}
            <div className="rounded-control bg-ink/[0.04] p-4">
              <p className="text-xs text-muted">You put in</p>
              <p className="mt-1 text-xl font-bold num text-ink">{inr(totalIn)}</p>
              <p className="text-xs text-muted">Before tax on gains</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
