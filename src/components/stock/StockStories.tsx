import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../../lib/api';
import { Button } from '../ui/Button';
import { STORY_PARTS } from './StorySections';

// Phones: a stock's story as six full-screen cards. Swipe, or tap the left or right edge.
// No auto-advance; the reader is in control. Why: a complete picture in about 20 seconds.
export default function StockStories({
  ticker,
  name,
  user,
  cards,
}: {
  ticker: string;
  name: string;
  user: any;
  cards: React.ReactNode[];
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [watched, setWatched] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // Track the card in view (no scroll listeners)
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { root, threshold: 0.6 },
    );
    cardRefs.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
  }, [cards.length]);

  useEffect(() => {
    if (!user) return;
    getWatchlist()
      .then((r) => setWatched((r.data.watchlist || []).some((w: any) => (w.ticker || '').toUpperCase().replace('.NS', '') === ticker)))
      .catch(() => {});
  }, [user, ticker]);

  const go = (i: number) => {
    const n = Math.max(0, Math.min(cards.length - 1, i));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cardRefs.current[n]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
  };

  const onCardClick = (e: React.MouseEvent<HTMLElement>, i: number) => {
    if ((e.target as HTMLElement).closest('a, button, input, select, [role="button"]')) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    if (x < 0.25) go(i - 1);
    else if (x > 0.75) go(i + 1);
  };

  const toggleWatch = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/stock/${ticker}`)}`);
      return;
    }
    setBusy(true);
    try {
      if (watched) await removeFromWatchlist(ticker);
      else await addToWatchlist(ticker, name);
      setWatched(!watched);
    } catch (err) {
      console.error(err);
    }
    setBusy(false);
  };

  const analyzeTo = user ? `/?analyze=${ticker}` : `/login?next=${encodeURIComponent(`/?analyze=${ticker}`)}`;

  return (
    <section
      aria-label={`${ticker} story`}
      aria-roledescription="carousel"
      className={`flex flex-col bg-canvas md:hidden ${user ? 'h-[calc(100dvh-var(--nav-h,64px)-57px-env(safe-area-inset-bottom))]' : 'h-[calc(100dvh-var(--nav-h,64px))]'}`}
    >
      {/* Progress: six segments, tappable */}
      <div className="flex gap-1 px-4 pt-2">
        {STORY_PARTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${p.title}`}
            aria-current={active === i ? 'step' : undefined}
            className="flex h-8 flex-1 items-center"
          >
            <span className={`block h-1 w-full rounded-full transition-colors duration-ui ${i <= active ? 'bg-accent' : 'bg-ink/15'}`} />
          </button>
        ))}
      </div>
      <div className="flex items-baseline justify-between px-4 pb-1 pt-1">
        <p className="num text-sm font-semibold text-ink">{ticker}</p>
        <p className="text-xs text-muted">
          {active + 1} of {cards.length} · {STORY_PARTS[active]?.title}
        </p>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        aria-label="Swipe or use arrow keys to move between cards"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(active + 1);
          if (e.key === 'ArrowLeft') go(active - 1);
        }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-hide focus:outline-none"
      >
        {cards.map((card, i) => (
          <article
            key={STORY_PARTS[i].id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-index={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${cards.length}: ${STORY_PARTS[i].title}`}
            onClick={(e) => onCardClick(e, i)}
            className="w-full shrink-0 snap-start overflow-y-auto px-4 pb-6 pt-3"
          >
            <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">{STORY_PARTS[i].title}</h2>
            <div className="mt-4">{card}</div>
            {/* Fades the last line while there is more below, so the card reads as scrollable */}
            <div className="pointer-events-none sticky bottom-[-24px] -mx-4 -mb-6 h-10 bg-gradient-to-t from-canvas to-transparent" aria-hidden="true" />
          </article>
        ))}
      </div>

      {/* Sticky actions */}
      <div className="flex gap-2 border-t border-line bg-canvas px-4 py-3">
        <Button variant={watched ? 'primary' : 'ghost'} size="lg" className="flex-1" onClick={toggleWatch} disabled={busy} aria-pressed={watched}>
          <Star className={`h-4 w-4 ${watched ? 'fill-current' : ''}`} strokeWidth={1.75} />
          {watched ? 'Watching' : 'Add to watchlist'}
        </Button>
        <Link to={analyzeTo} className="inline-flex h-12 flex-1 items-center justify-center rounded-control bg-cobalt px-4 text-base font-semibold text-white">
          Analyze
        </Link>
      </div>
    </section>
  );
}
