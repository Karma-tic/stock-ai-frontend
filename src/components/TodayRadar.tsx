import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Check, ChevronRight, ExternalLink, FileText, Info, Mail, Plus, RefreshCw, Save, Search, ShieldCheck, Target, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteThesis, getEarningsComparison, getEventCalendar, getEventRadar, getNotificationPreferences, getTheses, saveNotificationPreferences, saveThesis } from '../lib/api';
import { Change } from './ui/Price';

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

// Severity is always an icon and a word, never colour alone.
const SEVERITY: Record<string, { word: string; cls: string; Icon: typeof Info }> = {
  critical: { word: 'Critical', cls: 'text-down', Icon: AlertTriangle },
  high: { word: 'High', cls: 'text-caution', Icon: AlertTriangle },
  medium: { word: 'Medium', cls: 'text-accent', Icon: Info },
  low: { word: 'Low', cls: 'text-muted', Icon: Info },
};

function SeverityTag({ level }: { level: string }) {
  const s = SEVERITY[level] || SEVERITY.low;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${s.cls}`}>
      <s.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      {s.word}
    </span>
  );
}

// ── Filters ──
type Kind = 'all' | 'results' | 'dividends' | 'filings' | 'news';
const KINDS: { id: Kind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'results', label: 'Results' },
  { id: 'dividends', label: 'Dividends' },
  { id: 'filings', label: 'Filings' },
  { id: 'news', label: 'News' },
];
const isFiling = (e: RadarEvent) => /nse|bse|exchange/i.test(e.source_name || '');
function kindOf(e: RadarEvent): Exclude<Kind, 'all'> {
  const c = (e.category || '').toLowerCase();
  if (/earning|result/.test(c)) return 'results';
  if (/dividend|split|bonus|record|corporate_action/.test(c)) return 'dividends';
  return isFiling(e) ? 'filings' : 'news';
}

// ── Market-day placement (IST) ──
const IST = 'Asia/Kolkata';
const istParts = (d: Date) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value || '00';
  return { day: `${g('year')}-${g('month')}-${g('day')}`, mins: Number(g('hour')) * 60 + Number(g('minute')), hhmm: `${g('hour')}:${g('minute')}` };
};
const OPEN = 9 * 60 + 15;
const CLOSE = 15 * 60 + 30;
type Bucket = 'before' | 'market' | 'after';
const BUCKET_LABEL: Record<Bucket, string> = { before: 'Before open', market: 'Market hours, 9:15 to 15:30', after: 'After close' };

function dayLabel(day: string, today: string) {
  if (day === today) return 'Today';
  const y = new Date(`${today}T12:00:00+05:30`);
  y.setDate(y.getDate() - 1);
  if (istParts(y).day === day) return 'Yesterday';
  return new Date(`${day}T12:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function timeAgo(value?: string) {
  if (!value) return 'Recently';
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.floor(diff / 3600000));
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

// ── Detail (sticky panel on desktop, bottom sheet on phones) ──
function EventDetail({ event, earnings, onClose }: { event: RadarEvent; earnings: { period?: string; metrics: EarningsMetric[] } | null; onClose?: () => void }) {
  const fmt = (m: EarningsMetric) => (m.key === 'eps' ? `₹${m.value.toFixed(2)}` : `₹${(m.value / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`);
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SeverityTag level={event.severity} />
          {event.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-up">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Source verified
            </span>
          )}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded-control text-muted hover:bg-ink/[0.06]">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <p className="num mt-3 text-sm font-semibold text-accent">
        {event.ticker} <span className="font-sans font-normal text-muted">· {event.company_name}</span>
      </p>
      <h2 className="mt-1 text-lg font-semibold leading-snug text-ink">{event.title}</h2>
      {event.why_matters && (
        <div className="mt-4 rounded-control bg-surface2/70 p-3">
          <p className="text-xs font-medium text-muted">Why it matters</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/85">{event.why_matters}</p>
        </div>
      )}
      {(event.extracted_facts || []).length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted">Facts from the source</p>
          <ul className="mt-2 space-y-1.5">
            {event.extracted_facts!.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-2 text-sm text-ink/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <span>
          {timeAgo(event.published_at)} · {event.source_name}
        </span>
        <a href={event.source_url} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent">
          Open original source <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      {earnings?.metrics && earnings.metrics.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">Latest reported quarter{earnings.period ? `, ${earnings.period}` : ''}</p>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            {earnings.metrics.slice(0, 4).map((m) => (
              <div key={m.key} className="rounded-control border border-line p-2.5">
                <dt className="text-[11px] text-muted">{m.label}</dt>
                <dd className="num mt-0.5 text-sm font-semibold text-ink">{fmt(m)}</dd>
                {m.yoy_pct != null && <Change value={m.yoy_pct} className="text-[11px]" suffix="% YoY" />}
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[11px] text-muted">Reported financial-statement data · Yahoo Finance</p>
        </div>
      )}
    </div>
  );
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
  const [kind, setKind] = useState<Kind>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
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
    } catch {
      setError('We could not refresh your radar. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const reload = () => load(true);
    window.addEventListener('stock-ai:tracked-stocks-changed', reload);
    return () => window.removeEventListener('stock-ai:tracked-stocks-changed', reload);
  }, [load]);
  // The "Now" line moves with the clock
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(t);
  }, []);

  const filtered = useMemo(() => events.filter((e) => kind === 'all' || kindOf(e) === kind), [events, kind]);
  const selected = useMemo(() => events.find((e) => e.id === selectedId) || filtered[0] || events[0], [events, filtered, selectedId]);
  const important = events.filter((e) => e.severity === 'critical' || e.severity === 'high').length;
  const currentThesis = theses.find((item) => item.ticker === selected?.ticker);

  // Results comparison for the event in focus
  useEffect(() => {
    if (!selected?.ticker) return;
    let alive = true;
    setEarnings(null);
    getEarningsComparison(selected.ticker)
      .then((r) => alive && setEarnings(r.data))
      .catch(() => alive && setEarnings(null));
    return () => {
      alive = false;
    };
  }, [selected?.ticker]);

  // Group: day → bucket → events (newest day first, earliest time first inside a day)
  const today = istParts(now).day;
  const nowMins = istParts(now).mins;
  const groups = useMemo(() => {
    const byDay = new Map<string, { bucket: Bucket; mins: number; hhmm: string; e: RadarEvent }[]>();
    filtered.forEach((e) => {
      const d = new Date(e.published_at || e.event_date || Date.now());
      const p = istParts(d);
      const bucket: Bucket = p.mins < OPEN ? 'before' : p.mins < CLOSE ? 'market' : 'after';
      if (!byDay.has(p.day)) byDay.set(p.day, []);
      byDay.get(p.day)!.push({ bucket, mins: p.mins, hhmm: p.hhmm, e });
    });
    return Array.from(byDay.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([day, items]) => ({ day, items: items.sort((a, b) => a.mins - b.mins) }));
  }, [filtered]);

  const choose = (e: RadarEvent) => {
    setSelectedId(e.id);
    setEditingThesis(false);
    if (window.matchMedia('(max-width: 1023px)').matches) setSheetOpen(true);
  };

  const openThesisEditor = () => {
    setThesisText(currentThesis?.thesis || '');
    setSuccessText((currentThesis?.success_conditions || []).join('\n'));
    setRiskText((currentThesis?.invalidation_conditions || []).join('\n'));
    setEditingThesis(true);
  };
  const submitThesis = async () => {
    if (!selected || thesisText.trim().length < 10) return;
    setSavingThesis(true);
    try {
      await saveThesis(selected.ticker, {
        thesis: thesisText,
        success_conditions: successText.split('\n').map((i) => i.trim()).filter(Boolean),
        invalidation_conditions: riskText.split('\n').map((i) => i.trim()).filter(Boolean),
        holding_period: 'Long term',
      });
      setEditingThesis(false);
      setTheses((await getTheses()).data.theses || []);
    } finally {
      setSavingThesis(false);
    }
  };
  const removeThesis = async () => {
    if (!selected) return;
    await deleteThesis(selected.ticker);
    setTheses((items) => items.filter((i) => i.ticker !== selected.ticker));
    setEditingThesis(false);
  };
  const updatePreferences = async (updates: Partial<typeof preferences>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    setSavingPreferences(true);
    setPreferencesSaved(false);
    try {
      const response = await saveNotificationPreferences(next);
      setPreferences(response.data.preferences);
      setPreferencesSaved(true);
      window.setTimeout(() => setPreferencesSaved(false), 1800);
    } finally {
      setSavingPreferences(false);
    }
  };

  const inputCls = 'mt-1.5 w-full resize-none rounded-control border border-line bg-surface2/60 px-3 py-2 text-sm font-normal text-ink outline-none focus:border-accent/60';

  return (
    <div className="pb-10">
      <header id="today" className="mb-5 flex scroll-mt-24 items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">What changed for your stocks</h1>
          <p className="mt-1 text-sm text-muted">
            {loading
              ? 'Checking your watchlist…'
              : `${important || events.length} important ${(important || events.length) === 1 ? 'change' : 'changes'} across ${trackedCount || 'the'} stocks you follow${readingMinutes ? ` · ${readingMinutes} min read` : ''}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-control border border-line px-3 text-sm font-medium text-ink hover:bg-ink/[0.06] disabled:opacity-50"
          aria-label="Refresh radar"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-card border border-down/25 bg-down/10 p-4 text-sm text-ink">
          {error}
          <button type="button" onClick={() => load(true)} className="min-h-[40px] shrink-0 rounded-control border border-line px-3 text-sm font-semibold">
            Retry
          </button>
        </div>
      )}

      {loading && !events.length ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="skeleton block h-16 w-full" />
            ))}
          </div>
          <span className="skeleton hidden h-72 w-full lg:block" />
        </div>
      ) : !events.length && trackedCount === 0 ? (
        <section className="rounded-card border border-line bg-surface p-7 text-center sm:p-10">
          <Search className="mx-auto h-8 w-8 text-accent" strokeWidth={1.75} />
          <h2 className="mt-4 text-xl font-semibold text-ink">Choose what your radar should watch</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Add companies to your watchlist or portfolio. Today then filters filings and news for results, dividends, rating changes and corporate actions.
          </p>
          <button type="button" onClick={onBrowseStocks} className="mt-5 inline-flex h-11 items-center rounded-control bg-cobalt px-5 text-sm font-semibold text-white">
            Find stocks to follow
          </button>
        </section>
      ) : (
        <>
          {/* Filter chips */}
          <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide" role="group" aria-label="Filter events">
            {KINDS.map((k) => {
              const count = k.id === 'all' ? events.length : events.filter((e) => kindOf(e) === k.id).length;
              return (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={kind === k.id}
                  onClick={() => setKind(k.id)}
                  className={`min-h-[36px] shrink-0 rounded-full border px-3.5 text-sm font-medium transition ${
                    kind === k.id ? 'border-transparent bg-cobalt text-white' : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {k.label} <span className="num text-xs opacity-80">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Timeline */}
            <section aria-label="Timeline" className="rounded-card border border-line bg-surface px-4 py-2 sm:px-5">
              {!filtered.length ? (
                <div className="py-10 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-up" strokeWidth={1.75} />
                  <p className="mt-3 font-semibold text-ink">No material changes for your stocks{kind !== 'all' ? ' in this filter' : ''}</p>
                  {trackedTickers.length > 0 && <p className="mt-1 text-sm text-muted">Checked {trackedTickers.slice(0, 6).join(', ')}{trackedTickers.length > 6 ? '…' : ''}</p>}
                </div>
              ) : (
                groups.map(({ day, items }) => (
                  <div key={day} className="py-3">
                    <h2 className="sticky top-[calc(var(--nav-h,64px)+60px)] z-10 -mx-1 bg-surface px-1 py-1 text-sm font-semibold text-ink">{dayLabel(day, today)}</h2>
                    {(['before', 'market', 'after'] as Bucket[]).map((bucket) => {
                      const rows = items.filter((r) => r.bucket === bucket);
                      const showNow = day === today && ((bucket === 'market' && nowMins >= OPEN && nowMins < CLOSE) || (bucket === 'before' && nowMins < OPEN) || (bucket === 'after' && nowMins >= CLOSE));
                      if (!rows.length && !showNow) return null;
                      const nowIndex = showNow ? rows.findIndex((r) => r.mins > nowMins) : -1;
                      const nowLine = (
                        <li key="now" className="relative flex items-center gap-2 py-1.5 pl-6" aria-label={`Now, ${istParts(now).hhmm}`}>
                          <span className="absolute left-[3px] h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/20" aria-hidden="true" />
                          <span className="num text-[11px] font-semibold text-accent">Now {istParts(now).hhmm}</span>
                          <span className="h-px flex-1 bg-accent/50" aria-hidden="true" />
                        </li>
                      );
                      return (
                        <div key={bucket} className="mt-2">
                          <p className="text-xs font-medium text-muted">{BUCKET_LABEL[bucket]}</p>
                          <ol className="relative mt-1 border-l border-line pl-0">
                            {rows.map((r, i) => {
                              const active = selected?.id === r.e.id;
                              return [
                                showNow && nowIndex === i ? nowLine : null,
                                <li key={r.e.id} className="relative">
                                  <span className={`absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full border-2 border-surface ${active ? 'bg-accent' : 'bg-ink/30'}`} aria-hidden="true" />
                                  <button
                                    type="button"
                                    onClick={() => choose(r.e)}
                                    aria-current={active ? 'true' : undefined}
                                    className={`ml-4 w-[calc(100%-1rem)] rounded-control px-3 py-2.5 text-left transition ${active ? 'bg-accent/10' : 'hover:bg-ink/[0.04]'}`}
                                  >
                                    <span className="flex items-center justify-between gap-3">
                                      <span className="num text-xs font-semibold text-ink">
                                        {r.hhmm} · {r.e.ticker}
                                      </span>
                                      <SeverityTag level={r.e.severity} />
                                    </span>
                                    <span className="mt-1 line-clamp-2 block text-sm text-ink/85">{r.e.title}</span>
                                    <span className="mt-1 block text-[11px] text-muted">
                                      {kindOf(r.e) === 'filings' || isFiling(r.e) ? 'Filing' : kindOf(r.e) === 'results' ? 'Results' : kindOf(r.e) === 'dividends' ? 'Dividend' : 'News'} · {r.e.source_name}
                                    </span>
                                  </button>
                                </li>,
                              ];
                            })}
                            {showNow && nowIndex === -1 ? nowLine : null}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </section>

            {/* Detail panel (desktop) */}
            <aside className="hidden lg:block">
              {selected && (
                <div className="sticky top-[calc(var(--nav-h,64px)+72px)] rounded-card border border-line bg-surface p-5">
                  <EventDetail event={selected} earnings={earnings} />
                </div>
              )}
            </aside>
          </div>

          {/* Detail sheet (phones and tablets) */}
          {sheetOpen && selected && (
            <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Event detail">
              <div className="absolute inset-0 bg-[#0B0F14]/55" onClick={() => setSheetOpen(false)} aria-hidden="true" />
              <div className="board-panel absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-card border-t border-line bg-canvas p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-ink/15" aria-hidden="true" />
                <EventDetail event={selected} earnings={earnings} onClose={() => setSheetOpen(false)} />
              </div>
            </div>
          )}

          {/* Cards below: calendar, digest, thesis */}
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <section id="calendar" className="scroll-mt-24 rounded-card border border-line bg-surface p-5">
              <h2 className="flex items-center gap-2 font-semibold text-ink">
                <CalendarDays className="h-5 w-5 text-accent" strokeWidth={1.75} /> Coming up
              </h2>
              {calendarEvents.length > 0 ? (
                <ul className="mt-3 divide-y divide-line">
                  {calendarEvents.slice(0, 5).map((ev) => (
                    <li key={`${ev.ticker}-${ev.event_date}-${ev.title}`}>
                      <a href={ev.source_url} target="_blank" rel="noreferrer" className="block py-2.5">
                        <span className="flex items-center justify-between gap-2">
                          <span className="num text-xs font-semibold text-ink">{ev.ticker}</span>
                          <span className="num text-[11px] text-muted">
                            {ev.event_date ? new Date(`${ev.event_date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-sm text-ink/85">{ev.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No confirmed upcoming dates in your watchlist sources yet.</p>
              )}
              <Link to="/market-wrap" className="mt-3 flex min-h-[44px] items-center justify-between rounded-control border border-line px-3 text-sm font-medium text-ink">
                Open the market wrap <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-ink">
                  <Mail className="h-5 w-5 text-accent" strokeWidth={1.75} /> Daily digest
                </h2>
                {preferencesSaved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-up">
                    <Check className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">A short summary of what changed, with source links. No price targets.</p>
              <label className="mt-4 flex min-h-[48px] cursor-pointer items-center justify-between gap-3 rounded-control border border-line px-3 text-sm text-ink">
                <span>Weekdays, after market close</span>
                <input type="checkbox" checked={preferences.email_digest} disabled={savingPreferences} onChange={(e) => updatePreferences({ email_digest: e.target.checked })} className="h-4 w-4 accent-cobalt" />
              </label>
              <label className="mt-2 flex min-h-[48px] cursor-pointer items-center justify-between gap-3 rounded-control border border-line px-3 text-sm text-ink">
                <span>High-priority alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.high_priority_alerts}
                  disabled={savingPreferences}
                  onChange={(e) => updatePreferences({ high_priority_alerts: e.target.checked })}
                  className="h-4 w-4 accent-cobalt"
                />
              </label>
              {preferences.high_priority_alerts && (
                <label className="mt-2 block text-xs text-muted">
                  Alert me from
                  <select
                    value={preferences.minimum_severity}
                    disabled={savingPreferences}
                    onChange={(e) => updatePreferences({ minimum_severity: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-control border border-line bg-surface px-2 text-sm text-ink"
                  >
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                    <option value="critical">Critical only</option>
                  </select>
                </label>
              )}
            </section>

            {selected && (
              <section className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 font-semibold text-ink">
                    <Target className="h-5 w-5 text-accent" strokeWidth={1.75} /> Thesis check · <span className="num">{selected.ticker}</span>
                  </h2>
                  {!editingThesis && (
                    <button type="button" onClick={openThesisEditor} className="flex h-10 w-10 items-center justify-center rounded-control text-accent hover:bg-ink/[0.06]" aria-label={currentThesis ? 'Edit thesis' : 'Add thesis'}>
                      {currentThesis ? <FileText className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {editingThesis ? (
                  <div className="mt-3 space-y-3">
                    <label className="block text-xs font-medium text-muted">
                      Why do you follow or own it?
                      <textarea value={thesisText} onChange={(e) => setThesisText(e.target.value)} rows={3} className={inputCls} />
                    </label>
                    <label className="block text-xs font-medium text-muted">
                      What would confirm it? One per line
                      <textarea value={successText} onChange={(e) => setSuccessText(e.target.value)} rows={2} className={inputCls} />
                    </label>
                    <label className="block text-xs font-medium text-muted">
                      What would challenge it? One per line
                      <textarea value={riskText} onChange={(e) => setRiskText(e.target.value)} rows={2} className={inputCls} />
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={submitThesis}
                        disabled={savingThesis || thesisText.trim().length < 10}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-control bg-cobalt px-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" /> {savingThesis ? 'Saving…' : 'Save thesis'}
                      </button>
                      <button type="button" onClick={() => setEditingThesis(false)} className="flex h-11 w-11 items-center justify-center rounded-control border border-line text-muted" aria-label="Cancel">
                        <X className="h-4 w-4" />
                      </button>
                      {currentThesis && (
                        <button type="button" onClick={removeThesis} className="flex h-11 w-11 items-center justify-center rounded-control border border-down/30 text-down" aria-label="Delete thesis">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : currentThesis ? (
                  <div className="mt-3">
                    <p className="text-sm leading-relaxed text-ink/85">{currentThesis.thesis}</p>
                    {(currentThesis.alerts || []).length > 0 ? (
                      <div className="mt-3 rounded-control border border-caution/30 bg-caution/10 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-caution">
                          <AlertTriangle className="h-3.5 w-3.5" /> New facts may challenge your thesis
                        </p>
                        <p className="mt-1 text-xs text-ink/75">{currentThesis.alerts?.[0].condition}</p>
                      </div>
                    ) : (
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-up">
                        <ShieldCheck className="h-3.5 w-3.5" /> No matching challenge in recent events
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-muted">Save why you follow this company and the facts that would change your mind. We flag new events that match.</p>
                    <button type="button" onClick={openThesisEditor} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-control border border-line px-3 text-sm font-medium text-ink">
                      <Plus className="h-4 w-4" /> Add a thesis
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
