import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const articles = [
    {
      title: "What is PE Ratio and Why It Matters",
      desc: "Price to Earnings ratio compares a company's stock price to its earnings per share. A lower PE suggests the stock may be undervalued. For Indian markets, average PE is around 20-25 for large caps.",
      link: "/blog/what-is-pe-ratio"
    },
    {
      title: "How to Read NSE Stock Announcements",
      desc: "NSE publishes corporate announcements including quarterly results, board meetings, dividends and major business updates. These directly impact stock prices and are crucial for investors.",
      link: "/blog/how-to-read-nse-announcements"
    },
    {
      title: "Understanding Dividend Yield in Indian Stocks",
      desc: "Dividend yield shows annual dividend as percentage of stock price. ITC, Coal India and PSU stocks typically offer high dividend yields, making them attractive for income investors.",
      link: "/blog/dividend-yield-india"
    },
    {
      title: "What are Penny Stocks in NSE/BSE?",
      desc: "Penny stocks are shares trading below ₹100. While they offer high return potential, they also carry significant risks including low liquidity and high volatility. Always invest cautiously.",
      link: "/blog/penny-stocks-india"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* New Back Button */}
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-sm font-semibold mb-8 transition">
          ← Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Stock Market <span className="text-blue-400">Insights</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Learn about investing in the Indian stock market with our comprehensive guides and articles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map(a => (
            <div key={a.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition">
              <h3 className="text-white font-bold text-xl mb-4">{a.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{a.desc}</p>
              <Link to={a.link} className="text-blue-400 hover:text-blue-300 font-semibold transition flex items-center gap-2">
                Read full article →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
