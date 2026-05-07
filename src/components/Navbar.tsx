// src/components/Navbar.tsx
import { supabase } from '../lib/supabase';

export default function Navbar({ user }: { user: any }) {
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb_token');
    window.location.reload();
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📈</span>
        <span className="font-bold text-lg text-white">Stock AI</span>
        <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold">LIVE</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm hidden sm:block">
          {user?.email || user?.phone}
        </span>
        <button
          onClick={logout}
          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}