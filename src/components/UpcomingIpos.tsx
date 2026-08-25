import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Info, Search, TrendingUp } from 'lucide-react';
import { BASE } from '../lib/api';

export interface IPO {
  id: string; company_name: string; symbol: string; price_band: string; open_date: string;
  close_date: string; gmp: string; est_listing_price?: string; lot_size?: string; status?: string;
  category?: string; gmp_percent?: number; gmp_low?: number; gmp_high?: number; activity_score?: number;
  subscription?: string; issue_size?: string; listing_date?: string; source_updated_at?: string;
}

const IPO_CACHE_KEY = 'byteplay:ipos:v1';
const IPO_FILTER_KEY = 'byteplay:ipos:filters:v1';
const IPO_CACHE_TTL = 5 * 60 * 1000;

type IpoCache = { data: IPO[]; cachedAt: number };

function readIpoCache(): IpoCache | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(IPO_CACHE_KEY) || 'null');
    return Array.isArray(parsed?.data) ? parsed : null;
  } catch {
    return null;
  }
}

function readFilters() {
  try {
    return JSON.parse(sessionStorage.getItem(IPO_FILTER_KEY) || 'null') || {};
  } catch {
    return {};
  }
}

function Score({ value = 1 }: { value?: number }) {
  return <span className="inline-flex items-center gap-1.5" title={`GMP activity ${value} out of 5`}><Activity className="h-3.5 w-3.5 text-violet-400" /><span className="flex gap-0.5">{[1,2,3,4,5].map(i => <i key={i} className={`h-1.5 w-3 rounded-full ${i <= value ? 'bg-violet-400' : 'bg-lavender-text/15'}`} />)}</span></span>;
}

