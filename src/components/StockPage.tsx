import { useParams, Link } from 'react-router-dom';
import { STOCK_PROFILES, getGenericProfile } from '../data/stockProfiles';
import { TrendingUp, Info, AlertTriangle, BookOpen } from 'lucide-react';
import SEO from './SEO';
import StockStory from './StockStory';

export default function StockPage({ user }: { user?: any }) {
  const { symbol } = useParams();
  
  if (!symbol) return null;

  const upperSymbol = symbol.toUpperCase();
  const profile = STOCK_PROFILES[upperSymbol] || getGenericProfile(upperSymbol);

  return (
    <div className="min-h-screen bg-lavender-surface text-lavender-text/80">
      <SEO
        title={`${profile.symbol} Share Analysis | ${profile.name} Stock Profile | Stock AI`}
        description={`Read ${profile.name} (${profile.symbol}) business overview, fundamental analysis guide, risks, opportunities, and AI stock analysis context.`}
        canonicalPath={`/stock/${profile.symbol}`}
      />
      
      {/* Hero Section */}
      <div className="bg-lavender-base border-b border-lavender-text/10 pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-lavender-text">{profile.symbol}</h1>
                <span className="bg-blue-500/10 text-lavender-primary border border-blue-500/20 px-3 py-1 rounded-full text-sm font-bold">
                  {profile.sector}
                </span>
              </div>
              <p className="text-xl text-lavender-text/70">{profile.name}</p>
            </div>
            
            <div className="flex-shrink-0">
              <Link 
                to={user ? `/?analyze=${profile.symbol}` : "/login"}
                className="inline-flex items-center gap-2 bg-gradient-lavender hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition shadow-lavender shadow-amber-500/20"
              >
                <TrendingUp className="w-5 h-5" />
                Get Live AI Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - SEO Goldmine */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <StockStory ticker={profile.symbol} />
        <article className="prose prose-invert max-w-none prose-headings:text-lavender-text prose-p:leading-relaxed prose-p:text-lavender-text/80">
          
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-6 h-6 text-lavender-primary" />
              <h2 className="text-2xl font-bold m-0 text-lavender-text">Company Overview</h2>
            </div>
            <p>{profile.overview}</p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold m-0 text-lavender-text">Business Segments & Revenue Model</h2>
            </div>
            <p>{profile.businessSegments}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <section className="app-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold m-0 text-lavender-text">Fundamental Analysis Guide</h3>
              </div>
              <p className="text-sm">{profile.fundamentalAnalysis}</p>
            </section>

            <section className="app-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-bold m-0 text-lavender-text">Risks & Opportunities</h3>
              </div>
              <p className="text-sm">{profile.risksAndOpportunities}</p>
            </section>
          </div>

          <section className="border-t border-lavender-text/10 pt-12">
            <h2 className="text-2xl font-bold mb-4 text-lavender-text">How to research {profile.symbol} with Stock AI</h2>
            <p>
              Business quality and price do not always move together. Use the Stock Story above to compare official filings, results, risks and recent price context before forming your own view.
            </p>
            <p>
              Stock AI collects source-linked company events and market information for {profile.symbol}, then makes the important facts easier to review. It does not provide a personal recommendation, price target or guarantee of outcome.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Original sources:</strong> Open relevant exchange filings and credible reports.</li>
              <li><strong>Evidence on both sides:</strong> Separate supporting facts, risks and unresolved developments.</li>
              <li><strong>Quarterly comparison:</strong> Track changes in revenue, profit and operating performance.</li>
              <li><strong>What to watch next:</strong> Keep an eye on the disclosures that could support or challenge your view.</li>
            </ul>
          </section>

        </article>

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl p-8 text-center shadow-sm">
          <h3 className="text-lavender-text text-2xl font-bold mb-3">
            Build your own evidence-based view of {profile.symbol}.
          </h3>
          <p className="text-lavender-text/70 mb-6 max-w-xl mx-auto">
            Review source-linked company updates, results and risks in one place.
          </p>
          <Link to={user ? `/?analyze=${profile.symbol}` : "/login"} className="inline-block bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition hover:bg-blue-800">
            View {profile.symbol} research
          </Link>
        </div>

      </div>
    </div>
  );
}
