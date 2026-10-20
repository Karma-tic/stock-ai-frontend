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
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="invest-drawer-title" className="h-full w-full max-w-xl overflow-y-auto bg-surface dark:bg-lavender-base p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">{categories[o.category]}</p>
            <h2 id="invest-drawer-title" className="text-2xl font-bold text-lavender-text">{o.name}</h2>
            <p className="mt-1 text-lavender-text/75">{o.best_for}.</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="rounded-xl border border-lavender-text/15 p-2 text-lavender-text/70 hover:text-lavender-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        {o.live_symbol && <LiveTag symbol={o.live_symbol} quote={live?.prices[o.live_symbol]} />}

        <div className="grid grid-cols-2 gap-3">
          <div className="app-tile p-3">
            <p className="text-[11px] text-lavender-text/60">Risk</p>
            <p className={`font-bold ${RISK_TEXT[o.risk]}`}>{o.risk}/5 · {RISK_NAME[o.risk]}</p>
          </div>
          {facts.map(([k, v]) => (
            <div key={k} className="app-tile p-3">
              <p className="text-[11px] text-lavender-text/60">{k}</p>
              <p className="font-bold text-lavender-text tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-lavender-text">What can go wrong</h3>
          <ul className="space-y-2">
            {o.risks.map(r => (
              <li key={r} className="flex gap-2 text-sm text-lavender-text/85"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-down" />{r}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-lavender-text">Why people choose it</h3>
          <ul className="space-y-2">
            {o.pros.map(r => (
              <li key={r} className="flex gap-2 text-sm text-lavender-text/85"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-up" />{r}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="text-lg font-bold text-lavender-text">Tax</h3>
          <p className="text-sm text-lavender-text/85">{o.tax}</p>
        </section>

        <section className="space-y-1">
          <h3 className="text-lg font-bold text-lavender-text">Where to invest</h3>
          <p className="text-sm text-lavender-text/85">{o.how_to_invest}</p>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => onToggleCompare(o.id)} className="rounded-xl bg-gradient-lavender px-4 py-2.5 text-sm font-semibold text-white shadow-lavender">
            {inCompare ? 'Remove from compare' : 'Add to compare'}
          </button>
          <button type="button" onClick={() => onProject(o)} className="rounded-xl border border-lavender-text/15 px-4 py-2.5 text-sm font-semibold text-lavender-text">
            Project growth
          </button>
        </div>
        <p className="text-xs text-lavender-text/60">Figures are typical ranges and not a guarantee. Confirm current terms with the issuer before investing.</p>
      </div>
    </div>
  );
}
