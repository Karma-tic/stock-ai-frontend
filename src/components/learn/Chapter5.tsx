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
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-lavender-text font-black text-xl shadow-lavender flex-shrink-0">
          5
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-lavender-text">Stock Market Risks</h2>
      </div>
      
      
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1 text-red-600 font-bold">!</div>
            <div>
              <p className="text-red-600 font-bold text-lg mb-2">Important Warning</p>
              <p className="text-lavender-text/80 leading-relaxed">
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
              <div key={item.risk} className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-6 hover:border-red-500/30 transition">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lavender-text font-bold text-lg">{item.risk}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wider ${
                    item.level === 'HIGH' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <p className="text-lavender-text/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-white/50 prose-headings:text-lavender-text prose-a:text-lavender-primary">
          <h2 className="text-2xl font-bold mb-4 text-lavender-text">Navigating Market Risks: Systemic vs. Unsystemic</h2>
          <p className="mb-4 leading-relaxed">
            Risk is an inherent part of investing. The potential for high returns in the stock market is directly correlated with the amount of risk an investor is willing to take. However, risk is not a monolith; it can be categorized into two primary types: Systemic Risk and Unsystemic Risk.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Systemic Risk (Market Risk)</h3>
          <p className="mb-4 leading-relaxed">
            Systemic risk refers to the risk inherent to the entire market or market segment. It is the risk that an entire financial system or market will collapse, affecting all companies within it regardless of their individual fundamentals. Because it affects the broad market, systemic risk is generally unpredictable and impossible to completely avoid through diversification.
          </p>
          <p className="mb-4 leading-relaxed">
            Examples of systemic risk include macroeconomic events like interest rate hikes by the RBI or Federal Reserve, geopolitical tensions, global pandemics (like COVID-19 in 2020), and severe recessions. When a "Black Swan" event occurs, virtually all stocks fall, regardless of how strong their individual balance sheets might be.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Unsystemic Risk (Specific Risk)</h3>
          <p className="mb-4 leading-relaxed">
            Unsystemic risk, on the other hand, is specific to a particular company or industry. It is the risk that a specific stock will decline due to factors unique to its operations or its immediate competitive environment.
          </p>
          <p className="mb-4 leading-relaxed">
            Examples of unsystemic risk include a change in company management, a product recall, a sudden regulatory change affecting a specific sector (like pharmaceuticals or telecommunications), or a competitor launching a highly disruptive product.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Managing Risk Through Diversification</h3>
          <p className="mb-4 leading-relaxed">
            While you cannot eliminate systemic risk, you can effectively mitigate unsystemic risk through <strong>diversification</strong>. By spreading your capital across different sectors (e.g., holding stocks in IT, Banking, FMCG, and Auto) and across different asset classes (e.g., Equities, Debt, Gold), you ensure that a catastrophic event in one specific company or industry does not wipe out your entire portfolio.
          </p>
          <p className="mb-4 leading-relaxed">
            A well-diversified portfolio acts as a shock absorber. For instance, if regulatory changes hurt your banking stocks, your IT or Pharma holdings might remain unaffected or even gain, balancing the overall impact on your wealth.
          </p>
        </article>
    </LearnLayout>
  );
}
