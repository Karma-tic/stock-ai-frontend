import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);
  
  const [totalInvested, setTotalInvested] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalWealth, setTotalWealth] = useState(0);

  useEffect(() => {
    // SIP Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
    // P = amount, i = periodic interest rate (yearly rate/12/100), n = total number of months
    const P = monthlyInvestment;
    const i = expectedReturnRate / 12 / 100;
    const n = timePeriodYears * 12;

    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    
    const invested = P * n;
    const returns = M - invested;

    setTotalInvested(invested);
    setTotalWealth(M);
    setEstimatedReturns(returns);
  }, [monthlyInvestment, expectedReturnRate, timePeriodYears]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white text-gray-600">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">SIP Calculator</h1>
          </div>
          <p className="text-gray-500 text-lg">
            Calculate the future value of your systematic investment plan (SIP).
          </p>
        </div>

        {/* Interactive Calculator Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-16 shadow-xl flex flex-col md:flex-row gap-10">
          
          {/* Controls */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-900 font-semibold">Monthly Investment</label>
                <span className="text-blue-600 font-bold bg-blue-500/10 px-3 py-1 rounded-lg">
                  {formatCurrency(monthlyInvestment)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-gray-50 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-900 font-semibold">Expected Return Rate (p.a)</label>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
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
                className="w-full h-2 bg-gray-50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-900 font-semibold">Time Period</label>
                <span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-lg">
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
                className="w-full h-2 bg-gray-50 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 Yr</span>
                <span>40 Yrs</span>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="md:w-72 bg-gray-50/50 rounded-2xl p-6 border border-gray-300 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Invested Amount</p>
                <p className="text-xl text-gray-900 font-bold">{formatCurrency(totalInvested)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Est. Returns</p>
                <p className="text-xl text-emerald-400 font-bold">{formatCurrency(estimatedReturns)}</p>
              </div>
              <div className="pt-4 border-t border-gray-300">
                <p className="text-gray-500 text-sm mb-1">Total Value</p>
                <p className="text-3xl text-blue-600 font-black">{formatCurrency(totalWealth)}</p>
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
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Invested</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Returns</span>
            </div>
          </div>
        </div>

        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none prose-headings:text-gray-900 prose-a:text-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">What is a Systematic Investment Plan (SIP)?</h2>
          <p className="mb-6 leading-relaxed">
            A Systematic Investment Plan, commonly known as an SIP, is an investment strategy offered by mutual funds to investors, allowing them to invest a fixed amount of money at regular intervals—usually monthly or quarterly. In the Indian context, SIPs have become the cornerstone of retail investing, helping millions build wealth over the long term without needing to time the volatile stock market.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">The Power of Compounding</h2>
          <p className="mb-4 leading-relaxed">
            Albert Einstein is famously attributed with calling compound interest the "eighth wonder of the world." Compounding happens when the returns on your investments start generating their own returns. The longer you stay invested, the more pronounced this effect becomes.
          </p>
          <p className="mb-6 leading-relaxed">
            For example, using the SIP calculator above, if you invest ₹10,000 every month for 20 years at an expected return rate of 12% p.a., your total invested amount is ₹24 Lakhs. However, due to compounding, your estimated returns will be over ₹75 Lakhs, bringing your total wealth to nearly ₹1 Crore. The key variable here is <strong>time</strong>—delaying your investments by even 5 years can cost you tens of lakhs in future wealth.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Rupee Cost Averaging</h2>
          <p className="mb-6 leading-relaxed">
            One of the biggest advantages of an SIP is <em>Rupee Cost Averaging</em>. When the stock market (like the Nifty 50 or Sensex) falls, your fixed monthly SIP amount buys more units of the mutual fund. When the market goes up, it buys fewer units. Over a long period, this averages out the cost of your purchases, protecting you from the risk of investing a large lumpsum amount at a market peak.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">What is a Realistic Expected Return Rate?</h2>
          <p className="mb-4 leading-relaxed">
            When using an SIP return calculator, setting a realistic expected rate of return is crucial:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Large Cap Funds / Nifty 50 Index Funds:</strong> Historically, the Nifty 50 has delivered approximately 11% to 13% CAGR (Compound Annual Growth Rate) over 15+ year periods. Assuming 12% is generally considered a realistic expectation for equity investments in India.</li>
            <li><strong>Mid Cap and Small Cap Funds:</strong> These can deliver higher returns (often 14% to 18%) but come with significantly higher volatility and risk.</li>
            <li><strong>Debt Funds:</strong> For conservative investors, debt funds typically offer 6% to 8% returns, similar to Fixed Deposits (FDs) but with better tax efficiency in some cases.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Use the Stock AI SIP Calculator</h2>
          <p className="mb-4 leading-relaxed">
            Using our SIP calculator is straightforward and requires no financial expertise:
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Monthly Investment:</strong> Adjust the slider to reflect the amount you can comfortably invest every month. Start small if you need to; consistency matters more than the initial amount.</li>
            <li><strong>Expected Return Rate (p.a):</strong> Set this based on your asset allocation. Use 10-12% for equities and 6-8% for debt.</li>
            <li><strong>Time Period:</strong> Select the number of years you plan to keep investing without withdrawing. Notice how increasing the time period drastically increases the blue "Returns" portion of the graph!</li>
          </ol>

          <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-6 mt-8 shadow-sm">
            <h3 className="text-amber-900 font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The SIP calculator is for illustration purposes only and does not guarantee any returns. Historical returns of the Indian stock market (NSE/BSE) are not indicative of future performance. Always consult with a SEBI-registered financial advisor before making investment decisions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
