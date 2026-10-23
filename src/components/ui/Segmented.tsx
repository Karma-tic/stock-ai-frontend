import { useCallback, useEffect, useRef, useState } from 'react';

// One segmented control in the accent colour. On narrow screens it scrolls sideways:
// the edges fade where more tabs are hidden, and the selected tab is always scrolled into view.
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className = '',
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>('[aria-selected="true"]');
    if (active) {
      const target = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
    }
    measure();
  }, [value, measure]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, options.length]);

  const mask =
    edges.left || edges.right
      ? `linear-gradient(to right, ${edges.left ? 'transparent, black 28px' : 'black'}, ${edges.right ? 'black calc(100% - 28px), transparent' : 'black'})`
      : undefined;

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      onScroll={measure}
      style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
      className={`relative inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 scrollbar-hide ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition duration-ui ease-ui ${
              active ? 'bg-cobalt text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
