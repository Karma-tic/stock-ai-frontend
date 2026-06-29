import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter1() {
  return (
    <LearnLayout
      chapterNumber={1}
      title="What is the Stock Market?"
      prevChapter={undefined}
      nextChapter={{ path: '/learn/types-of-trading', title: 'Types of Trading in Indian Stock Market' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          1
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">What is the Stock Market?</h2>
      </div>
      
      
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
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
          <h4 className="text-xl font-bold text-white mb-4">Key Institutions</h4>
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

    </LearnLayout>
  );
}
