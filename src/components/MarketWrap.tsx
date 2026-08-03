import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MarketWrapItem {
  id: string;
  date: string;
  title: string;
  content_html: string;
  created_at: string;
}

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MarketWrap: React.FC = () => {
  const [wraps, setWraps] = useState<MarketWrapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < wraps.length - 1) {
      setCurrentIndex(prev => prev + 1); // Swipe left = go to older wraps
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1); // Swipe right = go to newer wraps
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const goToNext = () => {
    if (currentIndex < wraps.length - 1) setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    const fetchWraps = async () => {
      try {
        const response = await fetch(`${BASE}/api/market-wraps`);
        const data = await response.json();
        // Limit to current day + previous 3 days (max 4 wraps)
        setWraps(data.wraps ? data.wraps.slice(0, 4) : []);
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
      <div className="flex justify-center items-center h-screen bg-lavender-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-lavender-text mb-4">
            Daily Market Wrap-Up
          </h1>
          <p className="text-lg text-lavender-text/70">
            A 500-word summary of the Nifty 50 and Sensex performance, major news, and market sentiment.
            Updated every weekday at 4:15 PM IST.
          </p>
        </div>

        {wraps.length === 0 ? (
          <div className="text-center text-lavender-text/60 py-12">
            No market wrap-ups available yet. Check back after market close!
          </div>
        ) : (
          <div 
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Desktop Navigation Arrows */}
            {currentIndex > 0 && (
              <button 
                onClick={goToPrev}
                className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-lavender-surface border border-white/50 rounded-full items-center justify-center text-lavender-text/70 hover:text-lavender-text hover:bg-gray-200 transition shadow-lavender z-10"
                aria-label="Newer wrap"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {currentIndex < wraps.length - 1 && (
              <button 
                onClick={goToNext}
                className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-lavender-surface border border-white/50 rounded-full items-center justify-center text-lavender-text/70 hover:text-lavender-text hover:bg-gray-200 transition shadow-lavender z-10"
                aria-label="Older wrap"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="bg-lavender-surface rounded-2xl p-6 sm:p-8 shadow-lavender border border-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-white/50 pb-4 gap-4">
                <h2 className="text-2xl font-bold text-lavender-text">{wraps[currentIndex].title}</h2>
                <span className="bg-blue-500/20 text-lavender-primary px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto shrink-0">
                  {new Date(wraps[currentIndex].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <div 
                className="prose prose-invert prose-blue max-w-none 
                           prose-h3:text-lavender-primary prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                           prose-p:text-lavender-text/80 prose-p:leading-relaxed
                           prose-ul:text-lavender-text/80 prose-li:my-1
                           prose-strong:text-lavender-text whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: wraps[currentIndex].content_html }} 
              />
            </div>

            {/* Pagination Dots (Mobile & Desktop) */}
            <div className="flex justify-center gap-2 mt-8">
              {wraps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-lavender-surface hover:bg-slate-500'
                  }`}
                  aria-label={`Go to wrap ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-center mt-2 text-lavender-text/60 text-xs">
              Swipe left for older wraps
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketWrap;
