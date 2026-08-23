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

export default function UpcomingIpos({ compact = false }: { compact?: boolean }) {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | 'Mainboard' | 'SME'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${BASE}/api/market/ipos`)
      .then(res => {
        if (res.data.status === 'success') {
          setIpos(res.data.ipos);
        } else {
          setError(res.data.message || 'IPO data is temporarily unavailable.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error connecting to servers.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredIpos = ipos.filter(ipo => {
    const ipoText = `${ipo.company_name} ${ipo.symbol} ${ipo.status || ''}`.toLowerCase();
    const matchesSearch = !search.trim() || ipoText.includes(search.trim().toLowerCase());
    const matchesType =
      filter === 'All' ||
      (filter === 'Mainboard' && ipo.lot_size?.toLowerCase().includes('mainboard')) ||
      (filter === 'SME' && ipo.lot_size?.toLowerCase().includes('sme'));
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('close')) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><CheckCircle2 className="w-3 h-3" /> Closed</span>;
    if (s.includes('open')) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"><Clock className="w-3 h-3" /> Open</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-lavender-base text-lavender-text/60 border border-lavender-text/10"><Clock className="w-3 h-3" /> Upcoming</span>;
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
      <div className={`${compact ? 'py-10' : 'py-20'} flex flex-col items-center justify-center gap-4`}>
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

  if (compact) {
    const previewIpos = filteredIpos.slice(0, 3);

    return (
      <div className="grid gap-3 md:grid-cols-3">
        {previewIpos.length === 0 ? (
          <div className="app-card col-span-full py-10 text-center text-sm text-lavender-text/60">
            No upcoming IPOs are available right now.
          </div>
        ) : previewIpos.map(ipo => (
          <article key={ipo.id} className="app-card flex min-w-0 flex-col p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lavender">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-500">
                  {ipo.company_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-lavender-text">{ipo.company_name}</h3>
                  <p className="mt-0.5 text-xs text-lavender-text/50">{ipo.lot_size || 'Mainboard'}</p>
                </div>
              </div>
              {getStatusBadge(ipo.status)}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-lavender-text/10 pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-lavender-text/45">Price band</p>
                <p className="mt-1 text-sm font-bold text-lavender-text">{ipo.price_band || 'TBA'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-lavender-text/45">Current GMP</p>
                <p className={`mt-1 text-sm ${getGmpColor(ipo.gmp)}`}>{ipo.gmp || '₹0'}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-lavender-text/60">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>{ipo.open_date} – {ipo.close_date}</span>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* FILTER TABS */}
      <div className="app-card p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {['All', 'Mainboard', 'SME'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${filter === f ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-lavender-base border border-lavender-text/10 text-lavender-text/70 hover:bg-white hover:text-lavender-text'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-lavender-text/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search IPOs..." 
            className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl pl-9 pr-4 py-2 text-sm text-lavender-text placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-full sm:w-64"
          />
        </div>
      </div>

      {/* DATA TABLE (Desktop) */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-lavender-base border-b border-lavender-text/10">
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider rounded-tl-2xl">IPO Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Price Band</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">GMP</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider">Est. Listing</th>
                <th className="px-6 py-4 text-xs font-semibold text-lavender-text/70 uppercase tracking-wider text-right rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lavender-text/10">
              {filteredIpos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-lavender-text/60 text-sm">
                    No IPOs found for this category.
                  </td>
                </tr>
              ) : (
                filteredIpos.map(ipo => (
                  <tr key={ipo.id} className="hover:bg-lavender-base transition-colors group">
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
                      <span className="bg-lavender-base border border-lavender-text/10 text-lavender-text/80 px-2 py-1 rounded-md text-[10px] font-medium tracking-wide">
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
        <div className="bg-lavender-base px-6 py-4 border-t border-lavender-text/10 text-xs text-lavender-text/60 flex items-center gap-2 justify-between">
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
