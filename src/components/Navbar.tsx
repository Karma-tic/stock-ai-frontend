import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UpgradeModal from './UpgradeModal';
import { TrendingUp, Star } from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Navbar({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) return;

    axios
      .get(`${BASE}/api/payment/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsPro(res.data.plan === 'pro');
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    localStorage.removeItem('sb_token');
    window.location.reload();
  };



  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-lavender-surface border-b border-white/50 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0"><TrendingUp className="w-6 h-6 text-lavender-primary shrink-0" /></span>
          <span className="font-bold text-lg text-lavender-text whitespace-nowrap">Stock AI</span>
          <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
            LIVE
          </span>
        </Link>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/blog" className="text-lavender-text/70 hover:text-lavender-text transition">
            Blog
          </Link>
          <Link to="/tools" className="text-lavender-text/70 hover:text-lavender-text transition">
            Tools
          </Link>
          <Link to="/market-wrap" className="text-lavender-text/70 hover:text-lavender-text transition">
            Market Wrap
          </Link>
          <Link to="/stocks" className="text-lavender-text/70 hover:text-lavender-text transition">
            Stocks
          </Link>
          <Link to="/ipos" className="text-lavender-text/70 hover:text-lavender-text transition">
            IPOs
          </Link>
          <Link to="/track-record" className="text-lavender-text/70 hover:text-lavender-text transition">
            Track Record
          </Link>
          <Link to="/learn" className="text-lavender-text/70 hover:text-lavender-text transition">
            Learn
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PRO PICKS BUTTON - ALWAYS VISIBLE */}
          <Link 
            to="/pro-picks" 
            className={`flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20 border border-yellow-500/30 text-yellow-500 text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl transition-all ${user ? 'animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.2)]' : ''}`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-500" />
            <span className="whitespace-nowrap">Pro Picks</span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {isPro ? (
                <span className="flex items-center gap-1 text-xs bg-blue-500 text-lavender-text px-2 py-0.5 rounded-full font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  PRO
                </span>
              ) : (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-xs bg-gradient-lavender hover:opacity-90 text-white px-3 py-1.5 rounded-2xl font-semibold transition"
                >
                  Upgrade ₹99
                </button>
              )}

              <button
                onClick={logout}
                className="text-sm bg-lavender-surface hover:bg-gray-200 px-3 py-1.5 rounded-2xl text-lavender-text transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-sm bg-gradient-lavender hover:opacity-90 px-4 py-2 rounded-2xl text-lavender-text font-semibold transition whitespace-nowrap"
            >
              Get Started
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-lavender-text text-2xl px-2"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {open && (
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        )}
        
        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-lavender-surface border-b border-white/50 px-4 py-4 space-y-4 shadow-lavender z-50">
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Blog
            </Link>

            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Tools
            </Link>

            <Link
              to="/market-wrap"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Market Wrap
            </Link>

          <Link
              to="/stocks"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Stocks
            </Link>

            <Link
              to="/ipos"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              IPOs
            </Link>

            <Link
              to="/track-record"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Track Record
            </Link>

            <Link
              to="/learn"
              onClick={() => setOpen(false)}
              className="block text-lavender-text/80 hover:text-lavender-text transition"
            >
              Learn
            </Link>

            {/* Mobile Actions */}
            {user ? (
              <div className="pt-4 border-t border-white/50 space-y-3">
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-500 text-lavender-text px-2 py-1 rounded-full font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    PRO
                  </span>
                ) : (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="block w-full text-center text-sm bg-gradient-lavender hover:opacity-90 text-white px-3 py-2 rounded-2xl font-semibold transition"
                  >
                    Upgrade ₹99
                  </button>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-center text-sm bg-lavender-surface hover:bg-gray-200 px-3 py-2 rounded-2xl text-lavender-text transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/50">
                <Link
                  to="/login"
                  className="block w-full text-center text-sm bg-gradient-lavender hover:opacity-90 text-white px-3 py-2 rounded-2xl font-semibold transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => setIsPro(true)}
        />
      )}
    </>
  );
}
