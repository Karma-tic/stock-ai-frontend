import { lazy, Suspense } from 'react';
import SEO from './SEO';
import Hero from './landing/Hero';
import ProofStrip from './landing/ProofStrip';
import ToolsBento from './landing/ToolsBento';
import Receipts from './landing/Receipts';
import Pricing from './landing/Pricing';
import { Faq, TryIt } from './landing/Sections';
import './landing/landing.css';

// The scroll chapter carries GSAP and Lenis, so it loads as its own chunk after the hero.
const FilingUnfolds = lazy(() => import('./landing/FilingUnfolds'));

interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  return (
    // The landing page is one theme, top to bottom: Ink (dark).
    <div className="dark min-h-[100dvh] overflow-x-clip bg-canvas text-ink">
      <SEO
        title="Stock AI | Research Indian Stocks, Sources Attached"
        description="Research any NSE-listed company in seconds, built from filings and trusted financial news with every source linked. Plus IPOs, dividends, market wraps and an investment explorer. Free to start."
        canonicalPath="/"
      />

      <Hero onGetStarted={onGetStarted} />
      <ProofStrip />
      <Suspense fallback={<div className="min-h-[900px] bg-canvas" aria-hidden="true" />}>
        <FilingUnfolds />
      </Suspense>
      <ToolsBento />
      <Receipts />
      <Pricing onGetStarted={onGetStarted} />
      <Faq />
      <TryIt onGetStarted={onGetStarted} />
    </div>
  );
}
