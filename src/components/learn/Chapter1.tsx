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
        <div className="num grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-base font-semibold text-accent">
          1
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl text-balance">What is the Stock Market?</h1>
      </div>
      
      
          <div className="rounded-card border border-line bg-surface p-6 mb-8">
            <p className="text-ink/85 leading-relaxed mb-4">
              The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. In India, the two primary stock exchanges are the <strong className="text-ink">National Stock Exchange (NSE)</strong> and the <strong className="text-ink">Bombay Stock Exchange (BSE)</strong>. When you buy a share, you become a part-owner of that company and participate in its profits and growth.
            </p>
            <p className="text-ink/85 leading-relaxed mb-4">
              The NSE's benchmark index is <strong className="text-ink">Nifty 50</strong> — representing the 50 largest companies by market capitalisation. The BSE equivalent is <strong className="text-ink">Sensex</strong> — tracking 30 companies. When people say "the market is up today" they typically mean these indices have risen.
            </p>
            <p className="text-ink/85 leading-relaxed">
              India's market capitalisation crossed ₹400 lakh crore in 2024, making it one of the top 5 largest stock markets in the world. Over 9 crore Indians are now registered investors on NSE — a number growing rapidly as digital platforms make investing more accessible.
            </p>
          </div>
          <h4 className="text-xl font-bold text-ink mb-4">Key Institutions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { term: "NSE", def: "National Stock Exchange — India's largest exchange by trading volume. Home to Nifty 50 index and over 2,000 listed companies." },
              { term: "BSE", def: "Bombay Stock Exchange — Asia's oldest exchange, established 1875. Home to Sensex index and over 5,000 listed companies." },
              { term: "SEBI", def: "Securities and Exchange Board of India — the regulatory authority that governs all market participants and protects investor interests." },
            ].map(item => (
              <div key={item.term} className="rounded-card border border-line bg-surface p-4">
                <p className="text-accent font-bold mb-2">{item.term}</p>
                <p className="text-muted text-sm leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>

    
        {/* SEO Text Content for AdSense */}
        <article className="calc-article mt-14 border-t border-line pt-8">
          <h2 className="text-2xl font-bold mb-4 text-ink">The History and Evolution of the Indian Stock Market</h2>
          <p className="mb-4 leading-relaxed">
            The Indian stock market has a rich history that dates back to the 18th century when trading was conducted under banyan trees in Mumbai. The formalization of this unstructured trading led to the establishment of the Native Share and Stock Brokers' Association in 1875, which later became the Bombay Stock Exchange (BSE). The BSE is the oldest stock exchange in Asia.
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">The Rise of the National Stock Exchange (NSE)</h3>
          <p className="mb-4 leading-relaxed">
            While the BSE laid the foundation, the National Stock Exchange (NSE) revolutionized trading in India. Established in 1992, the NSE was the first exchange in India to introduce a fully automated, screen-based electronic trading system. This completely eliminated the traditional open outcry system, bringing unprecedented transparency and speed to the markets. Today, the NSE handles a significantly larger trading volume than the BSE, particularly in the derivatives (Futures & Options) segment.
          </p>
          <h3 className="text-xl font-bold mb-3 text-ink">Understanding Market Capitalization (Market Cap)</h3>
          <p className="mb-4 leading-relaxed">
            Market capitalization is a crucial concept for any investor. It represents the total market value of a company's outstanding shares of stock. It is calculated by multiplying the current market price of one share by the total number of outstanding shares.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Large-Cap Companies:</strong> These are typically the top 100 companies by market capitalization. Examples include Reliance Industries, TCS, and HDFC Bank. They are generally considered more stable and less volatile.</li>
            <li><strong>Mid-Cap Companies:</strong> These companies rank from 101 to 250 in terms of market capitalization. They offer higher growth potential but come with increased risk and volatility compared to large caps.</li>
            <li><strong>Small-Cap Companies:</strong> Ranked 251 and onwards, these are smaller companies that can offer explosive growth but are highly susceptible to market downturns and liquidity issues.</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-ink">The Role of Demat and Trading Accounts</h3>
          <p className="mb-4 leading-relaxed">
            To participate in the Indian stock market, you need two accounts: a Demat (Dematerialized) account and a Trading account. A Trading account is used to place buy and sell orders, while the Demat account acts as a digital vault where your purchased shares are held in electronic format. The introduction of Demat accounts by depositories like NSDL and CDSL has made the transfer of shares instantaneous and virtually eliminated the risk of theft, forgery, and damage associated with physical share certificates.
          </p>
        </article>
    </LearnLayout>
  );
}
