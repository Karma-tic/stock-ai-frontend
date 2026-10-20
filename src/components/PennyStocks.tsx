// src/components/PennyStocks.tsx
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import AnalysisModal from './AnalysisModal';
import StockRow, { StockRowSkeleton } from './app/StockRow';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

type Sort = 'move' | 'price' | 'name';

export default function PennyStocks() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [sort, setSort] = useState<Sort>('move');

  useEffect(() => {
    loadPennyStocks();
  }, []);

  const loadPennyStocks = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get(`${BASE}/api/market/penny-stocks`);
      setStocks(res.data.stocks || []);
    } catch (e) {
      console.error(e);
      setLoadError(true);
    }
    setLoading(false);
  };

  const sorted = useMemo(() => {
    const list = [...stocks];
    if (sort === 'move') list.sort((a, b) => Math.abs(b.price_change_pct || 0) - Math.abs(a.price_change_pct || 0));
    if (sort === 'price') list.sort((a, b) => (a.current_price || 0) - (b.current_price || 0));
    if (sort === 'name') list.sort((a, b) => String(a.display_ticker).localeCompare(String(b.display_ticker)));
    return list;
  }, [stocks, sort]);

  const upCount = stocks.filter((s) => (s.price_change_pct || 0) > 0).length;
  const downCount = stocks.filter((s) => (s.price_change_pct || 0) < 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Penny stocks under ₹100</h2>
          {!loading && stocks.length > 0 && (
            <p className="num mt-0.5 text-xs text-muted">
              {stocks.length} stocks · <span className="text-up">▲ {upCount} up</span> · <span className="text-down">▼ {downCount} down</span> today
            </p>
          )}
        </div>
        {!loading && stocks.length > 1 && (
          <Segmented<Sort>
            label="Sort penny stocks"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'move', label: 'Biggest move' },
              { value: 'price', label: 'Lowest price' },
              { value: 'name', label: 'A–Z' },
            ]}
          />
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-control bg-caution/10 px-3 py-2.5 text-xs leading-relaxed text-ink/85">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution" strokeWidth={2} />
        <span>
          Low-priced shares often trade thinly and can swing sharply. A low price does not mean a stock is cheap. Read the filings before you act.
        </span>
      </p>

      <div className="mt-2">
        {loading ? (
          <StockRowSkeleton rows={8} />
        ) : loadError ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted">Penny stock prices could not be loaded.</p>
            <Button variant="ghost" className="mt-3" onClick={loadPennyStocks}>
              Retry
            </Button>
          </div>
        ) : stocks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-base font-semibold text-ink">No penny stocks right now</p>
            <p className="mt-1 text-sm text-muted">Prices refresh during market hours. Check back after 9:15 am IST.</p>
          </div>
        ) : (
          <ul>
            {sorted.map((stock: any) => (
              <StockRow key={stock.display_ticker} stock={stock} onAnalyze={setSelected} />
            ))}
          </ul>
        )}
      </div>

      {selected && <AnalysisModal stock={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
