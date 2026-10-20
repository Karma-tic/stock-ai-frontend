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
        <div className="w-12 h-12 bg-down/15 rounded-2xl flex items-center justify-center text-lavender-text font-black text-xl shadow-lavender flex-shrink-0">
          9
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-lavender-text">10 Common Mistakes</h2>
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
              <div key={item.mistake} className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-6 flex items-start gap-4 hover:border-down/30 transition">
                <div className="w-10 h-10 rounded-full bg-down/10 flex items-center justify-center flex-shrink-0 border border-down/20">
                  <span className="text-down font-black text-lg">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-lavender-text font-bold text-lg mb-2">{item.mistake}</h4>
                  <p className="text-lavender-text/70 leading-relaxed"><span className="text-up font-semibold">The Fix:</span> {item.fix}</p>
                </div>
              </div>
            ))}
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-lavender-text/10 prose-headings:text-lavender-text prose-a:text-lavender-primary">
          <h2 className="text-2xl font-bold mb-4 text-lavender-text">The Psychology of Trading: Common Pitfalls to Avoid</h2>
          <p className="mb-4 leading-relaxed">
            The mathematical mechanics of the stock market are relatively simple to grasp; it is the psychological aspect that causes the vast majority of traders to lose money. Success in the financial markets requires mastering your own emotions—specifically, fear and greed. Avoiding these common behavioral mistakes is critical for long-term survival.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">FOMO (Fear Of Missing Out)</h3>
          <p className="mb-4 leading-relaxed">
            FOMO occurs when a trader sees a stock skyrocketing (often a penny stock or a trending tech stock) and impulsively buys in near the top, terrified of missing the rally. This usually happens after the smart money has already taken their positions. By the time retail investors buy in due to FOMO, the trend is exhausted, and the stock inevitably crashes, leaving the latecomers holding heavy losses. Always trade based on a defined strategy, not on the fear of missing a sudden spike.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Averaging Down on Losers</h3>
          <p className="mb-4 leading-relaxed">
            "Averaging down" involves buying more shares of a stock as its price falls, hoping to lower the average entry price. While this can work for fundamentally strong long-term investments, doing this in short-term trading is disastrous. A famous market adage warns: "Never catch a falling knife." Throwing good money after bad into a declining stock without a clear reversal signal is a surefire way to blow up a trading account.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Revenge Trading</h3>
          <p className="mb-4 leading-relaxed">
            After suffering a painful loss, human nature compels us to try and win it back immediately. This is known as revenge trading. The trader abandons their risk management rules, increases their position size, and takes suboptimal trades in a desperate attempt to recoup the loss. Revenge trading is driven purely by emotion and almost always results in deeper drawdowns. The best action after a severe loss is to step away from the screen and recalibrate.
          </p>
          <h3 className="text-xl font-bold mb-3 text-lavender-text">Ignoring the Stop-Loss</h3>
          <p className="mb-4 leading-relaxed">
            A stop-loss is an order placed with a broker to sell a security when it reaches a certain price, designed to limit an investor's loss on a position. Perhaps the most fatal mistake a trader can make is entering a trade without a predefined stop-loss, or worse, manually moving the stop-loss lower as the trade goes against them, hoping for a bounce. Accepting a small, calculated loss is the cost of doing business in trading; refusing to accept it can lead to catastrophic financial ruin.
          </p>
        </article>
    </LearnLayout>
  );
}
