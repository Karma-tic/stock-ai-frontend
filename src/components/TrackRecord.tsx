// src/components/TrackRecord.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

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
          <div className="h-10 w-64 bg-slate-800 rounded" />
          <div className="h-32 bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data || data.total_signals === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Track Record</h1>
        <p className="text-slate-400">
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

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white mb-3">
          Our Public Track Record
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Every AI signal we generate is automatically checked 7 days later.
          Nothing is hidden, nothing is removed. This is the real, unfiltered result.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-1">Overall Accuracy</p>
          <p className="text-4xl font-black text-blue-400">
            {data.overall_accuracy}%
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {data.total_signals} signals tracked
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-1">Avg Return on BUY</p>
          <p className={`text-4xl font-black ${data.avg_buy_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.avg_buy_return >= 0 ? '+' : ''}{data.avg_buy_return}%
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Per signal, 7 days later
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-1">BUY Accuracy</p>
          <p className="text-4xl font-black text-green-400">
            {data.breakdown?.BUY?.accuracy ?? 0}%
          </p>
          <p className="text-slate-500 text-xs mt-1">
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
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-left">
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
              <tr key={s.id} className="border-t border-slate-700">
                <td className="p-3 font-bold text-white">{s.ticker}</td>
                <td className="p-3">
                  <span className={`font-semibold ${
                    s.signal === 'BUY' ? 'text-green-400' :
                    s.signal === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {s.signal}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{s.confidence}%</td>
                <td className="p-3 text-slate-300">₹{s.entry_price}</td>
                <td className="p-3 text-slate-300">₹{s.price_at_check}</td>
                <td className={`p-3 font-semibold ${s.pct_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {s.pct_change >= 0 ? '+' : ''}{s.pct_change}%
                </td>
                <td className="p-3">
                  {s.was_correct ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="w-4 h-4" /> Wrong
                    </span>
                  )}
                </td>
                <td className="p-3 text-slate-500">{s.signal_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-10">
          No {filter} signals tracked yet.
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-slate-500 text-xs mt-8 text-center max-w-2xl mx-auto">
        {data.disclaimer}
      </p>
    </div>
  );
}