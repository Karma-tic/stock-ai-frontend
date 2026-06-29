import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter2() {
  return (
    <LearnLayout
      chapterNumber={2}
      title="Types of Trading in Indian Stock Market"
      prevChapter={{ path: '/learn/what-is-stock-market', title: 'What is the Stock Market?' }}
      nextChapter={{ path: '/learn/essential-terms', title: 'Essential Stock Market Terms' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          2
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Types of Trading in Indian Stock Market</h2>
      </div>
      
      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                title:  "Intraday Trading",
                color:  "border-red-500/40 bg-red-500/5",
                badge:  "High Risk",
                badgeC: "bg-red-500/20 text-red-400",
                desc:   "Buying and selling stocks within the same trading day. Positions must be closed before 3:30 PM. Requires significant time, discipline and risk management. Not recommended for beginners.",
                pros:   ["No overnight risk", "Can profit in falling markets"],
                cons:   ["Very high risk", "Requires constant monitoring", "Most beginners lose money"],
              },
              {
                title:  "Swing Trading",
                color:  "border-yellow-500/40 bg-yellow-500/5",
                badge:  "Medium Risk",
                badgeC: "bg-yellow-500/20 text-yellow-400",
                desc:   "Holding stocks for 2 days to several weeks to capture short-term price movements. Combines technical analysis with fundamental research. Suitable for part-time traders.",
                pros:   ["Less time intensive than intraday", "Can capture multi-day trends"],
                cons:   ["Overnight gap risk", "Requires technical knowledge"],
              },
              {
                title:  "Positional Trading",
                color:  "border-blue-500/40 bg-blue-500/5",
                badge:  "Medium Risk",
                badgeC: "bg-blue-500/20 text-blue-400",
                desc:   "Holding stocks for weeks to months based on a medium-term view. Focuses on fundamental analysis and sector trends. Good balance between active and passive investing.",
                pros:   ["Less stress than intraday", "Captures large moves"],
                cons:   ["Requires patience", "Capital locked for months"],
              },
              {
                title:  "Long-term Investing",
                color:  "border-green-500/40 bg-green-500/5",
                badge:  "Lower Risk",
                badgeC: "bg-green-500/20 text-green-400",
                desc:   "Buying quality stocks and holding for years or decades. Warren Buffett's preferred approach. Power of compounding works best here. Ideal for wealth building over time.",
                pros:   ["Benefits from compounding", "Lower tax on LTCG", "Less time required"],
                cons:   ["Returns take years", "Patience required"],
              },
            ].map(item => (
              <div key={item.title} className={`border rounded-xl p-5 ${item.color}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeC}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-green-400 text-xs font-semibold mb-1">Pros</p>
                    {item.pros.map(p => <p key={p} className="text-slate-400 text-xs">+ {p}</p>)}
                  </div>
                  <div>
                    <p className="text-red-400 text-xs font-semibold mb-1">Cons</p>
                    {item.cons.map(c => <p key={c} className="text-slate-400 text-xs">- {c}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <p className="text-blue-400 text-sm font-semibold mb-2">Stock AI Recommendation</p>
            <p className="text-slate-300 leading-relaxed">
              For most retail investors, a combination of positional trading and long-term investing works best. Stock AI at <strong>byteplay.org</strong> generates BUY/HOLD/SELL signals with 1-3 month and 6-12 month targets — perfectly suited for both positional and long-term approaches.
            </p>
          </div>

    </LearnLayout>
  );
}
