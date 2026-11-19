// src/lib/useSwipeDown.ts
// Phones: drag a bottom sheet down to dismiss it. Only starts when the sheet is scrolled to
// the top, follows the finger (transform only), and closes past 110 px or on a quick flick.
import { RefObject, useEffect } from 'react';

export function useSwipeDown(ref: RefObject<HTMLElement | null>, onClose: () => void, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !window.matchMedia('(max-width: 639px)').matches) return;
    let startY = 0;
    let startT = 0;
    let dy = 0;
    let active = false;

    const start = (e: TouchEvent) => {
      if (el.scrollTop > 0) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [data-no-swipe]')) return;
      active = true;
      startY = e.touches[0].clientY;
      startT = performance.now();
      dy = 0;
      el.style.transition = 'none';
    };
    const move = (e: TouchEvent) => {
      if (!active) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      if (dy > 0 && el.scrollTop <= 0) el.style.transform = `translateY(${dy}px)`;
    };
    const end = () => {
      if (!active) return;
      active = false;
      const fast = dy > 40 && dy / Math.max(1, performance.now() - startT) > 0.6;
      el.style.transition = 'transform 220ms cubic-bezier(.22,1,.36,1)';
      if (dy > 110 || fast) {
        el.style.transform = 'translateY(100%)';
        window.setTimeout(onClose, 200);
      } else {
        el.style.transform = '';
      }
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: true });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
    };
  }, [ref, onClose, enabled]);
}
