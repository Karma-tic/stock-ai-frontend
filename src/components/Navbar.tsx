import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpgradeModal from './UpgradeModal';
import { TrendingUp, Star } from 'lucide-react';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate();

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

  const goToEducation = () => {
    setOpen(false);
    navigate('/');
    setTimeout(() => {
      document
        .getElementById('education')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-lg text-white">Stock AI</span>
          <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold">
            LIVE
          </span>
        </div>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/about" className="text-slate-400 hover:text-white transition">
            About
          </Link>
          <Link to="/blog" className="text-slate-400 hover:text-white transition">
            Blog
          </Link>
          <Link to="/contact" className="text-slate-400 hover:text-white transition">
            Contact
          </Link>
          <button
            onClick={goToEducation}
            className="text-slate-400 hover:text-white transition"
          >
            Learn
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl px-2"
          >
            ☰
          </button>

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

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-slate-900 border-b border-slate-700 px-4 py-4 space-y-4 shadow-xl z-50">
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="block text-white"
            >
              About
            </Link>

            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="block text-white"
            >
              Blog
            </Link>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block text-white"
            >
              Contact
            </Link>

            <button
              onClick={goToEducation}
              className="block text-left text-white w-full"
            >
              Learn
            </button>
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