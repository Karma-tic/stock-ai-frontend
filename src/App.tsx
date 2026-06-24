import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-white font-semibold mb-2">Stock AI</p>
            <p className="text-slate-500 text-xs">AI-powered Indian stock market intelligence platform.</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-sm mb-2">Company</p>
            <div className="space-y-1">
              <Link to="/about" className="block text-slate-500 hover:text-white text-xs transition">About</Link>
              <Link to="/contact" className="block text-slate-500 hover:text-white text-xs transition">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-sm mb-2">Legal</p>
            <div className="space-y-1">
              <Link to="/privacy" className="block text-slate-500 hover:text-white text-xs transition">Privacy Policy</Link>
              <Link to="/terms" className="block text-slate-500 hover:text-white text-xs transition">Terms & Conditions</Link>
              <Link to="/refund" className="block text-slate-500 hover:text-white text-xs transition">Refund Policy</Link>
            </div>
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-sm mb-2">Support</p>
            <div className="space-y-1">
              <Link to="/disclaimer" className="block text-slate-500 hover:text-white text-xs transition">Disclaimer</Link>
              <a href="mailto:contact@karmatix.in" className="block text-slate-500 hover:text-white text-xs transition">contact@karmatix.in</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-600 text-xs">© 2026 BytePlay Technologies. All rights reserved.</p>
          <p className="text-slate-600 text-xs text-center">
            ⚠️ Not SEBI-registered. AI signals for educational purposes only. Invest at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
}

function MainApp({ user }: { user: any }) {
  return (
    <>
      <Navbar user={user} />
      <Dashboard />
      <Footer />
    </>
  );
}

export default function App() {
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Handle magic link redirect — URL contains access_token in hash
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

 const publicLayout = (Component: React.ComponentType) => (
  <>
    <Navbar user={user} />
    <Component />
    <Footer />
  </>
);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy"    element={publicLayout(PrivacyPolicy)} />
        <Route path="/terms"      element={publicLayout(TermsOfService)} />
        <Route path="/refund"     element={publicLayout(RefundPolicy)} />
        <Route path="/disclaimer" element={publicLayout(Disclaimer)} />
        <Route path="/contact"    element={publicLayout(Contact)} />
        <Route path="/about"      element={publicLayout(About)} />
        <Route path="/blog"       element={publicLayout(Blog)} />
        <Route path="/blog/*"     element={publicLayout(Blog)} />
        <Route path="/learn"      element={publicLayout(Learn)} />
        <Route path="/track-record" element={publicLayout(TrackRecord)} />

        <Route path="/login" element={
          <LoginPage
            onLogin={(token, u) => {
              localStorage.setItem('sb_token', token);
              setUser(u);
              // After login, they can just navigate to / or dashboard
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
              <MainApp user={user} />
            ) : (
              <LandingPage onGetStarted={() => { window.location.href = '/login'; }} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}