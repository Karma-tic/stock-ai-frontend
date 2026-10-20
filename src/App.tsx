import { useState, useEffect, lazy, Suspense, ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Logo, { LogoMark } from './components/ui/Logo';
import Skeleton from './components/ui/Skeleton';

// Every page except the landing page loads on demand, so first-time visitors
// only download the code for the page they open.
// If a deploy replaced the chunk files while this tab was open, reload once to pick up the new ones.
function lazyPage<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await load();
      sessionStorage.removeItem('stock_ai_chunk_reload');
      return mod;
    } catch (error) {
      if (!sessionStorage.getItem('stock_ai_chunk_reload')) {
        sessionStorage.setItem('stock_ai_chunk_reload', '1');
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });
}

const LoginPage = lazyPage(() => import('./components/LoginPage'));
const Dashboard = lazyPage(() => import('./components/Dashboard'));
const PrivacyPolicy = lazyPage(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazyPage(() => import('./components/TermsOfService'));
const RefundPolicy = lazyPage(() => import('./components/RefundPolicy'));
const Disclaimer = lazyPage(() => import('./components/Disclaimer'));
const Contact = lazyPage(() => import('./components/Contact'));
const About = lazyPage(() => import('./components/About'));
const Blog = lazyPage(() => import('./components/Blog'));
const BlogPost = lazyPage(() => import('./components/BlogPost'));
const Learn = lazyPage(() => import('./components/Learn'));
const TrackRecord = lazyPage(() => import('./components/TrackRecord'));
const ToolsHub = lazyPage(() => import('./components/ToolsHub'));
const SIPCalculator = lazyPage(() => import('./components/SIPCalculator'));
const LumpsumCalculator = lazyPage(() => import('./components/LumpsumCalculator'));
const BrokerageCalculator = lazyPage(() => import('./components/BrokerageCalculator'));
const FnOCalculator = lazyPage(() => import('./components/FnOCalculator'));
const StockPage = lazyPage(() => import('./components/StockPage'));
const StockComparison = lazyPage(() => import('./components/StockComparison'));
const StockScreener = lazyPage(() => import('./components/StockScreener'));
const DividendTracker = lazyPage(() => import('./components/DividendTracker'));
const Chapter1 = lazyPage(() => import('./components/learn/Chapter1'));
const Chapter2 = lazyPage(() => import('./components/learn/Chapter2'));
const Chapter3 = lazyPage(() => import('./components/learn/Chapter3'));
const Chapter4 = lazyPage(() => import('./components/learn/Chapter4'));
const Chapter5 = lazyPage(() => import('./components/learn/Chapter5'));
const Chapter6 = lazyPage(() => import('./components/learn/Chapter6'));
const Chapter7 = lazyPage(() => import('./components/learn/Chapter7'));
const Chapter8 = lazyPage(() => import('./components/learn/Chapter8'));
const Chapter9 = lazyPage(() => import('./components/learn/Chapter9'));
const MarketWrap = lazyPage(() => import('./components/MarketWrap'));
const ProPicks = lazyPage(() => import('./components/ProPicks'));
const IPOsPage = lazyPage(() => import('./components/IPOsPage'));
const IpoDetailPage = lazyPage(() => import('./components/IpoDetailPage'));
const BetaApplication = lazyPage(() => import('./components/BetaApplication'));
const InvestExplorer = lazyPage(() => import('./components/invest/InvestExplorer'));

// True when this browser might hold a signed-in session (or is returning from a sign-in).
// Visitors who have never signed in skip the session check and see the page immediately.
function mightHaveSession(): boolean {
  try {
    const { hash, search } = window.location;
    if (hash.includes('access_token') || hash.includes('refresh_token') || new URLSearchParams(search).has('code')) return true;
    if (sessionStorage.getItem('stock_ai_post_auth_redirect')) return true;
    if (localStorage.getItem('sb_token')) return true;
    for (let i = 0; i < localStorage.length; i++) {
      if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return true;
    }
    return false;
  } catch {
    return true;
  }
}

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" role="status" aria-label="Loading page">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

// Shown while a returning visitor's session is restored: the app's shape, not a spinner.
function BootSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-canvas" role="status" aria-label="Loading Stock AI">
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <LogoMark />
          <Skeleton className="hidden h-10 w-60 lg:block" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}


