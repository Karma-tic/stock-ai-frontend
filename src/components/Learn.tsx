import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Learn() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950">
      <section className="max-w-5xl mx-auto px-6 py-16">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Free Learning Hub
          </p>
          <h2 className="text-white text-3xl font-bold mb-4">
            Complete Guide to Stock Market Investing in India
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about trading on NSE and BSE —
            from basics to AI-powered analysis. Learn at your own pace.
          </p>
        </div>

        {/* ── Chapter 1 — What is Stock Market ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">1</div>
            <h3 className="text-white text-xl font-bold">What is the Stock Market?</h3>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-4">
            <p className="text-slate-300 leading-relaxed mb-4">
              The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. In India, the two primary stock exchanges are the <strong className="text-white">National Stock Exchange (NSE)</strong> and the <strong className="text-white">Bombay Stock Exchange (BSE)</strong>. When you buy a share, you become a part-owner of that company and participate in its profits and growth.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              The NSE's benchmark index is <strong className="text-white">Nifty 50</strong> — representing the 50 largest companies by market capitalisation. The BSE equivalent is <strong className="text-white">Sensex</strong> — tracking 30 companies. When people say "the market is up today" they typically mean these indices have risen.
            </p>
            <p className="text-slate-300 leading-relaxed">
              India's market capitalisation crossed ₹400 lakh crore in 2024, making it one of the top 5 largest stock markets in the world. Over 9 crore Indians are now registered investors on NSE — a number growing rapidly as digital platforms make investing more accessible.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { term: "NSE", def: "National Stock Exchange — India's largest exchange by trading volume. Home to Nifty 50 index and over 2,000 listed companies." },
              { term: "BSE", def: "Bombay Stock Exchange — Asia's oldest exchange, established 1875. Home to Sensex index and over 5,000 listed companies." },
              { term: "SEBI", def: "Securities and Exchange Board of India — the regulatory authority that governs all market participants and protects investor interests." },
            ].map(item => (
              <div key={item.term} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <p className="text-blue-400 font-bold mb-2">{item.term}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter 2 — Types of Trading ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">2</div>
            <h3 className="text-white text-xl font-bold">Types of Trading in Indian Stock Market</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.desc}</p>
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
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-400 text-sm font-semibold mb-1">Stock AI Recommendation</p>
            <p className="text-slate-300 text-sm">
              For most retail investors, a combination of positional trading and long-term investing works best. Stock AI at <strong>byteplay.org</strong> generates BUY/HOLD/SELL signals with 1-3 month and 6-12 month targets — perfectly suited for both positional and long-term approaches.
            </p>
          </div>
        </div>

        {/* ── Chapter 3 — Key Stock Market Terms ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">3</div>
            <h3 className="text-white text-xl font-bold">Essential Stock Market Terms Every Investor Must Know</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { term: "Bull Market", def: "A market condition where stock prices are rising or expected to rise. Nifty 50 rising 20% from its recent low signals a bull market." },
              { term: "Bear Market", def: "A market condition where stock prices are falling by 20% or more from recent highs. Associated with economic slowdowns." },
              { term: "Market Cap", def: "Total market value of a company's shares. Calculated as share price × total shares. Used to classify stocks as large-cap (>₹20,000 Cr), mid-cap, or small-cap." },
              { term: "PE Ratio", def: "Price to Earnings ratio. Shows how much investors pay per rupee of earnings. Lower PE may indicate undervaluation. Nifty 50 average PE is ~20-22." },
              { term: "Dividend", def: "A portion of company profits distributed to shareholders. Companies like ITC, Coal India and PSUs are known for high dividend yields in India." },
              { term: "52-Week High/Low", def: "The highest and lowest price at which a stock has traded in the past year. Stocks near 52-week lows may present buying opportunities." },
              { term: "Volume", def: "Number of shares traded in a given period. High volume with price increase confirms strong buying interest. Low volume moves are less reliable." },
              { term: "Stop Loss", def: "A predetermined price at which you exit a trade to limit losses. Essential risk management tool. Stock AI calculates stop loss for every recommendation." },
              { term: "FII/FPI", def: "Foreign Institutional Investors. Their buying or selling significantly impacts Indian markets. Heavy FII selling often causes market corrections." },
              { term: "DII", def: "Domestic Institutional Investors — mutual funds, insurance companies, pension funds. They often buy during FII selling, providing market support." },
              { term: "Circuit Breaker", def: "Automatic trading halt when a stock moves beyond a limit (typically ±5%, ±10%, ±20%). Prevents panic buying or selling." },
              { term: "Demat Account", def: "Dematerialised account that holds your shares electronically. Required to trade on NSE/BSE. Provided by brokers like Zerodha, Groww, Upstox." },
            ].map(item => (
              <div key={item.term} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <p className="text-blue-400 font-bold text-sm mb-1">{item.term}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter 4 — How to Analyze Stocks ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">4</div>
            <h3 className="text-white text-xl font-bold">How to Analyze Stocks — Fundamental vs Technical</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">Fundamental Analysis</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Evaluating a company's intrinsic value by examining financial statements, business model, management quality, competitive advantages and growth prospects. Used for long-term investment decisions.
              </p>
              <div className="space-y-2">
                {[
                  { metric: "Revenue Growth", desc: "Is the company growing its sales year-on-year?" },
                  { metric: "Profit Margins", desc: "Is it converting revenue to profit efficiently?" },
                  { metric: "Debt Levels", desc: "Is the company over-leveraged? Check D/E ratio." },
                  { metric: "Return on Equity", desc: "How efficiently is it using shareholder money?" },
                  { metric: "Cash Flow", desc: "Is it generating real cash, not just paper profits?" },
                ].map(item => (
                  <div key={item.metric} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white text-sm font-semibold">{item.metric}: </span>
                      <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">Technical Analysis</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Studying price charts and patterns to predict future price movements. Based on the belief that historical price action repeats. Used primarily for short-term trading decisions.
              </p>
              <div className="space-y-2">
                {[
                  { metric: "Moving Averages", desc: "50-day and 200-day MA show trend direction." },
                  { metric: "RSI", desc: "Relative Strength Index — above 70 is overbought, below 30 is oversold." },
                  { metric: "Support/Resistance", desc: "Price levels where stocks historically reverse." },
                  { metric: "Volume Analysis", desc: "Confirms price moves — high volume = conviction." },
                  { metric: "Candlestick Patterns", desc: "Doji, hammer, engulfing patterns signal reversals." },
                ].map(item => (
                  <div key={item.metric} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white text-sm font-semibold">{item.metric}: </span>
                      <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-2">How Stock AI Combines Both Approaches</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Stock AI at <strong>byteplay.org</strong> combines fundamental data (PE ratio, EPS, dividend yield, market cap) with price action data (52-week position, volume ratio, daily change) and real-time news sentiment to generate signals. This multi-factor approach is more robust than using either method alone. Our AI reads 4 news sources simultaneously and integrates qualitative news analysis with quantitative market data — something that would take a human analyst several hours per stock.
            </p>
          </div>
        </div>

        {/* ── Chapter 5 — Risks ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">5</div>
            <h3 className="text-white text-xl font-bold">Stock Market Risks Every Investor Must Understand</h3>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-red-400 font-semibold mb-2">Important Warning</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Stock market investments are subject to market risks. You can lose some or all of your invested capital. Never invest money you cannot afford to lose. Stock AI provides AI-generated analysis for educational purposes — it is not SEBI-registered investment advice.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div key={item.risk} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white font-semibold">{item.risk}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.level === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter 6 — AI in Stock Markets ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">6</div>
            <h3 className="text-white text-xl font-bold">Role of Artificial Intelligence in Stock Market Analysis</h3>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <p className="text-slate-300 leading-relaxed mb-4">
              Artificial Intelligence is transforming how financial markets are analyzed. Hedge funds and institutional investors have used AI for over a decade. Now, platforms like <strong className="text-white">Stock AI (byteplay.org)</strong> are making these capabilities available to retail investors in India at no cost.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Modern AI models — particularly Large Language Models (LLMs) like the ones powering Stock AI — can read and understand unstructured text data like news articles, company announcements and earnings reports. They can process thousands of data points simultaneously and identify patterns that human analysts might miss.
            </p>
            <p className="text-slate-300 leading-relaxed">
              However, AI is not infallible. Markets are influenced by human psychology, unexpected events and irrational behavior that no model can perfectly predict. AI analysis should be used as one input among many, not as the sole basis for investment decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                title: "What AI Does Well",
                color: "border-green-500/30",
                items: [
                  "Processing large volumes of news simultaneously",
                  "Identifying patterns in price and volume data",
                  "Removing emotional bias from analysis",
                  "Generating structured, consistent outputs",
                  "Running analysis on hundreds of stocks in minutes",
                  "Combining multiple data sources into one signal",
                ],
                itemColor: "text-green-400",
              },
              {
                title: "What AI Cannot Do",
                color: "border-red-500/30",
                items: [
                  "Predict black swan events (wars, pandemics)",
                  "Guarantee future stock price movements",
                  "Replace thorough fundamental research",
                  "Account for insider information",
                  "Understand complex political situations perfectly",
                  "Provide SEBI-registered investment advice",
                ],
                itemColor: "text-red-400",
              },
            ].map(item => (
              <div key={item.title} className={`bg-slate-800 border rounded-xl p-5 ${item.color}`}>
                <h4 className="text-white font-bold mb-3">{item.title}</h4>
                <div className="space-y-2">
                  {item.items.map(i => (
                    <div key={i} className="flex gap-2">
                      <span className={`${item.itemColor} text-xs mt-0.5`}>●</span>
                      <p className="text-slate-400 text-sm">{i}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-2">How Stock AI Uses LLM Technology</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Stock AI at <strong>byteplay.org</strong> uses Llama 3.3 — a state-of-the-art Large Language Model — to analyze each stock. For every analysis request, the AI receives: live price data from NSE, PE ratio, 52-week position, volume data, and the latest news from 4 sources. It then generates a structured JSON response with BUY/HOLD/SELL signal, confidence score, entry price, two price targets, stop loss, quantity guide and detailed reasoning. The entire process takes approximately 8 seconds.
            </p>
          </div>
        </div>

        {/* ── Chapter 7 — How to start investing ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">7</div>
            <h3 className="text-white text-xl font-bold">How to Start Investing in Indian Stocks — Step by Step</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                step:  "Open a Demat and Trading Account",
                desc:  "You need a Demat account to hold shares electronically and a trading account to buy/sell. Popular brokers in India include Zerodha, Groww, Upstox, Angel One and HDFC Securities. KYC verification with Aadhaar and PAN is required. Account opening is free on most platforms.",
              },
              {
                step:  "Start with Large-Cap Nifty 50 Stocks",
                desc:  "Begin your investing journey with well-known, stable companies from Nifty 50. These include HDFC Bank, Reliance, TCS, Infosys and ITC. They are liquid, well-researched and less volatile than small or mid-cap stocks. Avoid penny stocks until you have significant experience.",
              },
              {
                step:  "Use Stock AI for Analysis",
                desc:  "Before buying any stock, run an AI analysis on byteplay.org. The platform reads official NSE announcements, latest news and valuation metrics to give you a structured BUY/HOLD/SELL signal with specific entry price, targets and stop loss. Use this as one input — always do your own research as well.",
              },
              {
                step:  "Always Set a Stop Loss",
                desc:  "A stop loss is a price level at which you exit a losing trade to prevent further loss. For example, if you buy a stock at ₹100, set a stop loss at ₹90. If it falls below ₹90, sell immediately. This protects you from catastrophic losses. Stock AI calculates an appropriate stop loss for every recommendation.",
              },
              {
                step:  "Diversify Your Portfolio",
                desc:  "Never put all your money in one stock or one sector. Spread across different sectors — banking, IT, FMCG, pharma, infrastructure. A diversified portfolio reduces the impact of any single stock's poor performance on your overall wealth.",
              },
              {
                step:  "Track Your Portfolio Regularly",
                desc:  "Use Stock AI's portfolio tracker at byteplay.org to monitor your live P&L. Enter your holdings, buy prices and quantities — the app shows your current profit or loss updated in real time. Review your portfolio at least once a week and rebalance based on changed fundamentals.",
              },
            ].map((item, index) => (
              <div key={item.step} className="flex gap-4 bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-400 font-black text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{item.step}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter 8 — Dividends & Long-term ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">8</div>
            <h3 className="text-white text-xl font-bold">Dividend Investing — Building Passive Income from Stocks</h3>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-4">
            <p className="text-slate-300 leading-relaxed mb-4">
              Dividend investing is a strategy of buying stocks that regularly pay dividends — a share of company profits distributed to shareholders. In India, many PSU companies and established private companies offer attractive dividend yields. Reinvesting dividends over time through compounding can significantly grow your wealth.
            </p>
            <p className="text-slate-300 leading-relaxed">
              For example, Coal India has historically offered dividend yields of 5-8%. If you invested ₹10 lakh in Coal India and reinvested all dividends, your investment could double in approximately 10-14 years purely through dividends — before any price appreciation.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { stock: "ITC",       yield: "~4-5%",  type: "FMCG" },
              { stock: "Coal India", yield: "~5-8%", type: "Mining" },
              { stock: "ONGC",      yield: "~4-6%",  type: "Energy" },
              { stock: "Power Grid", yield: "~4-5%", type: "Utility" },
            ].map(item => (
              <div key={item.stock} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
                <p className="text-white font-bold text-sm">{item.stock}</p>
                <p className="text-emerald-400 font-black">{item.yield}</p>
                <p className="text-slate-500 text-xs">{item.type}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-3 text-center">
            * Dividend yields are approximate and change with stock price. Check byteplay.org for current data.
          </p>
        </div>

        {/* ── Chapter 9 — Common Mistakes ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">9</div>
            <h3 className="text-white text-xl font-bold">10 Common Mistakes New Investors Make</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { mistake: "Investing without research",    fix: "Use Stock AI to analyze any stock in 8 seconds before buying" },
              { mistake: "No stop loss",                  fix: "Always set a stop loss. Stock AI calculates it for every signal" },
              { mistake: "Panic selling at lows",         fix: "Pre-define exit points. Don't make decisions during market volatility" },
              { mistake: "Buying tips from WhatsApp",     fix: "Verify every tip with fundamental data. Use byteplay.org for quick analysis" },
              { mistake: "Over-concentration in 1 stock", fix: "Diversify across at least 5-8 different sectors" },
              { mistake: "Ignoring valuations",           fix: "Always check PE ratio before buying. Never buy overvalued stocks" },
              { mistake: "Trading with borrowed money",   fix: "Only invest surplus money you can afford to lose completely" },
              { mistake: "Ignoring transaction costs",    fix: "Frequent trading erodes returns through brokerage and STT charges" },
              { mistake: "FOMO buying at highs",          fix: "Check 52-week position. Avoid stocks already at 52-week highs without strong catalysts" },
              { mistake: "Not reviewing portfolio",       fix: "Review monthly. Use Stock AI portfolio tracker for live P&L monitoring" },
            ].map((item, i) => (
              <div key={item.mistake} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-3">
                <span className="text-rose-400 font-black text-lg flex-shrink-0">{i + 1}.</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{item.mistake}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">Fix: {item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-blue-900/50 to-slate-800 border border-blue-500/30 rounded-2xl p-8 text-center mt-12">
          <h3 className="text-white text-2xl font-bold mb-3">
            Ready to Start?
          </h3>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Stock AI combines everything you've learned here — fundamental analysis, technical screening, news sentiment — into one AI-powered signal. Free to start.
          </p>
          <button onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition">
            Get Free AI Stock Analysis
          </button>
        </div>
      </section>
    </div>
  );
}
