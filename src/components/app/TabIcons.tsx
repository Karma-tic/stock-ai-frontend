// src/components/app/TabIcons.tsx
// The bottom bar's own icon set: drawn on one 24 px grid with soft, rounded geometry.
// Each icon has an outline state and an active state (solid shape, details cut out in the
// canvas colour) so the current tab reads at a glance, not just by colour.
type P = { active?: boolean; className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};
const cut = 'rgb(var(--bg))';

export function HomeIcon({ active, className }: P) {
  return (
    <svg {...base} className={className}>
      <path
        d="M4 10.4 11.1 4.3a1.4 1.4 0 0 1 1.8 0L20 10.4V19a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 19z"
        fill={active ? 'currentColor' : 'none'}
      />
      <path d="M9.6 20.8v-4.6a2.4 2.4 0 0 1 4.8 0v4.6" stroke={active ? cut : 'currentColor'} />
    </svg>
  );
}

export function SearchIcon({ active, className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.6" cy="10.6" r="6.3" fill={active ? 'currentColor' : 'none'} />
      <path d="M15.4 15.4 20 20" strokeWidth={2.1} />
      <path d="M8 8.6a3.2 3.2 0 0 1 2.6-1.3" stroke={active ? cut : 'currentColor'} opacity={active ? 1 : 0.55} />
    </svg>
  );
}

// Today: the morning brief, a sun coming up over the horizon.
export function TodayIcon({ active, className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M6.2 16.2a5.8 5.8 0 0 1 11.6 0" fill={active ? 'currentColor' : 'none'} />
      <path d="M3 16.2h18M7 19.8h10" />
      <path d="M12 3.6v2.2M5.1 6.6l1.5 1.5M18.9 6.6l-1.5 1.5M2.9 12h1.6M19.5 12h1.6" opacity={active ? 1 : 0.8} />
    </svg>
  );
}

export function WatchIcon({ active, className }: P) {
  return (
    <svg {...base} className={className}>
      <path
        d="M11.1 3.9a1 1 0 0 1 1.8 0l2 4.1 4.5.7a1 1 0 0 1 .6 1.7l-3.3 3.2.8 4.5a1 1 0 0 1-1.5 1.1l-4-2.1-4 2.1a1 1 0 0 1-1.5-1.1l.8-4.5-3.3-3.2a1 1 0 0 1 .6-1.7l4.5-.7z"
        fill={active ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

export function MoreIcon({ active, className }: P) {
  const f = active ? 'currentColor' : 'none';
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="6.6" height="6.6" rx="2" fill={f} />
      <rect x="13.4" y="4" width="6.6" height="6.6" rx="3.3" fill={f} />
      <rect x="4" y="13.4" width="6.6" height="6.6" rx="2" fill={f} />
      <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2" fill={f} />
    </svg>
  );
}
