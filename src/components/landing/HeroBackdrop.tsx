import { useEffect, useRef, useState } from 'react';
import { HERO_VIDEO } from './heroMedia';
import { usePrefersReducedMotion } from './hooks';

// "Signals from the noise": hundreds of faint data points drift, then pull together
// into one clean rising line, hold, and scatter again. An 11-second loop drawn on a
// canvas; it pauses when the hero is off screen or the tab is hidden.

type Particle = {
  hx: number; hy: number; // drifting home position (0–1)
  tx: number; ty: number; // position on the line (0–1)
  phase: number;
  speed: number;
  size: number;
  hue: 0 | 1 | 2;
  dash: boolean;
  lag: number; // 0–1, staggers arrival on the line
};

const CYCLE_MS = 11000;
const COLORS = ['196, 181, 253', '165, 180, 252', '94, 234, 212']; // lavender, indigo, teal

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// 0 = scattered, 1 = on the line
function convergence(ms: number) {
  const t = (ms % CYCLE_MS) / CYCLE_MS;
  if (t < 0.28) return 0;
  if (t < 0.5) return smooth((t - 0.28) / 0.22);
  if (t < 0.76) return 1;
  return 1 - smooth((t - 0.76) / 0.24);
}

// The rising line, in 0–1 coordinates; gentler and lower on narrow screens.
function lineY(u: number, narrow: boolean) {
  const start = narrow ? 0.9 : 0.86;
  const end = narrow ? 0.6 : 0.2;
  return start + (end - start) * Math.pow(u, 1.2) + Math.sin(u * Math.PI * 3.2) * 0.018;
}

function makeParticles(count: number, narrow: boolean): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    list.push({
      hx: Math.random(),
      hy: Math.random(),
      tx: 0.04 + u * 0.94,
      ty: lineY(u, narrow),
      phase: Math.random() * Math.PI * 2,
      speed: 0.00018 + Math.random() * 0.00032,
      size: 0.6 + Math.random() * 1.3,
      hue: (Math.random() < 0.12 ? 2 : Math.random() < 0.5 ? 1 : 0) as 0 | 1 | 2,
      dash: Math.random() < 0.28,
      lag: Math.random(),
    });
  }
  return list;
}

export default function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState<{ mp4: string; webm?: string } | null>(null);

  // Load the optional video only after the page is interactive.
  useEffect(() => {
    if (!HERO_VIDEO || reduced) return;
    const connection = (navigator as any).connection;
    if (connection?.saveData) return;
    const pick = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      setVideoSrc(mobile && HERO_VIDEO?.mobile ? HERO_VIDEO.mobile : HERO_VIDEO!.desktop);
    };
    const idle = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
    if (document.readyState === 'complete') {
      idle ? idle(pick, { timeout: 2500 }) : window.setTimeout(pick, 800);
      return;
    }
    const onLoad = () => (idle ? idle(pick, { timeout: 2500 }) : window.setTimeout(pick, 800));
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, [reduced]);

  useEffect(() => {
    if (videoSrc) videoRef.current?.play().catch(() => {});
  }, [videoSrc]);

  // Canvas animation (stops once a video is playing)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || videoPlaying) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let narrow = false;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    const start = performance.now() - CYCLE_MS * 0.42; // open mid-convergence so the line forms early

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nowNarrow = width < 768;
      if (!particles.length || nowNarrow !== narrow) {
        narrow = nowNarrow;
        particles = makeParticles(narrow ? 110 : 240, narrow);
      }
    };

    const draw = (now: number) => {
      const elapsed = now - start;
      const c = reduced ? 1 : convergence(elapsed);
      ctx.clearRect(0, 0, width, height);

      // soft glow under the line while it holds
      if (c > 0.05) {
        const grad = ctx.createLinearGradient(0, height * 0.2, 0, height);
        grad.addColorStop(0, `rgba(165, 180, 252, ${0.1 * c})`);
        grad.addColorStop(1, 'rgba(165, 180, 252, 0)');
        ctx.beginPath();
        ctx.moveTo(particles[0].tx * width, height);
        particles.forEach((p) => ctx.lineTo(p.tx * width, p.ty * height));
        ctx.lineTo(particles[particles.length - 1].tx * width, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      for (const p of particles) {
        const k = smooth(c * 1.35 - p.lag * 0.35);
        const driftX = (p.hx + Math.sin(elapsed * p.speed + p.phase) * 0.02) * width;
        const driftY = (p.hy + Math.cos(elapsed * p.speed * 0.8 + p.phase) * 0.025) * height;
        const x = driftX + (p.tx * width - driftX) * k;
        const y = driftY + (p.ty * height - driftY) * k;
        const alpha = 0.22 + 0.6 * k;
        const color = COLORS[p.hue];

        ctx.fillStyle = `rgba(${color}, ${alpha * 0.14})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        if (p.dash && k < 0.6) {
          ctx.fillRect(x - 3.5, y - 0.5, 7, 1);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, p.size * (1 + 0.3 * k), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // the line itself
      if (c > 0.55) {
        const a = (c - 0.55) / 0.45;
        const stroke = ctx.createLinearGradient(0, 0, width, 0);
        stroke.addColorStop(0, `rgba(196, 181, 253, ${0.15 * a})`);
        stroke.addColorStop(0.6, `rgba(165, 180, 252, ${0.75 * a})`);
        stroke.addColorStop(1, `rgba(94, 234, 212, ${0.95 * a})`);
        ctx.strokeStyle = stroke;
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.beginPath();
        particles.forEach((p, i) => (i ? ctx.lineTo(p.tx * width, p.ty * height) : ctx.moveTo(p.tx * width, p.ty * height)));
        ctx.stroke();

        const last = particles[particles.length - 1];
        ctx.fillStyle = `rgba(94, 234, 212, ${a})`;
        ctx.beginPath();
        ctx.arc(last.tx * width, last.ty * height, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      draw(now);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const resume = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!reduced) resume();
    });
    io.observe(canvas);

    const onVisibility = () => !reduced && resume();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, videoPlaying]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className={`h-full w-full transition-opacity duration-1000 ${videoPlaying ? 'opacity-0' : 'opacity-100'}`} />
      {HERO_VIDEO && videoSrc && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-[65%_50%] mix-blend-screen transition-opacity duration-1000 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={HERO_VIDEO.poster}
          onPlaying={() => setVideoPlaying(true)}
        >
          {videoSrc.webm && <source src={videoSrc.webm} type="video/webm" />}
          <source src={videoSrc.mp4} type="video/mp4" />
        </video>
      )}
      {/* keeps the headline readable over any backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,12,27,0.92)_0%,rgba(14,12,27,0.55)_45%,rgba(14,12,27,0.15)_100%)]" />
      {/* phones: text runs over the whole backdrop, so dim it a little more */}
      <div className="absolute inset-0 bg-[#0e0c1b]/40 lg:hidden" />
      <div className="absolute inset-y-0 left-0 hidden w-3/5 bg-gradient-to-r from-[#0e0c1b]/85 via-[#0e0c1b]/55 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0e0c1b]" />
    </div>
  );
}
