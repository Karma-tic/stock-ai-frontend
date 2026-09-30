import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { InvestLive, InvestRates, changeClass, fmtINR, fmtPct, fmtRate, fmtTimeIST, useApi } from './hooks';

const QUOTES: { key: string; label: string; symbol: string }[] = [
  { key: 'NIFTYBEES', label: 'Nifty 50 ETF', symbol: 'NIFTYBEES' },
  { key: 'GOLDBEES', label: 'Gold ETF', symbol: 'GOLDBEES' },
  { key: 'MON100', label: 'Nasdaq 100 ETF', symbol: 'MON100' },
];

function Row({ label, sub, value, change }: { label: string; sub: string; value?: string; change?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/50">{sub}</p>
      </div>
      <div className="text-right tabular-nums">
        {value ? (
          <>
            <p className="text-sm font-semibold text-white">{value}</p>
            {change !== undefined && <p className={`text-xs font-medium ${changeClass(change)}`}>{fmtPct(change)}</p>}
          </>
        ) : (
          <div className="space-y-1.5">
            <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
            <div className="ml-auto h-3 w-10 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveMarketCard() {
  const live = useApi<InvestLive>('/api/invest/live');
  const rates = useApi<InvestRates>('/api/invest/rates');

  const fd = rates.data?.rates.bank_fd?.[0];
  const ppf = rates.data?.rates.small_savings?.find((r) => r.key === 'ppf');
  const scss = rates.data?.rates.small_savings?.find((r) => r.key === 'scss');
  const ratesStale = rates.data?.status?.small_savings?.stale;

  if (live.status === 'error' && rates.status === 'error') {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-sm text-white/70 backdrop-blur-xl">
        Live prices are unavailable right now.{' '}
        <Link to="/invest" className="font-semibold text-white underline underline-offset-4">Compare investments</Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0c1b]/40 p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Markets right now
        </p>
        {live.data?.fetched_at && (
          <p className="text-xs tabular-nums text-white/50">Updated {fmtTimeIST(live.data.fetched_at)}</p>
        )}
      </div>

      <div className="mt-3 divide-y divide-white/10">
        {QUOTES.map((q) => {
          const quote = live.data?.prices[q.key];
          return (
            <Row
              key={q.key}
              label={q.label}
              sub={q.symbol}
              value={quote ? fmtINR(quote.price) : undefined}
              change={quote?.change_pct}
            />
          );
        })}
        <Row
          label="US dollar"
          sub="USD/INR"
          value={live.data?.usd_inr ? fmtINR(live.data.usd_inr.price) : undefined}
          change={live.data?.usd_inr?.change_pct}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-white/[0.05] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Best guaranteed rates</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Top bank FD', value: fd?.rate },
            { label: 'Senior Citizen', value: scss?.rate },
            { label: 'PPF', value: ppf?.rate },
          ].map((r) => (
            <div key={r.label} className="min-w-0">
              <p className="text-lg font-bold tabular-nums text-white">{r.value !== undefined ? fmtRate(r.value) : '—'}</p>
              <p className="truncate text-[11px] text-white/55">{r.label}</p>
            </div>
          ))}
        </div>
        {ratesStale && <p className="mt-3 text-[11px] text-amber-300/90">New quarterly rates are being confirmed.</p>}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[11px] leading-snug text-white/45">Last traded prices. Not a recommendation.</p>
        <Link to="/invest" className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-white hover:text-teal-200">
          Compare all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
