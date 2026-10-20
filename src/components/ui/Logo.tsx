// The Stock AI mark: a short rising line that ends in one dot (the end of a "thread").
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="fill-ink dark:fill-surface2" />
      <path
        d="M12 45 L24 33 L33 38 L49 20"
        fill="none"
        stroke="#8FA2FF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="19" r="6" fill="#FFFFFF" />
    </svg>
  );
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Stock AI</span>
    </span>
  );
}
