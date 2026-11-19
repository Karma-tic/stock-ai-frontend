// src/components/ui/AllowanceMeter.tsx
// Free plan: how many Evidence Boards are left today, from the server's real limit.
// Amber at one left. Hidden for Pro and while unknown.
import { useAllowance, usePlanState } from '../../lib/plan';

export default function AllowanceMeter({ compact = false, onUpgrade }: { compact?: boolean; onUpgrade?: () => void }) {
  const plan = usePlanState();
  const a = useAllowance();
  if (plan.loading || plan.isPro || !a || a.freeLeft == null) return null;
  const left = a.freeLeft;
  const tone = left === 0 ? 'text-down' : left === 1 ? 'text-caution' : 'text-muted';
  const bar = left === 0 ? 'bg-down' : left === 1 ? 'bg-caution' : 'bg-accent';
  const words = `${left} of ${a.perDay} free ${a.perDay === 1 ? 'analysis' : 'analyses'} left today${a.bonus ? `, plus ${a.bonus} bonus` : ''}`;
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'mt-2'}`} role="status" aria-label={words}>
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: a.perDay }, (_, i) => (
          <span key={i} className={`h-1.5 w-4 rounded-full ${i < left ? bar : 'bg-ink/15'}`} />
        ))}
      </span>
      <span className={`text-xs ${tone}`}>
        {compact ? `${left}/${a.perDay} free today` : words}
      </span>
      {!compact && left <= 1 && onUpgrade && (
        <button type="button" onClick={onUpgrade} className="text-xs font-semibold text-accent hover:underline">
          Go unlimited
        </button>
      )}
    </div>
  );
}
