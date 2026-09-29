// src/components/invest/CompareTab.tsx — up to four options side by side.
import { X } from 'lucide-react';
import { InvestOption } from '../../data/investCatalog';
import { fmtReturn, RiskMeter } from './investShared';

interface Props { items: InvestOption[]; onRemove: (id: string) => void; onBrowse: () => void }

const ROWS: [string, (o: InvestOption) => React.ReactNode][] = [
  ['Typical return', o => <span className="font-bold tabular-nums">{fmtReturn(o)}</span>],
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
        <h2 className="text-2xl font-bold text-lavender-text">Side by side</h2>
        <p className="mt-1 text-lavender-text/70">Add up to four options with the Compare button on any card.</p>
      </div>
      {items.length === 0 ? (
        <div className="app-card p-10 text-center space-y-3">
          <p className="text-lavender-text/70">Nothing to compare yet.</p>
          <button type="button" onClick={onBrowse} className="rounded-xl bg-gradient-lavender px-4 py-2.5 text-sm font-semibold text-white">Browse options</button>
        </div>
      ) : (
        <div className="app-card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-lavender-text/10">
                <th scope="col" className="w-36 p-4" />
                {items.map(o => (
                  <th key={o.id} scope="col" className="p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-bold text-lavender-text">{o.name}</span>
                      <button type="button" onClick={() => onRemove(o.id)} aria-label={`Remove ${o.name}`} className="text-lavender-text/50 hover:text-lavender-text"><X className="h-4 w-4" /></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, render]) => (
                <tr key={label} className="border-b border-lavender-text/10 last:border-0">
                  <th scope="row" className="p-4 text-left align-top text-xs font-semibold uppercase tracking-wider text-lavender-text/60">{label}</th>
                  {items.map(o => <td key={o.id} className="p-4 align-top text-lavender-text/85">{render(o)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
