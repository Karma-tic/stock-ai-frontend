import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SEO from './SEO';

export default function Learn() {
  const chapters = [
    { num: 1, title: "What is the Stock Market?", slug: "what-is-stock-market", desc: "The basics of NSE, BSE, Nifty, and SEBI.", iconBg: "bg-gradient-lavender" },
    { num: 2, title: "Types of Trading in Indian Stock Market", slug: "types-of-trading", desc: "Intraday, Swing, Positional, and Long-term.", iconBg: "bg-cobalt" },
    { num: 3, title: "Essential Stock Market Terms", slug: "essential-terms", desc: "Bull market, PE Ratio, Stop Loss, DIIs and FIIs.", iconBg: "bg-up/15" },
    { num: 4, title: "Fundamental vs Technical Analysis", slug: "fundamental-vs-technical", desc: "How to actually pick stocks to buy.", iconBg: "bg-caution/15" },
    { num: 5, title: "Stock Market Risks", slug: "market-risks", desc: "Understand what causes you to lose money.", iconBg: "bg-down/15" },
    { num: 6, title: "Role of AI in Stock Markets", slug: "ai-in-markets", desc: "How AI is changing retail investing.", iconBg: "bg-cobalt" },
    { num: 7, title: "How to Start Investing Step by Step", slug: "how-to-start", desc: "From Demat account to your first trade.", iconBg: "bg-caution/15" },
    { num: 8, title: "Dividend Investing", slug: "dividend-investing", desc: "Building passive income from stocks.", iconBg: "bg-up/15" },
    { num: 9, title: "10 Common Mistakes", slug: "common-mistakes", desc: "Avoid these beginner traps.", iconBg: "bg-down/15" }
  ];

  return (
    <div className="bg-lavender-surface min-h-screen">
      <SEO
        title="Learn Stock Market Investing in India | Free Beginner Guide | Stock AI"
        description="Learn Indian stock market basics, trading types, PE ratio, risks, AI analysis, dividend investing, and beginner mistakes."
        canonicalPath="/learn"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-lavender-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Free Learning Hub
          </p>
          <h1 className="text-lavender-text text-4xl md:text-5xl font-black mb-6">
            Complete Guide to Stock Market Investing in India
          </h1>
          <p className="text-lavender-text/70 text-lg max-w-2xl mx-auto">
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
              className="app-card flex items-center gap-6 p-6 hover:border-lavender-primary/25 hover:shadow-lavender transition group"
            >
              <div className={`w-14 h-14 ${ch.iconBg} rounded-2xl flex items-center justify-center text-lavender-text font-black text-xl flex-shrink-0 shadow-lavender group-hover:scale-110 transition-transform`}>
                {ch.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lavender-text text-xl font-bold mb-1 group-hover:text-lavender-primary transition-colors">
                  {ch.title}
                </h3>
                <p className="text-lavender-text/70 text-sm">{ch.desc}</p>
              </div>
              <div className="hidden sm:flex flex-shrink-0 text-lavender-text/60 group-hover:text-lavender-text transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>

      </section>
    </div>
  );
}
