import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

// Same plans and prices as before. Every button goes to sign-in via onGetStarted,
// where the upgrade (including the ₹1 one-day trial) is completed.
type Group = { name: string; items: string[] };

const FREE: Group[] = [
  { name: 'Research', items: ['2 AI analyses a day', 'Top 10 stocks', 'Every free tool and calculator'] },
  { name: 'Alerts', items: ['Daily market wrap'] },
  { name: 'Limits', items: ['5 stocks in your watchlist'] },
];

const PRO: Group[] = [
  { name: 'Research', items: ['Unlimited AI analyses', '500+ stocks', 'Portfolio tracker'] },
  { name: 'Alerts', items: ['Morning email digest at 8:30 AM'] },
  { name: 'Limits', items: ['No daily cap on analyses'] },
];

function Features({ groups, pro }: { groups: Group[]; pro?: boolean }) {
  return (
    <div className="mt-6 space-y-5">
      {groups.map((g) => (
        <div key={g.name}>
          <p className="text-xs font-medium text-muted">{g.name}</p>
          <ul className="mt-2 space-y-2">
            {g.items.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink/85">
                <Check className={`mt-0.5 h-4 w-4 shrink-0 ${pro ? 'text-accent' : 'text-muted'}`} strokeWidth={2.25} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Pricing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section aria-labelledby="pricing-heading" className="bg-canvas py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-heading" className="text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
            Start free. Go Pro when you need more.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">No hidden charges, and nothing renews automatically.</p>
        </div>

        {/* Phones: Pro first. Larger screens: side by side, Free on the left. */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-col-reverse gap-4 md:grid md:grid-cols-2 md:gap-5">
          <div className="flex flex-col rounded-card border border-line bg-surface p-6 sm:p-7">
            <p className="text-sm font-semibold text-ink">Free</p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="tnum text-4xl font-semibold tracking-[-0.03em] text-ink">₹0</span>
              <span className="text-sm text-muted">forever</span>
            </p>
            <p className="mt-1 text-sm text-muted">No card needed.</p>
            <Features groups={FREE} />
            <Button variant="ghost" size="lg" className="mt-8 w-full" onClick={onGetStarted}>
              Start free
            </Button>
          </div>

          <div className="relative flex flex-col rounded-card border border-accent bg-surface p-6 shadow-lift sm:p-7">
            <p className="text-sm font-semibold text-accent">Pro</p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="tnum text-4xl font-semibold tracking-[-0.03em] text-ink">₹99</span>
              <span className="text-sm text-muted">for 30 days</span>
              <span className="tnum text-sm text-muted line-through">₹499</span>
            </p>
            <p className="mt-1 text-sm text-muted">Regular price ₹499. Does not renew.</p>
            <Features groups={PRO} pro />
            <Button size="lg" className="mt-8 w-full" onClick={onGetStarted}>
              Go Pro
            </Button>
            <button type="button" onClick={onGetStarted} className="mt-3 min-h-[44px] text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
              Or try every Pro feature for a day, for ₹1
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
