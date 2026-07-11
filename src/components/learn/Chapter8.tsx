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

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-slate-800 prose-headings:text-white prose-a:text-blue-400">
          <h2 className="text-2xl font-bold mb-4 text-white">Dividend Investing: Creating Passive Income Streams</h2>
          <p className="mb-4 leading-relaxed">
            While many investors focus entirely on capital appreciation—buying a stock at ₹100 and selling it at ₹150—there is another powerful way to generate wealth in the stock market: Dividend Investing. This strategy focuses on building a portfolio of companies that regularly share a portion of their profits with their investors.
          </p>
          <h3 className="text-xl font-bold mb-3 text-white">What is a Dividend?</h3>
          <p className="mb-4 leading-relaxed">
            A dividend is a reward, cash or otherwise, that a company gives to its shareholders. When a mature, profitable company generates more cash than it needs to reinvest in its business (like building new factories or funding R&D), it often chooses to distribute that excess cash to the people who own the company—the shareholders. In India, public sector undertakings (PSUs) and established FMCG and IT companies are known for their consistent dividend payouts.
          </p>
          <h3 className="text-xl font-bold mb-3 text-white">Understanding Dividend Yield</h3>
          <p className="mb-4 leading-relaxed">
            The most important metric for a dividend investor is the <strong>Dividend Yield</strong>. It is calculated by dividing the annual dividend per share by the current stock price, expressed as a percentage.
          </p>
          <p className="mb-4 leading-relaxed">
            For example, if a stock is trading at ₹1000 and the company pays an annual dividend of ₹50 per share, the dividend yield is 5%. A high dividend yield can be attractive, but investors must be cautious; sometimes a high yield is the result of a rapidly falling stock price, indicating underlying fundamental issues (a "dividend trap").
          </p>
          <h3 className="text-xl font-bold mb-3 text-white">Crucial Dates: Record Date and Ex-Dividend Date</h3>
          <p className="mb-4 leading-relaxed">
            To receive a dividend, you must be a shareholder on the company's books.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
            <li><strong>Record Date:</strong> The cut-off date set by the company to determine which shareholders are eligible to receive the dividend.</li>
            <li><strong>Ex-Dividend Date:</strong> In the Indian T+1 settlement cycle, this is usually the same day as the record date. You must purchase the stock <em>before</em> the ex-dividend date to be eligible. If you buy the stock on or after the ex-dividend date, the seller receives the dividend, not you.</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-white">The Power of Dividend Reinvestment</h3>
          <p className="mb-4 leading-relaxed">
            The true magic of dividend investing lies in reinvestment. Instead of spending the dividend cash, you use it to buy more shares of the same company. Those new shares will then generate their own dividends the following year, which buys even more shares. Over decades, this compounding effect can dramatically snowball your wealth and generate a substantial passive income stream that outpaces inflation.
          </p>
        </article>
    </LearnLayout>
  );
}