export default function UpcomingIpos({ compact = false }: { compact?: boolean }) {
  const initialCache = useMemo(() => readIpoCache(), []);
  const initialFilters = useMemo(() => readFilters(), []);
  const [ipos, setIpos] = useState<IPO[]>(initialCache?.data || []);
  const [loading, setLoading] = useState(!initialCache?.data?.length);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(initialFilters.filter || 'All');
  const [search, setSearch] = useState(initialFilters.search || '');

  useEffect(() => {
    const cache = readIpoCache();
    const cacheIsFresh = cache && Date.now() - cache.cachedAt < IPO_CACHE_TTL;
    if (cacheIsFresh) {
      setLoading(false);
      return;
    }

    axios.get(`${BASE}/api/market/ipos`).then(r => {
      if (r.data.status === 'success' && Array.isArray(r.data.ipos)) {
        setIpos(r.data.ipos);
        setError('');
        sessionStorage.setItem(IPO_CACHE_KEY, JSON.stringify({ data: r.data.ipos, cachedAt: Date.now() }));
      } else if (!cache?.data?.length) {
        setError(r.data.message || 'IPO data is temporarily unavailable.');
      }
    }).catch(() => {
      if (!cache?.data?.length) setError('IPO data is temporarily unavailable.');
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!compact) sessionStorage.setItem(IPO_FILTER_KEY, JSON.stringify({ filter, search }));
  }, [compact, filter, search]);
  const visible = useMemo(() => ipos.filter(ipo => (filter === 'All' || ipo.category === filter) && `${ipo.company_name} ${ipo.symbol}`.toLowerCase().includes(search.toLowerCase())), [ipos, filter, search]);
  const badge = (status = 'Upcoming') => <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${status.toLowerCase().includes('open') ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400' : 'border-violet-400/20 bg-violet-400/10 text-violet-300'}`}>{status}</span>;

  if (loading) return <div className="py-14 text-center text-sm text-lavender-text/60">Refreshing live IPO data…</div>;
  if (error) return <div className="py-14 text-center text-sm text-rose-400">{error}</div>;

  if (compact) return <div className="grid gap-3 md:grid-cols-3">{visible.slice(0,3).map(ipo => <Link to={`/ipos/${ipo.id}`} key={ipo.id} className="app-card group p-5 transition hover:-translate-y-0.5 hover:border-violet-400/30">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-bold text-lavender-text group-hover:text-violet-300">{ipo.company_name}</h3><p className="mt-1 text-xs text-lavender-text/50">{ipo.category || 'IPO'}</p></div>{badge(ipo.status)}</div>
    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-lavender-text/10 pt-4"><div><p className="text-[10px] uppercase text-lavender-text/45">Price</p><b className="text-sm text-lavender-text">{ipo.price_band}</b></div><div><p className="text-[10px] uppercase text-lavender-text/45">Live GMP</p><b className="text-sm text-emerald-400">{ipo.gmp}</b></div></div>
    <div className="mt-4 flex items-center justify-between"><Score value={ipo.activity_score} /><ArrowRight className="h-4 w-4 text-lavender-text/40 group-hover:text-violet-300" /></div>
  </Link>)}</div>;

  return <div className="space-y-5">
    <div className="app-card flex flex-wrap items-center justify-between gap-3 p-3"><div className="flex gap-2">{['All','Mainboard','SME'].map(x => <button key={x} onClick={() => setFilter(x)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${filter === x ? 'bg-violet-500 text-white' : 'bg-lavender-base text-lavender-text/70'}`}>{x}</button>)}</div><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-lavender-text/40" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IPOs" className="rounded-xl border border-lavender-text/10 bg-white py-2 pl-9 pr-3 text-sm text-lavender-text outline-none focus:border-violet-400" /></label></div>
    <div className="grid gap-3 md:hidden">{visible.map(ipo => <Link key={ipo.id} to={`/ipos/${ipo.id}`} className="app-card p-4"><div className="flex justify-between gap-3"><b className="text-lavender-text">{ipo.company_name}</b>{badge(ipo.status)}</div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><span><small className="block text-lavender-text/45">Price</small>{ipo.price_band}</span><span><small className="block text-lavender-text/45">GMP</small><b className="text-emerald-400">{ipo.gmp}</b></span><span><small className="block text-lavender-text/45">Listing</small>{ipo.listing_date || 'TBA'}</span></div><div className="mt-4 flex justify-between"><Score value={ipo.activity_score}/><ArrowRight className="h-4 w-4 text-violet-300" /></div></Link>)}</div>
    <div className="app-card hidden overflow-x-auto md:block"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="border-b border-lavender-text/10 bg-lavender-base text-[11px] uppercase text-lavender-text/55"><tr>{['Name','GMP','Activity','Sub','Price','Issue size','Lot','Open','Close','Allotment','Listing','Updated'].map(h => <th key={h} className="px-4 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-lavender-text/10">{visible.map(ipo => <tr key={ipo.id} className="hover:bg-lavender-base"><td className="px-4 py-4"><Link to={`/ipos/${ipo.id}`} className="font-bold text-lavender-text hover:text-violet-300">{ipo.company_name}</Link><small className="mt-1 block text-lavender-text/45">{ipo.category}</small></td><td className="px-4 py-4 font-bold text-emerald-400"><TrendingUp className="mr-1 inline h-3.5 w-3.5" />{ipo.gmp}</td><td className="px-4 py-4"><Score value={ipo.activity_score}/></td><td className="px-4 py-4">{ipo.subscription || '-'}</td><td className="px-4 py-4">{ipo.price_band}</td><td className="px-4 py-4">{ipo.issue_size || '-'}</td><td className="px-4 py-4">{ipo.lot_size || '-'}</td><td className="px-4 py-4">{ipo.open_date}</td><td className="px-4 py-4">{ipo.close_date}</td><td className="px-4 py-4">{(ipo as any).allotment_date || '-'}</td><td className="px-4 py-4">{ipo.listing_date || '-'}</td><td className="px-4 py-4 text-xs text-lavender-text/50">{ipo.source_updated_at || '-'}</td></tr>)}</tbody></table></div>
    <div className="flex items-start gap-2 text-xs text-lavender-text/55"><Info className="mt-0.5 h-4 w-4 shrink-0"/><p>GMP is unofficial, unregulated and indicative—not a listing guarantee. Data attributed to InvestorGain; verify facts and complete your own due diligence.</p></div>
  </div>;
}
