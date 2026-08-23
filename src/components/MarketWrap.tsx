import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import SEO from './SEO';

interface MarketWrapItem {
  id: string;
  date: string;
  title: string;
  content_html: string;
  created_at: string;
}

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8377;/g, '₹')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimPoint(value: string) {
  return value.length > 135 ? `${value.slice(0, 132).trim()}...` : value;
}

function getImportantPoints(html: string) {
  const bulletPoints = Array.from(html.matchAll(/<li[^>]*>(.*?)<\/li>/gi))
    .map(match => trimPoint(stripHtml(match[1])))
    .filter(Boolean);

  const fallback = stripHtml(html)
    .split(/(?<=[.!?])\s+/)
    .map(trimPoint)
    .filter(sentence => sentence.length > 35);

  return [...bulletPoints, ...fallback]
    .filter((point, index, list) => list.indexOf(point) === index)
    .slice(0, 3);
}

const MarketWrap: React.FC = () => {
  const [wraps, setWraps] = useState<MarketWrapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const currentWrap = wraps[currentIndex];
  const highlights = useMemo(
    () => currentWrap ? getImportantPoints(currentWrap.content_html) : [],
    [currentWrap]
  );

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
      <SEO
        title="Daily Market Wrap India | Nifty, Sensex and Market News | Stock AI"
        description="Read daily Indian stock market wrap-ups covering Nifty, Sensex, major news, market sentiment, and key events after market close."
        canonicalPath="/market-wrap"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-lavender-text mb-4">
            Daily Market Wrap-Up
          </h1>
          <p className="text-base sm:text-lg text-lavender-text/70 max-w-2xl mx-auto">
            A concise summary of Nifty 50, Sensex, major news, and market sentiment.
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
                className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-lavender-text/10 shadow-sm rounded-full items-center justify-center text-lavender-text/70 hover:text-lavender-text hover:bg-gray-200 transition shadow-lavender z-10"
                aria-label="Newer wrap"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {currentIndex < wraps.length - 1 && (
              <button 
                onClick={goToNext}
                className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-lavender-text/10 shadow-sm rounded-full items-center justify-center text-lavender-text/70 hover:text-lavender-text hover:bg-gray-200 transition shadow-lavender z-10"
                aria-label="Older wrap"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="app-card p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-lavender-text/10 pb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-lavender-text">{currentWrap.title}</h2>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto shrink-0">
                  {new Date(currentWrap.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {highlights.length > 0 && (
                <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-50 to-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                    Key points that matter
                  </div>
                  <div className="grid gap-2">
                    {highlights.map(point => (
                      <div key={point} className="flex gap-2 text-sm leading-relaxed text-lavender-text/80">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-center text-xs text-lavender-text/50">
                A quick overview designed to be read in under one minute.
              </p>
            </div>

            {/* Pagination Dots (Mobile & Desktop) */}
            <div className="flex justify-center gap-2 mt-8">
              {wraps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-lavender-text/20 hover:bg-lavender-text/30'
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
