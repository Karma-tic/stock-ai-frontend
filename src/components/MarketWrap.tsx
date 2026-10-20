import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';

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

  const dayLabel = (iso: string, long = false) =>
    new Date(iso).toLocaleDateString('en-IN', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { weekday: 'short', day: 'numeric', month: 'short' });
  const fullText = currentWrap ? stripHtml(currentWrap.content_html) : '';

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Daily Market Wrap India | Nifty, Sensex and Market News | Stock AI"
        description="Read daily Indian stock market wrap-ups covering Nifty, Sensex, major news, market sentiment, and key events after market close."
        canonicalPath="/market-wrap"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Market wrap"
          icon={Newspaper}
          title="The day in the market, in one minute"
          intro="Nifty 50, Sensex and the news that moved them. Published every weekday at 4:15 pm IST."
        />

        {loading ? (
          <div aria-hidden="true">
            <span className="skeleton block h-11 w-80 max-w-full" />
            <span className="skeleton mt-4 block h-64" />
          </div>
        ) : wraps.length === 0 ? (
          <p className="rounded-card border border-dashed border-line p-10 text-center text-sm text-muted">No wrap yet. The first one appears after the market closes at 3:30 pm IST.</p>
        ) : (
          <>
            {/* Day picker: newest first */}
            <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Choose a day">
              {wraps.map((w, idx) => (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={currentIndex === idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`min-h-[40px] shrink-0 rounded-full border px-3.5 text-sm font-medium transition ${
                    currentIndex === idx ? 'border-cobalt bg-cobalt text-white' : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {idx === 0 ? 'Latest' : dayLabel(w.date)}
                </button>
              ))}
            </div>

            <article className="mt-4 rounded-card border border-line bg-surface p-5 sm:p-7" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <p className="text-xs text-muted">{dayLabel(currentWrap.date, true)}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.015em] text-ink sm:text-2xl">{currentWrap.title}</h2>

              {highlights.length > 0 && (
                <>
                  <h3 className="mt-6 text-xs font-medium text-muted">What mattered</h3>
                  <ol className="mt-2 space-y-3">
                    {highlights.map((point, i) => (
                      <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
                        <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">{i + 1}</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {fullText && (
                <details className="group mt-6 border-t border-line pt-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-accent hover:underline">
                    <span className="group-open:hidden">Read the full wrap</span>
                    <span className="hidden group-open:inline">Hide the full wrap</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{fullText}</p>
                </details>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentIndex >= wraps.length - 1}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-control px-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Older
                </button>
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-control px-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-40"
                >
                  Newer <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </article>
            <p className="mt-4 text-xs text-muted">AI-written summary of the day's market data and headlines. Not investment advice.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketWrap;
