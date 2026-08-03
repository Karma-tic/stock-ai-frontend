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
          .slice(0, 6); // Keeping it at 6 so it centers beautifully on desktop
        setSignals(real);
      }).catch(() => {});
    };
    load();
  }, []);

  if (!signals.length) return null;

  // We duplicate the signals array multiple times to ensure the ticker 
  // is wide enough to cover the screen and loop seamlessly on mobile.
  const tickerItems = [...signals, ...signals, ...signals, ...signals];

  return (
    <div className="px-4 py-3 bg-lavender-surface border-b border-white/50 overflow-hidden">
      
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
        
        /* 
         * CRITICAL FIX FOR DESKTOP:
         * On medium screens and up (md:), we completely disable the animation
         * so it stays perfectly static and centered.
         */
        @media (min-width: 768px) {
          .animate-ticker {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto w-full">
        <p className="text-lavender-text/60 text-xs mb-2 uppercase tracking-wider font-semibold md:text-center">
          Live AI Signals
        </p>
        
        <div className="relative overflow-hidden w-full flex justify-center">
          
          {/* Mobile fade edges - hidden on desktop (md:hidden) so it looks clean */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          {/* 
            The scrolling container:
            - Mobile: w-max (wide enough to hold all duplicates) and animated
            - Desktop: md:w-full md:justify-center (centers the non-duplicated items)
          */}
          <div className="flex gap-2 w-max animate-ticker pt-1 pb-1 md:w-full md:justify-center">
            {tickerItems.map((s, i) => {
              // Identify if this item is a duplicate
              const isDuplicate = i >= signals.length;
              
              const colors: Record<string, string> = {
                BUY:  'border-green-500 bg-green-500/10',
                HOLD: 'border-yellow-500 bg-yellow-500/10',
                SELL: 'border-red-500 bg-red-500/10'
              };
              const textColors: Record<string, string> = {
                BUY:  'text-green-600',
                HOLD: 'text-yellow-400',
                SELL: 'text-red-600'
              };
              
              return (
                <div 
                  key={`${s.ticker}-${i}`} 
                  // If it IS a duplicate, we hide it completely on desktop (md:hidden).
                  // This leaves only the original 6 items perfectly centered!
                  className={`flex-shrink-0 border rounded-2xl px-3 py-2 w-[140px] cursor-default transition-colors hover:bg-lavender-surface ${colors[s.signal] || 'border-white/50'} ${isDuplicate ? 'md:hidden' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lavender-text font-bold text-sm truncate">{s.ticker}</span>
                    <span className={`text-xs font-bold ${textColors[s.signal] || 'text-lavender-text'}`}>
                      {s.signal}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 items-center">
                    <p className="text-lavender-text/70 text-xs truncate">₹{s.current_price}</p>
                    <p className="text-lavender-text/60 text-[10px] font-medium">{s.confidence}% conf</p>
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