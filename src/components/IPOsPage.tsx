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
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-up/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-up/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-up/10 rounded-2xl mb-6 border border-up/20">
            <Rocket className="w-8 h-8 text-up" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-lavender-text mb-6">
            Upcoming <span className="text-accent">IPOs</span>
          </h1>
          <p className="text-lavender-text/70 text-lg max-w-2xl mx-auto leading-relaxed">
            One factual view of live GMP, issue details, key dates and subscription status for current Indian IPOs.
          </p>
        </div>

        <UpcomingIpos />

        <div className="mt-12 app-card p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-lavender-text mb-4">Understand the numbers</h2>
          <p className="text-lavender-text/70 text-sm leading-relaxed">
            GMP is unofficial and can be volatile. We present sourced facts and estimates for research—not a listing prediction or investment recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}
