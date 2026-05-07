// src/components/LatestSignals.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function LatestSignals() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) return;
    axios.get(`${BASE}/api/signals/latest`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSignals(res.data.signals?.slice(0, 6) || []);
    }).catch(() => {});
  }, []);

  if (!signals.length) return null;

  return (
    <div className="px-4 py-3 bg-slate-900 border-b border-slate-800">
      <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">🤖 Latest AI Signals</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {signals.map((s, i) => {
          const color = { BUY: 'border-green-500 bg-green-500/10', HOLD: 'border-yellow-500 bg-yellow-500/10', SELL: 'border-red-500 bg-red-500/10' }[s.signal] || 'border-slate-600';
          const textColor = { BUY: 'text-green-400', HOLD: 'text-yellow-400', SELL: 'text-red-400' }[s.signal] || 'text-white';
          return (
            <div key={i} className={`flex-shrink-0 border rounded-lg px-3 py-2 ${color}`}>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{s.ticker}</span>
                <span className={`text-xs font-bold ${textColor}`}>{s.signal}</span>
                <span className="text-slate-500 text-xs">{s.confidence}%</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">₹{s.current_price}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}