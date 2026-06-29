import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter9() {
  return (
    <LearnLayout
      chapterNumber={9}
      title="10 Common Mistakes"
      prevChapter={{ path: '/learn/dividend-investing', title: 'Dividend Investing' }}
      nextChapter={undefined}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          9
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">10 Common Mistakes</h2>
      </div>
      
      
          <div className="grid grid-cols-1 gap-4">
            {[
              { mistake: "Investing without research",    fix: "Use Stock AI to analyze any stock in 8 seconds before buying." },
              { mistake: "Trading without a stop loss",   fix: "Always set a stop loss. Stock AI calculates it for every signal automatically." },
              { mistake: "Panic selling at market lows",  fix: "Pre-define exit points. Don't make emotional decisions during extreme market volatility." },
              { mistake: "Buying tips from WhatsApp/Telegram", fix: "Verify every tip with fundamental data. Use byteplay.org for quick, unbiased analysis." },
              { mistake: "Over-concentration in one stock", fix: "Diversify across at least 5-8 different sectors so one bad stock doesn't ruin your portfolio." },
              { mistake: "Ignoring basic valuations",     fix: "Always check the PE ratio before buying. Never buy severely overvalued stocks without a catalyst." },
              { mistake: "Trading with borrowed money",   fix: "Only invest surplus money you can afford to lose completely. Debt multiplies losses." },
              { mistake: "Ignoring transaction costs",    fix: "Frequent trading erodes returns through brokerage, GST, and STT charges." },
              { mistake: "FOMO buying at 52-week highs",  fix: "Check 52-week position. Avoid chasing stocks already at all-time highs without strong news." },
              { mistake: "Not reviewing your portfolio",  fix: "Review monthly. Use the Stock AI portfolio tracker for live P&L monitoring." },
            ].map((item, i) => (
              <div key={item.mistake} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-start gap-4 hover:border-rose-500/30 transition">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                  <span className="text-rose-400 font-black text-lg">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">{item.mistake}</h4>
                  <p className="text-slate-400 leading-relaxed"><span className="text-green-400 font-semibold">The Fix:</span> {item.fix}</p>
                </div>
              </div>
            ))}
          </div>

    </LearnLayout>
  );
}
