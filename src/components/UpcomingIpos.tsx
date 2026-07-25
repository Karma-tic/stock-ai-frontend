import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE } from '../lib/api';
import { Sparkles, CalendarDays, TrendingUp, AlertTriangle } from 'lucide-react';

interface IPO {
  id: string;
  company_name: string;
  symbol: string;
  price_band: string;
  open_date: string;
  close_date: string;
  subscription_status: string;
  ai_analysis: string;
  ai_prediction: string;
}

export default function UpcomingIpos() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BASE}/api/market/ipos`)
      .then(res => {
        if (res.data.status === 'success') {
          setIpos(res.data.ipos);
        } else {
          setError('Failed to fetch IPOs');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error connecting to servers.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getPredictionColor = (pred: string) => {
    if (pred?.toLowerCase().includes('premium')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (pred?.toLowerCase().includes('discount')) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  };

  const getPredictionIcon = (pred: string) => {
    if (pred?.toLowerCase().includes('premium')) return <TrendingUp className="w-4 h-4" />;
    if (pred?.toLowerCase().includes('discount')) return <AlertTriangle className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        {error}
      </div>
    );
  }

  if (ipos.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm bg-slate-900/50 rounded-xl border border-slate-800">
        No active IPOs found right now. Check back later!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipos.map(ipo => (
          <div key={ipo.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {ipo.company_name}
                </h3>
                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                  <CalendarDays className="w-3 h-3" />
                  {ipo.open_date} - {ipo.close_date}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${getPredictionColor(ipo.ai_prediction)}`}>
                {getPredictionIcon(ipo.ai_prediction)}
                {ipo.ai_prediction || 'Neutral'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div>
                <p className="text-slate-500 text-xs mb-1">Price Band</p>
                <p className="text-slate-200 text-sm font-medium">{ipo.price_band || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Subscribed</p>
                <p className="text-emerald-400 text-sm font-medium">{ipo.subscription_status}x</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-emerald-500/70 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> AI Analysis
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {ipo.ai_analysis}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
