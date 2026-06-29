import React from 'react';
import LearnLayout from './LearnLayout';

export default function Chapter6() {
  return (
    <LearnLayout
      chapterNumber={6}
      title="Role of AI in Stock Markets"
      prevChapter={{ path: '/learn/market-risks', title: 'Stock Market Risks' }}
      nextChapter={{ path: '/learn/how-to-start', title: 'How to Start Investing Step by Step' }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
          6
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Role of AI in Stock Markets</h2>
      </div>
      
      
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 mb-8">
            <p className="text-slate-300 leading-relaxed text-lg mb-4">
              Artificial Intelligence is transforming how financial markets are analyzed. Hedge funds and institutional investors have used AI for over a decade. Now, platforms like <strong className="text-white">Stock AI (byteplay.org)</strong> are making these capabilities available to retail investors in India at no cost.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg mb-4">
              Modern AI models — particularly Large Language Models (LLMs) like the ones powering Stock AI — can read and understand unstructured text data like news articles, company announcements and earnings reports. They can process thousands of data points simultaneously and identify patterns that human analysts might miss.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg">
              However, AI is not infallible. Markets are influenced by human psychology, unexpected events and irrational behavior that no model can perfectly predict. AI analysis should be used as one input among many, not as the sole basis for investment decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "What AI Does Well",
                color: "border-green-500/40 bg-green-900/10",
                items: [
                  "Processing large volumes of news simultaneously",
                  "Identifying patterns in price and volume data",
                  "Removing emotional bias from analysis",
                  "Generating structured, consistent outputs",
                  "Running analysis on hundreds of stocks in minutes",
                  "Combining multiple data sources into one signal",
                ],
                icon: "✓",
                itemColor: "text-green-400",
              },
              {
                title: "What AI Cannot Do",
                color: "border-red-500/40 bg-red-900/10",
                items: [
                  "Predict black swan events (wars, pandemics)",
                  "Guarantee future stock price movements",
                  "Replace thorough fundamental research",
                  "Account for insider information",
                  "Understand complex political situations perfectly",
                  "Provide SEBI-registered investment advice",
                ],
                icon: "✗",
                itemColor: "text-red-400",
              },
            ].map(item => (
              <div key={item.title} className={`border rounded-2xl p-6 ${item.color}`}>
                <h4 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                  <span className={`${item.itemColor} bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center border border-slate-700`}>{item.icon}</span>
                  {item.title}
                </h4>
                <div className="space-y-4">
                  {item.items.map(i => (
                    <div key={i} className="flex gap-3">
                      <span className={`${item.itemColor} text-sm mt-0.5`}>●</span>
                      <p className="text-slate-300">{i}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h4 className="text-cyan-400 text-xl font-bold mb-4">How Stock AI Uses LLM Technology</h4>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
              Stock AI uses advanced models (like Llama 3.3) to analyze each stock. For every request, the AI receives: live price data from NSE, PE ratio, 52-week position, volume data, and the latest news from 4 sources. It generates a structured output with a BUY/HOLD/SELL signal, confidence score, and specific targets in just 8 seconds.
            </p>
          </div>

    </LearnLayout>
  );
}
