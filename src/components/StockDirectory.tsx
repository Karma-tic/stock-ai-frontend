import { Link } from 'react-router-dom';
import { STOCK_PROFILES } from '../data/stockProfiles';
import SEO from './SEO';

export default function StockDirectory({ user }: { user?: any }) {
  const stocks = Object.values(STOCK_PROFILES).sort((a, b) => 
    a.symbol.localeCompare(b.symbol)
  );

  return (
    <div className="min-h-screen bg-lavender-surface text-lavender-text/80">
      <SEO
        title="Indian Stock Directory | NSE Stock Profiles | Stock AI"
        description="Browse Indian stock profiles with business overviews, fundamental analysis guides, risks, and opportunities for popular NSE stocks."
        canonicalPath="/stocks"
      />
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="text-center mb-12">
          <p className="text-lavender-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Stock Directory
          </p>
          <h1 className="text-4xl font-bold text-lavender-text mb-4">
            Indian Stock Market Profiles
          </h1>
          <p className="text-lavender-text/70 max-w-2xl mx-auto text-lg">
            Browse our comprehensive database of Indian stocks. Read detailed company profiles, understand their business models, and learn how to analyze their fundamentals.
          </p>
        </div>

        <div className="mb-10 bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lavender-text text-xl font-bold mb-1">Screen stocks by valuation, dividend and momentum</h2>
            <p className="text-lavender-text/70 text-sm">
              Use the free screener to narrow your research list before opening a detailed stock profile.
            </p>
          </div>
          <Link to="/stocks/screener" className="bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-3 rounded-2xl text-sm transition text-center">
            Open Screener
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <Link 
              key={stock.symbol} 
              to={`/stock/${stock.symbol}`}
              className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-6 hover:border-lavender-text/20 hover:shadow-lavender hover:bg-lavender-surface transition duration-300 group block"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lavender-text text-xl font-bold">{stock.symbol}</h3>
                  <p className="text-lavender-text/60 text-sm truncate max-w-[200px]">{stock.name}</p>
                </div>
                <span className="text-xs font-semibold bg-blue-500/10 text-lavender-primary px-2 py-1 rounded-full">
                  {stock.marketCapRank}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="text-xs text-lavender-text/70 uppercase tracking-wider font-semibold">Sector</span>
                <p className="text-sm text-lavender-text/80 mt-1">{stock.sector}</p>
              </div>

              <div className="text-lavender-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Profile <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dynamic Fallback Notice */}
        <div className="mt-16 bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-8 text-center">
          <h3 className="text-lavender-text text-xl font-bold mb-3">Looking for another stock?</h3>
          <p className="text-lavender-text/70 mb-6 max-w-xl mx-auto">
            Our AI can analyze over 2,000+ NSE and BSE listed stocks in real-time. Simply log in and use the search bar on your dashboard to instantly generate a BUY/HOLD/SELL signal for any stock.
          </p>
          <Link to={user ? "/" : "/login"} className="inline-block bg-gradient-lavender hover:opacity-90 text-white font-bold py-3 px-8 rounded-2xl transition">
            {user ? 'Search and Analyze Any Stock' : 'Get Free AI Analysis'}
          </Link>
        </div>

      </div>
    </div>
  );
}
