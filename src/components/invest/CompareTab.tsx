// src/components/invest/CompareTab.tsx — up to four options side by side.
import { X } from 'lucide-react';
import { InvestOption } from '../../data/investCatalog';
import { fmtReturn, RiskMeter } from './investShared';

interface Props { items: InvestOption[]; onRemove: (id: string) => void; onBrowse: () => void }

const ROWS: [string, (o: InvestOption) => React.ReactNode][] = [
  ['Typical return', o => <span className="font-bold num">{fmtReturn(o)}</span>],
  ['Risk', o => <RiskMeter risk={o.risk} />],
  ['Liquidity', o => o.liquidity],
  ['Lock-in', o => o.lock_in],
  ['Minimum', o => o.minimum],
  ['Tax', o => o.tax],
  ['Main risk', o => o.risks[0]],
  ['Best for', o => o.best_for],
  ['Where to invest', o => o.how_to_invest],
];

export default function CompareTab({ items, onRemove, onBrowse }: Props) {
  return (
    <div className="space-y-4">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink">Side by side</h2>
        <p className="mt-1 text-muted">Add up to four options with the Compare button on any card.</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center space-y-3">
          <p className="text-muted">Nothing to compare yet.</p>
          <button type="button" onClick={onBrowse} className="inline-flex min-h-[44px] items-center justify-center rounded-control bg-cobalt px-4 text-sm font-semibold text-white hover:brightness-110">Browse options</button>
        </div>
      ) : (
        <div className="rounded-card border border-line bg-surface overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-36 p-4" />
                {items.map(o => (
                  <th key={o.id} scope="col" className="p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-bold text-ink">{o.name}</span>
                      <button type="button" onClick={() => onRemove(o.id)} aria-label={`Remove ${o.name}`} className="text-muted hover:text-ink"><X className="h-4 w-4" /></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, render]) => (
                <tr key={label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-left align-top text-xs font-semibold text-muted">{label}</th>
                  {items.map(o => <td key={o.id} className="p-4 align-top text-ink/85">{render(o)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
