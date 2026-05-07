// src/App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        setUser(data.session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes (handles Google OAuth redirect)
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

  if (!user) {
    return <LoginPage onLogin={(token, u) => { localStorage.setItem('sb_token', token); setUser(u); }} />;
  }

  return (
    <div>
      <Navbar user={user} />
      <Dashboard />
    </div>
  );
}