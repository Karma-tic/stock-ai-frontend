import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ExplorerScreen, RadarScreen, StockScreen } from './StoryScreens';
import { useInView } from './hooks';

const STEPS = [
  {
    title: 'Read any company in seconds',
    body: 'Price, valuation and what the latest filings and news actually say, in one structured summary. Each point shows where it came from.',
    link: { to: '/stocks', label: 'Browse stocks' },
  },
  {
    title: 'Know what changed for your stocks',
    body: 'Your watchlist and portfolio feed an event radar: results dates, dividends, filings and news, sorted by how much they could matter.',
    link: { to: '/today', label: 'Open your radar' },
  },
  {
    title: 'Compare every way to invest',
    body: "FDs, PPF, gold, mutual funds, bonds and global options side by side, with today's rates, the risks and how each is taxed.",
    link: { to: '/invest', label: 'Explore investments' },
  },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const INTRO = 0.4; // share of one step spent flattening the first screen

// Where screen i sits for story position q (q - i < 0: waiting behind, 0–1: in front, > 1: leaving).
function screenStyle(s: number, isLast: boolean) {
  if (s < 0) {
    // waiting behind: opaque cards stacked lower and smaller, so only their edges show
    const depth = Math.min(-s, 2);
    return {
      transform: `translate3d(0, ${depth * 28}px, ${-depth * 120}px) rotateX(${depth * 7}deg) scale(${1 - depth * 0.05})`,
      opacity: String(depth <= 1 ? 1 : clamp(1 - (depth - 1) * 0.65, 0, 1)),
      zIndex: String(10 - Math.round(depth * 2)),
    };
  }
  // in front, then lifting away quickly to reveal the next screen
  const exit = isLast ? 0 : clamp((s - 0.74) / 0.2, 0, 1);
  return {
    transform: `translate3d(0, ${-exit * 90}px, ${exit * 30}px) rotateX(${-exit * 12}deg)`,
    opacity: String((1 - exit) * (1 - exit)),
    zIndex: String(exit > 0.08 ? 5 : 20), // tucks behind the (opaque) next screen, so texts never overlap
  };
}

function StepText({ index, active, onSelect }: { index: number; active: boolean; onSelect?: () => void }) {
  const step = STEPS[index];
  const body = (
    <>
      <p className={`text-xs font-semibold tabular-nums tracking-[0.14em] ${active ? 'text-lavender-primary' : 'text-lavender-text/40'}`}>
        STEP {index + 1}
      </p>
      <h3 className={`mt-1 text-xl font-bold transition-colors ${active ? 'text-lavender-text' : 'text-lavender-text/55'}`}>{step.title}</h3>
      <p className={`mt-2 text-[15px] leading-relaxed transition-colors ${active ? 'text-lavender-text/75' : 'text-lavender-text/45'}`}>{step.body}</p>
    </>
  );
  const frame = `block w-full border-l-2 py-1 pl-5 text-left transition-colors duration-300 ${
    active ? 'border-lavender-primary' : 'border-lavender-text/10 hover:border-lavender-text/30'
  }`;
  return onSelect ? (
    <button type="button" onClick={onSelect} aria-current={active ? 'step' : undefined} className={frame}>
      {body}
    </button>
  ) : (
    <div className={frame}>{body}</div>
  );
}

const SCREENS = [StockScreen, RadarScreen, ExplorerScreen];

export default function ScrollStory() {
  const [loadRef, near] = useInView<HTMLElement>('400px');
  const trackRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const screens = screenRefs.current;
      if (!track) return;
      const pinned = wide.matches && !reduced.matches;
      if (!pinned) {
        screens.forEach((el) => el && el.removeAttribute('style'));
        return;
      }
      const rect = track.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / total, 0, 1);
      const q = p * (STEPS.length + INTRO) - INTRO;
      setActive(clamp(Math.floor(q + 0.35), 0, STEPS.length - 1));
      screens.forEach((el, i) => {
        if (!el) return;
        const st = screenStyle(q - i, i === STEPS.length - 1);
        el.style.transform = st.transform;
        el.style.opacity = st.opacity;
        el.style.zIndex = st.zIndex;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    wide.addEventListener?.('change', schedule);
    reduced.addEventListener?.('change', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      wide.removeEventListener?.('change', schedule);
      reduced.removeEventListener?.('change', schedule);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const total = track.offsetHeight - window.innerHeight;
    const q = i + 0.2;
    const top = track.getBoundingClientRect().top + window.scrollY + ((q + INTRO) / (STEPS.length + INTRO)) * total;
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section ref={loadRef} id="how-it-works" aria-labelledby="story-heading" className="bg-lavender-surface">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lavender-primary">How it works</p>
        <h2 id="story-heading" className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight text-lavender-text sm:text-[2.6rem] sm:leading-[1.1]">
          See the evidence, not just a verdict
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-lavender-text/70 sm:text-lg">
          Stock AI reads filings, results and trusted financial news, then lays out what matters so you can make up your own mind.
        </p>
      </div>

      {/* Desktop: pinned, screens step forward as you scroll */}
      <div ref={trackRef} className="story-track relative mt-4 hidden lg:block">
        <div className="sticky top-[var(--nav-h,72px)] flex h-[calc(100vh-var(--nav-h,72px))] items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[0.9fr_1.1fr] items-center gap-16 px-8">
            <div className="space-y-8">
              {STEPS.map((_, i) => (
                <StepText key={i} index={i} active={active === i} onSelect={() => goTo(i)} />
              ))}
              <Link to={STEPS[active].link.to} className="group ml-5 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-primary">
                {STEPS[active].link.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="story-stage relative h-[480px]">
              {SCREENS.map((Screen, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    screenRefs.current[i] = el;
                  }}
                  className="story-screen absolute inset-0 flex items-center"
                  aria-hidden={active !== i}
                >
                  <div className="w-full"><Screen load={near} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: one step after another */}
      <div className="story-stacked mx-auto w-full max-w-6xl space-y-16 px-4 pb-20 pt-12 sm:px-6 sm:pb-28 lg:hidden">
        {SCREENS.map((Screen, i) => (
          <div key={i} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
            <div>
              <StepText index={i} active />
              <Link to={STEPS[i].link.to} className="ml-5 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-primary">
                {STEPS[i].link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <RevealOnScroll>
              <Screen load={near} />
            </RevealOnScroll>
          </div>
        ))}
      </div>
      <div className="hidden pb-12 lg:block" />
    </section>
  );
}

function RevealOnScroll({ children }: { children: React.ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>('-15% 0px');
  return (
    <div ref={ref} className={`story-reveal ${seen ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}
