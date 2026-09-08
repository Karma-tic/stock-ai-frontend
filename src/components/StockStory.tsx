import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, Eye, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { getStockStory } from '../lib/api';

type Evidence = { title: string; summary: string; category: string; severity: string; source_name: string; source_url: string; published_at: string; why_matters: string; verified: boolean };
type Story = { company_name: string; price_context: { current_price?: number; day_change_pct?: number; position_in_52w?: number; week52_high?: number; week52_low?: number }; trend?: { status: string; returns_pct?: Record<string, number | null>; drawdown_from_52w_high_pct?: number | null }; earnings: { period?: string; metrics: { label: string; change_pct: number; basis: string }[] }; evidence: { support: Evidence[]; challenge: Evidence[]; watch: Evidence[] }; watch_next: string[]; disclaimer: string; generated_at: string };

const EvidenceList = ({ title, tone, items }: { title: string; tone: 'support' | 'challenge' | 'watch'; items: Evidence[] }) => {
  const colors = tone === 'support' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600' : tone === 'challenge' ? 'border-red-500/20 bg-red-500/5 text-red-600' : 'border-lavender-primary/20 bg-lavender-primary/5 text-lavender-primary';
  return <section className={`rounded-2xl border p-4 ${colors}`}>
    <h3 className="font-bold">{title}</h3>
    {items.length ? <div className="mt-3 space-y-3">{items.map(item => <a key={`${item.source_url}-${item.title}`} href={item.source_url} target="_blank" rel="noopener noreferrer" className="block rounded-xl bg-white/70 p-3 transition hover:bg-white">
      <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-lavender-text">{item.title}</p><ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" /></div>
      <p className="mt-1 text-xs leading-5 text-lavender-text/65">{item.why_matters}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-lavender-text/45">{item.source_name}{item.verified ? ' · source verified' : ''}</p>
    </a>)}</div> : <p className="mt-2 text-sm text-lavender-text/60">No source-linked evidence was found in the latest scan.</p>}
  </section>;
};

export default function StockStory({ ticker }: { ticker: string }) {
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getStockStory(ticker).then(response => active && setStory(response.data)).catch(() => active && setError(true));
    return () => { active = false; };
  }, [ticker]);

  if (error) return null;
  if (!story) return <section className="app-card mb-10 flex items-center gap-2 p-5 text-sm text-lavender-text/60"><Loader2 className="h-4 w-4 animate-spin" />Building source-linked Stock Story…</section>;
  const p = story.price_context;
  return <section className="app-card mb-10 overflow-hidden">
    <div className="border-b border-lavender-text/10 p-5 sm:p-6"><div className="flex items-start gap-3"><span className="rounded-xl bg-lavender-primary/10 p-2 text-lavender-primary"><Eye className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-primary">Evidence-led research</p><h2 className="mt-1 text-2xl font-black text-lavender-text">Stock Story: what changed and what to watch</h2><p className="mt-2 text-sm leading-6 text-lavender-text/65">A source-linked view of current context. It does not predict the next price move.</p></div></div></div>
    <div className="p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-3"><div className="app-tile p-4"><p className="text-xs text-lavender-text/50">Latest price</p><p className="mt-1 text-lg font-bold text-lavender-text">{p.current_price ? `₹${p.current_price.toLocaleString('en-IN')}` : 'Unavailable'}</p></div><div className="app-tile p-4"><p className="text-xs text-lavender-text/50">Today</p><p className={`mt-1 inline-flex items-center gap-1 text-lg font-bold ${(p.day_change_pct || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{(p.day_change_pct || 0) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{p.day_change_pct == null ? 'N/A' : `${p.day_change_pct}%`}</p></div><div className="app-tile p-4"><p className="text-xs text-lavender-text/50">52-week position</p><p className="mt-1 text-lg font-bold text-lavender-text">{p.position_in_52w == null ? 'N/A' : `${p.position_in_52w}% of range`}</p></div></div>
      {story.trend?.status === 'available' && <div className="mt-4 rounded-2xl border border-lavender-text/10 p-4"><div className="flex items-baseline justify-between gap-2"><p className="font-bold text-lavender-text">Observed price trend</p><p className="text-xs text-lavender-text/50">Not a forecast</p></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{Object.entries(story.trend.returns_pct || {}).map(([period, value]) => <div key={period} className="app-tile p-3"><p className="text-xs uppercase text-lavender-text/50">{period}</p><p className={`mt-1 font-bold ${(value || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{value == null ? 'N/A' : `${value >= 0 ? '+' : ''}${value}%`}</p></div>)}<div className="app-tile p-3"><p className="text-xs text-lavender-text/50">From 52W high</p><p className="mt-1 font-bold text-red-600">{story.trend.drawdown_from_52w_high_pct == null ? 'N/A' : `${story.trend.drawdown_from_52w_high_pct}%`}</p></div></div></div>}
      {story.earnings.metrics.length > 0 && <div className="mt-5 rounded-2xl bg-lavender-base p-4"><p className="text-sm font-bold text-lavender-text">Latest reported earnings context</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{story.earnings.metrics.slice(0, 3).map(metric => <div key={metric.label} className="rounded-xl bg-white p-3"><p className="text-xs text-lavender-text/50">{metric.label} · {metric.basis}</p><p className={`mt-1 font-bold ${metric.change_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{metric.change_pct >= 0 ? '+' : ''}{metric.change_pct}%</p></div>)}</div></div>}
      <div className="mt-5 grid gap-4 lg:grid-cols-3"><EvidenceList title="Evidence supporting the case" tone="support" items={story.evidence.support} /><EvidenceList title="Evidence challenging the case" tone="challenge" items={story.evidence.challenge} /><EvidenceList title="Developments to watch" tone="watch" items={story.evidence.watch} /></div>
      <div className="mt-5 rounded-2xl border border-lavender-primary/20 bg-lavender-primary/5 p-4"><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lavender-primary" /><div><h3 className="font-bold text-lavender-text">What to watch next</h3><ul className="mt-2 space-y-1.5 text-sm leading-6 text-lavender-text/70">{story.watch_next.map(item => <li key={item}>• {item}</li>)}</ul></div></div></div>
      <p className="mt-4 flex gap-2 text-xs leading-5 text-lavender-text/50"><AlertTriangle className="h-4 w-4 shrink-0" />{story.disclaimer}</p>
    </div>
  </section>;
}
