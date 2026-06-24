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
import Learn from './components/Learn';
import TrackRecord from './components/TrackRecord';


function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© 2026 BytePlay Technologies. All rights reserved.</p>
        <div className="flex gap-4 flex-wrap">
          <Link to="/about" className="text-slate-500 hover:text-white text-sm">About</Link>
          <Link to="/privacy" className="text-slate-500 hover:text-white text-sm">Privacy</Link>
          <Link to="/terms" className="text-slate-500 hover:text-white text-sm">Terms</Link>
          <Link to="/refund" className="text-slate-500 hover:text-white text-sm">Refund</Link>
          <Link to="/disclaimer" className="text-slate-500 hover:text-white text-sm">Disclaimer</Link>
          <Link to="/contact" className="text-slate-500 hover:text-white text-sm">Contact</Link>
        </div>
        <p className="text-slate-600 text-xs w-full text-center">
          ⚠️ Not SEBI-registered. AI signals for educational purposes only. Invest at your own risk.
        </p>
        
        {/* Data Sources */}
        <div className="border-t border-slate-800 pt-6 mt-6 w-full">
          <p className="text-slate-600 text-xs text-center mb-3">Data Sources</p>
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
                className="text-slate-600 hover:text-slate-400 text-xs transition underline"
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
function AppLayout({ user }: { user: any }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays pinned to the top (Hidden on Login Page) */}
      {!isLoginPage && <Navbar user={user} />}
      
      {/* The main content area expands to push the footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/privacy"    element={<PrivacyPolicy />} />
          <Route path="/terms"      element={<TermsOfService />} />
          <Route path="/refund"     element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/about"      element={<About />} />
          <Route path="/blog/*"     element={<Blog />} />
          <Route path="/learn"      element={<Learn />} />
          <Route path="/track-record" element={<TrackRecord />} />

          <Route path="/login" element={
            <LoginPage
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-25"></span>
          <div className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></div>
        </div>
        <p className="text-slate-400 text-xs tracking-widest uppercase animate-pulse">
          Fetching Real-time Intelligence
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* AppLayout contains everything and manages the global Navbar/Footer */}
      <AppLayout user={user} />
    </BrowserRouter>
  );
}
