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

  return (
    <div className="px-4 py-3 bg-slate-900 border-b border-slate-800">
     <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-semibold">
  AI Signals
</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {signals.map((s, i) => {
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
            <div key={i} className={`flex-shrink-0 border rounded-lg px-3 py-2 min-w-[130px] ${colors[s.signal] || 'border-slate-600'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-bold text-sm">{s.ticker}</span>
                <span className={`text-xs font-bold ${textColors[s.signal] || 'text-white'}`}>
                  {s.signal}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-slate-400 text-xs">₹{s.current_price}</p>
                <p className="text-slate-500 text-xs">{s.confidence}% conf</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}