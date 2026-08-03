import { useParams, Link } from 'react-router-dom';
import { STOCK_PROFILES, getGenericProfile } from '../data/stockProfiles';
import { TrendingUp, Info, AlertTriangle, BookOpen } from 'lucide-react';

export default function StockPage() {
  const { symbol } = useParams();
  
  if (!symbol) return null;

  const upperSymbol = symbol.toUpperCase();
  const profile = STOCK_PROFILES[upperSymbol] || getGenericProfile(upperSymbol);

  return (
    <div className="min-h-screen bg-white text-gray-600">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">{profile.symbol}</h1>
                <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-bold">
                  {profile.sector}
                </span>
              </div>
              <p className="text-xl text-gray-500">{profile.name}</p>
            </div>
            
            <div className="flex-shrink-0">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-amber-500/20"
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
        <article className="prose prose-invert max-w-none prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-600">
          
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold m-0 text-gray-900">Company Overview</h2>
            </div>
            <p>{profile.overview}</p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold m-0 text-gray-900">Business Segments & Revenue Model</h2>
            </div>
            <p>{profile.businessSegments}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold m-0 text-gray-900">Fundamental Analysis Guide</h3>
              </div>
              <p className="text-sm">{profile.fundamentalAnalysis}</p>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-bold m-0 text-gray-900">Risks & Opportunities</h3>
              </div>
              <p className="text-sm">{profile.risksAndOpportunities}</p>
            </section>
          </div>

          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Trade {profile.symbol} using AI</h2>
            <p>
              While understanding the fundamental profile of {profile.name} is crucial for long-term investing, short-to-medium term price action is often dictated by market sentiment, quarterly earnings reports, and breaking news. 
            </p>
            <p>
              Stock AI at byteplay.org utilizes advanced Large Language Models (LLMs) to read thousands of news articles, official NSE announcements, and real-time financial data for {profile.symbol}. In just 8 seconds, our AI synthesizes this unstructured data to provide you with a clear, actionable <strong>BUY, HOLD, or SELL signal</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Entry Price:</strong> The exact price range to enter the trade.</li>
              <li><strong>Target Prices:</strong> Short-term (1-3 months) and Long-term (6-12 months) price targets.</li>
              <li><strong>Stop Loss:</strong> A strictly calculated stop-loss to protect your capital from downside risk.</li>
              <li><strong>Confidence Score:</strong> A percentage metric indicating the AI's conviction in the trade.</li>
            </ul>
          </section>

        </article>

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/40 to-gray-50 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-gray-900 text-2xl font-bold mb-3">
            Don't Guess. Let AI Analyze {profile.symbol}.
          </h3>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            Join thousands of smart investors using AI to find the best entry and exit points in the Indian stock market.
          </p>
          <Link to="/login" className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-xl transition hover:bg-slate-200">
            Analyze {profile.symbol} Now
          </Link>
        </div>

      </div>
    </div>
  );
}
