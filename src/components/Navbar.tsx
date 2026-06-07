import { useState, useEffect } from 'react';
import UpgradeModal from './UpgradeModal';
import axios from 'axios';
import { TrendingUp, Star } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) return;
    axios.get(`${BASE}/api/payment/status`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setIsPro(res.data.plan === 'pro');
    }).catch(() => {});
  }, []);

  const logout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    localStorage.removeItem('sb_token');
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
  {/* Left */}
  <div className="flex items-center gap-2">
    <TrendingUp className="w-6 h-6 text-blue-400" />
    <span className="font-bold text-lg text-white">Stock AI</span>
    <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold">
      LIVE
    </span>
  </div>

  {/* Center Nav */}
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

    {/* Scroll to education hub */}
    <button
      onClick={() => {
        navigate("/");
        setTimeout(() => {
          document
            .getElementById("education")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }}
      className="text-slate-400 hover:text-white transition"
    >
      Learn
    </button>
  </div>

  {/* Right */}
  <div className="flex items-center gap-2">
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
</nav>

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => setIsPro(true)}
        />
      )}
    </>
  );
}