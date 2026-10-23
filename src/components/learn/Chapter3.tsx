import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter3() {
  return (
    <LearnLayout
      chapterNumber={3}
      title="Essential Stock Market Terms"
      prevChapter={{ path: '/learn/types-of-trading', title: 'Types of Trading in Indian Stock Market' }}
      nextChapter={{ path: '/learn/fundamental-vs-technical', title: 'Fundamental vs Technical Analysis' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="num grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-base font-semibold text-accent">
          3
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl text-balance">Essential Stock Market Terms</h1>
      </div>
      
      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { term: "Bull Market", def: "A market condition where stock prices are rising or expected to rise. Nifty 50 rising 20% from its recent low signals a bull market." },
              { term: "Bear Market", def: "A market condition where stock prices are falling by 20% or more from recent highs. Associated with economic slowdowns." },
              { term: "Market Cap", def: "Total market value of a company's shares. Calculated as share price × total shares. Used to classify stocks as large-cap (>₹20,000 Cr), mid-cap, or small-cap." },
              { term: "PE Ratio", def: "Price to Earnings ratio. Shows how much investors pay per rupee of earnings. Lower PE may indicate undervaluation. Nifty 50 average PE is ~20-22." },
              { term: "Dividend", def: "A portion of company profits distributed to shareholders. Companies like ITC, Coal India and PSUs are known for high dividend yields in India." },
              { term: "52-Week High/Low", def: "The highest and lowest price at which a stock has traded in the past year. Stocks near 52-week lows may present buying opportunities." },
              { term: "Volume", def: "Number of shares traded in a given period. High volume with price increase confirms strong buying interest. Low volume moves are less reliable." },
              { term: "Stop Loss", def: "A predetermined price at which you exit a trade to limit losses. Essential risk management tool. Decide yours before you buy, based on how much you can afford to lose." },
              { term: "FII/FPI", def: "Foreign Institutional Investors. Their buying or selling significantly impacts Indian markets. Heavy FII selling often causes market corrections." },
              { term: "DII", def: "Domestic Institutional Investors — mutual funds, insurance companies, pension funds. They often buy during FII selling, providing market support." },
              { term: "Circuit Breaker", def: "Automatic trading halt when a stock moves beyond a limit (typically ±5%, ±10%, ±20%). Prevents panic buying or selling." },
              { term: "Demat Account", def: "Dematerialised account that holds your shares electronically. Required to trade on NSE/BSE. Provided by brokers like Zerodha, Groww, Upstox." },
            ].map(item => (
              <div key={item.term} className="rounded-card border border-line bg-surface p-5 hover:border-up/30 transition">
                <p className="text-up font-bold text-lg mb-2">{item.term}</p>
                <p className="text-ink/85 leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="calc-article mt-14 border-t border-line pt-8">
          <h2 className="text-2xl font-bold mb-4 text-ink">Mastering the Language of the Market</h2>
          <p className="mb-4 leading-relaxed">
            To successfully navigate the financial markets, you must first speak its language. Financial jargon can seem intimidating, but understanding these essential terms is the first step toward becoming a confident investor.
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">Bulls, Bears, and Market Sentiment</h3>
          <p className="mb-4 leading-relaxed">
            The terms "Bull" and "Bear" are ubiquitous in finance. A <strong>Bull Market</strong> occurs when stock prices are rising consistently, fueled by economic growth and investor optimism. Conversely, a <strong>Bear Market</strong> is characterized by falling prices and widespread pessimism, typically defined as a drop of 20% or more from recent highs. These terms are said to originate from how the animals attack: a bull thrusts its horns up, while a bear swipes its paws down.
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">Volatility and the VIX</h3>
          <p className="mb-4 leading-relaxed">
            <strong>Volatility</strong> measures the rate at which the price of a stock or market index increases or decreases. A highly volatile stock experiences massive price swings in short periods, making it riskier but potentially more profitable for short-term traders. The India VIX (Volatility Index) is a measure of the market's expectation of volatility over the near term. A rising VIX often indicates fear and uncertainty, usually correlating with a falling Nifty 50.
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">Liquidity: The Lifeblood of Trading</h3>
          <p className="mb-4 leading-relaxed">
            <strong>Liquidity</strong> refers to how easily you can buy or sell a stock without significantly affecting its price. High liquidity means there are always plenty of buyers and sellers available. Large-cap stocks like Reliance or Infosys are highly liquid. Penny stocks, however, often suffer from low liquidity, meaning you might not be able to sell your shares when you want to, or you may have to sell them at a steep discount (the bid-ask spread is wide).
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">Corporate Actions: Dividends, Bonuses, and Splits</h3>
          <p className="mb-4 leading-relaxed">
            Companies regularly announce corporate actions that affect shareholders:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Dividends:</strong> A portion of the company's profits distributed to shareholders as a reward for their investment.</li>
            <li><strong>Bonus Issue:</strong> Free additional shares given to existing shareholders based upon the number of shares they already own (e.g., a 1:1 bonus means you get one free share for every share you hold).</li>
            <li><strong>Stock Split:</strong> A decision to increase the number of outstanding shares by splitting existing shares (e.g., a ₹10 face value share split into 10 shares of ₹1 face value). This increases liquidity and makes the stock more affordable for retail investors without changing the company's total market capitalization.</li>
          </ul>
        </article>
    </LearnLayout>
  );
}
