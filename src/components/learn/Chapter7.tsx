import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter7() {
  return (
    <LearnLayout
      chapterNumber={7}
      title="How to Start Investing Step by Step"
      prevChapter={{ path: '/learn/ai-in-markets', title: 'Role of AI in Stock Markets' }}
      nextChapter={{ path: '/learn/dividend-investing', title: 'Dividend Investing' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center text-gray-900 font-black text-xl shadow-lg flex-shrink-0">
          7
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">How to Start Investing Step by Step</h2>
      </div>
      
      
          <div className="space-y-6">
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
              <div key={item.step} className="flex flex-col sm:flex-row gap-6 bg-gray-50 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-yellow-500/30 transition">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center text-yellow-400 font-black text-xl">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-gray-900 text-xl font-bold mb-3">{item.step}</h4>
                  <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 pt-8 border-t border-gray-200 prose-headings:text-gray-900 prose-a:text-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your First Steps: Demat, KYC, and Choosing a Broker</h2>
          <p className="mb-4 leading-relaxed">
            Starting your investment journey in the Indian stock market is easier now than ever before. The digitization of the financial sector has streamlined the process, allowing anyone with a smartphone and a bank account to start investing within a few hours.
          </p>
          <h3 className="text-xl font-bold mb-3 text-gray-900">The Demat and Trading Account</h3>
          <p className="mb-4 leading-relaxed">
            Before you can buy your first share, you need to open two linked accounts:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Trading Account:</strong> Provided by a stockbroker, this account acts as your interface with the stock exchange (NSE/BSE). You use it to place buy and sell orders.</li>
            <li><strong>Demat Account:</strong> Short for Dematerialized account, this acts as a digital locker. When you buy shares via your trading account, they are electronically credited to and stored safely in your Demat account, which is maintained by depositories like NSDL or CDSL.</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-gray-900">The KYC Process</h3>
          <p className="mb-4 leading-relaxed">
            Know Your Customer (KYC) is a mandatory verification process mandated by SEBI. It prevents fraud, money laundering, and illegal activities. To complete your KYC online, you will need:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li>Your PAN Card (mandatory for investing in India).</li>
            <li>An Aadhaar Card linked to your mobile number (for eSign).</li>
            <li>A canceled cheque or bank statement to link your bank account.</li>
            <li>A live photo or a short video verification via your webcam or phone.</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Discount Brokers vs. Full-Service Brokers</h3>
          <p className="mb-4 leading-relaxed">
            Choosing the right broker is critical for your profitability, as high brokerage fees can severely eat into your returns.
          </p>
          <p className="mb-4 leading-relaxed">
            <strong>Full-Service Brokers</strong> (like ICICI Direct, HDFC Securities) offer a wide range of services including research reports, advisory services, and relationship managers. However, they charge a higher brokerage fee, often a percentage of the trade value.
          </p>
          <p className="mb-4 leading-relaxed">
            <strong>Discount Brokers</strong> (like Zerodha, Upstox, Groww) revolutionized the industry by offering a flat-fee model (e.g., ₹20 per trade) or even zero brokerage on equity delivery. They do not provide personalized advice but offer robust, fast trading platforms. For modern, tech-savvy retail investors, discount brokers are almost always the preferred choice due to their cost efficiency and ease of use.
          </p>
        </article>
    </LearnLayout>
  );
}
