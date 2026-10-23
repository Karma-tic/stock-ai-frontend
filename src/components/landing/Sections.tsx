import { Button } from '../ui/Button';
import StockSearch from '../ui/StockSearch';
import { useInView } from './hooks';

// ── FAQ: three groups, native <details> (smooth height where the browser supports it) ──
const FAQ_GROUPS = [
  {
    name: 'Plans',
    items: [
      {
        q: 'Is Stock AI free to use?',
        a: 'Yes. The free plan includes 2 Evidence Boards a day, the last year of big-investor data, a 5-stock watchlist, portfolio health checks and every tool on the site. Pro is ₹99 for 30 days (a limited offer; the regular price is ₹499): it removes the limits and adds 3 years of big-investor history, alerts when promoters or big funds move in your stocks, and CSV export. It does not renew automatically.',
      },
      {
        q: 'Can I track my own portfolio?',
        a: 'Yes. Add your stocks, quantity and average buy price in the Portfolio tab, and Stock AI shows the live profit or loss against what you invested.',
      },
    ],
  },
  {
    name: 'Accuracy and safety',
    items: [
      {
        q: 'Is this SEBI-registered investment advice?',
        a: 'No. Stock AI is an educational platform. Its analysis is AI-generated for information only, and we are not SEBI-registered investment advisers or research analysts. Always consult a qualified financial adviser before investing.',
      },
      {
        q: 'How accurate is the AI analysis?',
        a: 'The AI works from price data, valuation numbers, filings and recent news, and like any tool it is sometimes wrong. We also publish studies of how stocks did after promoter trades and big stake changes, including when a signal did not help. Use it as one input among many.',
      },
    ],
  },
  {
    name: 'Data',
    items: [
      {
        q: 'Which stocks can I research?',
        a: "Search covers every company on NSE's equity list, from Nifty 50 leaders to PSUs, mid-caps and small caps.",
      },
      {
        q: 'How often is the information updated?',
        a: 'Prices refresh through the trading day. Analyses for watched stocks refresh every hour from 9 AM to 4 PM IST on weekdays, the market wrap arrives at 4:15 PM, and Pro users get a morning email digest at 8:30 AM.',
      },
    ],
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-line bg-canvas py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <h2 id="faq-heading" className="text-balance text-3xl font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
          Questions, answered
        </h2>
        <div className="space-y-10">
          {FAQ_GROUPS.map((g, gi) => (
            <div key={g.name}>
              <h3 className="text-sm font-semibold text-muted">{g.name}</h3>
              <div className="mt-2 divide-y divide-line border-y border-line">
                {g.items.map((item, i) => (
                  <details key={item.q} className="faq group" open={gi === 0 && i === 0}>
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-muted transition duration-ui group-open:rotate-45 motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-5 pr-10 text-[15px] leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final call to action: the product itself ──
export function TryIt({ onGetStarted }: { onGetStarted: () => void }) {
  const [ref, seen] = useInView<HTMLElement>('-10% 0px');
  return (
    <section ref={ref} aria-labelledby="tryit-heading" className={`tryit relative isolate overflow-hidden border-t border-line bg-canvas py-24 sm:py-32 ${seen ? 'is-on' : ''}`}>
      {/* The hero line returns, faint, and draws itself once. Why: the page ends where it began. */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[70%] w-full sm:block" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="tryit-line"
          pathLength={1}
          d="M0 380 C160 360 260 330 380 334 C480 338 540 300 640 262 C760 216 860 226 960 160 C1040 108 1110 70 1200 30"
          fill="none"
          stroke="rgb(var(--accent))"
          strokeOpacity="0.35"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <h2 id="tryit-heading" className="text-balance text-3xl font-bold tracking-[-0.03em] text-ink sm:text-5xl sm:leading-[1.05]">
          Pick a stock. See the evidence.
        </h2>
        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 text-left sm:flex-row">
          <StockSearch className="flex-1" placeholder="Try TCS, Infosys or HDFC Bank" />
          <Button size="lg" className="h-14 sm:w-auto" onClick={onGetStarted}>
            Start free
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">Stock pages are free to read. No card needed to sign up.</p>
      </div>
    </section>
  );
}
