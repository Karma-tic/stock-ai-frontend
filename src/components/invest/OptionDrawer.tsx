// src/components/invest/OptionDrawer.tsx — full detail for one option: risks, tax, where to invest.
import { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { InvestOption, LivePayload } from '../../data/investCatalog';
import { fmtReturn, LiveTag, RISK_NAME, RISK_TEXT } from './investShared';

interface Props {
  option: InvestOption | null;
  categories: Record<string, string>;
  live: LivePayload | null;
  inCompare: boolean;
  onClose: () => void;
  onToggleCompare: (id: string) => void;
  onProject: (o: InvestOption) => void;
}

export default function OptionDrawer({ option: o, categories, live, inCompare, onClose, onToggleCompare, onProject }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!o) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [o, onClose]);

  if (!o) return null;
  const facts: [string, string][] = [
    ['Typical return', fmtReturn(o)],
    ['Liquidity', o.liquidity],
    ['Lock-in', o.lock_in],
    ['Minimum', o.minimum],
    ['Suggested horizon', o.min_horizon_years ? `${o.min_horizon_years}+ years` : 'Any'],
  ];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-[#0B0F14]/55" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="invest-drawer-title" className="h-full w-full max-w-xl overflow-y-auto bg-surface p-6 sm:p-8 space-y-6 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted">{categories[o.category]}</p>
            <h2 id="invest-drawer-title" className="text-xl font-semibold tracking-[-0.015em] text-ink">{o.name}</h2>
            <p className="mt-1 text-ink/85">{o.best_for}.</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="rounded-control border border-line p-2 text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {o.live_symbol && <LiveTag symbol={o.live_symbol} quote={live?.prices[o.live_symbol]} />}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-control bg-ink/[0.04] p-3">
            <p className="text-[11px] text-muted">Risk</p>
            <p className={`font-bold ${RISK_TEXT[o.risk]}`}>{o.risk}/5 · {RISK_NAME[o.risk]}</p>
          </div>
          {facts.map(([k, v]) => (
            <div key={k} className="rounded-control bg-ink/[0.04] p-3">
              <p className="text-[11px] text-muted">{k}</p>
              <p className="font-bold text-ink num">{v}</p>
            </div>
          ))}
        </div>

        <section className="space-y-2">
          <h3 className="text-base font-semibold text-ink">What can go wrong</h3>
          <ul className="space-y-2">
            {o.risks.map(r => (
              <li key={r} className="flex gap-2 text-sm text-ink/85"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-down" />{r}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-semibold text-ink">Why people choose it</h3>
          <ul className="space-y-2">
            {o.pros.map(r => (
              <li key={r} className="flex gap-2 text-sm text-ink/85"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-up" />{r}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="text-base font-semibold text-ink">Tax</h3>
          <p className="text-sm text-ink/85">{o.tax}</p>
        </section>

        <section className="space-y-1">
          <h3 className="text-base font-semibold text-ink">Where to invest</h3>
          <p className="text-sm text-ink/85">{o.how_to_invest}</p>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => onToggleCompare(o.id)} className="inline-flex min-h-[44px] items-center justify-center rounded-control bg-cobalt px-4 text-sm font-semibold text-white hover:brightness-110">
            {inCompare ? 'Remove from compare' : 'Add to compare'}
          </button>
          <button type="button" onClick={() => onProject(o)} className="inline-flex min-h-[44px] items-center justify-center rounded-control border border-line px-4 text-sm font-semibold text-ink hover:bg-ink/[0.06]">
            Project growth
          </button>
        </div>
        <p className="text-xs text-muted">Figures are typical ranges and not a guarantee. Confirm current terms with the issuer before investing.</p>
      </div>
    </div>
  );
}
