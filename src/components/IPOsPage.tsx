import React from 'react';
import { Rocket } from 'lucide-react';
import UpcomingIpos from './UpcomingIpos';
import SEO from './SEO';

export default function IPOsPage() {
  return (
    <div className="min-h-screen bg-lavender-surface pt-24 pb-20 relative overflow-hidden">
      <SEO
        title="Upcoming IPOs India | GMP, Price Band and AI IPO View | Stock AI"
        description="Track upcoming Indian IPOs with GMP, price band, open and close dates, estimated listing price, and educational IPO analysis."
        canonicalPath="/ipos"
      />
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20">
            <Rocket className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-lavender-text mb-6">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">IPOs</span>
          </h1>
          <p className="text-lavender-text/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Stay ahead of the market with our AI-driven analysis of upcoming Initial Public Offerings. 
            We analyze market sentiment, financial health, and subscription data to predict listing performance.
          </p>
        </div>

        <UpcomingIpos />

        <div className="mt-20 p-8 bg-lavender-surface/50 rounded-2xl border border-white/50 text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-lavender-text mb-4">Why track IPOs with us?</h2>
          <p className="text-lavender-text/70 text-sm leading-relaxed">
            Our proprietary AI models process real-time subscription numbers, grey market premiums (GMP), 
            and historical sector performance to deliver high-confidence predictions on listing day gains. 
            Check back daily as predictions are updated in real-time based on live retail and QIB subscription data.
          </p>
        </div>
      </div>
    </div>
  );
}
