import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';

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
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Indian Stock Market Blog | Investing Guides | Stock AI"
        description="Read practical guides on PE ratio, NSE announcements, dividend yield, penny stocks, and Indian stock market basics."
        canonicalPath="/blog"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        
        

        <PageHeader eyebrow="Blog" icon={Newspaper} title="Guides for Indian investors" intro="Practical explainers on reading filings, valuation, dividends and the risks of low-priced shares." />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map(a => (
            <Link key={a.title} to={a.link} className="group flex flex-col rounded-card border border-line bg-surface p-5 transition hover:border-accent/40 sm:p-6">
              <h2 className="text-lg font-semibold text-ink group-hover:text-accent">{a.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Read the article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
