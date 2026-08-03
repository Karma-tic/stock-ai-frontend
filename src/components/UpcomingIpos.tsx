import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE } from '../lib/api';
import { Search, Info, TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';

interface IPO {
  id: string;
  company_name: string;
  symbol: string;
  price_band: string;
  open_date: string;
  close_date: string;
  gmp: string;
  est_listing_price?: string;
  lot_size?: string;
  status?: string;
}

export default function UpcomingIpos() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | 'Mainboard' | 'SME'>('All');

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

  const filteredIpos = ipos.filter(ipo => {
    if (filter === 'All') return true;
    if (filter === 'Mainboard') return ipo.lot_size?.toLowerCase().includes('mainboard');
    if (filter === 'SME') return ipo.lot_size?.toLowerCase().includes('sme');
    return true;
  });

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('close')) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><CheckCircle2 className="w-3 h-3" /> Closed</span>;
    if (s.includes('open')) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"><Clock className="w-3 h-3" /> Open</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-lavender-surface0/10 text-lavender-text/60 border border-white/50"><Clock className="w-3 h-3" /> Upcoming</span>;
  };

  const getGmpColor = (gmp?: string) => {
    if (!gmp || gmp === '₹0' || gmp === '₹-') return 'text-lavender-text/70';
    if (gmp.includes('-')) return 'text-rose-400';
    return 'text-emerald-400 font-bold';
  };

  const getEstListingColor = (est?: string) => {
    if (!est || est.includes('(0.00%)') || est === '₹-') return 'text-lavender-text/70';
    if (est.includes('-')) return 'text-rose-400';
    return 'text-emerald-400';
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-25"></span>
          <div className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></div>
        </div>
        <p className="text-lavender-text/70 text-sm animate-pulse tracking-widest uppercase">Fetching Live IPO GMPs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-lavender-text/70 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* FILTER TABS */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-lavender-surface/50 p-4 rounded-2xl border border-white/50">
        <div className="flex gap-2">
          {['All', 'Mainboard', 'SME'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${filter === f ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-lavender-surface text-lavender-text/70 hover:bg-gray-200 hover:text-lavender-text'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-lavender-text/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search IPOs..." 
            className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl pl-9 pr-4 py-2 text-sm text-lavender-text placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-full sm:w-64"
          />
        </div>
      </div>

      {/* DATA TABLE (Desktop) */}
      <div className="bg-lavender-surface/80 border border-white/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-lavender-surface/50 border-b border-white/50">
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider rounded-tl-2xl">IPO Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Price Band</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">GMP</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Est. Listing</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider text-right rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIpos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-lavender-text/60 text-sm">
                    No IPOs found for this category.
                  </td>
                </tr>
              ) : (
                filteredIpos.map(ipo => (
                  <tr key={ipo.id} className="hover:bg-lavender-surface/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                          {ipo.company_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-400 transition-colors whitespace-normal max-w-[200px] leading-tight">
                            {ipo.company_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-lavender-text/70">
                      <span className="bg-lavender-surface text-lavender-text/80 px-2 py-1 rounded-md text-[10px] font-medium tracking-wide">
                        {ipo.lot_size || 'MAINBOARD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-lavender-text/80">
                      {ipo.price_band}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-lavender-text/80 flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{ipo.open_date}</span>
                        <span className="flex items-center gap-1.5 text-lavender-text/60"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>{ipo.close_date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm flex items-center gap-1 ${getGmpColor(ipo.gmp)}`}>
                        {ipo.gmp?.includes('-') ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        {ipo.gmp || '₹0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium flex items-center gap-1 ${getEstListingColor(ipo.est_listing_price)}`}>
                        {ipo.est_listing_price || 'TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {getStatusBadge(ipo.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-lavender-surface px-6 py-4 border-t border-white/50 text-xs text-lavender-text/60 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-lavender-text/70" />
            GMP (Grey Market Premium) is highly volatile and indicative only. Est. Listing is based on upper price band + GMP.
          </div>
          <div>Live Data Feed</div>
        </div>
      </div>
      
    </div>
  );
}
