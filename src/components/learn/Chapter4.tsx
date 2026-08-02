import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter4() {
  return (
    <LearnLayout
      chapterNumber={4}
      title="Fundamental vs Technical Analysis"
      prevChapter={{ path: '/learn/essential-terms', title: 'Essential Stock Market Terms' }}
      nextChapter={{ path: '/learn/market-risks', title: 'Stock Market Risks' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-gray-900 font-black text-xl shadow-lg flex-shrink-0">
          4
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">Fundamental vs Technical Analysis</h2>
      </div>
      
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <h4 className="text-gray-900 font-bold text-xl mb-4">Fundamental Analysis</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Evaluating a company's intrinsic value by examining financial statements, business model, management quality, competitive advantages and growth prospects. Used for long-term investment decisions.
              </p>
              <div className="space-y-4">
                {[
                  { metric: "Revenue Growth", desc: "Is the company growing its sales year-on-year?" },
                  { metric: "Profit Margins", desc: "Is it converting revenue to profit efficiently?" },
                  { metric: "Debt Levels", desc: "Is the company over-leveraged? Check D/E ratio." },
                  { metric: "Return on Equity", desc: "How efficiently is it using shareholder money?" },
                  { metric: "Cash Flow", desc: "Is it generating real cash, not just paper profits?" },
                ].map(item => (
                  <div key={item.metric} className="flex gap-3 bg-white/50 p-3 rounded-lg border border-gray-300/50">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 font-semibold block mb-1">{item.metric}</span>
                      <span className="text-gray-500 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <h4 className="text-gray-900 font-bold text-xl mb-4">Technical Analysis</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Studying price charts and patterns to predict future price movements. Based on the belief that historical price action repeats. Used primarily for short-term trading decisions.
              </p>
              <div className="space-y-4">
                {[
                  { metric: "Moving Averages", desc: "50-day and 200-day MA show trend direction." },
                  { metric: "RSI", desc: "Relative Strength Index — above 70 is overbought, below 30 is oversold." },
                  { metric: "Support/Resistance", desc: "Price levels where stocks historically reverse." },
                  { metric: "Volume Analysis", desc: "Confirms price moves — high volume = conviction." },
                  { metric: "Candlestick Patterns", desc: "Doji, hammer, engulfing patterns signal reversals." },
                ].map(item => (
                  <div key={item.metric} className="flex gap-3 bg-white/50 p-3 rounded-lg border border-gray-300/50">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 font-semibold block mb-1">{item.metric}</span>
                      <span className="text-gray-500 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-900/40 to-gray-50 border border-emerald-500/30 rounded-xl p-6">
            <h4 className="text-emerald-400 font-bold text-lg mb-3">How Stock AI Combines Both Approaches</h4>
            <p className="text-gray-600 leading-relaxed">
              Stock AI at <strong>byteplay.org</strong> combines fundamental data (PE ratio, EPS, dividend yield, market cap) with price action data (52-week position, volume ratio, daily change) and real-time news sentiment to generate signals. This multi-factor approach is more robust than using either method alone. Our AI reads 4 news sources simultaneously and integrates qualitative news analysis with quantitative market data — something that would take a human analyst several hours per stock.
            </p>
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-gray-200 prose-headings:text-gray-900 prose-a:text-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Fundamental vs. Technical Analysis: Finding Your Edge</h2>
          <p className="mb-4 leading-relaxed">
            When deciding which stocks to buy, investors generally rely on two distinct schools of thought: Fundamental Analysis and Technical Analysis. While purists argue for one over the other, the most successful investors often use a combination of both.
          </p>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Fundamental Analysis: Uncovering Intrinsic Value</h3>
          <p className="mb-4 leading-relaxed">
            Fundamental analysis is the process of evaluating a company's core business to determine its intrinsic value. The goal is to answer a simple question: Is the current stock price lower or higher than what the company is actually worth?
          </p>
          <p className="mb-4 leading-relaxed">
            Fundamental analysts pore over financial statements—the balance sheet, income statement, and cash flow statement. They look at crucial ratios:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Price-to-Earnings (P/E) Ratio:</strong> How much you are paying for ₹1 of the company's earnings. A lower P/E relative to peers might indicate an undervalued stock.</li>
            <li><strong>Return on Equity (ROE):</strong> A measure of financial performance calculated by dividing net income by shareholders' equity. It shows how efficiently management is using investors' money to generate growth.</li>
            <li><strong>Debt-to-Equity Ratio:</strong> Indicates how much debt a company is using to finance its assets relative to the value of shareholders' equity. High debt can be a red flag in rising interest rate environments.</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Technical Analysis: The Study of Price Action</h3>
          <p className="mb-4 leading-relaxed">
            Technical analysis completely ignores a company's financials. Instead, it assumes that all fundamental information is already "priced in" to the stock. Technical analysts study historical market data, primarily price and volume, to forecast future price movements.
          </p>
          <p className="mb-4 leading-relaxed">
            This approach involves reading candlestick charts, identifying support and resistance levels, and using mathematical indicators like Moving Averages, Relative Strength Index (RSI), and MACD. Technical analysts look for repeating patterns (like Head and Shoulders, Double Bottoms, or Flags) to time their entries and exits.
          </p>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Combining Both Worlds: Techno-Funda Approach</h3>
          <p className="mb-4 leading-relaxed">
            A growing number of modern traders employ a "Techno-Funda" strategy. They use fundamental analysis to answer the question of <em>what</em> to buy (identifying fundamentally strong companies with good earnings growth) and use technical analysis to answer the question of <em>when</em> to buy (finding the optimal entry price based on chart support levels). This dual approach can significantly improve risk-adjusted returns.
          </p>
        </article>
    </LearnLayout>
  );
}
