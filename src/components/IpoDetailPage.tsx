import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ExternalLink, Info, TrendingUp } from 'lucide-react';
import { BASE } from '../lib/api';
import SEO from './SEO';
import type { IPO } from './UpcomingIpos';

type Detail = IPO & { source_url?: string; source?: string; issue_price?: number; issue_size?: string; subscription?: string; pe_ratio?: string; allotment_date?: string; listing_date?: string; anchor_available?: boolean; gmp_value?: number; gmp_percent?: number; gmp_low?: number; gmp_high?: number; activity_score?: number; source_updated_at?: string };

const Fact = ({ label, value, accent = false }: { label: string; value?: string | number; accent?: boolean }) => <div className="rounded-2xl border border-lavender-text/10 bg-lavender-base p-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-lavender-text/45">{label}</p><p className={`mt-2 text-base font-bold ${accent ? 'text-emerald-400' : 'text-lavender-text'}`}>{value ?? '—'}</p></div>;

export default function IpoDetailPage() {
  const { id } = useParams();
  const [ipo, setIpo] = useState<Detail>();
  const [error, setError] = useState('');
  useEffect(() => { axios.get(`${BASE}/api/market/ipos/${id}`).then(r => setIpo(r.data.ipo)).catch(() => setError('This IPO record is unavailable right now.')); }, [id]);
  if (error) return <div className="min-h-screen bg-lavender-surface px-6 pt-32 text-center text-rose-400">{error}</div>;
  if (!ipo) return <div className="min-h-screen bg-lavender-surface pt-32 text-center text-lavender-text/60">Loading latest IPO facts…</div>;
  return <div className="min-h-screen bg-lavender-surface pb-20 pt-24"><SEO title={`${ipo.company_name} IPO GMP, Dates and Details | Stock AI`} description={`Latest factual GMP, issue and schedule data for ${ipo.company_name}.`} canonicalPath={`/ipos/${ipo.id}`} />
    <main className="mx-auto max-w-6xl px-4 sm:px-6"><Link to="/ipos" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"><ArrowLeft className="h-4 w-4"/>All IPOs</Link>
      <section className="app-card overflow-hidden"><div className="border-b border-lavender-text/10 bg-gradient-to-br from-violet-500/15 to-emerald-500/5 p-6 sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start"><div><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">{ipo.category || 'IPO'}</span><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">{ipo.status}</span></div><h1 className="text-3xl font-bold text-lavender-text sm:text-4xl">{ipo.company_name}</h1><p className="mt-3 text-sm text-lavender-text/55">Last source update: {ipo.source_updated_at || 'Not available'}</p></div><div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:min-w-56"><p className="text-xs uppercase text-lavender-text/55">Current GMP</p><p className="mt-1 text-3xl font-bold text-emerald-400">{ipo.gmp}</p><p className="mt-2 text-xs text-lavender-text/60">Observed range ₹{ipo.gmp_low ?? 0}–₹{ipo.gmp_high ?? 0}</p></div></div></div>
        <div className="p-5 sm:p-8"><h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-lavender-text"><TrendingUp className="h-5 w-5 text-emerald-400"/>IPO snapshot</h2><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Fact label="Issue price" value={ipo.price_band}/><Fact label="Estimated listing" value={ipo.est_listing_price} accent/><Fact label="Issue size" value={ipo.issue_size}/><Fact label="Lot size" value={ipo.lot_size}/><Fact label="Subscription" value={ipo.subscription}/><Fact label="P/E" value={ipo.pe_ratio}/><Fact label="Anchor" value={ipo.anchor_available ? 'Available' : 'Not indicated'}/><Fact label="GMP activity" value={`${ipo.activity_score || 1}/5`}/></div>
          <h2 className="mb-4 mt-9 flex items-center gap-2 text-lg font-bold text-lavender-text"><CalendarDays className="h-5 w-5 text-violet-400"/>Schedule</h2><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Fact label="Opens" value={ipo.open_date}/><Fact label="Closes" value={ipo.close_date}/><Fact label="Allotment" value={ipo.allotment_date}/><Fact label="Listing" value={ipo.listing_date}/></div>
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-300"/><p className="max-w-3xl text-sm leading-6 text-lavender-text/65">GMP is an unofficial and unregulated market indicator. It can change quickly and must not be treated as a recommendation or a guaranteed listing price.</p></div>{ipo.source_url && <a href={ipo.source_url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-300">View source <ExternalLink className="h-4 w-4"/></a>}</div>
        </div></section>
    </main></div>;
}
