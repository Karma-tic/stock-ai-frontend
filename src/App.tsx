import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import About from './components/About';

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© 2026 BytePlay. Stock AI.</p>
        <div className="flex gap-4">
          <Link to="/about" className="text-slate-500 hover:text-white text-sm transition">About</Link>
          <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition">Privacy Policy</Link>
          <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition">Terms of Service</Link>
        </div>
        <p className="text-slate-600 text-xs w-full">
          ⚠️ Not SEBI-registered. AI signals for educational purposes only.
        </p>
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
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        setUser(data.session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-4xl animate-pulse">📈</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={<><PrivacyPolicy /><Footer /></>} />
        <Route path="/terms" element={<><TermsOfService /><Footer /></>} />
        <Route path="/about" element={<><About /><Footer /></>} />
        <Route path="*" element={
          user
            ? <MainApp user={user} />
            : <LoginPage onLogin={(token, u) => {
                localStorage.setItem('sb_token', token);
                setUser(u);
              }} />
        } />
      </Routes>
    </BrowserRouter>
  );
}