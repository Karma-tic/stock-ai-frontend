import type { LucideIcon } from 'lucide-react';

// The standard page opening: small accent eyebrow, a tight headline, one muted line.
export default function PageHeader({
  eyebrow,
  icon: Icon,
  title,
  intro,
  children,
  className = '',
}: {
  eyebrow: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`mb-10 max-w-2xl ${className}`}>
      <p className="flex items-center gap-2 text-sm font-medium text-accent">
        {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />} {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl text-balance">{title}</h1>
      {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}
      {children}
    </header>
  );
}
