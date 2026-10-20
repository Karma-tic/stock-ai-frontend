import { useEffect, useRef, useState } from 'react';

const fmt = (v: number, digits: number) => v.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });

// Up/down change: always carries ▲/▼ and a sign, so it never depends on colour alone.
export function Change({ value, className = '', suffix = '%' }: { value: number; className?: string; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={`num inline-flex items-center gap-0.5 ${up ? 'text-up' : 'text-down'} ${className}`}>
      <span aria-hidden="true" className="text-[0.8em]">{up ? '▲' : '▼'}</span>
      <span className="sr-only">{up ? 'up' : 'down'}</span>
      {up ? '+' : '−'}
      {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}

// A price that flashes up/down (600ms tint) when it changes. Tabular digits so it never jitters.
export default function Price({ value, prefix = '₹', digits = 2, className = '' }: { value: number; prefix?: string; digits?: number; className?: string }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<'' | 'flash-up' | 'flash-down'>('');

  useEffect(() => {
    if (value === prev.current) return;
    setFlash(value > prev.current ? 'flash-up' : 'flash-down');
    prev.current = value;
    const t = window.setTimeout(() => setFlash(''), 650);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <span className={`num rounded px-0.5 ${flash} ${className}`}>
      {prefix}
      {fmt(value, digits)}
    </span>
  );
}
