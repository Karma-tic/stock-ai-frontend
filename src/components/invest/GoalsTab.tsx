// src/components/invest/GoalsTab.tsx
// Default view of /invest: "What is this money for?" → three options worth a look.
import { useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Calculator, Check, Globe2, Plus, Scale } from 'lucide-react';
import { InvestOption, LivePayload } from '../../data/investCatalog';
import { GOALS, Goal } from './goals';
import { fmtReturn, LiveTag, Profile, RiskMeter } from './investShared';

interface Props {
  goalId: string | null;
  onGoal: (id: string | null) => void;
  options: InvestOption[];
  categories: Record<string, string>;
  live: LivePayload | null;
  compare: string[];
  profile: Profile | null;
  onToggleCompare: (id: string) => void;
  onOpen: (o: InvestOption) => void;
  onSeeAll: (g: Goal | null) => void;
  onQuiz: () => void;
  onGrowth: () => void;
  onGlobal: () => void;
}

export default function GoalsTab(p: Props) {
  const goal = GOALS.find(g => g.id === p.goalId) || null;
  const byId = useMemo(() => new Map(p.options.map(o => [o.id, o])), [p.options]);
  const listRef = useRef<HTMLElement>(null);

  // On phones the short list sits below the six tiles; bring it into view when a goal is picked.
  useEffect(() => {
    if (!goal || !listRef.current || window.innerWidth >= 1024) return;
    listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [goal]);

  return (
    <div className="space-y-8">
      <section aria-labelledby="goal-q">
        <h2 id="goal-q" className="text-lg font-semibold tracking-[-0.01em] text-ink">What is this money for?</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3" role="radiogroup" aria-labelledby="goal-q">
          {GOALS.map(g => {
            const on = g.id === p.goalId;
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => p.onGoal(on ? null : g.id)}
                className={`group flex min-h-[76px] flex-col items-start gap-2 rounded-card sm:flex-row sm:gap-3 border p-3 text-left transition sm:p-4 ${
                  on ? 'border-cobalt bg-cobalt/[0.07] ring-1 ring-cobalt' : 'border-line bg-surface hover:border-ink/25'
                }`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${on ? 'bg-cobalt text-white' : 'bg-ink/[0.05] text-ink/80 group-hover:text-ink'}`}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-snug text-ink">{g.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{g.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {goal ? (
        <section ref={listRef} aria-labelledby="goal-picks" className="scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="max-w-2xl">
              <h2 id="goal-picks" className="text-lg font-semibold tracking-[-0.01em] text-ink">Three options to look at for {goal.forText}</h2>
              <p className="mt-1 text-sm text-muted">{goal.note}</p>
            </div>
          </div>

          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {goal.picks.map(({ id, why }) => {
              const o = byId.get(id);
              if (!o) return null;
              const inCmp = p.compare.includes(o.id);
              return (
                <li key={id} className="flex flex-col rounded-card border border-line bg-surface p-5">
                  <p className="text-xs font-medium text-muted">{p.categories[o.category]}</p>
                  <h3 className="mt-0.5 text-base font-semibold leading-snug text-ink">{o.name}</h3>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="num text-2xl font-semibold tracking-[-0.02em] text-ink">{fmtReturn(o)}</span>
                    {!o.return_label && <span className="text-xs text-muted">typical a year</span>}
                  </p>
                  <div className="mt-2"><RiskMeter risk={o.risk} /></div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/85">{why}</p>
                  {o.live_symbol && <div className="mt-2"><LiveTag symbol={o.live_symbol} quote={p.live?.prices[o.live_symbol]} /></div>}
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-sm">
                    <div><dt className="text-[11px] text-muted">Lock-in</dt><dd className="font-medium text-ink">{o.lock_in}</dd></div>
                    <div><dt className="text-[11px] text-muted">Minimum</dt><dd className="font-medium text-ink">{o.minimum}</dd></div>
                  </dl>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <button type="button" onClick={() => p.onOpen(o)} className="inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-accent hover:underline underline-offset-2">
                      Risks and tax <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => p.onToggleCompare(o.id)} aria-pressed={inCmp}
                      className={`inline-flex min-h-[36px] items-center gap-1 rounded-control border px-3 text-xs font-semibold transition ${inCmp ? 'border-accent bg-accent/10 text-accent' : 'border-line text-ink/85 hover:border-ink/30'}`}>
                      {inCmp ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                      {inCmp ? 'Comparing' : 'Compare'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">In no particular order, and not a recommendation for you. Check rates and terms with the provider.</p>
            <button type="button" onClick={() => p.onSeeAll(goal)} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-control border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-ink/30">
              Every option for this goal <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : (
        <p className="rounded-card border border-dashed border-line px-5 py-6 text-center text-sm text-muted">
          Pick a goal to see three options worth a look, or{' '}
          <button type="button" onClick={() => p.onSeeAll(null)} className="font-semibold text-accent underline underline-offset-2">browse all {p.options.length}</button>.
        </p>
      )}

      <section aria-label="More tools" className="grid gap-3 sm:grid-cols-3">
        <ToolLink icon={Scale} title={p.profile ? `Your risk profile: ${p.profile.name}` : 'How much risk suits you?'} text={p.profile ? 'Retake the five questions' : 'Five questions, under a minute'} onClick={p.onQuiz} />
        <ToolLink icon={Calculator} title="Growth projector" text="See what a monthly SIP could grow to" onClick={p.onGrowth} />
        <ToolLink icon={Globe2} title="Investing abroad" text="US stocks, global funds and GIFT City" onClick={p.onGlobal} />
      </section>
    </div>
  );
}

function ToolLink({ icon: Icon, title, text, onClick }: { icon: typeof Scale; title: string; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex items-center gap-3 rounded-card border border-line bg-surface p-4 text-left transition hover:border-ink/25">
      <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
    </button>
  );
}
