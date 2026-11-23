// src/components/ToolsHub.tsx — /tools
// A bento of the calculators. Each tool has its own colour and a small live preview of what it does;
// the SIP card is a working mini calculator. Motion is CSS-only and switches off for reduced motion.
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Calculator, Compass, PieChart, Scale, TrendingUp, Wrench, type LucideIcon } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import { GOALS } from './invest/goals';

type Tone = { text: string; chip: string; glow: string; ring: string };
const TONES: Record<string, Tone> = {
  emerald: { text: 'text-emerald-600 dark:text-emerald-400', chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', glow: '16 185 129', ring: 'hover:border-emerald-500/45' },
  cobalt: { text: 'text-accent', chip: 'bg-accent/10 text-accent', glow: '79 109 245', ring: 'hover:border-accent/45' },
  amber: { text: 'text-amber-600 dark:text-amber-400', chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', glow: '245 158 11', ring: 'hover:border-amber-500/45' },
  violet: { text: 'text-violet-600 dark:text-violet-400', chip: 'bg-violet-500/10 text-violet-700 dark:text-violet-300', glow: '139 92 246', ring: 'hover:border-violet-500/45' },
  rose: { text: 'text-rose-600 dark:text-rose-400', chip: 'bg-rose-500/10 text-rose-700 dark:text-rose-300', glow: '244 63 94', ring: 'hover:border-rose-500/45' },
  sky: { text: 'text-sky-600 dark:text-sky-400', chip: 'bg-sky-500/10 text-sky-700 dark:text-sky-300', glow: '14 165 233', ring: 'hover:border-sky-500/45' },
};

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Card shell: tinted spotlight follows the pointer (CSS variables, no React state). */
function Shell({ tone, className = '', children }: { tone: Tone; className?: string; children: ReactNode }) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={move}
      className={`tool-card group relative isolate flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 sm:p-6 ${tone.ring} ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), rgb(${tone.glow} / 0.13), transparent 65%)` }} />
      {children}
    </div>
  );
}

function Head({ Icon, tone, title, text }: { Icon: LucideIcon; tone: Tone; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${tone.chip}`}><Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /></span>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

function Open({ to, tone, label = 'Open' }: { to: string; tone: Tone; label?: string }) {
  return (
    <Link to={to} className={`relative z-[1] mt-auto inline-flex min-h-[40px] items-center gap-1 pt-4 text-sm font-semibold ${tone.text} after:absolute after:inset-0`}>
      {label} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

const inr = (v: number) =>
  v >= 1e7 ? `₹${(v / 1e7).toFixed(2)} Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(1)} L` : `₹${Math.round(v).toLocaleString('en-IN')}`;

/* ── SIP: a real mini calculator ─────────────────────────────────────────── */
const SIP_RATE = 12;
function SipCard() {
  const t = TONES.emerald;
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const pts = useMemo(() => {
    const i = SIP_RATE / 12 / 100;
    return Array.from({ length: years + 1 }, (_, y) => {
      const n = y * 12;
      return { inv: monthly * n, val: n ? monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : 0 };
    });
  }, [monthly, years]);
  const last = pts[pts.length - 1];
  // Fixed 40-step x axis so the path keeps its point count and `d` can transition smoothly.
  const W = 320, H = 120, max = last.val || 1;
  const path = (key: 'inv' | 'val') => Array.from({ length: 41 }, (_, k) => {
    const yf = (k / 40) * years;
    const lo = pts[Math.floor(yf)], hi = pts[Math.min(Math.ceil(yf), years)];
    const v = lo[key] + (hi[key] - lo[key]) * (yf - Math.floor(yf));
    return `${k ? 'L' : 'M'}${((k / 40) * W).toFixed(1)},${(H - (v / max) * (H - 8)).toFixed(1)}`;
  }).join(' ');
  const area = `${path('val')} L${W},${H} L0,${H} Z`;

  return (
    <Shell tone={t} className="md:col-span-2">
      <Head Icon={Calculator} tone={t} title="SIP calculator" text="Drag the amount. See what a monthly SIP could grow to." />
      <div className="mt-5 grid items-end gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="relative z-[1] space-y-4">
          <div>
            <label htmlFor="sip-mini" className="flex items-baseline justify-between text-xs text-muted">
              Every month <span className="num text-base font-semibold text-ink">₹{monthly.toLocaleString('en-IN')}</span>
            </label>
            <input id="sip-mini" type="range" min={500} max={50000} step={500} value={monthly} onChange={e => setMonthly(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-500" />
          </div>
          <div role="radiogroup" aria-label="For how many years" className="flex gap-1.5">
            {[5, 10, 15, 25].map(y => (
              <button key={y} type="button" role="radio" aria-checked={years === y} onClick={() => setYears(y)}
                className={`num h-8 flex-1 rounded-full border text-xs font-semibold transition ${years === y ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-line text-ink/80 hover:border-emerald-500/50'}`}>
                {y} yrs
              </button>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-[11px] text-muted">You put in</dt><dd className="num font-semibold text-ink">{inr(last.inv)}</dd></div>
            <div><dt className="text-[11px] text-muted">Could grow to</dt><dd className={`num text-lg font-semibold ${t.text}`}>{inr(last.val)}</dd></div>
          </dl>
        </div>
        <figure className="m-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full overflow-visible" role="img"
            aria-label={`₹${monthly} a month for ${years} years at ${SIP_RATE}% could grow to ${inr(last.val)}`}>
            <defs>
              <linearGradient id="sip-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#sip-fill)" className="tool-morph" />
            <path d={path('val')} fill="none" stroke="rgb(16 185 129)" strokeWidth="2.5" strokeLinecap="round" className="tool-morph" />
            <path d={path('inv')} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="tool-morph text-ink/35" />
          </svg>
          <figcaption className="mt-1 flex justify-between text-[11px] text-muted">
            <span>Dashed: what you put in</span><span>At an assumed {SIP_RATE}% a year</span>
          </figcaption>
        </figure>
      </div>
      <Open to={`/tools/sip-calculator?amount=${monthly}&years=${years}&rate=${SIP_RATE}`} tone={t} label="Open the full calculator" />
    </Shell>
  );
}

