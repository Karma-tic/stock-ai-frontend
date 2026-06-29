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
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          3
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Essential Stock Market Terms</h2>
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
              { term: "Stop Loss", def: "A predetermined price at which you exit a trade to limit losses. Essential risk management tool. Stock AI calculates stop loss for every recommendation." },
              { term: "FII/FPI", def: "Foreign Institutional Investors. Their buying or selling significantly impacts Indian markets. Heavy FII selling often causes market corrections." },
              { term: "DII", def: "Domestic Institutional Investors — mutual funds, insurance companies, pension funds. They often buy during FII selling, providing market support." },
              { term: "Circuit Breaker", def: "Automatic trading halt when a stock moves beyond a limit (typically ±5%, ±10%, ±20%). Prevents panic buying or selling." },
              { term: "Demat Account", def: "Dematerialised account that holds your shares electronically. Required to trade on NSE/BSE. Provided by brokers like Zerodha, Groww, Upstox." },
            ].map(item => (
              <div key={item.term} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-green-500/30 transition">
                <p className="text-green-400 font-bold text-lg mb-2">{item.term}</p>
                <p className="text-slate-300 leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>

    </LearnLayout>
  );
}
