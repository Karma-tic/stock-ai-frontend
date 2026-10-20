// src/components/TrendingStocks.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import AnalysisModal from './AnalysisModal';
import StockRow, { StockRowSkeleton } from './app/StockRow';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
type Side = 'bought' | 'sold';

export default function TrendingStocks() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [side, setSide] = useState<Side>('bought');

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get(`${BASE}/api/market/trending`);
      setData(res.data);
    } catch (e) {
      console.error(e);
      setLoadError(true);
    }
    setLoading(false);
  };

  const stocks: any[] = side === 'bought' ? data?.most_bought || [] : data?.most_sold || [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Today's biggest movers</h2>
          <p className="mt-0.5 text-xs text-muted">Largest moves across 150+ NSE stocks, refreshed every 30 minutes. What happened, not a forecast.</p>
        </div>
        <Segmented<Side>
          label="Movers"
          value={side}
          onChange={setSide}
          options={[
            { value: 'bought', label: '▲ Gainers' },
            { value: 'sold', label: '▼ Losers' },
          ]}
        />
      </div>

      <div className="mt-2">
        {loading ? (
          <StockRowSkeleton rows={8} />
        ) : loadError || stocks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-base font-semibold text-ink">{loadError ? 'Movers could not be loaded' : 'No movers yet today'}</p>
            <p className="mt-1 text-sm text-muted">{loadError ? 'Check your connection and try again.' : 'The list fills in once the market opens at 9:15 am IST.'}</p>
            <Button variant="ghost" className="mt-4" onClick={loadTrending}>
              Retry
            </Button>
          </div>
        ) : (
          <ol>
            {stocks.map((stock: any, index: number) => (
              <li key={stock.display_ticker} className="flex items-center gap-3">
                <span className="num w-6 shrink-0 text-right text-xs text-muted" aria-label={`Rank ${index + 1}`}>
                  {index + 1}
                </span>
                <ul className="min-w-0 flex-1">
                  <StockRow stock={stock} onAnalyze={setSelected} />
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>

      {selected && <AnalysisModal stock={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
