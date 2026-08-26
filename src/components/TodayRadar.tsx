import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, Check, ChevronRight, Clock3, ExternalLink, FileText, Mail, Plus, RefreshCw, Save, Search, ShieldCheck, Target, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteThesis, getEarningsComparison, getEventCalendar, getEventRadar, getNotificationPreferences, getTheses, saveNotificationPreferences, saveThesis } from '../lib/api';

type RadarEvent = {
  id: string; ticker: string; company_name: string; category: string;
  severity: 'low' | 'medium' | 'high' | 'critical'; title: string;
  summary: string; why_matters: string; source_name: string; source_url: string;
  published_at?: string; verified?: boolean;
  extracted_facts?: string[]; event_date?: string;
};

type Thesis = {
  ticker: string; thesis: string; success_conditions: string[];
  invalidation_conditions: string[]; holding_period?: string;
  alerts?: Array<{ condition: string; event: RadarEvent }>;
};

type CalendarEvent = Pick<RadarEvent, 'ticker' | 'company_name' | 'category' | 'title' | 'source_name' | 'source_url' | 'event_date'>;
type EarningsMetric = { key: string; label: string; value: number; qoq_pct?: number | null; yoy_pct?: number | null };

const severityStyle: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  medium: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  low: 'bg-lavender-secondary/10 text-lavender-primary border-lavender-primary/20',
};

function timeAgo(value?: string) {
  if (!value) return 'Recently';
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.floor(diff / 3600000));
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

