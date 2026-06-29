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
        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          4
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Fundamental vs Technical Analysis</h2>
      </div>
      
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="text-white font-bold text-xl mb-4">Fundamental Analysis</h4>
              <p className="text-slate-300 leading-relaxed mb-6">
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
                  <div key={item.metric} className="flex gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white font-semibold block mb-1">{item.metric}</span>
                      <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="text-white font-bold text-xl mb-4">Technical Analysis</h4>
              <p className="text-slate-300 leading-relaxed mb-6">
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
                  <div key={item.metric} className="flex gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white font-semibold block mb-1">{item.metric}</span>
                      <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-xl p-6">
            <h4 className="text-emerald-400 font-bold text-lg mb-3">How Stock AI Combines Both Approaches</h4>
            <p className="text-slate-300 leading-relaxed">
              Stock AI at <strong>byteplay.org</strong> combines fundamental data (PE ratio, EPS, dividend yield, market cap) with price action data (52-week position, volume ratio, daily change) and real-time news sentiment to generate signals. This multi-factor approach is more robust than using either method alone. Our AI reads 4 news sources simultaneously and integrates qualitative news analysis with quantitative market data — something that would take a human analyst several hours per stock.
            </p>
          </div>

    </LearnLayout>
  );
}
