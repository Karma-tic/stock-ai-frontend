import { Search } from 'lucide-react';

// A compact filter-as-you-type field (not the global stock search).
export default function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label || placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-control border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
    </label>
  );
}
