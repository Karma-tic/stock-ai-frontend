import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(100000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);
  
  const [totalInvested, setTotalInvested] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalWealth, setTotalWealth] = useState(0);

  useEffect(() => {
    // Lumpsum Formula: A = P(1 + r)^t
    // P = Principal amount, r = annual interest rate, t = time in years
    const P = totalInvestment;
    const r = expectedReturnRate / 100;
    const t = timePeriodYears;

    const A = P * Math.pow(1 + r, t);
    
    const returns = A - P;

    setTotalInvested(P);
    setTotalWealth(A);
    setEstimatedReturns(returns);
  }, [totalInvestment, expectedReturnRate, timePeriodYears]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-lavender-surface text-lavender-text/80">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-lavender-text">Lumpsum Calculator</h1>
          </div>
          <p className="text-lavender-text/70 text-lg">
            Estimate the future value of your one-time investments with compounding.
          </p>
        </div>

        {/* Interactive Calculator Section */}
        <div className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-6 md:p-10 mb-16 shadow-lavender flex flex-col md:flex-row gap-10">
          
          {/* Controls */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lavender-text font-semibold">Total Investment</label>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-2xl">
                  {formatCurrency(totalInvestment)}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="10000000"
                step="5000"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="w-full h-2 bg-lavender-surface rounded-2xl appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-lavender-text/60 mt-2">
                <span>₹5,000</span>
                <span>₹1 Cr</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lavender-text font-semibold">Expected Return Rate (p.a)</label>
                <span className="text-lavender-primary font-bold bg-blue-500/10 px-3 py-1 rounded-2xl">
                  {expectedReturnRate}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-lavender-surface rounded-2xl appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-lavender-text/60 mt-2">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lavender-text font-semibold">Time Period</label>
                <span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-2xl">
                  {timePeriodYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={timePeriodYears}
                onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                className="w-full h-2 bg-lavender-surface rounded-2xl appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-lavender-text/60 mt-2">
                <span>1 Yr</span>
                <span>40 Yrs</span>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="md:w-72 bg-lavender-surface/50 rounded-2xl p-6 border border-white/50 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <p className="text-lavender-text/70 text-sm mb-1">Invested Amount</p>
                <p className="text-xl text-lavender-text font-bold">{formatCurrency(totalInvested)}</p>
              </div>
              <div>
                <p className="text-lavender-text/70 text-sm mb-1">Est. Returns</p>
                <p className="text-xl text-emerald-400 font-bold">{formatCurrency(estimatedReturns)}</p>
              </div>
              <div className="pt-4 border-t border-white/50">
                <p className="text-lavender-text/70 text-sm mb-1">Total Value</p>
                <p className="text-3xl text-emerald-400 font-black">{formatCurrency(totalWealth)}</p>
              </div>
            </div>
            
            {/* Simple Progress Bar Chart */}
            <div className="mt-8 h-4 flex rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${(totalInvested / totalWealth) * 100}%` }}
                title="Invested Amount"
              ></div>
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${(estimatedReturns / totalWealth) * 100}%` }}
                title="Estimated Returns"
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-lavender-text/60">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Invested</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Returns</span>
            </div>
          </div>
        </div>

        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none prose-headings:text-lavender-text prose-a:text-emerald-400">
          <h2 className="text-2xl font-bold mb-4 text-lavender-text">What is a Lumpsum Investment?</h2>
          <p className="mb-6 leading-relaxed">
            A lumpsum investment is a strategy where an investor puts a single, bulk amount of money into an investment vehicle (like mutual funds, stocks, or fixed deposits) at one go, rather than spreading it out over time. This approach is often used when you have accumulated a large sum of cash, perhaps from a bonus, the sale of an asset, or an inheritance, and you want to put that capital to work immediately in the market.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-lavender-text">Lumpsum vs. SIP: Which is Better?</h2>
          <p className="mb-4 leading-relaxed">
            A common dilemma for retail investors in India is choosing between a lumpsum investment and a Systematic Investment Plan (SIP). While SIPs benefit from rupee cost averaging by spreading out purchases, lumpsum investments can theoretically yield higher absolute returns if the market is on a prolonged upward trend (bull market).
          </p>
          <p className="mb-6 leading-relaxed">
            Because a lumpsum investment puts all your money to work from day one, it maximizes the time your capital spends in the market compounding. However, it also carries higher timing risk. If you invest a large lumpsum amount right before a major market correction, it could take years just to recover your principal. This is why many financial advisors suggest staggering lumpsum investments through Systematic Transfer Plans (STPs) if the market is at an all-time high.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-lavender-text">The Rule of 72</h2>
          <p className="mb-6 leading-relaxed">
            Want a quick mental shortcut without using the lumpsum calculator? Use the <strong>Rule of 72</strong>. If you divide 72 by your expected annual return rate, the result is approximately the number of years it will take to double your lumpsum investment. For example, if you invest ₹5 Lakhs in a Nifty 50 index fund that you expect to grow at 12% annually, it will take about 6 years (72 ÷ 12) for your money to double to ₹10 Lakhs.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-lavender-text">Understanding the Lumpsum Calculation Formula</h2>
          <p className="mb-4 leading-relaxed">
            The mathematics behind lumpsum growth is based on the compound interest formula: <strong>A = P(1 + r)^t</strong>. Here's a breakdown of the variables:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-lavender-text/80">
            <li><strong>A (Amount):</strong> The final total wealth or maturity value.</li>
            <li><strong>P (Principal):</strong> Your initial lumpsum investment amount.</li>
            <li><strong>r (Rate):</strong> The annual rate of return in decimal form (e.g., 12% becomes 0.12).</li>
            <li><strong>t (Time):</strong> The number of years the money stays invested.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-lavender-text">Tax Implications in India (LTCG and STCG)</h2>
          <p className="mb-4 leading-relaxed">
            When you eventually withdraw the returns from your lumpsum investment in equity mutual funds or stocks, it is subject to taxation under Indian law:
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-lavender-text/80">
            <li><strong>Short-Term Capital Gains (STCG):</strong> If you sell your equity investments within one year of buying, the profits are taxed at a flat rate (typically 20% under recent budget proposals, though historically 15%).</li>
            <li><strong>Long-Term Capital Gains (LTCG):</strong> If you hold for more than one year, the profits are classified as long-term. Under current regulations, long-term capital gains over ₹1.25 Lakhs in a financial year are taxed at 12.5% without indexation.</li>
          </ol>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mt-8">
            <h3 className="text-emerald-400 font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-lavender-text/70 leading-relaxed">
              Mutual Fund and stock market investments are subject to market risks, read all scheme related documents carefully. The lumpsum return calculator is for illustration purposes only and does not guarantee any returns. Historical returns of the Indian stock market (NSE/BSE) are not indicative of future performance. Always consult with a SEBI-registered financial advisor before making investment decisions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
