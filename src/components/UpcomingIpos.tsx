import { useEffect, useMemo, useState } from 'react';
import { blankToNull, fmtDay, fmtDayRange, fmtRange } from '../lib/format';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Search } from 'lucide-react';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';
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
  return (
    <span className="inline-flex items-center gap-0.5" title={`Grey-market activity ${value} out of 5`} aria-label={`Grey-market activity ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`h-1.5 w-2.5 rounded-full ${i <= value ? 'bg-cobalt' : 'bg-ink/15'}`} />
      ))}
    </span>
  );
}

type IpoState = 'open' | 'listed' | 'closed' | 'upcoming';

function getIpoState(status = 'Upcoming'): IpoState {
  const normalized = status.trim().toLowerCase();
  if (normalized.includes('listed')) return 'listed';
  if (normalized.includes('open')) return 'open';
  if (normalized.includes('closed')) return 'closed';
  return 'upcoming';
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
  const visible = useMemo(() => ipos.filter(ipo => {
    const matchesFilter = filter === 'All'
      || (filter === 'Open Now' ? getIpoState(ipo.status) === 'open' : ipo.category === filter);
    return matchesFilter && `${ipo.company_name} ${ipo.symbol}`.toLowerCase().includes(search.toLowerCase());
  }), [ipos, filter, search]);
  const badge = (status = 'Upcoming') => {
    const state = getIpoState(status);
    const tone =
      state === 'open' ? 'bg-up/10 text-up' : state === 'listed' ? 'bg-ink/[0.06] text-muted' : state === 'closed' ? 'bg-caution/10 text-caution' : 'bg-accent/10 text-accent';
    return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{status}</span>;
  };
  const gmpTone = (gmp?: string) => (/^\s*-/.test(gmp || '') ? 'text-down' : /^\s*(₹\s*)?0(\.0+)?\s*(\(|$)/.test(gmp || '') || !gmp ? 'text-muted' : 'text-up');

  if (loading)
    return (
      <div aria-hidden="true" className="space-y-2 py-2">
        {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
          <span key={i} className="skeleton block h-16" />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted">{error}</p>
        <Button variant="ghost" className="mt-3" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );

  if (compact)
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {visible.slice(0, 3).map((ipo) => (
          <Link to={`/ipos/${ipo.id}`} key={ipo.id} className="group rounded-card border border-line bg-surface p-5 transition hover:border-accent/40">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-ink group-hover:text-accent">{ipo.company_name}</h3>
                <p className="mt-0.5 text-xs text-muted">{ipo.category || 'IPO'}</p>
              </div>
              {badge(ipo.status)}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <div>
                <dt className="text-xs text-muted">Price band</dt>
                <dd className="num text-sm font-medium text-ink">{fmtRange(ipo.price_band)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Grey-market premium</dt>
                <dd className={`num text-sm font-medium ${gmpTone(ipo.gmp)}`}>{ipo.gmp || 'n/a'}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between">
              <Score value={ipo.activity_score} />
              <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" />
            </div>
          </Link>
        ))}
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<string>
          label="Filter IPOs"
          value={filter}
          onChange={setFilter}
          options={['All', 'Open Now', 'Mainboard', 'SME'].map((x) => ({ value: x, label: x === 'Open Now' ? 'Open now' : x }))}
        />
        <label className="relative w-full sm:w-56">
          <span className="sr-only">Search IPOs</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search IPOs"
            className="h-10 w-full rounded-control border border-line bg-canvas pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">No IPOs match this filter.</p>
      ) : (
        <>
          {/* Phones: rows */}
          <ul className="mt-2 md:hidden">
            {visible.map((ipo) => (
              <li key={ipo.id} className="border-b border-line last:border-0">
                <Link to={`/ipos/${ipo.id}`} className="block py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{ipo.company_name}</p>
                      <p className="text-xs text-muted">
                        {ipo.category || 'IPO'} · {fmtDayRange(ipo.open_date, ipo.close_date)}
                      </p>
                    </div>
                    {badge(ipo.status)}
                  </div>
                  <div className="num mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-muted">
                      Price <span className="text-ink">{fmtRange(ipo.price_band)}</span>
                    </span>
                    <span className="text-muted">
                      GMP <span className={gmpTone(ipo.gmp)}>{ipo.gmp || 'n/a'}</span>
                    </span>
                    {blankToNull(ipo.subscription) && (
                      <span className="text-muted">
                        Subscribed <span className="text-ink">{ipo.subscription}</span>
                      </span>
                    )}
                    <Score value={ipo.activity_score} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Larger screens: table */}
          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-line text-xs text-muted">
                <tr>
                  {['IPO', 'GMP', 'Activity', 'Subscribed', 'Price band', 'Issue size', 'Lot', 'Opens', 'Closes', 'Allotment', 'Listing', 'Updated'].map((h) => (
                    <th key={h} scope="col" className="whitespace-nowrap px-3 py-3 font-medium first:pl-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((ipo) => (
                  <tr key={ipo.id} className="transition-colors hover:bg-ink/[0.03]">
                    <td className="py-3 pl-0 pr-3">
                      <Link to={`/ipos/${ipo.id}`} className="font-semibold text-ink hover:text-accent">
                        {ipo.company_name}
                      </Link>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted">{ipo.category}</span>
                        {badge(ipo.status)}
                      </div>
                    </td>
                    <td className={`num whitespace-nowrap px-3 py-3 font-medium ${gmpTone(ipo.gmp)}`}>{ipo.gmp || 'n/a'}</td>
                    <td className="px-3 py-3">
                      <Score value={ipo.activity_score} />
                    </td>
                    <td className="num px-3 py-3 text-ink/85">{ipo.subscription || '–'}</td>
                    <td className="num whitespace-nowrap px-3 py-3 text-ink/85">{fmtRange(ipo.price_band)}</td>
                    <td className="num whitespace-nowrap px-3 py-3 text-ink/85">{ipo.issue_size || '–'}</td>
                    <td className="num px-3 py-3 text-ink/85">{ipo.lot_size || '–'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink/85">{fmtDay(ipo.open_date)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink/85">{fmtDay(ipo.close_date)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink/85">{(ipo as any).allotment_date || '–'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink/85">{ipo.listing_date || '–'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">{ipo.source_updated_at || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Grey-market premium (GMP) is unofficial and unregulated. It is not a listing price guarantee. Data from InvestorGain; check the exchange documents before you apply.
      </p>
    </div>
  );
}
