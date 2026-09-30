import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SEO from './SEO';
import HeroBackdrop from './landing/HeroBackdrop';
import LiveMarketCard from './landing/LiveMarketCard';
import ProofStrip from './landing/ProofStrip';
import ScrollStory from './landing/ScrollStory';
import Pricing from './landing/Pricing';
import { Faq, FinalCta, ToolsGrid, Trust } from './landing/Sections';
import './landing/landing.css';

interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  // The scroll story pins itself just below the sticky navbar.
  useEffect(() => {
    const setNavHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) document.documentElement.style.setProperty('--nav-h', `${Math.round(nav.getBoundingClientRect().height)}px`);
    };
    setNavHeight();
    window.addEventListener('resize', setNavHeight);
    return () => window.removeEventListener('resize', setNavHeight);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-lavender-surface">
      <SEO
        title="Stock AI | Research Indian Stocks in Seconds"
        description="Research any NSE-listed company in seconds, built from filings and trusted financial news with sources linked. Plus IPOs, dividends, market wraps and an investment explorer. Free to start."
        canonicalPath="/"
      />

      {/* 1. Hero: always dark, animated backdrop (or video), live market card */}
      <section aria-labelledby="hero-heading" className="dark relative isolate overflow-hidden bg-[#0e0c1b]">
        <HeroBackdrop />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
              AI research for Indian investors
            </p>
            <h1
              id="hero-heading"
              className="mt-6 text-balance text-[2.35rem] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[3.4rem] lg:text-[3.6rem]"
            >
              Research Indian stocks{' '}
              <span className="bg-gradient-to-r from-[#c4b5fd] via-[#a5b4fc] to-[#5eead4] bg-clip-text text-transparent">in seconds</span>, with the
              sources in front of you.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Stock AI reads NSE filings, results and trusted financial news, then gives you a clear, structured view of any listed company, with the
              sources linked. Free to start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-xl bg-gradient-lavender px-6 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-12px_rgba(118,75,162,0.95)] transition hover:opacity-90"
              >
                Start researching free
              </button>
              <Link
                to="/invest"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/10"
              >
                Explore investments
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/55">
              Free plan · No card needed ·{' '}
              <Link to="/beta" className="underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white">
                Join the research beta
              </Link>
            </p>
          </div>
          <div className="w-full max-w-xl lg:max-w-none">
            <LiveMarketCard />
          </div>
        </div>
      </section>

      {/* 2. Live proof: prices, latest wrap, IPOs */}
      <ProofStrip />

      {/* 3. Scroll story (the 3D section) */}
      <ScrollStory />

      {/* 4. Tools */}
      <ToolsGrid />

      {/* 5. Trust */}
      <Trust />

      {/* 6. Pricing */}
      <Pricing onGetStarted={onGetStarted} />

      {/* 7. FAQ and final call to action */}
      <Faq />
      <FinalCta onGetStarted={onGetStarted} />
    </div>
  );
}
