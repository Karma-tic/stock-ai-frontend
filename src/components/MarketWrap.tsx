import React, { useEffect, useState } from 'react';

interface MarketWrapItem {
  id: string;
  date: string;
  title: string;
  content_html: string;
  created_at: string;
}

const MarketWrap: React.FC = () => {
  const [wraps, setWraps] = useState<MarketWrapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWraps = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/market-wraps'); // Use localhost for testing, will need env var for prod
        const data = await response.json();
        setWraps(data.wraps || []);
      } catch (error) {
        console.error("Error fetching market wraps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWraps();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Daily Market Wrap-Up
          </h1>
          <p className="text-lg text-slate-400">
            A 500-word summary of the Nifty 50 and Sensex performance, major news, and market sentiment.
            Updated every weekday at 4:15 PM IST.
          </p>
        </div>

        {wraps.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No market wrap-ups available yet. Check back after market close!
          </div>
        ) : (
          <div className="space-y-12">
            {wraps.map((wrap) => (
              <div key={wrap.id} className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                  <h2 className="text-2xl font-bold text-white">{wrap.title}</h2>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                    {new Date(wrap.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div 
                  className="prose prose-invert prose-blue max-w-none 
                             prose-h3:text-blue-400 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                             prose-p:text-slate-300 prose-p:leading-relaxed
                             prose-ul:text-slate-300 prose-li:my-1
                             prose-strong:text-white whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: wrap.content_html }} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketWrap;