const FOOTER_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/refund', label: 'Refund' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/contact', label: 'Contact' },
  { to: '/beta', label: 'Join the research beta' },
];
const DATA_SOURCES = [
  { label: 'NSE India', url: 'https://www.nseindia.com' },
  { label: 'BSE India', url: 'https://www.bseindia.com' },
  { label: 'Economic Times Markets', url: 'https://economictimes.indiatimes.com/markets' },
  { label: 'SEBI', url: 'https://www.sebi.gov.in' },
  { label: 'Moneycontrol', url: 'https://www.moneycontrol.com' },
];

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Research, not advice. Not SEBI-registered. AI analysis is for education only; invest at your own risk.
          </p>
          <p className="mt-4 text-xs text-muted">© 2026 BytePlay Technologies. All rights reserved.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted">Company</p>
            <ul className="mt-3 space-y-1">
              {FOOTER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex min-h-[36px] items-center text-sm text-ink/80 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Data sources</p>
            <ul className="mt-3 space-y-1">
              {DATA_SOURCES.map((link) => (
                <li key={link.label}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[36px] items-center text-sm text-ink/80 hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
// NEW: Global Layout Component
function AppLayout({ user, isDarkMode, onToggleTheme }: { user: any; isDarkMode: boolean; onToggleTheme: () => void }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const requestedPath = new URLSearchParams(location.search).get('next');
  const safeNext = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/';
  // The public landing page is one dark theme, so its navbar and footer join it.
  const landingDark = !user && location.pathname === '/';

  return (
    <div className={`flex min-h-[100dvh] flex-col bg-canvas ${landingDark ? 'dark' : ''}`}>
      {/* Navbar stays pinned to the top (Hidden on Login Page) */}
      {!isLoginPage && (
        <Navbar user={user} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      )}
      
      {/* The main content area expands to push the footer down */}
      <main className="flex-grow">
        <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/privacy"    element={<PrivacyPolicy />} />
          <Route path="/terms"      element={<TermsOfService />} />
          <Route path="/refund"     element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/about"      element={<About />} />
          <Route path="/beta"       element={<BetaApplication />} />
          <Route path="/blog"       element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn"      element={<Learn />} />
          <Route path="/track-record" element={<TrackRecord />} />
          <Route path="/market-wrap" element={<MarketWrap />} />
          <Route path="/invest"     element={<InvestExplorer user={user} />} />
          <Route path="/tools"      element={<ToolsHub />} />
          <Route path="/tools/sip-calculator" element={<SIPCalculator />} />
          <Route path="/tools/lumpsum-calculator" element={<LumpsumCalculator />} />
          <Route path="/tools/brokerage-calculator" element={<BrokerageCalculator />} />
          <Route path="/tools/fno-calculator" element={<FnOCalculator />} />
          <Route path="/tools/stock-comparison" element={<StockComparison />} />
          
          <Route path="/stocks" element={<StockScreener />} />
          <Route path="/stocks/screener" element={<StockScreener />} />
          <Route path="/stocks/dividends" element={<DividendTracker />} />
          <Route path="/stock/:symbol" element={<StockPage user={user} />} />

          <Route path="/pro-picks" element={<ProPicks />} />
          <Route path="/ipos" element={<IPOsPage />} />
          <Route path="/ipos/:id" element={<IpoDetailPage />} />
          <Route path="/today" element={user ? <Dashboard initialTab="radar" /> : <Navigate to="/login?next=%2Ftoday" replace />} />
          
          {/* Learn Wiki Routes */}
          <Route path="/learn/what-is-stock-market" element={<Chapter1 />} />
          <Route path="/learn/types-of-trading" element={<Chapter2 />} />
          <Route path="/learn/essential-terms" element={<Chapter3 />} />
          <Route path="/learn/fundamental-vs-technical" element={<Chapter4 />} />
          <Route path="/learn/market-risks" element={<Chapter5 />} />
          <Route path="/learn/ai-in-markets" element={<Chapter6 />} />
          <Route path="/learn/how-to-start" element={<Chapter7 />} />
          <Route path="/learn/dividend-investing" element={<Chapter8 />} />
          <Route path="/learn/common-mistakes" element={<Chapter9 />} />

          <Route path="/login" element={user ? (
            <Navigate to={safeNext} replace />
          ) : (
            <LoginPage
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
              onLogin={(token, u) => {
                localStorage.setItem('sb_token', token);
                window.location.assign(safeNext);
              }}
              onBack={() => {
                window.history.back();
              }}
            />
          )
          } />
          
          <Route
            path="*"
            element={
              user ? (
                <Dashboard />
              ) : (
                <LandingPage onGetStarted={() => { window.location.href = '/login'; }} />
              )
            }
          />
        </Routes>
        </Suspense>
      </main>

      {/* Footer stays pinned to the bottom (Hidden on Login Page) */}
      {!isLoginPage && (
        <Footer />
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(mightHaveSession);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('stock_ai_theme');
    const dark = saved ? saved === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    document.documentElement.classList.toggle('dark', dark); // before first paint, so there is no flash
    return dark;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('stock_ai_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const finishPendingRedirect = () => {
      const pending = sessionStorage.getItem('stock_ai_post_auth_redirect');
      if (!pending) return;
      sessionStorage.removeItem('stock_ai_post_auth_redirect');
      if (pending.startsWith('/') && !pending.startsWith('//') && `${window.location.pathname}${window.location.search}` !== pending) {
        window.location.replace(pending);
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Session restoration failed:', error.message);
        localStorage.removeItem('sb_token');
      }
      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        setUser(data.session.user);
        finishPendingRedirect();
      }
    }).catch((error) => {
      console.error('Session restoration failed:', error);
      localStorage.removeItem('sb_token');
    }).finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      if (session) {
        localStorage.setItem('sb_token', session.access_token);
        setUser(session.user);
        if (event === 'SIGNED_IN') finishPendingRedirect();
      } else {
        setUser(null);
        localStorage.removeItem('sb_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <BootSkeleton />;

  return (
    <BrowserRouter>
      {/* AppLayout contains everything and manages the global Navbar/Footer */}
      <AppLayout
        user={user}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
      />
    </BrowserRouter>
  );
}