export default function TodayRadar({ onBrowseStocks }: { onBrowseStocks?: () => void }) {
  const [events, setEvents] = useState<RadarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [editingThesis, setEditingThesis] = useState(false);
  const [thesisText, setThesisText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [riskText, setRiskText] = useState('');
  const [savingThesis, setSavingThesis] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [earnings, setEarnings] = useState<{ period?: string; metrics: EarningsMetric[] } | null>(null);
  const [preferences, setPreferences] = useState({ email_digest: false, high_priority_alerts: false, minimum_severity: 'high' });
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [trackedCount, setTrackedCount] = useState(0);
  const [trackedTickers, setTrackedTickers] = useState<string[]>([]);
  const [readingMinutes, setReadingMinutes] = useState(0);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true); setError('');
    try {
      const [radarResult, thesisResult, calendarResult, preferenceResult] = await Promise.allSettled([getEventRadar(forceRefresh), getTheses(), getEventCalendar(), getNotificationPreferences()]);
      if (radarResult.status === 'rejected') throw radarResult.reason;
      const radarData = radarResult.value.data || {};
      setEvents(radarData.events || []);
      setTrackedCount(radarData.tracked_count || 0);
      setTrackedTickers(radarData.tracked_tickers || []);
      setReadingMinutes(radarData.reading_minutes || 0);
      if (thesisResult.status === 'fulfilled') setTheses(thesisResult.value.data.theses || []);
      if (calendarResult.status === 'fulfilled') setCalendarEvents(calendarResult.value.data.events || []);
      if (preferenceResult.status === 'fulfilled' && preferenceResult.value.data.preferences) setPreferences(preferenceResult.value.data.preferences);
      const leadTicker = radarData.events?.[0]?.ticker;
      setLoading(false);
      if (leadTicker) getEarningsComparison(leadTicker).then(result => setEarnings(result.data)).catch(() => setEarnings(null));
    }
    catch { setError('We could not refresh your radar. Please try again.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const reloadForTrackedStocks = () => load(true);
    window.addEventListener('stock-ai:tracked-stocks-changed', reloadForTrackedStocks);
    return () => window.removeEventListener('stock-ai:tracked-stocks-changed', reloadForTrackedStocks);
  }, [load]);

  const lead = events[0];
  const rest = useMemo(() => events.slice(1, 7), [events]);
  const important = events.filter(e => e.severity === 'critical' || e.severity === 'high').length;
  const currentThesis = theses.find(item => item.ticker === lead?.ticker);
  const formatMetric = (metric: EarningsMetric) => metric.key === 'eps'
    ? `₹${metric.value.toFixed(2)}`
    : `₹${(metric.value / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;

  const openThesisEditor = () => {
    setThesisText(currentThesis?.thesis || '');
    setSuccessText((currentThesis?.success_conditions || []).join('\n'));
    setRiskText((currentThesis?.invalidation_conditions || []).join('\n'));
    setEditingThesis(true);
  };

  const submitThesis = async () => {
    if (!lead || thesisText.trim().length < 10) return;
    setSavingThesis(true);
    try {
      await saveThesis(lead.ticker, {
        thesis: thesisText,
        success_conditions: successText.split('\n').map(item => item.trim()).filter(Boolean),
        invalidation_conditions: riskText.split('\n').map(item => item.trim()).filter(Boolean),
        holding_period: 'Long term',
      });
      setEditingThesis(false);
      setTheses((await getTheses()).data.theses || []);
    } finally { setSavingThesis(false); }
  };

  const removeThesis = async () => {
    if (!lead) return;
    await deleteThesis(lead.ticker);
    setTheses(items => items.filter(item => item.ticker !== lead.ticker));
    setEditingThesis(false);
  };

  const updatePreferences = async (updates: Partial<typeof preferences>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next); setSavingPreferences(true); setPreferencesSaved(false);
    try {
      const response = await saveNotificationPreferences(next);
      setPreferences(response.data.preferences);
      setPreferencesSaved(true);
      window.setTimeout(() => setPreferencesSaved(false), 1800);
    } finally { setSavingPreferences(false); }
  };

  return (
    <main className="min-h-screen bg-lavender-surface pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
        <header id="today" className="mb-6 flex scroll-mt-24 items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-lavender-primary">Your daily radar</p>
            <h1 className="text-2xl font-bold text-lavender-text sm:text-3xl">What changed today</h1>
            <p className="mt-1 text-sm text-lavender-text/60">{loading ? 'Checking your watchlist…' : `${important || events.length} important ${important === 1 ? 'change' : 'changes'} across stocks you follow${readingMinutes ? ` · ${readingMinutes} min read` : ''}`}</p>
          </div>
          <button onClick={() => load(true)} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl border border-lavender-text/10 bg-white px-3 text-sm font-semibold text-lavender-text shadow-sm disabled:opacity-50" aria-label="Refresh event radar">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {error && <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700">{error}</div>}

        {!loading && !lead && trackedCount === 0 ? (
          <section className="app-card p-7 text-center sm:p-10">
            <Search className="mx-auto h-9 w-9 text-lavender-primary" />
            <h2 className="mt-4 text-xl font-bold">Choose what your radar should monitor</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-lavender-text/65">Add companies to your watchlist or portfolio. Today will then filter filings and news for promoter activity, auditor changes, rating downgrades, results and corporate actions.</p>
            <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
              {['Governance & risk alerts', 'Quarterly result changes', 'Dividends, splits & key dates'].map(item => <div key={item} className="rounded-2xl border border-lavender-text/10 bg-lavender-surface p-3 text-xs font-semibold text-lavender-text/75"><ShieldCheck className="mb-2 h-4 w-4 text-lavender-primary" />{item}</div>)}
            </div>
            <button onClick={onBrowseStocks} className="mt-5 inline-flex rounded-xl bg-gradient-lavender px-5 py-2.5 text-sm font-bold text-white">Search and analyze stocks</button>
          </section>
        ) : !loading && !lead ? (
          <section className="app-card p-7 text-center sm:p-10">
            <ShieldCheck className="mx-auto h-10 w-10 text-emerald-600" />
            <h2 className="mt-4 text-xl font-bold">No material changes detected</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-lavender-text/65">We checked {trackedCount} tracked {trackedCount === 1 ? 'company' : 'companies'}{trackedTickers.length ? ` (${trackedTickers.slice(0, 5).join(', ')}${trackedTickers.length > 5 ? '…' : ''})` : ''}. No new high-signal filings or news matched the radar rules.</p>
            <button onClick={() => load(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-lavender-text/15 px-4 py-2 text-sm font-bold text-lavender-text"><RefreshCw className="h-4 w-4" />Check again</button>
          </section>
        ) : lead ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <section className="overflow-hidden rounded-3xl border border-lavender-primary/20 bg-white shadow-sm">
                <div className="border-b border-lavender-text/10 bg-lavender-secondary/10 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyle[lead.severity]}`}>{lead.severity} priority</span>
                    {lead.verified && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" />Source verified</span>}
                  </div>
                  <p className="mt-4 text-sm font-bold text-lavender-primary">{lead.ticker} · {lead.company_name}</p>
                  <h2 className="mt-1 text-xl font-bold leading-snug text-lavender-text sm:text-2xl">{lead.title}</h2>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="rounded-2xl bg-lavender-surface p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-lavender-text/50">Why it matters</p>
                    <p className="mt-1.5 text-sm leading-6 text-lavender-text/80">{lead.why_matters}</p>
                  </div>
                  {(lead.extracted_facts || []).length > 0 && <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wide text-lavender-text/50">Extracted facts</p><ul className="mt-2 space-y-2">{lead.extracted_facts?.slice(0, 3).map(fact => <li key={fact} className="flex gap-2 text-sm leading-5 text-lavender-text/75"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{fact}</span></li>)}</ul></div>}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-lavender-text/55">
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{timeAgo(lead.published_at)} · {lead.source_name}</span>
                    <a href={lead.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold text-lavender-primary hover:underline">Open original source <ExternalLink className="h-3.5 w-3.5" /></a>
                  </div>
                </div>
              </section>

              {earnings?.metrics && earnings.metrics.length > 0 && <section className="app-card p-5 sm:p-6">
                <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-lavender-primary">Latest reported quarter</p><h2 className="mt-1 text-lg font-bold">{lead.ticker} earnings comparison</h2></div><span className="text-xs text-lavender-text/50">{earnings.period}</span></div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{earnings.metrics.slice(0, 4).map(metric => <div key={metric.key} className="rounded-2xl bg-lavender-surface p-3"><p className="text-[11px] font-semibold text-lavender-text/55">{metric.label}</p><p className="mt-1 text-sm font-bold text-lavender-text">{formatMetric(metric)}</p><div className="mt-2 flex gap-2 text-[10px]"><span className={(metric.qoq_pct || 0) >= 0 ? 'text-emerald-700' : 'text-red-600'}>QoQ {metric.qoq_pct == null ? '—' : `${metric.qoq_pct > 0 ? '+' : ''}${metric.qoq_pct}%`}</span><span className={(metric.yoy_pct || 0) >= 0 ? 'text-emerald-700' : 'text-red-600'}>YoY {metric.yoy_pct == null ? '—' : `${metric.yoy_pct > 0 ? '+' : ''}${metric.yoy_pct}%`}</span></div></div>)}</div>
                <p className="mt-3 text-[11px] text-lavender-text/45">Reported financial-statement data · Yahoo Finance</p>
              </section>}

              <section id="timeline" className="app-card scroll-mt-24 p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div><h2 className="text-lg font-bold">Your watchlist timeline</h2><p className="text-xs text-lavender-text/55">Facts first, newest first</p></div>
                  <Bell className="h-5 w-5 text-lavender-primary" />
                </div>
                <div className="divide-y divide-lavender-text/10">
                  {rest.map(event => (
                    <article key={event.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${event.severity === 'critical' ? 'bg-red-500' : event.severity === 'high' ? 'bg-amber-500' : 'bg-lavender-primary'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-lavender-primary">{event.ticker} · {event.category.replace('_', ' ')}</p><span className="shrink-0 text-[11px] text-lavender-text/45">{timeAgo(event.published_at)}</span></div>
                          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-lavender-text">{event.title}</h3>
                          <a href={event.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-lavender-text/60 hover:text-lavender-primary">{event.source_name}<ExternalLink className="h-3 w-3" /></a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section id="calendar" className="app-card scroll-mt-24 p-5">
                <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-lavender-primary" /><h2 className="font-bold">Upcoming events</h2></div>
                {calendarEvents.length > 0 ? <div className="mt-4 space-y-3">{calendarEvents.slice(0, 4).map(event => <a key={`${event.ticker}-${event.event_date}-${event.title}`} href={event.source_url} target="_blank" rel="noreferrer" className="block rounded-xl bg-lavender-surface p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-lavender-primary">{event.ticker}</span><span className="text-[11px] text-lavender-text/50">{event.event_date ? new Date(`${event.event_date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</span></div><p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-lavender-text">{event.title}</p></a>)}</div> : <p className="mt-4 text-sm leading-6 text-lavender-text/65">No confirmed upcoming dates were found in your watchlist sources.</p>}
                <Link to="/market-wrap" className="mt-4 flex items-center justify-between rounded-xl border border-lavender-text/10 px-3 py-3 text-sm font-bold">Open market digest <ChevronRight className="h-4 w-4" /></Link>
              </section>
              <section className="rounded-3xl bg-gradient-to-br from-lavender-primary to-indigo-700 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between"><Mail className="h-5 w-5" />{preferencesSaved && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/80"><Check className="h-3.5 w-3.5" />Saved</span>}</div><h2 className="mt-3 text-lg font-bold">Daily digest</h2>
                <p className="mt-1 text-sm leading-5 text-white/75">A short summary of what changed, with source links. No invented price targets.</p>
                <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold"><span>Weekdays · after market close</span><input type="checkbox" checked={preferences.email_digest} disabled={savingPreferences} onChange={event => updatePreferences({ email_digest: event.target.checked })} className="h-4 w-4 accent-white" aria-label="Email daily digest" /></label>
                <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold"><span>High-priority alerts</span><input type="checkbox" checked={preferences.high_priority_alerts} disabled={savingPreferences} onChange={event => updatePreferences({ high_priority_alerts: event.target.checked })} className="h-4 w-4 accent-white" aria-label="Email high-priority alerts" /></label>
                {preferences.high_priority_alerts && <label className="mt-2 block text-[11px] font-semibold text-white/75">Alert me from
                  <select value={preferences.minimum_severity} disabled={savingPreferences} onChange={event => updatePreferences({ minimum_severity: event.target.value })} className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/10 px-2 py-2 text-xs font-bold text-white outline-none"><option className="text-slate-900" value="medium">Medium priority</option><option className="text-slate-900" value="high">High priority</option><option className="text-slate-900" value="critical">Critical only</option></select>
                </label>}
              </section>
              <section className="app-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><Target className="h-5 w-5 text-lavender-primary" /><h2 className="font-bold">Thesis check · {lead.ticker}</h2></div>
                  {!editingThesis && <button onClick={openThesisEditor} className="rounded-lg p-1.5 text-lavender-primary hover:bg-lavender-surface" aria-label={currentThesis ? 'Edit investment thesis' : 'Add investment thesis'}>{currentThesis ? <FileText className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</button>}
                </div>
                {editingThesis ? (
                  <div className="mt-4 space-y-3">
                    <label className="block text-xs font-bold text-lavender-text/65">Why do you follow or own it?
                      <textarea value={thesisText} onChange={event => setThesisText(event.target.value)} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-lavender-text/15 bg-lavender-surface px-3 py-2 text-sm font-normal outline-none focus:border-lavender-primary" placeholder="My thesis is…" />
                    </label>
                    <label className="block text-xs font-bold text-lavender-text/65">What would confirm it? <span className="font-normal">One per line</span>
                      <textarea value={successText} onChange={event => setSuccessText(event.target.value)} rows={2} className="mt-1.5 w-full resize-none rounded-xl border border-lavender-text/15 bg-lavender-surface px-3 py-2 text-sm font-normal outline-none focus:border-lavender-primary" placeholder="Revenue growth stays above 15%" />
                    </label>
                    <label className="block text-xs font-bold text-lavender-text/65">What would challenge it? <span className="font-normal">One per line</span>
                      <textarea value={riskText} onChange={event => setRiskText(event.target.value)} rows={2} className="mt-1.5 w-full resize-none rounded-xl border border-lavender-text/15 bg-lavender-surface px-3 py-2 text-sm font-normal outline-none focus:border-lavender-primary" placeholder={'Auditor resigns\nCredit rating is downgraded'} />
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={submitThesis} disabled={savingThesis || thesisText.trim().length < 10} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-lavender px-3 py-2 text-xs font-bold text-white disabled:opacity-40"><Save className="h-3.5 w-3.5" />{savingThesis ? 'Saving…' : 'Save thesis'}</button>
                      <button onClick={() => setEditingThesis(false)} className="rounded-xl border border-lavender-text/10 p-2 text-lavender-text/60" aria-label="Cancel"><X className="h-4 w-4" /></button>
                      {currentThesis && <button onClick={removeThesis} className="rounded-xl border border-red-500/20 p-2 text-red-600" aria-label="Delete thesis"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </div>
                ) : currentThesis ? (
                  <div className="mt-3">
                    <p className="text-sm leading-5 text-lavender-text/75">{currentThesis.thesis}</p>
                    {(currentThesis.alerts || []).length > 0 ? <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3"><p className="flex items-center gap-1.5 text-xs font-bold text-amber-700"><AlertTriangle className="h-3.5 w-3.5" />New facts may challenge your thesis</p><p className="mt-1.5 text-xs text-lavender-text/70">{currentThesis.alerts?.[0].condition}</p></div> : <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" />No matching challenge detected in recent events</p>}
                  </div>
                ) : <div className="mt-3"><p className="text-sm leading-5 text-lavender-text/65">Save your reason for following this company and the facts that would change your mind.</p><button onClick={openThesisEditor} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-lavender-primary"><Plus className="h-3.5 w-3.5" />Add my thesis</button></div>}
              </section>
            </aside>
          </div>
        ) : <div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="h-80 animate-pulse rounded-3xl bg-white" /><div className="h-52 animate-pulse rounded-3xl bg-white" /></div>}
      </div>
    </main>
  );
}
