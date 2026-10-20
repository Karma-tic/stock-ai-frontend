import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink, Button } from '../ui/Button';
import useMagnetic from '../../lib/motion/useMagnetic';
import HeroBackdrop, { lineX, lineY } from './HeroBackdrop';
import LiveMarketCard from './LiveMarketCard';

type ThreadPath = { d: string; len: number };

// Three cobalt threads run from the rising line to the first rows of the live market card.
// Desktop only; they fade in while the line holds and out when it scatters.
// Why: it introduces the product's visual language (every claim tied to its source) in the first view.
function HeroThreads({ sectionRef, groupRef }: { sectionRef: React.RefObject<HTMLElement | null>; groupRef: React.RefObject<SVGGElement | null> }) {
  const [paths, setPaths] = useState<ThreadPath[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section || window.innerWidth < 1024) {
      setPaths([]);
      return;
    }
    const s = section.getBoundingClientRect();
    const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-thread-target]')).slice(0, 3);
    const card = section.querySelector<HTMLElement>('[data-thread-card]');
    if (!rows.length || !card) return;
    const c = card.getBoundingClientRect();
    const ax = c.left - s.left - 36;
    const u = Math.min(1, Math.max(0, (ax / s.width - 0.04) / 0.94));
    const ay = lineY(u, false) * s.height;
    const axOnLine = lineX(u) * s.width;
    const next = rows.map((row) => {
      const r = row.getBoundingClientRect();
      const tx = c.left - s.left + 10;
      const ty = r.top - s.top + r.height / 2;
      const d = `M ${axOnLine.toFixed(1)} ${ay.toFixed(1)} C ${(axOnLine + 34).toFixed(1)} ${ay.toFixed(1)}, ${(tx - 40).toFixed(1)} ${ty.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`;
      const len = Math.hypot(tx - axOnLine, ty - ay) * 1.25;
      return { d, len };
    });
    setBox({ w: s.width, h: s.height });
    setPaths(next);
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(section);
    section.querySelectorAll('[data-thread-card]').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [measure, sectionRef]);

  if (!paths.length) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
      <g ref={groupRef} style={{ opacity: 0, transition: 'opacity 500ms ease' }}>
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke="rgb(143 162 255)"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            strokeLinecap="round"
            className="hero-thread"
            style={{ strokeDasharray: p.len, strokeDashoffset: p.len, animationDelay: `${1150 + i * 120}ms` }}
          />
        ))}
        <circle r="3.5" fill="#fff" cx={paths[0].d.split(' ')[1]} cy={paths[0].d.split(' ')[2]} />
      </g>
    </svg>
  );
}

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const threadsRef = useRef<SVGGElement | null>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>(4);

  // Called every animation frame by the backdrop; writes straight to the DOM (no re-render).
  const onConverge = useCallback((c: number) => {
    const g = threadsRef.current;
    if (g) g.style.opacity = c > 0.7 ? '1' : '0';
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-canvas">
      <HeroBackdrop onConverge={onConverge} />
      <HeroThreads sectionRef={sectionRef} groupRef={threadsRef} />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.4fr_0.75fr] lg:gap-14 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="min-w-0">
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-ink/75" style={{ animationDelay: '0ms' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            AI research for Indian investors
          </p>
          <h1
            id="hero-heading"
            className="mt-6 text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3.4rem] lg:text-[clamp(2.5rem,3.9vw,3.9rem)]"
          >
            {/* Each line rises out of its own mask. Why: the promise is read first, one beat at a time. */}
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block" style={{ animationDelay: '80ms' }}>Research any NSE stock.</span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block text-accent" style={{ animationDelay: '140ms' }}>Sources attached.</span>
            </span>
          </h1>
          <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: '320ms' }}>
            Stock AI reads filings, results and trusted news, then shows what matters. Every point links to its source.
          </p>
          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '420ms' }}>
            <Button ref={ctaRef} size="lg" onClick={onGetStarted} className="w-full sm:w-auto">
              Start free
            </Button>
            <ButtonLink to="/invest" variant="ghost" size="lg" className="w-full border-white/15 sm:w-auto">
              Explore investments
            </ButtonLink>
          </div>
        </div>
        <div className="hero-rise w-full max-w-xl lg:max-w-none" style={{ animationDelay: '260ms' }}>
          <LiveMarketCard />
        </div>
      </div>
    </section>
  );
}
