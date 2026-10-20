import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { STOCK_PROFILES, getGenericProfile } from '../data/stockProfiles';
import SEO from './SEO';
import { ButtonLink } from './ui/Button';
import Price, { Change } from './ui/Price';
import StockStories from './stock/StockStories';
import { useStockData } from './stock/storyData';
import { KeyNumbers, PriceToday, STORY_PARTS, Sources, SupportConcern, WatchFor, WhatHappened } from './stock/StorySections';

const ABOUT = [
  { id: 'overview', title: 'Company overview' },
  { id: 'segments', title: 'Business segments' },
  { id: 'fundamentals', title: 'Reading the fundamentals' },
  { id: 'risks', title: 'Risks and opportunities' },
];

export default function StockPage({ user }: { user?: any }) {
  const { symbol = '' } = useParams();
  const upper = symbol.toUpperCase();
  const profile = STOCK_PROFILES[upper] || getGenericProfile(upper);
  const { quote, story, status } = useStockData(profile.symbol);
  const storyLoading = status.story === 'loading';
  const name = quote?.company_name || story?.company_name || profile.name;
  const sector = quote?.sector && quote.sector !== 'N/A' ? quote.sector : profile.sector !== 'Public Equities' ? profile.sector : '';

  const heroRef = useRef<HTMLDivElement | null>(null);
  const [showMini, setShowMini] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(STORY_PARTS[0].id);

  // Sticky mini header once the page header scrolls away (IntersectionObserver, no scroll listener)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowMini(!e.isIntersecting), { rootMargin: '-120px 0px 0px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Section index highlights the section being read
  useEffect(() => {
    const ids = [...STORY_PARTS.map((p) => p.id), ...ABOUT.map((a) => a.id)];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [profile.symbol]);

  const analyzeTo = user ? `/?analyze=${profile.symbol}` : `/login?next=${encodeURIComponent(`/?analyze=${profile.symbol}`)}`;
  const price = quote?.current_price ?? story?.price_context?.current_price;
  const change = quote?.price_change_pct ?? story?.price_context?.day_change_pct;

  const cards = [
    <PriceToday key="p" quote={quote} story={story} />,
    <WhatHappened key="h" story={story} loading={storyLoading} />,
    <KeyNumbers key="n" quote={quote} story={story} />,
    <SupportConcern key="e" story={story} loading={storyLoading} />,
    <WatchFor key="w" story={story} loading={storyLoading} />,
    <Sources key="s" story={story} loading={storyLoading} />,
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name,
    tickerSymbol: `NSE: ${profile.symbol}`,
    url: `https://byteplay.org/stock/${profile.symbol}`,
    ...(sector ? { industry: sector } : {}),
  };

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title={`${profile.symbol} Share Analysis | ${profile.name} Stock Profile | Stock AI`}
        description={`Read ${profile.name} (${profile.symbol}) business overview, fundamental analysis guide, risks, opportunities, and AI stock analysis context.`}
        canonicalPath={`/stock/${profile.symbol}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Phones: Stock Stories */}
      <StockStories ticker={profile.symbol} name={name} user={user} cards={cards} />

      {/* Larger screens: the same story as a page */}
      <div className="hidden md:block">
        {/* Sticky mini header */}
        <div
          aria-hidden={!showMini}
          className={`fixed inset-x-0 top-[var(--nav-h,64px)] z-40 border-b border-line bg-canvas/90 backdrop-blur-[16px] transition duration-ui ${
            showMini ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
            <span className="num text-sm font-semibold text-ink">{profile.symbol}</span>
            {price != null && <Price value={price} className="text-sm font-medium text-ink" />}
            {change != null && <Change value={change} className="text-xs" />}
            <ButtonLink to={analyzeTo} size="sm" className="ml-auto" tabIndex={showMini ? 0 : -1}>
              Analyze
            </ButtonLink>
          </div>
        </div>

        <header ref={heroRef} className="border-b border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 pb-10 pt-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="num text-4xl font-semibold tracking-[-0.02em] text-ink lg:text-5xl">{profile.symbol}</h1>
                {sector && <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">{sector}</span>}
              </div>
              <p className="mt-2 text-lg text-muted">{name}</p>
              {price != null && (
                <p className="mt-4 flex flex-wrap items-baseline gap-3">
                  <Price value={price} className="text-2xl font-semibold text-ink" />
                  {change != null && <Change value={change} className="text-sm font-medium" />}
                </p>
              )}
            </div>
            <ButtonLink to={analyzeTo} size="lg">
              Analyze {profile.symbol}
            </ButtonLink>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Section index */}
          <nav aria-label="On this page" className="hidden lg:block">
            <ul className="sticky top-[calc(var(--nav-h,64px)+80px)] space-y-1 border-l border-line">
              {[...STORY_PARTS, ...ABOUT].map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={activeSection === s.id ? 'location' : undefined}
                    className={`-ml-px flex min-h-[36px] items-center border-l-2 pl-4 text-sm transition ${
                      activeSection === s.id ? 'border-accent font-medium text-ink' : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-6">
            {STORY_PARTS.map((part, i) => (
              <section key={part.id} id={part.id} className="scroll-mt-[calc(var(--nav-h,64px)+72px)] rounded-card border border-line bg-surface p-6">
                <h2 className="text-lg font-semibold text-ink">{part.title}</h2>
                <div className="mt-4">{cards[i]}</div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* About the company: on every screen size (keeps the page's search content) */}
      <article className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <div className="hidden lg:block" />
        <div className="space-y-10 border-t border-line pt-10 text-[15px] leading-relaxed text-ink/85">
          <section id="overview" className="scroll-mt-[calc(var(--nav-h,64px)+72px)]">
            <h2 className="text-xl font-semibold text-ink">About {name}</h2>
            <p className="mt-3 max-w-[65ch]">{profile.overview}</p>
          </section>
          <section id="segments" className="scroll-mt-[calc(var(--nav-h,64px)+72px)]">
            <h2 className="text-xl font-semibold text-ink">Business segments and revenue model</h2>
            <p className="mt-3 max-w-[65ch]">{profile.businessSegments}</p>
          </section>
          <div className="grid gap-6 md:grid-cols-2">
            <section id="fundamentals" className="scroll-mt-[calc(var(--nav-h,64px)+72px)] rounded-card border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">Reading the fundamentals</h2>
              <p className="mt-3 text-sm">{profile.fundamentalAnalysis}</p>
            </section>
            <section id="risks" className="scroll-mt-[calc(var(--nav-h,64px)+72px)] rounded-card border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">Risks and opportunities</h2>
              <p className="mt-3 text-sm">{profile.risksAndOpportunities}</p>
            </section>
          </div>
          <section className="rounded-card border border-line bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-ink">Build your own view of {profile.symbol}</h2>
            <p className="mt-2 max-w-[60ch] text-sm text-muted">
              Stock AI collects source-linked filings, results and news, and separates what supports the case from what challenges it. It does not give
              a personal recommendation, price target or guarantee.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink to={analyzeTo}>Analyze {profile.symbol}</ButtonLink>
              <Link to="/stocks" className="inline-flex h-11 items-center gap-1 px-2 text-sm font-semibold text-accent">
                Browse other stocks <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
