import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';

export const CHAPTERS = [
  { num: 1, title: 'What is the stock market?', slug: 'what-is-stock-market', desc: 'NSE, BSE, Nifty, Sensex and SEBI, explained simply.' },
  { num: 2, title: 'Types of trading in India', slug: 'types-of-trading', desc: 'Intraday, swing, positional and long-term investing.' },
  { num: 3, title: 'Essential market terms', slug: 'essential-terms', desc: 'Bull and bear markets, P/E ratio, stop loss, FIIs and DIIs.' },
  { num: 4, title: 'Fundamental vs technical analysis', slug: 'fundamental-vs-technical', desc: 'Two ways to study a stock before you buy.' },
  { num: 5, title: 'Stock market risks', slug: 'market-risks', desc: 'What actually causes people to lose money.' },
  { num: 6, title: 'The role of AI in markets', slug: 'ai-in-markets', desc: 'What AI can and cannot do for a retail investor.' },
  { num: 7, title: 'How to start investing', slug: 'how-to-start', desc: 'From opening a demat account to your first order.' },
  { num: 8, title: 'Dividend investing', slug: 'dividend-investing', desc: 'Building income from companies that pay out profits.' },
  { num: 9, title: '10 common mistakes', slug: 'common-mistakes', desc: 'Beginner traps and how to avoid them.' },
];

export default function Learn() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Learn Stock Market Investing in India | Free Beginner Guide | Stock AI"
        description="Learn Indian stock market basics, trading types, PE ratio, risks, AI analysis, dividend investing, and beginner mistakes."
        canonicalPath="/learn"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Learn"
          icon={GraduationCap}
          title="A plain-English guide to investing in India"
          intro="Nine short chapters, from what the stock market is to the mistakes beginners make. Free, and in order, so each one builds on the last."
        />
        <ol className="overflow-hidden rounded-card border border-line bg-surface">
          {CHAPTERS.map((ch) => (
            <li key={ch.num} className="border-b border-line last:border-0">
              <Link to={`/learn/${ch.slug}`} className="group flex items-center gap-4 px-4 py-4 transition hover:bg-ink/[0.03] sm:px-5">
                <span className="num grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">{ch.num}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink group-hover:text-accent">{ch.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{ch.desc}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
