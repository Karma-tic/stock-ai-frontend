import { FileText, Newspaper } from 'lucide-react';

export function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink/75 ${className}`}>
      {children}
    </span>
  );
}

// A small pill naming where a point came from, e.g. "NSE filing · 14 Oct".
export function SourceChip({
  kind = 'filing',
  children,
  className = '',
}: {
  kind?: 'filing' | 'news';
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = kind === 'filing' ? FileText : Newspaper;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent ${className}`}
    >
      <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
      {children}
    </span>
  );
}
