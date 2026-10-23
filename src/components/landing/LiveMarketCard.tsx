import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Price, { Change } from '../ui/Price';
import Skeleton from '../ui/Skeleton';
import { InvestLive, InvestRates, fmtRate, fmtTimeIST, useApi } from './hooks';

const QUOTES: { key: string; label: string; symbol: string }[] = [
  { key: 'NIFTYBEES', label: 'Nifty 50 ETF', symbol: 'NIFTYBEES' },
  { key: 'GOLDBEES', label: 'Gold ETF', symbol: 'GOLDBEES' },
  { key: 'MON100', label: 'Nasdaq 100 ETF', symbol: 'MON100' },
];

function Row({ label, sub, value, change, thread }: { label: string; sub: string; value?: number; change?: number; thread?: boolean }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-4 py-2.5" data-thread-target={thread ? '' : undefined}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{label}</p>
        <p className="num text-xs text-muted">{sub}</p>
      </div>
      <div className="text-right">
        {value !== undefined ? (
          <>
            <Price value={value} className="block text-sm font-semibold text-ink" />
            {change !== undefined && <Change value={change} className="text-xs font-medium" />}
          </>
        ) : (
          <div className="space-y-1.5">
            <Skeleton className="ml-auto h-3.5 w-16" />
            <Skeleton className="ml-auto h-3 w-10" />
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
      <div className="min-h-[200px] rounded-card border border-line bg-surface/80 p-6 text-sm text-muted backdrop-blur">
        Live prices are unavailable right now.{' '}
        <Link to="/invest" className="font-semibold text-ink underline underline-offset-4">
          Compare investments
        </Link>
      </div>
    );
  }

  return (
    // Fixed minimum height so the card never shifts the layout while data loads.
    <div data-thread-card="" className="min-h-[430px] rounded-card border border-line bg-surface/85 p-5 shadow-lift backdrop-blur-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-up" aria-hidden="true" />
          Markets right now
        </p>
        <p className="num min-h-[16px] text-xs text-muted">{live.data?.fetched_at ? `Updated ${fmtTimeIST(live.data.fetched_at)}` : ''}</p>
      </div>

      <div className="mt-3 divide-y divide-line">
        {QUOTES.map((q) => {
          const quote = live.data?.prices[q.key];
          return <Row key={q.key} thread label={q.label} sub={q.symbol} value={quote?.price} change={quote?.change_pct} />;
        })}
        <Row label="US dollar" sub="USD/INR" value={live.data?.usd_inr?.price} change={live.data?.usd_inr?.change_pct} />
      </div>

      {rates.status !== 'error' && (
      <div className="mt-4 rounded-control bg-surface2/70 p-4">
        <p className="text-xs font-medium text-muted">Best guaranteed rates</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Top bank FD', value: fd?.rate },
            { label: 'Senior Citizen', value: scss?.rate },
            { label: 'PPF', value: ppf?.rate },
          ].map((r) => (
            <div key={r.label} className="min-w-0">
              <p className="num text-lg font-semibold text-ink">{r.value !== undefined ? fmtRate(r.value) : <Skeleton className="mx-auto mt-1 h-5 w-14" />}</p>
              <p className="truncate text-[11px] text-muted">{r.label}</p>
            </div>
          ))}
        </div>
        {ratesStale && <p className="mt-3 text-[11px] text-caution">New quarterly rates are being confirmed.</p>}
      </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[11px] leading-snug text-muted">Last traded prices. Not a recommendation.</p>
        <Link to="/invest" className="group inline-flex min-h-[44px] shrink-0 items-center gap-1 text-sm font-semibold text-accent">
          Compare all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
