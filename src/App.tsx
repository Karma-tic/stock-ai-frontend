import { useState, useEffect, lazy, Suspense, ComponentType } from 'react';
import { Toaster } from 'sonner';
import { LazyMotion } from 'motion/react';
import { captureRef, claimStoredRef } from './lib/referral';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { applyPendingBriefChoice } from './lib/emailOptIn';
import { trackSignupOnce, trackVisitOnce } from './lib/track';
import Navbar from './components/Navbar';
import SiteFooter from './components/SiteFooter';
import LandingPage from './components/LandingPage';
import { LogoMark } from './components/ui/Logo';
import Skeleton from './components/ui/Skeleton';
import BottomTabs from './components/app/BottomTabs';

const loadMotion = () => import('./lib/motionFeatures').then((r) => r.default);

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
const Studies = lazyPage(() => import('./components/studies/Studies'));
const Blog = lazyPage(() => import('./components/Blog'));
const BlogPost = lazyPage(() => import('./components/BlogPost'));
const Learn = lazyPage(() => import('./components/Learn'));
const AlertsPage = lazyPage(() => import('./components/AlertsPage'));
const InvitePage = lazyPage(() => import('./components/InvitePage'));
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
      {mightHaveSession && (
        // The bottom tab bar's footprint, so nothing jumps when it arrives.
        <div className="fixed inset-x-0 bottom-0 h-[calc(58px+env(safe-area-inset-bottom))] border-t border-line bg-canvas lg:hidden" aria-hidden="true" />
      )}
    </div>
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
    <div className={`flex min-h-[100dvh] flex-col bg-canvas ${landingDark ? 'dark' : ''} ${user && !isLoginPage ? 'pb-[calc(57px+env(safe-area-inset-bottom))] lg:pb-0' : ''}`}>
      {/* Navbar stays pinned to the top (Hidden on Login Page) */}
      {!isLoginPage && (
        <Navbar user={user} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      )}
      
      {/* The main content area expands to push the footer down */}
      <main className="flex-grow">
        {/* Each page fades in with an 8 px rise (200 ms); reduced motion shows it at once. */}
        <div key={location.pathname} className="page-in">
        <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/privacy"    element={<PrivacyPolicy />} />
          <Route path="/terms"      element={<TermsOfService />} />
          <Route path="/refund"     element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/about"      element={<About />} />
          <Route path="/studies"    element={<Studies />} />
          <Route path="/beta"       element={<BetaApplication />} />
          <Route path="/blog"       element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn"      element={<Learn />} />
          <Route path="/track-record" element={<Navigate to="/studies" replace />} />
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

          <Route path="/pro-picks" element={<Navigate to="/" replace />} />
          <Route path="/ipos" element={<IPOsPage />} />
          <Route path="/ipos/:id" element={<IpoDetailPage />} />
          <Route path="/alerts" element={user ? <AlertsPage /> : <Navigate to="/login?next=%2Falerts" replace />} />
          <Route path="/invite" element={user ? <InvitePage /> : <Navigate to="/login?next=%2Finvite" replace />} />
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
        </div>
      </main>

      {/* Footer stays pinned to the bottom (Hidden on Login Page) */}
      {!isLoginPage && <SiteFooter />}
      {user && !isLoginPage && <BottomTabs />}
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

    trackVisitOnce();
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Session restoration failed:', error.message);
        localStorage.removeItem('sb_token');
      }
      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        setUser(data.session.user);
        void applyPendingBriefChoice(data.session.access_token);
        trackSignupOnce(data.session.user.id, data.session.access_token);
        finishPendingRedirect();
      }
    }).catch((error) => {
      console.error('Session restoration failed:', error);
      localStorage.removeItem('sb_token');
    }).finally(() => setLoading(false));

    captureRef();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('sb_token', session.access_token);
        setUser(session.user);
        if (event === 'SIGNED_IN') {
          void applyPendingBriefChoice(session.access_token);
          trackSignupOnce(session.user.id, session.access_token);
          void claimStoredRef();
          finishPendingRedirect();
        }
      } else {
        setUser(null);
        localStorage.removeItem('sb_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <BootSkeleton />;

  return (
    // Motion's animation features load after first paint, so the first bundle stays small.
    <LazyMotion features={loadMotion} strict>
    <BrowserRouter>
      {/* AppLayout contains everything and manages the global Navbar/Footer */}
      <AppLayout
        user={user}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
      />
      {/* Toasts sit above the phone tab bar and follow the app theme. */}
      <Toaster
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-center"
        offset={{ bottom: 24 }}
        mobileOffset={{ bottom: 'calc(76px + env(safe-area-inset-bottom))' }}
        toastOptions={{ className: 'font-sans text-sm', duration: 3000 }}
      />
    </BrowserRouter>
    </LazyMotion>
  );
}
