// src/components/TrackRecord.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, History, X } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import Segmented from './ui/Segmented';
import { Change } from './ui/Price';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface SignalOutcome {
  id: string;
  ticker: string;
  signal: string;
  confidence: number;
  entry_price: number;
  price_at_check: number;
  pct_change: number;
  was_correct: boolean;
  signal_date: string;
  check_date: string;
}
type Filter = 'ALL' | 'BUY' | 'HOLD' | 'SELL';
const money = (v: number) => `₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function TrackRecord() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('ALL');

  useEffect(() => {
    axios
      .get(`${BASE}/api/track-record`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const signals: SignalOutcome[] = data?.signals || [];
  const filtered = filter === 'ALL' ? signals : signals.filter((s) => s.signal === filter);
  const buy = data?.breakdown?.BUY;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Stock AI Track Record | Public Signal Accuracy"
        description="See the public track record for Stock AI signals, including accuracy, average BUY return, and automatically checked signal outcomes."
        canonicalPath="/track-record"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Track record"
          icon={History}
          title="Every AI read, checked 7 days later"
          intro="Nothing is hidden and nothing is removed. Each read is compared with the closing price a week later, automatically."
        />

        {loading ? (
          <div aria-hidden="true">
            <span className="skeleton block h-28" />
            <span className="skeleton mt-6 block h-64" />
          </div>
        ) : !data || data.total_signals === 0 ? (
          <p className="rounded-card border border-dashed border-line p-10 text-center text-sm text-muted">The public record is still being built. The first checked reads appear 7 days after they are made.</p>
        ) : (
          <>
            <section className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
              <div className="bg-surface p-5">
                <p className="text-xs text-muted">Overall accuracy</p>
                <p className="num mt-1 text-3xl font-semibold text-ink">{data.overall_accuracy}%</p>
                <p className="num mt-1 text-xs text-muted">{data.total_signals} reads checked</p>
              </div>
              <div className="bg-surface p-5">
                <p className="text-xs text-muted">Average move after a buy read</p>
                <p className="mt-1 text-3xl font-semibold">
                  <Change value={Number(data.avg_buy_return) || 0} />
                </p>
                <p className="mt-1 text-xs text-muted">Per read, 7 days later</p>
              </div>
              <div className="bg-surface p-5">
                <p className="text-xs text-muted">Buy reads that were right</p>
                <p className="num mt-1 text-3xl font-semibold text-ink">{buy?.accuracy ?? 0}%</p>
                <p className="num mt-1 text-xs text-muted">
                  {buy?.correct ?? 0} of {buy?.total ?? 0}
                </p>
              </div>
            </section>

            <section className="mt-8 rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-ink">Every checked read</h2>
                <Segmented<Filter>
                  label="Filter by read"
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { value: 'ALL', label: 'All' },
                    { value: 'BUY', label: 'Buy' },
                    { value: 'HOLD', label: 'Hold' },
                    { value: 'SELL', label: 'Sell' },
                  ]}
                />
              </div>

              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">No {filter.toLowerCase()} reads checked yet.</p>
              ) : (
                <>
                  {/* Phones: rows */}
                  <ul className="mt-2 md:hidden">
                    {filtered.map((s) => (
                      <li key={s.id} className="border-b border-line py-3 last:border-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="num font-semibold text-ink">
                            {s.ticker} <span className="font-sans text-xs font-normal text-muted">{s.signal.toLowerCase()} · {s.confidence}%</span>
                          </p>
                          <Result ok={s.was_correct} />
                        </div>
                        <p className="num mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                          {money(s.entry_price)} → {money(s.price_at_check)} <Change value={Number(s.pct_change) || 0} className="text-xs" /> · {s.signal_date}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {/* Larger screens: table */}
                  <div className="mt-3 hidden overflow-x-auto md:block">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-line text-xs text-muted">
                        <tr>
                          {['Stock', 'Read', 'Confidence', 'Price then', '7 days later', 'Change', 'Result', 'Date'].map((h) => (
                            <th key={h} scope="col" className="whitespace-nowrap px-3 py-2.5 font-medium first:pl-0">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {filtered.map((s) => (
                          <tr key={s.id} className="hover:bg-ink/[0.03]">
                            <td className="num py-3 pl-0 pr-3 font-semibold text-ink">{s.ticker}</td>
                            <td className="px-3 py-3 text-ink/85">{s.signal.charAt(0) + s.signal.slice(1).toLowerCase()}</td>
                            <td className="num px-3 py-3 text-ink/85">{s.confidence}%</td>
                            <td className="num px-3 py-3 text-ink/85">{money(s.entry_price)}</td>
                            <td className="num px-3 py-3 text-ink/85">{money(s.price_at_check)}</td>
                            <td className="px-3 py-3">
                              <Change value={Number(s.pct_change) || 0} />
                            </td>
                            <td className="px-3 py-3">
                              <Result ok={s.was_correct} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-muted">{s.signal_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>

            {data.disclaimer && <p className="mt-6 text-xs text-muted">{data.disclaimer}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function Result({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-up/10 px-2 py-0.5 text-xs font-semibold text-up">
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Right
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-down/10 px-2 py-0.5 text-xs font-semibold text-down">
      <X className="h-3.5 w-3.5" strokeWidth={2.5} /> Wrong
    </span>
  );
}
