import { useState } from 'react';
import { Check } from 'lucide-react';
import { SectionHeader } from './Sections';

// Same plans, prices and buttons as before; every button goes to sign-in via onGetStarted.
const PLANS = [
  {
    title: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['2 AI analyses/day', 'Top 10 stocks', '5 watchlist stocks'],
    badge: null as string | null,
    tone: 'plain' as const,
    btnText: 'Get Started',
  },
  {
    title: 'Trial',
    price: '₹1',
    period: '1 day access',
    features: ['Full Pro access', 'All features unlocked', 'No commitment'],
    badge: 'TRY IT',
    tone: 'trial' as const,
    btnText: 'Try for ₹1',
  },
  {
    title: '1 Month',
    price: '₹99',
    originalPrice: '₹499',
    period: 'no auto-renewal · limited offer',
    features: ['Unlimited analysis', '500+ stocks', 'Portfolio tracker', 'Email digest'],
    badge: 'POPULAR',
    tone: 'popular' as const,
    btnText: 'Get 30 Days for ₹99',
  },
];

type Plan = (typeof PLANS)[number];

const TONES = {
  plain: {
    card: 'border border-lavender-text/10 bg-white dark:border-lavender-text/15',
    title: 'text-lavender-text/60',
    badge: '',
    check: 'text-lavender-text/50',
    button: 'border border-lavender-text/15 text-lavender-text hover:border-lavender-primary/40 hover:bg-lavender-surface',
  },
  trial: {
    card: 'border border-amber-400/50 bg-white dark:border-amber-400/30',
    title: 'text-amber-600 dark:text-amber-300',
    badge: 'bg-amber-400 text-[#2d2400]',
    check: 'text-amber-600 dark:text-amber-300',
    button: 'bg-amber-400 text-[#2d2400] hover:bg-amber-300',
  },
  popular: {
    card: 'border-2 border-lavender-primary/50 bg-white shadow-lavender',
    title: 'text-lavender-primary',
    badge: 'bg-gradient-lavender text-white',
    check: 'text-lavender-primary',
    button: 'bg-gradient-lavender text-white hover:opacity-90',
  },
};

function PlanCard({ plan, onChoose, className = '' }: { plan: Plan; onChoose: () => void; className?: string }) {
  const tone = TONES[plan.tone];
  const original = 'originalPrice' in plan ? plan.originalPrice : undefined;
  return (
    <div className={`relative flex h-full flex-col rounded-2xl p-6 text-left ${tone.card} ${className}`}>
      {plan.badge && (
        <span className={`absolute -top-3 left-6 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${tone.badge}`}>{plan.badge}</span>
      )}
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${tone.title}`}>{plan.title}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {original && <span className="text-lg text-lavender-text/45 line-through">{original}</span>}
        <span className="text-4xl font-extrabold tracking-tight text-lavender-text">{plan.price}</span>
        {original && <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">80% OFF</span>}
      </div>
      <p className="mt-1 text-sm text-lavender-text/55">{plan.period}</p>
      <ul className="mb-7 mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-lavender-text/80">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tone.check}`} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onChoose} className={`mt-auto w-full rounded-xl px-4 py-3 text-sm font-bold transition ${tone.button}`}>
        {plan.btnText}
      </button>
    </div>
  );
}

export default function Pricing({ onGetStarted }: { onGetStarted: () => void }) {
  const [active, setActive] = useState(1); // start on the middle card, as before
  const [touchStart, setTouchStart] = useState(0);

  const onTouchEnd = (e: React.TouchEvent) => {
    const distance = touchStart - e.changedTouches[0].clientX;
    if (distance > 50 && active < PLANS.length - 1) setActive(active + 1);
    if (distance < -50 && active > 0) setActive(active - 1);
  };

  return (
    <section aria-labelledby="pricing-heading" className="overflow-hidden border-y border-lavender-text/10 bg-lavender-base py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader id="pricing-heading" eyebrow="Pricing" title="Simple, transparent pricing" intro="No hidden charges and no auto-renewal. Start free and upgrade only if you need more." center />

        {/* Phones: swipe between plans */}
        <div className="mt-12 md:hidden">
          <div
            className="relative flex h-[440px] items-center justify-center"
            onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            {PLANS.map((plan, i) => {
              const offset = i - active;
              const pos =
                offset === 0
                  ? 'z-20 translate-x-0 scale-100 opacity-100'
                  : offset === -1
                    ? 'z-10 -translate-x-[82%] scale-90 opacity-40'
                    : offset === 1
                      ? 'z-10 translate-x-[82%] scale-90 opacity-40'
                      : 'pointer-events-none z-0 scale-75 opacity-0';
              return (
                <div
                  key={plan.title}
                  className={`absolute h-[400px] w-[min(300px,82vw)] transition-all duration-300 ease-out motion-reduce:transition-none ${pos}`}
                  onClick={() => offset !== 0 && setActive(i)}
                >
                  <PlanCard plan={plan} onChoose={() => (offset === 0 ? onGetStarted() : setActive(i))} />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-center gap-2">
            {PLANS.map((plan, i) => (
              <button
                key={plan.title}
                type="button"
                aria-label={`Show ${plan.title} plan`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${active === i ? 'w-6 bg-lavender-primary' : 'w-2 bg-lavender-text/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Tablet and desktop: three columns */}
        <div className="mx-auto mt-14 hidden max-w-5xl grid-cols-3 gap-5 md:grid">
          {PLANS.map((plan) => (
            <PlanCard key={plan.title} plan={plan} onChoose={onGetStarted} />
          ))}
        </div>
      </div>
    </section>
  );
}
