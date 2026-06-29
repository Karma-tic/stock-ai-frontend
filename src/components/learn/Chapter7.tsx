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
        <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          7
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">How to Start Investing Step by Step</h2>
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
              <div key={item.step} className="flex flex-col sm:flex-row gap-6 bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 hover:border-yellow-500/30 transition">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center text-yellow-400 font-black text-xl">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-3">{item.step}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

    </LearnLayout>
  );
}
