import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter8() {
  return (
    <LearnLayout
      chapterNumber={8}
      title="Dividend Investing"
      prevChapter={{ path: '/learn/how-to-start', title: 'How to Start Investing Step by Step' }}
      nextChapter={{ path: '/learn/common-mistakes', title: '10 Common Mistakes' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          8
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Dividend Investing</h2>
      </div>
      
      
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-10">
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Dividend investing is a strategy of buying stocks that regularly pay dividends — a share of company profits distributed to shareholders. In India, many PSU companies and established private companies offer attractive dividend yields. Reinvesting dividends over time through compounding can significantly grow your wealth.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              For example, Coal India has historically offered dividend yields of 5-8%. If you invested ₹10 lakh in Coal India and reinvested all dividends, your investment could double in approximately 10-14 years purely through dividends — before any price appreciation.
            </p>
          </div>
          
          <h4 className="text-2xl font-bold text-white mb-6 text-center">Top Dividend Yield Examples</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { stock: "ITC",       yield: "~4-5%",  type: "FMCG / Tobacco" },
              { stock: "Coal India", yield: "~5-8%", type: "Mining" },
              { stock: "ONGC",      yield: "~4-6%",  type: "Energy" },
              { stock: "Power Grid", yield: "~4-5%", type: "Utility" },
            ].map(item => (
              <div key={item.stock} className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 text-center hover:bg-emerald-900/40 transition cursor-default">
                <p className="text-white font-bold text-lg mb-2">{item.stock}</p>
                <p className="text-emerald-400 font-black text-3xl mb-2">{item.yield}</p>
                <p className="text-slate-500 text-sm">{item.type}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm text-center">
            * Dividend yields are historical approximations and change with stock price. Check byteplay.org for live data.
          </p>

    </LearnLayout>
  );
}
