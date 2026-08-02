import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Learn() {
  const chapters = [
    { num: 1, title: "What is the Stock Market?", slug: "what-is-stock-market", desc: "The basics of NSE, BSE, Nifty, and SEBI.", iconBg: "bg-blue-600" },
    { num: 2, title: "Types of Trading in Indian Stock Market", slug: "types-of-trading", desc: "Intraday, Swing, Positional, and Long-term.", iconBg: "bg-purple-600" },
    { num: 3, title: "Essential Stock Market Terms", slug: "essential-terms", desc: "Bull market, PE Ratio, Stop Loss, DIIs and FIIs.", iconBg: "bg-green-600" },
    { num: 4, title: "Fundamental vs Technical Analysis", slug: "fundamental-vs-technical", desc: "How to actually pick stocks to buy.", iconBg: "bg-orange-600" },
    { num: 5, title: "Stock Market Risks", slug: "market-risks", desc: "Understand what causes you to lose money.", iconBg: "bg-red-600" },
    { num: 6, title: "Role of AI in Stock Markets", slug: "ai-in-markets", desc: "How AI is changing retail investing.", iconBg: "bg-cyan-600" },
    { num: 7, title: "How to Start Investing Step by Step", slug: "how-to-start", desc: "From Demat account to your first trade.", iconBg: "bg-yellow-600" },
    { num: 8, title: "Dividend Investing", slug: "dividend-investing", desc: "Building passive income from stocks.", iconBg: "bg-emerald-600" },
    { num: 9, title: "10 Common Mistakes", slug: "common-mistakes", desc: "Avoid these beginner traps.", iconBg: "bg-rose-600" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Free Learning Hub
          </p>
          <h1 className="text-gray-900 text-4xl md:text-5xl font-black mb-6">
            Complete Guide to Stock Market Investing in India
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about trading on NSE and BSE —
            from basics to AI-powered analysis. Choose a chapter below to start reading.
          </p>
        </div>

        {/* Wiki Grid */}
        <div className="space-y-4">
          {chapters.map((ch) => (
            <Link 
              key={ch.num} 
              to={`/learn/${ch.slug}`}
              className="flex items-center gap-6 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500/30 p-6 rounded-2xl transition group"
            >
              <div className={`w-14 h-14 ${ch.iconBg} rounded-2xl flex items-center justify-center text-gray-900 font-black text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                {ch.num}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                  {ch.title}
                </h3>
                <p className="text-gray-500 text-sm">{ch.desc}</p>
              </div>
              <div className="hidden sm:flex flex-shrink-0 text-gray-400 group-hover:text-gray-900 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>

      </section>
    </div>
  );
}
