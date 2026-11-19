// src/components/ui/PullToRefresh.tsx
// Phones only: pull down from the top of the page to refresh. A small ring fills as you
// pull and refreshes past 64 px. The pull distance lives in a ref and is written straight
// to the indicator's style, so dragging never re-renders the page.
import { useEffect, useRef, useState } from 'react';
import { haptic } from '../../lib/toast';

const THRESHOLD = 64;
const R = 9;
const C = 2 * Math.PI * R;

export default function PullToRefresh({ onRefresh }: { onRefresh: () => Promise<unknown> | void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    // Stop the browser's own pull-to-reload while ours is on the page.
    const root = document.documentElement;
    const prevOverscroll = root.style.overscrollBehaviorY;
    root.style.overscrollBehaviorY = 'contain';
    let startY = 0;
    let pulling = false;
    let dist = 0;

    const paint = (d: number, animate = false) => {
      const el = wrap.current;
      if (!el) return;
      const p = Math.min(1, d / THRESHOLD);
      el.style.transition = animate ? 'transform 200ms cubic-bezier(.22,1,.36,1), opacity 200ms' : 'none';
      el.style.transform = `translate(-50%, ${Math.min(d, THRESHOLD + 16) - 40}px)`;
      el.style.opacity = d > 4 ? '1' : '0';
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - p));
    };

    const onStart = (e: TouchEvent) => {
      // Only from the very top, and never from inside an open sheet or dialog.
      if (busyRef.current || window.scrollY > 0 || document.body.style.overflow === 'hidden') return;
      if ((e.target as HTMLElement)?.closest('[role="dialog"],[data-vaul-drawer]')) return;
      startY = e.touches[0].clientY;
      pulling = true;
      dist = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0 || window.scrollY > 0) {
        dist = 0;
        paint(0);
        return;
      }
      // Resistance: the ring moves at half the finger's speed.
      const next = dy * 0.5;
      if (dist < THRESHOLD && next >= THRESHOLD) haptic();
      dist = next;
      paint(dist);
    };
    const onEnd = async () => {
      if (!pulling) return;
      pulling = false;
      if (dist >= THRESHOLD) {
        busyRef.current = true;
        setBusy(true);
        paint(THRESHOLD, true);
        try {
          await refreshRef.current();
        } finally {
          busyRef.current = false;
          setBusy(false);
          paint(0, true);
        }
      } else {
        paint(0, true);
      }
      dist = 0;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      root.style.overscrollBehaviorY = prevOverscroll;
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden={!busy}
      role="status"
      aria-label={busy ? 'Refreshing' : undefined}
      className="pointer-events-none fixed left-1/2 top-[calc(var(--nav-h,64px)+8px)] z-[60] grid h-9 w-9 place-items-center rounded-full border border-line bg-surface opacity-0 shadow-lift"
      style={{ transform: 'translate(-50%, -40px)' }}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 -rotate-90 ${busy ? 'ptr-spin' : ''}`}>
        <circle cx="12" cy="12" r={R} fill="none" stroke="rgb(var(--text) / 0.12)" strokeWidth="2.5" />
        <circle ref={ring} cx="12" cy="12" r={R} fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
    </div>
  );
}
