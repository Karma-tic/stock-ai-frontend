import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter5() {
  return (
    <LearnLayout
      chapterNumber={5}
      title="Stock Market Risks"
      prevChapter={{ path: '/learn/fundamental-vs-technical', title: 'Fundamental vs Technical Analysis' }}
      nextChapter={{ path: '/learn/ai-in-markets', title: 'Role of AI in Stock Markets' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          5
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Stock Market Risks</h2>
      </div>
      
      
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1 text-red-400 font-bold">!</div>
            <div>
              <p className="text-red-400 font-bold text-lg mb-2">Important Warning</p>
              <p className="text-slate-300 leading-relaxed">
                Stock market investments are subject to market risks. You can lose some or all of your invested capital. Never invest money you cannot afford to lose. Stock AI provides AI-generated analysis for educational purposes — it is not SEBI-registered investment advice.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                risk:   "Market Risk",
                desc:   "The entire market can fall due to global events, economic slowdowns, or geopolitical crises. Even good companies fall in a bear market. Diversification helps but cannot eliminate this risk.",
                level:  "HIGH",
              },
              {
                risk:   "Company-Specific Risk",
                desc:   "A company can fail, face fraud allegations, lose key management, or see its business disrupted. Examples: YES Bank, Satyam. Research thoroughly before investing.",
                level:  "HIGH",
              },
              {
                risk:   "Liquidity Risk",
                desc:   "Small and mid-cap stocks may not have enough buyers when you want to sell. Stick to liquid, high-volume stocks especially for large investments.",
                level:  "MEDIUM",
              },
              {
                risk:   "Regulatory Risk",
                desc:   "Government policy changes can significantly impact specific sectors. Examples: tobacco taxes affecting ITC, telecom regulations affecting Idea, crypto bans.",
                level:  "MEDIUM",
              },
              {
                risk:   "Currency Risk",
                desc:   "For IT companies earning in USD, a strong rupee reduces their revenues when converted. FII flows also affected by INR/USD movements.",
                level:  "MEDIUM",
              },
              {
                risk:   "Emotional Risk",
                desc:   "Fear and greed are the biggest risks. Panic selling at lows and buying at highs destroys wealth. Following AI-based signals removes emotional bias from decisions.",
                level:  "HIGH",
              },
            ].map(item => (
              <div key={item.risk} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-red-500/30 transition">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold text-lg">{item.risk}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wider ${
                    item.level === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

    </LearnLayout>
  );
}
