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
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0"><TrendingUp className="w-6 h-6 text-blue-600 shrink-0" /></span>
          <span className="font-bold text-lg text-gray-900 whitespace-nowrap">Stock AI</span>
          <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
            LIVE
          </span>
        </Link>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/blog" className="text-gray-500 hover:text-gray-900 transition">
            Blog
          </Link>
          <Link to="/tools" className="text-gray-500 hover:text-gray-900 transition">
            Tools
          </Link>
          <Link to="/market-wrap" className="text-gray-500 hover:text-gray-900 transition">
            Market Wrap
          </Link>
          <Link to="/stocks" className="text-gray-500 hover:text-gray-900 transition">
            Stocks
          </Link>
          <Link to="/ipos" className="text-gray-500 hover:text-gray-900 transition">
            IPOs
          </Link>
          <Link to="/track-record" className="text-gray-500 hover:text-gray-900 transition">
            Track Record
          </Link>
          <Link to="/learn" className="text-gray-500 hover:text-gray-900 transition">
            Learn
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PRO PICKS BUTTON - ALWAYS VISIBLE */}
          <Link 
            to="/pro-picks" 
            className={`flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20 border border-yellow-500/30 text-yellow-500 text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all ${user ? 'animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.2)]' : ''}`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-500" />
            <span className="whitespace-nowrap">Pro Picks</span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {isPro ? (
                <span className="flex items-center gap-1 text-xs bg-blue-500 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  PRO
                </span>
              ) : (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-gray-900 px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Upgrade ₹99
                </button>
              )}

              <button
                onClick={logout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-900 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-gray-900 font-semibold transition whitespace-nowrap"
            >
              Get Started
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-900 text-2xl px-2"
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
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-gray-300 px-4 py-4 space-y-4 shadow-xl z-50">
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Blog
            </Link>

            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Tools
            </Link>

            <Link
              to="/market-wrap"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Market Wrap
            </Link>

          <Link
              to="/stocks"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Stocks
            </Link>

            <Link
              to="/ipos"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              IPOs
            </Link>

            <Link
              to="/track-record"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Track Record
            </Link>

            <Link
              to="/learn"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-gray-900 transition"
            >
              Learn
            </Link>

            {/* Mobile Actions */}
            {user ? (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-500 text-gray-900 px-2 py-1 rounded-full font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    PRO
                  </span>
                ) : (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="block w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-gray-900 px-3 py-2 rounded-lg font-semibold transition"
                  >
                    Upgrade ₹99
                  </button>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-900 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-gray-900 px-3 py-2 rounded-lg font-semibold transition"
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
