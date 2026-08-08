import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Target, TrendingUp, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpgradeModal from './UpgradeModal';
import SEO from './SEO';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function ProPicks() {
  const [picks, setPicks] = useState<any[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [accuracy, setAccuracy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "";
        setIsLoggedIn(!!session);

        // Fetch Accuracy
        const accRes = await fetch(`${BASE}/api/pro-accuracy`);
        const accData = await accRes.json();
        setAccuracy(accData);

        // Fetch Picks
        const picksRes = await fetch(`${BASE}/api/pro-picks`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const picksData = await picksRes.json();
        setIsPro(picksData.is_pro);
        setPicks(picksData.picks || []);
      } catch (error) {
        console.error("Error fetching pro data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lavender-text/60">Loading AI Engine Data...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <SEO
        title="Pro Picks | Daily AI-Screened NSE Setups | Stock AI"
        description="View daily AI-screened NSE trading setups, Pro accuracy stats, entry levels, targets, and stop loss information for educational use."
        canonicalPath="/pro-picks"
      />
      {/* HEADER SECTION */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
          <TrendingUp className="w-10 h-10 text-yellow-500" />
          Pro Picks
        </h1>
        <p className="text-lavender-text/60 text-lg max-w-2xl mx-auto">
          Every morning at 9:20 AM, our AI screens a broad NSE universe and shortlists 2-5 high-interest setups for further research.
        </p>
      </div>

      {/* ACCURACY TRACKER */}
      <div className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between shadow-lavender">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-300 font-medium">All-Time AI Accuracy</h3>
            <p className="text-sm text-lavender-text/70">Based on End-of-Day Closing Prices</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-lavender-text">{accuracy?.total_picks || 0}</div>
            <div className="text-sm text-lavender-text/70">Total Calls</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-600">{accuracy?.win_rate || "0%"}</div>
            <div className="text-sm text-green-500/70 font-medium tracking-wider uppercase mt-1">Win Rate</div>
          </div>
        </div>
      </div>

      {/* SECURITY BANNER FOR FREE USERS */}
      {!isPro && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8 text-center flex flex-col items-center">
          <Lock className="w-12 h-12 text-yellow-500 mb-3" />
          <h2 className="text-2xl font-bold text-lavender-text mb-2">Unlock Today's Picks</h2>
          <p className="text-lavender-text/60 mb-6 max-w-xl">
            You are currently viewing masked data. Exact ticker names, entry points, and targets are available only to Pro subscribers.
          </p>
          {isLoggedIn ? (
            <button onClick={() => setShowUpgrade(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              Upgrade to Pro Now
            </button>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              Upgrade to Pro Now
            </Link>
          )}
        </div>
      )}

      {/* PICKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {picks.length === 0 ? (
          <div className="col-span-full text-center p-12 text-lavender-text/70 border border-white/50 rounded-2xl">
            No picks generated for today yet. Check back after 9:30 AM.
          </div>
        ) : (
          picks.map((pick, index) => (
            <div key={index} className={`relative overflow-hidden bg-lavender-surface border rounded-2xl p-6 transition-all shadow-lavender ${isPro ? 'border-white/50 hover:border-lavender-text/20 hover:shadow-lavender hover:-translate-y-1' : 'border-white/50'}`}>
              
              {/* Blur Overlay for Free Users */}
              {!isPro && (
                <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-lavender-surface/40 flex items-center justify-center">
                  <div className="bg-lavender-surface/80 px-6 py-2 rounded-full border border-white/50 text-yellow-500 font-bold flex items-center gap-2 shadow-2xl">
                    <Lock className="w-4 h-4" /> Pro Only
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-3xl font-black ${isPro ? 'text-lavender-text' : 'text-lavender-text/80 font-mono tracking-widest'}`}>
                    {pick.ticker}
                  </h3>
                  <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 text-xs px-2 py-1 rounded mt-2 border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    AI Screened
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lavender-text/70 text-sm mb-1">Entry Price</div>
                  <div className={`text-xl font-bold ${isPro ? 'text-lavender-text' : 'text-lavender-text/80 font-mono'}`}>
                    ₹{pick.entry}
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-white/50">
                <p className={`text-sm leading-relaxed ${isPro ? 'text-gray-300' : 'text-lavender-text/80'}`}>
                  {isPro ? pick.reasoning : "This masked setup passed our momentum, liquidity, and risk filters. Upgrade to review the exact ticker and reasoning before doing your own research."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-lavender-surface p-3 rounded-2xl border border-white/50">
                  <div className="text-xs text-lavender-text/70 mb-1">Target 1</div>
                  <div className={`font-bold ${isPro ? 'text-green-600' : 'text-lavender-text/80'}`}>₹{pick.target1}</div>
                </div>
                <div className="bg-lavender-surface p-3 rounded-2xl border border-white/50">
                  <div className="text-xs text-lavender-text/70 mb-1">Target 2</div>
                  <div className={`font-bold ${isPro ? 'text-green-600' : 'text-lavender-text/80'}`}>₹{pick.target2}</div>
                </div>
                <div className="bg-red-50/50 p-3 rounded-2xl border border-red-200/50">
                  <div className="text-xs text-red-500/70 mb-1">Stop Loss</div>
                  <div className={`font-bold ${isPro ? 'text-red-600' : 'text-lavender-text/80'}`}>₹{pick.stopLoss}</div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => setIsPro(true)}
        />
      )}
    </div>
  );
}
