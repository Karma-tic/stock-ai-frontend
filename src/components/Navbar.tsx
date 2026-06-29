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
      <nav className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0"><TrendingUp className="w-6 h-6 text-blue-400 shrink-0" /></span>
          <span className="font-bold text-lg text-white whitespace-nowrap">Stock AI</span>
          <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
            LIVE
          </span>
        </Link>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/learn" className="text-slate-400 hover:text-white transition">
            Learn
          </Link>
          <Link to="/tools" className="text-slate-400 hover:text-white transition">
            Tools
          </Link>
          <Link to="/market-wrap" className="text-slate-400 hover:text-white transition">
            Market Wrap
          </Link>
          <Link to="/stocks" className="text-slate-400 hover:text-white transition">
            Stocks
          </Link>
          <Link to="/track-record" className="text-slate-400 hover:text-white transition">
            Track Record
          </Link>
          <Link to="/learn" className="text-slate-400 hover:text-white transition">
            Learn
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {isPro ? (
                <span className="flex items-center gap-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  PRO
                </span>
              ) : (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Upgrade ₹49
                </button>
              )}

              <button
                onClick={logout}
                className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition whitespace-nowrap"
            >
              Get Started
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl px-2"
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
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-slate-900 border-b border-slate-700 px-4 py-4 space-y-4 shadow-xl z-50">
            <Link
              to="/learn"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Learn
            </Link>

            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Tools
            </Link>

            <Link
              to="/market-wrap"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Market Wrap
            </Link>

            <Link
              to="/stocks"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Stocks
            </Link>

            <Link
              to="/track-record"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Track Record
            </Link>

            <Link
              to="/learn"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition"
            >
              Learn
            </Link>

            {/* Mobile Actions */}
            {user ? (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    PRO
                  </span>
                ) : (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="block w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold transition"
                  >
                    Upgrade ₹49
                  </button>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-center text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-800">
                <Link
                  to="/login"
                  className="block w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold transition"
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
