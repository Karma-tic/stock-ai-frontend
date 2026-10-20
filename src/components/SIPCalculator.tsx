import { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import SEO from './SEO';
import { GrowthChart, NumberSlider, RollingNumber, ShareResult, YearPoint, useUrlNumber } from './calc/CalcKit';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useUrlNumber('amount', 5000, 500, 1000000);
  const [rate, setRate] = useUrlNumber('rate', 12, 1, 30);
  const [years, setYears] = useUrlNumber('years', 10, 1, 40);

  // Year-by-year values for the chart and table
  const points = useMemo<YearPoint[]>(() => {
    const i = rate / 12 / 100;
    return Array.from({ length: years + 1 }, (_, y) => {
      const n = y * 12;
      const value = n === 0 ? 0 : i === 0 ? monthly * n : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      return { year: y, invested: monthly * n, value };
    });
  }, [monthly, rate, years]);
  const last = points[points.length - 1];
  const invested = last.invested;
  const total = last.value;
  const gains = total - invested;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="SIP Calculator India | Monthly Investment Return Calculator | Stock AI"
        description="Calculate future value, invested amount, and estimated returns for monthly SIP investments in India with a free SIP calculator."
        canonicalPath="/tools/sip-calculator"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-accent">
            <Calculator className="h-4 w-4" strokeWidth={1.75} /> Calculator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">SIP calculator</h1>
          <p className="mt-3 text-base text-muted">See what a fixed monthly investment could grow to. Change any number; the link updates so you can share the result.</p>
        </header>

        <section className="mb-16 grid gap-6 rounded-card border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="space-y-7">
            <NumberSlider label="Monthly investment" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} prefix="₹" suffix="" minLabel="₹500" maxLabel="₹1,00,000" />
            <NumberSlider label="Expected return a year" value={rate} onChange={setRate} min={1} max={30} step={0.5} prefix="" suffix="%" minLabel="1%" maxLabel="30%" />
            <NumberSlider label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} prefix="" suffix="yrs" minLabel="1 yr" maxLabel="40 yrs" />
          </div>

          <div className="flex flex-col">
            <dl className="grid grid-cols-3 gap-3">
              <div>
                <dt className="text-xs text-muted">Invested</dt>
                <dd className="mt-1 text-base font-semibold text-ink sm:text-lg"><RollingNumber value={invested} /></dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Est. growth</dt>
                <dd className="mt-1 text-base font-semibold text-up sm:text-lg"><RollingNumber value={gains} /></dd>
              </div>
              <div>
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
          <h2 className="text-2xl font-bold mb-4 text-ink">What is a Systematic Investment Plan (SIP)?</h2>
          <p className="mb-6 leading-relaxed">
            A Systematic Investment Plan, commonly known as an SIP, is an investment strategy offered by mutual funds to investors, allowing them to invest a fixed amount of money at regular intervals, usually monthly or quarterly. In the Indian context, SIPs have become the cornerstone of retail investing, helping millions build wealth over the long term without needing to time the volatile stock market.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">The Power of Compounding</h2>
          <p className="mb-4 leading-relaxed">
            Albert Einstein is famously attributed with calling compound interest the "eighth wonder of the world." Compounding happens when the returns on your investments start generating their own returns. The longer you stay invested, the more pronounced this effect becomes.
          </p>
          <p className="mb-6 leading-relaxed">
            For example, using the SIP calculator above, if you invest ₹10,000 every month for 20 years at an expected return rate of 12% p.a., your total invested amount is ₹24 Lakhs. However, due to compounding, your estimated returns will be over ₹75 Lakhs, bringing your total wealth to nearly ₹1 Crore. The key variable here is <strong>time</strong>, delaying your investments by even 5 years can cost you tens of lakhs in future wealth.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">Rupee Cost Averaging</h2>
          <p className="mb-6 leading-relaxed">
            One of the biggest advantages of an SIP is <em>Rupee Cost Averaging</em>. When the stock market (like the Nifty 50 or Sensex) falls, your fixed monthly SIP amount buys more units of the mutual fund. When the market goes up, it buys fewer units. Over a long period, this averages out the cost of your purchases, protecting you from the risk of investing a large lumpsum amount at a market peak.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">What is a Realistic Expected Return Rate?</h2>
          <p className="mb-4 leading-relaxed">
            When using an SIP return calculator, setting a realistic expected rate of return is crucial:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Large Cap Funds / Nifty 50 Index Funds:</strong> Historically, the Nifty 50 has delivered approximately 11% to 13% CAGR (Compound Annual Growth Rate) over 15+ year periods. Assuming 12% is generally considered a realistic expectation for equity investments in India.</li>
            <li><strong>Mid Cap and Small Cap Funds:</strong> These can deliver higher returns (often 14% to 18%) but come with significantly higher volatility and risk.</li>
            <li><strong>Debt Funds:</strong> For conservative investors, debt funds typically offer 6% to 8% returns, similar to Fixed Deposits (FDs) but with better tax efficiency in some cases.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-ink">How to Use the Stock AI SIP Calculator</h2>
          <p className="mb-4 leading-relaxed">
            Using our SIP calculator is straightforward and requires no financial expertise:
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Monthly Investment:</strong> Adjust the slider to reflect the amount you can comfortably invest every month. Start small if you need to; consistency matters more than the initial amount.</li>
            <li><strong>Expected Return Rate (p.a):</strong> Set this based on your asset allocation. Use 10-12% for equities and 6-8% for debt.</li>
            <li><strong>Time Period:</strong> Select the number of years you plan to keep investing without withdrawing. Notice how increasing the time period drastically increases the green "Growth" part of the chart!</li>
          </ol>

          <div className="rounded-card border border-line bg-surface p-6 mt-8">
            <h3 className="text-ink font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-muted leading-relaxed">
              Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The SIP calculator is for illustration purposes only and does not guarantee any returns. Historical returns of the Indian stock market (NSE/BSE) are not indicative of future performance. Always consult with a SEBI-registered financial advisor before making investment decisions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