/* ── Invest Explorer: goals cycle and show their three options ───────────── */
function InvestCard() {
  const t = TONES.cobalt;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduceMotion()) return;
    const id = window.setInterval(() => setI(v => (v + 1) % GOALS.length), 2600);
    return () => window.clearInterval(id);
  }, [paused]);
  const g = GOALS[i];
  return (
    <Shell tone={t} className="lg:row-span-2">
      <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="flex h-full flex-col">
        <Head Icon={Compass} tone={t} title="Invest Explorer" text="Pick what the money is for and see three options worth a look." />
        <ul className="relative z-[1] mt-5 grid grid-cols-2 gap-1.5">
          {GOALS.map((x, k) => {
            const Icon = x.icon;
            return (
              <li key={x.id}>
                <Link to={`/invest?goal=${x.id}`} onFocus={() => { setI(k); setPaused(true); }} onPointerEnter={() => setI(k)}
                  className={`flex min-h-[40px] items-center gap-2 rounded-control border px-2.5 text-xs font-medium transition ${k === i ? 'border-accent bg-accent/10 text-ink' : 'border-line text-muted hover:text-ink'}`}>
                  <Icon className={`h-4 w-4 shrink-0 ${k === i ? 'text-accent' : ''}`} aria-hidden="true" /> <span className="truncate">{x.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 rounded-control bg-ink/[0.035] p-3" aria-live="polite">
          <p className="text-[11px] text-muted">Options to look at for {g.forText}</p>
          <ol key={g.id} className="mt-2 space-y-1.5">
            {g.picks.map((p, k) => (
              <li key={p.id} className="tool-rise flex items-center gap-2 text-sm text-ink" style={{ '--d': `${k * 90}ms` } as CSSProperties}>
                <span className="num grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">{k + 1}</span>
                <span className="truncate">{PICK_NAMES[p.id] || p.id}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-5">
          <p className="text-[11px] text-muted">All 35 options, from lowest to highest risk</p>
          <div className="mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            {LADDER.map(([n, c], k) => (
              <span key={k} className="tool-bar h-full" style={{ flex: n, background: c, '--d': `${k * 90}ms` } as CSSProperties} />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-muted"><span>FDs, PPF, govt schemes</span><span>Equity, crypto</span></div>
        </div>
        <Open to="/invest" tone={t} />
      </div>
    </Shell>
  );
}
const LADDER: [number, string][] = [[13, 'rgb(79 109 245 / 0.35)'], [2, 'rgb(79 109 245 / 0.5)'], [9, 'rgb(79 109 245 / 0.7)'], [6, 'rgb(245 158 11 / 0.85)'], [5, 'rgb(244 63 94 / 0.85)']];
const PICK_NAMES: Record<string, string> = {
  liquid: 'Liquid funds', sav: 'Savings account', fd: 'Bank FD', sfbfd: 'Small finance bank FD', debtmf: 'Debt mutual funds',
  scss: 'Senior Citizen Savings', mis: 'Post Office MIS', reit: 'REITs', ppf: 'PPF', elss: 'ELSS funds', nps: 'NPS',
  index: 'Nifty 50 index funds', hybrid: 'Hybrid funds', goldetf: 'Gold ETFs', epf: 'EPF / VPF',
};

/* ── Small previews ──────────────────────────────────────────────────────── */
function LumpsumPreview() {
  const bars = [['Today', 1], ['5 yrs', 1.76], ['10 yrs', 3.11], ['20 yrs', 9.65]] as const;
  return (
    <div className="mt-5 flex h-28 items-end gap-3" role="img" aria-label="₹1 lakh at 12% a year: about ₹1.8 lakh in 5 years, ₹3.1 lakh in 10 and ₹9.6 lakh in 20">
      {bars.map(([l, v], k) => (
        <div key={l} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="num text-[11px] font-semibold text-amber-700 dark:text-amber-300">{v.toFixed(1)}×</span>
          <div className="tool-grow w-full origin-bottom rounded-t-md bg-gradient-to-t from-amber-500/70 to-amber-400"
            style={{ height: `${Math.max(8, (v / 9.65) * 72)}px`, '--d': `${k * 120}ms` } as CSSProperties} />
          <span className="text-[11px] text-muted">{l}</span>
        </div>
      ))}
    </div>
  );
}

function ComparePreview() {
  const rows = [['P/E', 62, 38], ['Dividend yield', 30, 70], ['52-week range', 75, 50]] as const;
  return (
    <div className="mt-5 space-y-3" aria-hidden="true">
      <div className="flex gap-4 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-500" />Stock A</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-ink/40" />Stock B</span>
      </div>
      {rows.map(([l, a, b], k) => (
        <div key={l}>
          <p className="text-[11px] text-muted">{l}</p>
          <div className="mt-1 space-y-1">
            <div className="tool-bar h-1.5 rounded-full bg-violet-500 transition-[width] duration-500 group-hover:w-[var(--b)]" style={{ width: `${a}%`, '--b': `${b}%`, '--d': `${k * 100}ms` } as CSSProperties} />
            <div className="tool-bar h-1.5 rounded-full bg-ink/25 transition-[width] duration-500 group-hover:w-[var(--a)]" style={{ width: `${b}%`, '--a': `${a}%`, '--d': `${k * 100 + 50}ms` } as CSSProperties} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BrokeragePreview() {
  const segs = [['Brokerage', 0.34, 'rgb(244 63 94)'], ['STT', 0.28, 'rgb(251 113 133)'], ['GST', 0.16, 'rgb(253 164 175)'], ['Exchange', 0.12, 'rgb(190 18 60)'], ['Stamp duty', 0.1, 'rgb(136 19 55)']] as const;
  let off = 0;
  return (
    <div className="mt-5 flex items-center gap-5" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="h-24 w-24 shrink-0 -rotate-90 transition-transform duration-700 group-hover:rotate-[0deg]">
        <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="12" className="text-ink/[0.06]" />
        {segs.map(([l, f, c], k) => {
          const el = (
            <circle key={l} cx="40" cy="40" r="30" fill="none" stroke={c} strokeWidth="12" pathLength={1}
              strokeDasharray={`${f - 0.012} ${1 - f + 0.012}`} strokeDashoffset={-off}
              className="tool-seg" style={{ '--d': `${k * 110}ms` } as CSSProperties} />
          );
          off += f;
          return el;
        })}
      </svg>
      <ul className="space-y-1 text-[11px] text-muted">
        {segs.map(([l, , c]) => <li key={l} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm" style={{ background: c }} />{l}</li>)}
      </ul>
    </div>
  );
}

function FnoPreview() {
  // Long call payoff: flat loss below the strike, rising profit above it.
  const d = 'M0,70 L150,70 L300,10';
  return (
    <div className="mt-5" aria-hidden="true">
      <svg viewBox="0 0 300 90" className="h-28 w-full overflow-visible">
        <defs>
          <clipPath id="fno-up"><rect x="0" y="0" width="300" height="52" /></clipPath>
          <clipPath id="fno-down"><rect x="0" y="52" width="300" height="40" /></clipPath>
        </defs>
        <line x1="0" x2="300" y1="52" y2="52" stroke="currentColor" strokeDasharray="3 4" className="text-ink/30" />
        <text x="2" y="47" className="fill-current text-[9px] text-muted">Break-even</text>
        <path d={`${d} L300,52 L0,52 Z`} clipPath="url(#fno-up)" fill="rgb(14 165 233 / 0.18)" />
        <path d={`${d} L300,52 L0,52 Z`} clipPath="url(#fno-down)" fill="rgb(244 63 94 / 0.14)" />
        <path d={d} fill="none" stroke="rgb(14 165 233)" strokeWidth="2.5" strokeLinejoin="round" pathLength={1} className="tool-draw" />
        <circle r="5" fill="rgb(14 165 233)" stroke="white" strokeWidth="2" className="tool-orbit">
          <animateMotion dur="5s" repeatCount="indefinite" path={d} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
        </circle>
      </svg>
      <div className="flex justify-between text-[11px] text-muted"><span>Price falls</span><span>Strike</span><span>Price rises</span></div>
    </div>
  );
}

function ToolCard({ tone, Icon, title, text, to, className, children }: { tone: Tone; Icon: LucideIcon; title: string; text: string; to: string; className?: string; children: ReactNode }) {
  return (
    <Shell tone={tone} className={className}>
      <Head Icon={Icon} tone={tone} title={title} text={text} />
      {children}
      <Open to={to} tone={tone} />
    </Shell>
  );
}

export default function ToolsHub() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Free Financial Calculators for Indian Investors | Stock AI"
        description="Use free SIP, lumpsum, brokerage, F&O, and stock comparison tools built for Indian stock market investors."
        canonicalPath="/tools"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader eyebrow="Tools" icon={Wrench} title="Free calculators for Indian investors" intro="Plan, compare and check the numbers. Every result has a link you can share." />
        <div className="tools-bento grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SipCard />
          <InvestCard />
          <ToolCard tone={TONES.amber} Icon={TrendingUp} title="Lumpsum calculator" text="How a one-time investment could grow over the years you choose." to="/tools/lumpsum-calculator">
            <LumpsumPreview />
          </ToolCard>
          <ToolCard tone={TONES.violet} Icon={Scale} title="Compare stocks" text="NSE stocks side by side on price, P/E, dividend yield, 52-week range and market cap." to="/tools/stock-comparison">
            <ComparePreview />
          </ToolCard>
          <ToolCard tone={TONES.rose} Icon={PieChart} title="Brokerage calculator" text="Every charge on a delivery or intraday trade, and what you keep." to="/tools/brokerage-calculator">
            <BrokeragePreview />
          </ToolCard>
          <ToolCard tone={TONES.sky} Icon={Activity} title="F&O calculator" text="Your real profit or loss on a futures or options trade after all charges." to="/tools/fno-calculator" className="md:col-span-2">
            <FnoPreview />
          </ToolCard>
        </div>
        <p className="mt-6 text-xs text-muted">Calculators show estimates from the numbers you enter. Returns are not guaranteed.</p>
      </div>
    </div>
  );
}
