// A 5-dot scale with a word label, e.g. Risk: Low ●●○○○. Meaning never relies on colour alone.
export default function DotScale({ value, max = 5, label, className = '' }: { value: number; max?: number; label: string; className?: string }) {
  const filled = Math.max(0, Math.min(max, Math.round(value)));
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="img" aria-label={`${label}: ${filled} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < filled ? 'bg-accent' : 'bg-ink/15'}`} />
      ))}
    </span>
  );
}
