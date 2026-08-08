import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import RefundPolicy from './components/RefundPolicy';
import Disclaimer from './components/Disclaimer';
import Contact from './components/Contact';
import About from './components/About';
import LandingPage from './components/LandingPage';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Learn from './components/Learn';
import TrackRecord from './components/TrackRecord';
import ToolsHub from './components/ToolsHub';
import SIPCalculator from './components/SIPCalculator';
import LumpsumCalculator from './components/LumpsumCalculator';
import BrokerageCalculator from './components/BrokerageCalculator';
import FnOCalculator from './components/FnOCalculator';
import StockDirectory from './components/StockDirectory';
import StockPage from './components/StockPage';
import StockComparison from './components/StockComparison';
import StockScreener from './components/StockScreener';
import Chapter1 from './components/learn/Chapter1';
import Chapter2 from './components/learn/Chapter2';
import Chapter3 from './components/learn/Chapter3';
import Chapter4 from './components/learn/Chapter4';
import Chapter5 from './components/learn/Chapter5';
import Chapter6 from './components/learn/Chapter6';
import Chapter7 from './components/learn/Chapter7';
import Chapter8 from './components/learn/Chapter8';
import Chapter9 from './components/learn/Chapter9';
import MarketWrap from './components/MarketWrap';
import ProPicks from './components/ProPicks';
import IPOsPage from './components/IPOsPage';


function Footer() {
  return (
    <footer className="bg-lavender-surface border-t border-white/50 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
        <p className="text-lavender-text/80 text-sm">© 2026 BytePlay Technologies. All rights reserved.</p>
        <div className="flex gap-4 flex-wrap">
          <Link to="/about" className="text-lavender-text/80 hover:text-lavender-text text-sm">About</Link>
          <Link to="/privacy" className="text-lavender-text/80 hover:text-lavender-text text-sm">Privacy</Link>
          <Link to="/terms" className="text-lavender-text/80 hover:text-lavender-text text-sm">Terms</Link>
          <Link to="/refund" className="text-lavender-text/80 hover:text-lavender-text text-sm">Refund</Link>
          <Link to="/disclaimer" className="text-lavender-text/80 hover:text-lavender-text text-sm">Disclaimer</Link>
          <Link to="/contact" className="text-lavender-text/80 hover:text-lavender-text text-sm">Contact</Link>
        </div>
        <p className="text-lavender-text/70 text-xs w-full text-center">
          Not SEBI-registered. AI signals for educational purposes only. Invest at your own risk.
        </p>
        
        {/* Data Sources */}
        <div className="border-t border-white/50 pt-6 mt-6 w-full">
          <p className="text-lavender-text/70 text-xs text-center mb-3">Data Sources</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "NSE India", url: "https://www.nseindia.com" },
              { label: "BSE India", url: "https://www.bseindia.com" },
              { label: "Economic Times Markets", url: "https://economictimes.indiatimes.com/markets" },
              { label: "SEBI", url: "https://www.sebi.gov.in" },
              { label: "Moneycontrol", url: "https://www.moneycontrol.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lavender-text/70 hover:text-lavender-text text-xs transition underline"
              >
                {link.label}
              </a>
            ))}
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays pinned to the top (Hidden on Login Page) */}
      {!isLoginPage && <Navbar user={user} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />}
      
      {/* The main content area expands to push the footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/privacy"    element={<PrivacyPolicy />} />
          <Route path="/terms"      element={<TermsOfService />} />
          <Route path="/refund"     element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/about"      element={<About />} />
          <Route path="/blog"       element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn"      element={<Learn />} />
          <Route path="/track-record" element={<TrackRecord />} />
          <Route path="/market-wrap" element={<MarketWrap />} />
          <Route path="/tools"      element={<ToolsHub />} />
          <Route path="/tools/sip-calculator" element={<SIPCalculator />} />
          <Route path="/tools/lumpsum-calculator" element={<LumpsumCalculator />} />
          <Route path="/tools/brokerage-calculator" element={<BrokerageCalculator />} />
          <Route path="/tools/fno-calculator" element={<FnOCalculator />} />
          <Route path="/tools/stock-comparison" element={<StockComparison />} />
          
          <Route path="/stocks" element={<StockDirectory />} />
          <Route path="/stocks/screener" element={<StockScreener />} />
          <Route path="/stock/:symbol" element={<StockPage />} />

          <Route path="/pro-picks" element={<ProPicks />} />
          <Route path="/ipos" element={<IPOsPage />} />
          
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

          <Route path="/login" element={
            <LoginPage
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
              onLogin={(token, u) => {
                localStorage.setItem('sb_token', token);
                window.location.href = '/'; 
              }}
              onBack={() => {
                window.history.back();
              }}
            />
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
      </main>

      {/* Footer stays pinned to the bottom (Hidden on Login Page) */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('stock_ai_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('stock_ai_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        setUser(data.session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      if (session) {
        localStorage.setItem('sb_token', session.access_token);
        setUser(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('sb_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-lavender-surface flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-25"></span>
          <div className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></div>
        </div>
        <p className="text-lavender-text/70 text-xs tracking-widest uppercase animate-pulse">
          Fetching Real-time Intelligence
        </p>
      </div>
    );
  }

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
