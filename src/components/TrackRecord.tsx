// src/components/TrackRecord.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';
import SEO from './SEO';

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

export default function TrackRecord() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'HOLD' | 'SELL'>('ALL');

  useEffect(() => {
    axios.get(`${BASE}/api/track-record`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 bg-lavender-surface rounded" />
          <div className="h-32 bg-lavender-surface rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data || data.total_signals === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-lavender-text mb-2">Track Record</h1>
        <p className="text-lavender-text/70">
          We're still building our public track record. Check back soon.
        </p>
      </div>
    );
  }

  const signals: SignalOutcome[] = data.signals || [];
  const filtered = filter === 'ALL'
    ? signals
    : signals.filter(s => s.signal === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="Stock AI Track Record | Public Signal Accuracy"
        description="See the public track record for Stock AI signals, including accuracy, average BUY return, and automatically checked signal outcomes."
        canonicalPath="/track-record"
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-lavender-text mb-3">
          Our Public Track Record
        </h1>
        <p className="text-lavender-text/70 max-w-2xl mx-auto">
          Every AI signal we generate is automatically checked 7 days later.
          Nothing is hidden, nothing is removed. This is the real, unfiltered result.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-6 text-center">
          <p className="text-lavender-text/70 text-sm mb-1">Overall Accuracy</p>
          <p className="text-4xl font-black text-lavender-primary">
            {data.overall_accuracy}%
          </p>
          <p className="text-lavender-text/60 text-xs mt-1">
            {data.total_signals} signals tracked
          </p>
        </div>
        <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-6 text-center">
          <p className="text-lavender-text/70 text-sm mb-1">Avg Return on BUY</p>
          <p className={`text-4xl font-black ${data.avg_buy_return >= 0 ? 'text-up' : 'text-down'}`}>
            {data.avg_buy_return >= 0 ? '+' : ''}{data.avg_buy_return}%
          </p>
          <p className="text-lavender-text/60 text-xs mt-1">
            Per signal, 7 days later
          </p>
        </div>
        <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-6 text-center">
          <p className="text-lavender-text/70 text-sm mb-1">BUY Accuracy</p>
          <p className="text-4xl font-black text-up">
            {data.breakdown?.BUY?.accuracy ?? 0}%
          </p>
          <p className="text-lavender-text/60 text-xs mt-1">
            {data.breakdown?.BUY?.correct ?? 0}/{data.breakdown?.BUY?.total ?? 0} correct
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['ALL', 'BUY', 'HOLD', 'SELL'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${
              filter === f
                ? 'bg-gradient-lavender text-white'
                : 'bg-lavender-surface text-lavender-text/70 hover:text-lavender-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-lavender-surface text-lavender-text/70 text-left">
              <th className="p-3">Stock</th>
              <th className="p-3">Signal</th>
              <th className="p-3">Conf</th>
              <th className="p-3">Entry</th>
              <th className="p-3">7d Later</th>
              <th className="p-3">Change</th>
              <th className="p-3">Result</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-white/50">
                <td className="p-3 font-bold text-lavender-text">{s.ticker}</td>
                <td className="p-3">
                  <span className={`font-semibold ${
 s.signal === 'BUY' ? 'text-up' :
 s.signal === 'SELL' ? 'text-down' : 'text-caution'
 }`}>
                    {s.signal}
                  </span>
                </td>
                <td className="p-3 text-lavender-text/80">{s.confidence}%</td>
                <td className="p-3 text-lavender-text/80">₹{s.entry_price}</td>
                <td className="p-3 text-lavender-text/80">₹{s.price_at_check}</td>
                <td className={`p-3 font-semibold ${s.pct_change >= 0 ? 'text-up' : 'text-down'}`}>
                  {s.pct_change >= 0 ? '+' : ''}{s.pct_change}%
                </td>
                <td className="p-3">
                  {s.was_correct ? (
                    <span className="flex items-center gap-1 text-up">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-down">
                      <XCircle className="w-4 h-4" /> Wrong
                    </span>
                  )}
                </td>
                <td className="p-3 text-lavender-text/60">{s.signal_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-lavender-text/60 py-10">
          No {filter} signals tracked yet.
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-lavender-text/60 text-xs mt-8 text-center max-w-2xl mx-auto">
        {data.disclaimer}
      </p>
    </div>
  );
}
