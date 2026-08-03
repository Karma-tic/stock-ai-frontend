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
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lavender flex-shrink-0">
          2
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-lavender-text">Types of Trading in Indian Stock Market</h2>
      </div>
      
      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                title:  "Intraday Trading",
                color:  "border-red-500/40 bg-red-500/5",
                badge:  "High Risk",
                badgeC: "bg-red-500/20 text-red-600",
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
                color:  "border-white/50 bg-blue-500/5",
                badge:  "Medium Risk",
                badgeC: "bg-blue-500/20 text-lavender-primary",
                desc:   "Holding stocks for weeks to months based on a medium-term view. Focuses on fundamental analysis and sector trends. Good balance between active and passive investing.",
                pros:   ["Less stress than intraday", "Captures large moves"],
                cons:   ["Requires patience", "Capital locked for months"],
              },
              {
                title:  "Long-term Investing",
                color:  "border-green-500/40 bg-green-500/5",
                badge:  "Lower Risk",
                badgeC: "bg-green-500/20 text-green-600",
                desc:   "Buying quality stocks and holding for years or decades. Warren Buffett's preferred approach. Power of compounding works best here. Ideal for wealth building over time.",
                pros:   ["Benefits from compounding", "Lower tax on LTCG", "Less time required"],
                cons:   ["Returns take years", "Patience required"],
              },
            ].map(item => (
              <div key={item.title} className={`border rounded-2xl p-5 ${item.color}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lavender-text font-bold">{item.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeC}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-lavender-text/70 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-green-600 text-xs font-semibold mb-1">Pros</p>
                    {item.pros.map(p => <p key={p} className="text-lavender-text/70 text-xs">+ {p}</p>)}
                  </div>
                  <div>
                    <p className="text-red-600 text-xs font-semibold mb-1">Cons</p>
                    {item.cons.map(c => <p key={c} className="text-lavender-text/70 text-xs">- {c}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-500/10 border border-white/50 rounded-2xl p-6">
            <p className="text-lavender-primary text-sm font-semibold mb-2">Stock AI Recommendation</p>
            <p className="text-lavender-text/80 leading-relaxed">
              For most retail investors, a combination of positional trading and long-term investing works best. Stock AI at <strong>byteplay.org</strong> generates BUY/HOLD/SELL signals with 1-3 month and 6-12 month targets — perfectly suited for both positional and long-term approaches.
            </p>
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-white/50 prose-headings:text-lavender-text prose-a:text-lavender-primary">
          <h2 className="text-2xl font-bold mb-4 text-lavender-text">Deep Dive into Trading Styles: From Intraday to Delivery</h2>
          <p className="mb-4 leading-relaxed">
            Navigating the stock market requires choosing a trading style that aligns with your capital, risk tolerance, and time commitment. The Indian stock market offers various avenues, each with its distinct characteristics and taxation rules.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Intraday Trading (Day Trading)</h3>
          <p className="mb-4 leading-relaxed">
            Intraday trading involves buying and selling stocks within the same trading day (between 9:15 AM and 3:30 PM IST). The goal is to profit from short-term price fluctuations. If a position is not closed by the trader, the broker will automatically square it off before the market closes. Intraday traders rely heavily on technical analysis, charts, and momentum indicators. Because positions are not held overnight, intraday traders are immune to "gap down" openings the next day, but they must possess immense discipline and quick decision-making skills.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Swing Trading</h3>
          <p className="mb-4 leading-relaxed">
            Swing trading sits between day trading and long-term investing. Traders hold positions for a period ranging from a few days to several weeks. The objective is to capture a "swing" or a specific price movement in a stock. Swing traders use a combination of fundamental and technical analysis to identify trends and potential breakouts. This style requires less screen time than intraday trading but requires a solid understanding of market cycles and stop-loss management.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Delivery Trading (Long-Term Investing)</h3>
          <p className="mb-4 leading-relaxed">
            Delivery trading is synonymous with traditional investing. When you buy shares and hold them in your Demat account for more than a day, it is considered a delivery trade. This approach is rooted in fundamental analysis—evaluating a company's financial health, management, and growth prospects. Long-term investors benefit not just from capital appreciation but also from corporate actions like dividends, bonuses, and stock splits.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Tax Implications in India</h3>
          <p className="mb-4 leading-relaxed">
            Understanding the tax structure is crucial for calculating your net returns. In India, the taxation varies significantly based on your trading style:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-lavender-text/80">
            <li><strong>Short-Term Capital Gains (STCG):</strong> Applies to equity shares sold within 12 months of purchase. It is typically taxed at a flat rate of 15% (subject to changes in the Union Budget).</li>
            <li><strong>Long-Term Capital Gains (LTCG):</strong> Applies to equity shares held for more than 12 months. LTCG exceeding ₹1 lakh in a financial year is taxed at 10% without indexation benefits.</li>
            <li><strong>Intraday and F&O Trading:</strong> Profits from intraday equity trading and Futures & Options are treated as speculative and non-speculative business income, respectively, and are taxed according to your applicable income tax slab.</li>
          </ul>
        </article>
    </LearnLayout>
  );
}
