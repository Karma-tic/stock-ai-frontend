import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ExplorerScreen, FILING_POINTS, FilingDoc, RadarScreen, SummaryScreen } from './StoryScreens';
import { useInView } from './hooks';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

// Loaded as its own chunk, so GSAP and Lenis never weigh on the hero or the app pages.

const PHASES = [
  {
    verb: 'Read',
    title: 'Read the filing, keep the receipt.',
    body: 'Stock AI pulls the sentences that matter from results and filings, and every summary point stays linked to where it came from.',
    link: { to: '/stocks', label: 'Browse stocks' },
  },
  {
    verb: 'Connect',
    title: 'Know what changed for your stocks.',
    body: 'Results dates, dividends, filings and news land on one radar, sorted by how much each could matter to you.',
    link: { to: '/today', label: 'Open your radar' },
  },
  {
    verb: 'Compare',
    title: 'Compare every way to grow money.',
    body: "FDs, PPF, gold, funds and bonds side by side, with today's rates, the risks and how each is taxed.",
    link: { to: '/invest', label: 'Explore investments' },
  },
];
const PHASE_JUMP = [0.2, 0.55, 0.88];
const CARD_SHIFT = -24;

function PhaseLink({ i }: { i: number }) {
  const l = PHASES[i].link;
  return (
    <Link to={l.to} className="group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent">
      {l.label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

// ── Desktop (≥1024px, motion allowed): pinned chapter scrubbed by scroll ──
function PinnedStory({ load }: { load: boolean }) {
  const root = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current;
        if (!el) return;
        const stage = el.querySelector<HTMLElement>('[data-stage]')!;
        const card = el.querySelector<HTMLElement>('[data-card]')!;
        const doc = el.querySelector<HTMLElement>('[data-doc]')!;
        const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', el);
        const marks = FILING_POINTS.map((p) => stage.querySelector<HTMLElement>(`[data-mark="${p.id}"]`)!);
        const points = FILING_POINTS.map((p) => stage.querySelector<HTMLElement>(`[data-point="${p.id}"]`)!);
        const rows = [0, 1, 2].map((i) => stage.querySelector<HTMLElement>(`[data-radar="${i}"]`)!);
        const ghosts = gsap.utils.toArray<HTMLElement>('[data-ghost]', el);
        const threadsA = gsap.utils.toArray<SVGPathElement>('[data-thread-a]', el);
        const threadsB = gsap.utils.toArray<SVGPathElement>('[data-thread-b]', el);
        const svg = el.querySelector<SVGSVGElement>('[data-threads]')!;

        // Smooth scroll on desktop only, kept in sync with ScrollTrigger.
        // Why: the scrubbed chapter reads as one continuous shot instead of wheel-tick steps.
        const lenis = new Lenis({ lerp: 0.12 });
        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const navH = () => document.querySelector<HTMLElement>('nav')?.offsetHeight ?? 64;

        // Positions inside the stage. Offsets ignore transforms, so mid-animation measurements stay true.
        const offset = (node: HTMLElement) => {
          let x = 0;
          let y = 0;
          let n: HTMLElement | null = node;
          while (n && n !== stage) {
            x += n.offsetLeft;
            y += n.offsetTop;
            n = n.offsetParent as HTMLElement | null;
          }
          return { x, y, w: node.offsetWidth, h: node.offsetHeight };
        };
        // End of a highlighted sentence (its last line), relative to the stage.
        const markEnd = (m: HTMLElement) => {
          const s = stage.getBoundingClientRect();
          const rects = m.getClientRects();
          const r = rects[rects.length - 1] || m.getBoundingClientRect();
          return { x: r.right - s.left, y: r.top - s.top + r.height / 2 };
        };
        const curve = (ax: number, ay: number, bx: number, by: number) =>
          `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${(ax + 60).toFixed(1)} ${ay.toFixed(1)}, ${(bx - 60).toFixed(1)} ${by.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`;

        const layout = () => {
          svg.setAttribute('viewBox', `0 0 ${stage.offsetWidth} ${stage.offsetHeight}`);
          marks.forEach((m, i) => {
            const a = markEnd(m);
            const p = offset(points[i]);
            threadsA[i]?.setAttribute('d', curve(a.x + 4, a.y, p.x, p.y + p.h / 2));
            const r = offset(rows[i]);
            threadsB[i]?.setAttribute('d', curve(a.x + 4, a.y, r.x, r.y + r.h / 2 + CARD_SHIFT));
          });
        };
        layout();
        const onRefreshInit = () => layout();
        ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

        gsap.set(points, { autoAlpha: 0 });
        gsap.set(layers.slice(1), { autoAlpha: 0 });
        gsap.set([...threadsA, ...threadsB], { drawSVG: '0%' });
        gsap.set(ghosts, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: () => `top top+=${navH()}`,
            end: '+=250%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const next = p < 0.35 ? 0 : p < 0.7 ? 1 : 2;
              setPhase((prev) => (prev === next ? prev : next));
            },
          },
        });
        tlRef.current = tl;

        // Phase 1, "Read": highlighter sweeps a sentence, it flies into the summary, a thread stays attached.
        marks.forEach((m, i) => {
          const t = 0.3 + i * 1.0;
          tl.to(m, { backgroundSize: '100% 100%', duration: 0.35, ease: 'power2.inOut' }, t);
          tl.fromTo(
            ghosts[i],
            { x: () => markEnd(m).x - ghosts[i].offsetWidth, y: () => markEnd(m).y - ghosts[i].offsetHeight / 2, autoAlpha: 0, scale: 0.92 },
            { autoAlpha: 1, duration: 0.1 },
            t + 0.3,
          );
          tl.to(
            ghosts[i],
            {
              x: () => offset(points[i]).x + 10,
              y: () => offset(points[i]).y + offset(points[i]).h / 2 - ghosts[i].offsetHeight / 2,
              scale: 1,
              duration: 0.45,
              ease: 'power3.inOut',
            },
            t + 0.35,
          );
          tl.to(points[i], { autoAlpha: 1, duration: 0.15 }, t + 0.75);
          tl.to(ghosts[i], { autoAlpha: 0, duration: 0.1 }, t + 0.8);
          tl.to(threadsA[i], { drawSVG: '100%', duration: 0.35, ease: 'power2.inOut' }, t + 0.8);
        });

        // Phase 2, "Connect": the summary becomes the event radar; threads re-attach to the radar rows.
        tl.to(threadsA, { drawSVG: '0%', duration: 0.3 }, 3.6);
        tl.to(layers[0], { autoAlpha: 0, y: -16, duration: 0.4 }, 3.8);
        tl.to(card, { y: CARD_SHIFT, duration: 0.5, ease: 'power2.inOut' }, 3.8);
        tl.fromTo(layers[1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 4.0);
        threadsB.forEach((p, i) => tl.to(p, { drawSVG: '100%', duration: 0.4, ease: 'power2.inOut' }, 4.6 + i * 0.2));

        // Phase 3, "Compare": the radar morphs into the Invest Explorer, built from today's rates.
        tl.to(threadsB, { drawSVG: '0%', duration: 0.3 }, 7.1);
        tl.to(doc, { autoAlpha: 0.25, duration: 0.5 }, 7.2);
        tl.to(layers[1], { autoAlpha: 0, y: -16, duration: 0.4 }, 7.3);
        tl.fromTo(layers[2], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 7.5);
        tl.to({}, { duration: 1.5 }, 8.5);

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
          tlRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const goTo = (i: number) => {
    const st = tlRef.current?.scrollTrigger;
    if (!st) return;
    const y = st.start + (st.end - st.start) * PHASE_JUMP[i];
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div ref={root} className="hidden lg:block motion-reduce:hidden">
      <div className="flex h-[calc(100dvh-var(--nav-h,64px))] min-h-[600px] items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[0.6fr_1.4fr] items-center gap-10 px-8">
          <div>
            <ol className="flex gap-2" aria-label="Chapter">
              {PHASES.map((p, i) => (
                <li key={p.verb}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={phase === i ? 'step' : undefined}
                    className={`min-h-[36px] rounded-full px-3.5 text-sm font-medium transition duration-ui ${
                      phase === i ? 'bg-cobalt text-white' : 'border border-line text-muted hover:text-ink'
                    }`}
                  >
                    {p.verb}
                  </button>
                </li>
              ))}
            </ol>
            <div className="relative mt-8 min-h-[220px]">
              {PHASES.map((p, i) => (
                <div
                  key={p.verb}
                  aria-hidden={phase !== i}
                  className={`absolute inset-x-0 top-0 transition duration-500 ease-ui ${phase === i ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
                >
                  <h3 className="text-[1.9rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink">{p.title}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{p.body}</p>
                  <div className="mt-4">
                    <PhaseLink i={i} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-stage className="relative h-[540px]">
            <div data-doc className="absolute left-0 top-0 w-[47%]">
              <FilingDoc />
            </div>
            <div data-card className="absolute right-0 top-[56px] h-[420px] w-[49%]">
              <div data-layer className="absolute inset-x-0 top-0">
                <SummaryScreen />
              </div>
              <div data-layer className="absolute inset-x-0 top-0">
                <RadarScreen />
              </div>
              <div data-layer className="absolute inset-x-0 top-0">
                <ExplorerScreen load={load} />
              </div>
            </div>
            <svg data-threads className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              {FILING_POINTS.map((p) => (
                <path key={`a-${p.id}`} data-thread-a="" fill="none" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
              ))}
              {FILING_POINTS.map((p) => (
                <path key={`b-${p.id}`} data-thread-b="" fill="none" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
              ))}
            </svg>
            {FILING_POINTS.map((p) => (
              <span
                key={`g-${p.id}`}
                data-ghost=""
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded-full bg-cobalt px-2.5 py-1 text-[11px] font-semibold text-white shadow-lift"
              >
                {p.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Phones, tablets and reduced motion: a snap carousel; each card plays once as it arrives ──
function StoryCard({ i, children }: { i: number; children: React.ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>('-20% 0px');
  return (
    <div ref={ref} className={`story-card w-[85vw] max-w-[440px] shrink-0 snap-center lg:w-auto lg:max-w-none ${seen ? 'is-on' : ''}`}>
      <p className="text-xs font-semibold text-accent">{PHASES[i].verb}</p>
      <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-ink">{PHASES[i].title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{PHASES[i].body}</p>
      <PhaseLink i={i} />
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CarouselStory({ load }: { load: boolean }) {
  return (
    <div className="lg:hidden motion-reduce:block">
      <div className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-8 scrollbar-hide sm:px-6 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-8">
        <StoryCard i={0}>
          <FilingDoc />
          <svg className="mx-auto my-1 block h-8 w-4" viewBox="0 0 16 32" aria-hidden="true">
            <path className="mini-thread" d="M8 0 L8 32" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <SummaryScreen />
        </StoryCard>
        <StoryCard i={1}>
          <RadarScreen />
        </StoryCard>
        <StoryCard i={2}>
          <ExplorerScreen load={load} />
        </StoryCard>
      </div>
    </div>
  );
}

export default function FilingUnfolds() {
  const [loadRef, near] = useInView<HTMLElement>('600px');
  return (
    <section ref={loadRef} id="how-it-works" aria-labelledby="story-heading" className="bg-canvas pb-16 lg:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <p className="text-xs font-semibold text-accent">How it works</p>
        <h2 id="story-heading" className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
          See the evidence, not just a verdict
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Watch one filing become a summary you can check, line by line.
        </p>
      </div>
      <PinnedStory load={near} />
      <CarouselStory load={near} />
    </section>
  );
}
