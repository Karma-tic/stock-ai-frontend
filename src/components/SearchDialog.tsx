import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import StockSearch from './ui/StockSearch';

const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN'];
const QUICK = [
  { to: '/invest', label: 'Explore investments' },
  { to: '/ipos', label: 'IPO tracker' },
  { to: '/tools/sip-calculator', label: 'SIP calculator' },
  { to: '/market-wrap', label: 'Market wrap' },
];

// Search, one keystroke away: ⌘K / Ctrl K / "/" on desktop, a full-screen sheet on phones.
export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      // Keep focus inside the dialog
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button, input');
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center sm:p-6 sm:pt-[12vh]">
      <button type="button" aria-label="Close search" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-[#0B0F14]/60 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search stocks"
        className="relative flex h-[100dvh] w-full flex-col bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:h-auto sm:max-w-xl sm:rounded-card sm:border sm:border-line sm:bg-surface sm:p-5 sm:shadow-lift"
      >
        <div className="flex items-center gap-2">
          <StockSearch size="md" autoFocus onNavigate={onClose} className="flex-1" />
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-muted hover:bg-ink/[0.06] hover:text-ink">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium text-muted">Popular</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR.map((t) => (
              <Link
                key={t}
                to={`/stock/${t}`}
                onClick={onClose}
                className="num inline-flex min-h-[40px] items-center rounded-full border border-line px-3 text-xs font-semibold text-ink hover:border-accent/50 hover:text-accent"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs font-medium text-muted">Quick tools</p>
          <ul className="mt-1">
            {QUICK.map((q) => (
              <li key={q.to}>
                <Link to={q.to} onClick={onClose} className="flex min-h-[44px] items-center rounded-control px-2 text-sm text-ink hover:bg-ink/[0.06]">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-auto pt-6 text-xs text-muted sm:mt-6">
          <kbd className="rounded border border-line px-1 font-mono">↑</kbd> <kbd className="rounded border border-line px-1 font-mono">↓</kbd> to move,{' '}
          <kbd className="rounded border border-line px-1 font-mono">Enter</kbd> to open, <kbd className="rounded border border-line px-1 font-mono">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
