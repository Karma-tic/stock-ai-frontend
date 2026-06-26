import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function LatestSignals() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;

      axios.get(`${BASE}/api/signals/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        // Only show signals with real confidence
        const real = (res.data.signals || [])
          .filter((s: any) => s.confidence > 0)
          .slice(0, 6);
        setSignals(real);
      }).catch(() => {});
    };
    load();
  }, []);

  if (!signals.length) return null;

  // We duplicate the signals array multiple times to ensure the ticker 
  // is wide enough to cover the screen and loop seamlessly.
  const tickerItems = [...signals, ...signals, ...signals, ...signals];

  return (
    <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 overflow-hidden">
      
      {/* Inline styles for the seamless ticker animation */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          /* Translating by -50% perfectly loops because we duplicated the array evenly */
          100% { transform: translateX(-50%); } 
        }
        .animate-ticker {
          animation: ticker-scroll 30s linear infinite;
        }
        /* Pause the animation when the user hovers over it to read */
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        
        /* Only animate on mobile/tablet. On large screens, we will center them if there aren't many. */
        @media (min-width: 1024px) {
          .desktop-no-animate {
            animation: none !important;
            transform: none !important;
            justify-content: center;
          }
        }
      `}</style>

      {/* Container wrapper to perfectly align with your main dashboard tabs */}
      <div className="max-w-7xl mx-auto w-full relative">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-semibold">
          AI Signals
        </p>
        
        {/* Ticker Window - Relative positioning for the gradient fade effects */}
        <div className="relative overflow-hidden w-full">
          
          {/* Left and Right gradient overlays to make it look like they fade in/out of the edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

          {/* The actual scrolling container. 
              We conditionally apply desktop-no-animate if there are 8 or fewer unique signals */}
          <div className={`flex gap-2 w-max animate-ticker pb-1 ${signals.length <= 8 ? 'lg:desktop-no-animate lg:w-full' : ''}`}>
            {/* If we aren't animating on desktop, we only want to map the ORIGINAL signals array, not the duplicated one */}
            {(signals.length <= 8 ? signals : tickerItems).map((s, i) => {
              const colors: Record<string, string> = {
                BUY:  'border-green-500 bg-green-500/10',
                HOLD: 'border-yellow-500 bg-yellow-500/10',
                SELL: 'border-red-500 bg-red-500/10'
              };
              const textColors: Record<string, string> = {
                BUY:  'text-green-400',
                HOLD: 'text-yellow-400',
                SELL: 'text-red-400'
              };
              
              return (
                <div 
                  // Use index in key because we are duplicating the exact same items
                  key={`${s.ticker}-${i}`} 
                  className={`flex-shrink-0 border rounded-lg px-3 py-2 w-[130px] cursor-default transition-colors hover:bg-slate-800 ${colors[s.signal] || 'border-slate-600'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-bold text-sm truncate">{s.ticker}</span>
                    <span className={`text-xs font-bold ${textColors[s.signal] || 'text-white'}`}>
                      {s.signal}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 items-center">
                    <p className="text-slate-400 text-xs truncate">₹{s.current_price}</p>
                    <p className="text-slate-500 text-[10px] font-medium">{s.confidence}% conf</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}