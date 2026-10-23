import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import SEO from './SEO';
import { GrowthChart, NumberSlider, RollingNumber, ShareResult, YearPoint, useUrlNumber } from './calc/CalcKit';

export default function LumpsumCalculator() {
  const [amount, setAmount] = useUrlNumber('amount', 100000, 1000, 100000000);
  const [rate, setRate] = useUrlNumber('rate', 12, 1, 30);
  const [years, setYears] = useUrlNumber('years', 10, 1, 40);

  // Year-by-year values for the chart and table
  const points = useMemo<YearPoint[]>(() => {
    return Array.from({ length: years + 1 }, (_, y) => ({ year: y, invested: amount, value: amount * Math.pow(1 + rate / 100, y) }));
  }, [amount, rate, years]);
  const last = points[points.length - 1];
  const invested = last.invested;
  const total = last.value;
  const gains = total - invested;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Lumpsum Calculator India | One-Time Investment Return Calculator | Stock AI"
        description="Estimate future value, invested amount, and returns for one-time investments using a free Indian lumpsum calculator."
        canonicalPath="/tools/lumpsum-calculator"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4" strokeWidth={1.75} /> Calculator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">Lumpsum calculator</h1>
          <p className="mt-3 text-base text-muted">See what a one-time investment could grow to. Change any number; the link updates so you can share the result.</p>
        </header>

        <section className="mb-16 grid gap-6 rounded-card border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="space-y-7">
            <NumberSlider label="Total investment" value={amount} onChange={setAmount} min={1000} max={10000000} step={1000} prefix="₹" suffix="" minLabel="₹1,000" maxLabel="₹1 crore" />
            <NumberSlider label="Expected return a year" value={rate} onChange={setRate} min={1} max={30} step={0.5} prefix="" suffix="%" minLabel="1%" maxLabel="30%" />
            <NumberSlider label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} prefix="" suffix="yrs" minLabel="1 yr" maxLabel="40 yrs" />
          </div>

          <div className="flex flex-col">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted">Invested</dt>
                <dd className="mt-1 text-base font-semibold text-ink sm:text-lg"><RollingNumber value={invested} /></dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Est. growth</dt>
                <dd className="mt-1 text-base font-semibold text-up sm:text-lg"><RollingNumber value={gains} /></dd>
              </div>
              <div className="order-first col-span-2 sm:order-none sm:col-span-1">
                <dt className="text-xs text-muted">Total value</dt>
                <dd className="mt-1 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl"><RollingNumber value={total} /></dd>
              </div>
            </dl>
            <div className="mt-6">
              <GrowthChart points={points} />
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="text-xs text-muted">Illustration only. Returns are not guaranteed.</p>
              <ShareResult />
            </div>
          </div>
        </section>

        {/* SEO Text Content for AdSense */}
        <article className="calc-article mx-auto max-w-[70ch] text-[15px] leading-relaxed text-ink/85">
          <h2 className="text-2xl font-bold mb-4 text-ink">What is a Lumpsum Investment?</h2>
          <p className="mb-6 leading-relaxed">
            A lumpsum investment is a strategy where an investor puts a single, bulk amount of money into an investment vehicle (like mutual funds, stocks, or fixed deposits) at one go, rather than spreading it out over time. This approach is often used when you have accumulated a large sum of cash, perhaps from a bonus, the sale of an asset, or an inheritance, and you want to put that capital to work immediately in the market.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">Lumpsum vs. SIP: Which is Better?</h2>
          <p className="mb-4 leading-relaxed">
            A common dilemma for retail investors in India is choosing between a lumpsum investment and a Systematic Investment Plan (SIP). While SIPs benefit from rupee cost averaging by spreading out purchases, lumpsum investments can theoretically yield higher absolute returns if the market is on a prolonged upward trend (bull market).
          </p>
          <p className="mb-6 leading-relaxed">
            Because a lumpsum investment puts all your money to work from day one, it maximizes the time your capital spends in the market compounding. However, it also carries higher timing risk. If you invest a large lumpsum amount right before a major market correction, it could take years just to recover your principal. This is why many financial advisors suggest staggering lumpsum investments through Systematic Transfer Plans (STPs) if the market is at an all-time high.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">The Rule of 72</h2>
          <p className="mb-6 leading-relaxed">
            Want a quick mental shortcut without using the lumpsum calculator? Use the <strong>Rule of 72</strong>. If you divide 72 by your expected annual return rate, the result is approximately the number of years it will take to double your lumpsum investment. For example, if you invest ₹5 Lakhs in a Nifty 50 index fund that you expect to grow at 12% annually, it will take about 6 years (72 ÷ 12) for your money to double to ₹10 Lakhs.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">Understanding the Lumpsum Calculation Formula</h2>
          <p className="mb-4 leading-relaxed">
            The mathematics behind lumpsum growth is based on the compound interest formula: <strong>A = P(1 + r)^t</strong>. Here's a breakdown of the variables:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>A (Amount):</strong> The final total wealth or maturity value.</li>
            <li><strong>P (Principal):</strong> Your initial lumpsum investment amount.</li>
            <li><strong>r (Rate):</strong> The annual rate of return in decimal form (e.g., 12% becomes 0.12).</li>
            <li><strong>t (Time):</strong> The number of years the money stays invested.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-ink">Tax Implications in India (LTCG and STCG)</h2>
          <p className="mb-4 leading-relaxed">
            When you eventually withdraw the returns from your lumpsum investment in equity mutual funds or stocks, it is subject to taxation under Indian law:
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Short-Term Capital Gains (STCG):</strong> If you sell your equity investments within one year of buying, the profits are taxed at a flat rate (typically 20% under recent budget proposals, though historically 15%).</li>
            <li><strong>Long-Term Capital Gains (LTCG):</strong> If you hold for more than one year, the profits are classified as long-term. Under current regulations, long-term capital gains over ₹1.25 Lakhs in a financial year are taxed at 12.5% without indexation.</li>
          </ol>

          <div className="bg-up/10 border border-up/30 rounded-card p-6 mt-8">
            <h3 className="text-up font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-muted leading-relaxed">
              Mutual Fund and stock market investments are subject to market risks, read all scheme related documents carefully. The lumpsum return calculator is for illustration purposes only and does not guarantee any returns. Historical returns of the Indian stock market (NSE/BSE) are not indicative of future performance. Always consult with a SEBI-registered financial advisor before making investment decisions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
