import { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FnOCalculator() {
  const [tradeType, setTradeType] = useState<'options' | 'futures'>('options');
  const [buyPrice, setBuyPrice] = useState<number | ''>('');
  const [sellPrice, setSellPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(50); // Default Nifty lot size is 50
  const [brokeragePerOrder, setBrokeragePerOrder] = useState<number>(20);

  // Constants for Indian F&O Taxes (approx)
  const OPTION_STT = 0.001; // 0.1% on sell premium
  const FUTURE_STT = 0.0002; // 0.02% on sell turnover
  const OPTION_EXCHANGE_TXN = 0.0005; // 0.05% on premium turnover
  const FUTURE_EXCHANGE_TXN = 0.00002; // 0.002% on turnover
  const SEBI_TURNOVER = 0.000001; // ₹10 per crore

  const results = useMemo(() => {
    const buy = Number(buyPrice) || 0;
    const sell = Number(sellPrice) || 0;
    const qty = Number(quantity) || 0;
    const brk = Number(brokeragePerOrder) || 0;

    if (!buy || !sell || !qty) return null;

    const buyTurnover = buy * qty;
    const sellTurnover = sell * qty;
    const totalTurnover = buyTurnover + sellTurnover;
    
    // Gross P&L
    const grossPnL = sellTurnover - buyTurnover;
    
    // Taxes & Charges
    const brokerage = brk * 2; // Buy & Sell
    
    let stt = 0;
    let exchangeTxn = 0;
    
    if (tradeType === 'options') {
      stt = sellTurnover * OPTION_STT;
      exchangeTxn = totalTurnover * OPTION_EXCHANGE_TXN;
    } else {
      stt = sellTurnover * FUTURE_STT;
      exchangeTxn = totalTurnover * FUTURE_EXCHANGE_TXN;
    }
    
    const sebiCharges = totalTurnover * SEBI_TURNOVER;
    const gst = (brokerage + exchangeTxn + sebiCharges) * 0.18; // 18% GST on brokerage + exchange + sebi
    const stampDuty = buyTurnover * 0.00003; // 0.003% on buy side only

    const totalCharges = brokerage + stt + exchangeTxn + sebiCharges + gst + stampDuty;
    const netPnL = grossPnL - totalCharges;

    // ROI calculation (assuming capital is buy turnover for long trade)
    const roi = buyTurnover > 0 ? (netPnL / buyTurnover) * 100 : 0;

    return {
      grossPnL,
      netPnL,
      totalCharges,
      breakdown: {
        brokerage,
        stt,
        exchangeTxn,
        gst,
        stampDuty,
        sebiCharges
      },
      turnover: totalTurnover,
      roi
    };
  }, [buyPrice, sellPrice, quantity, brokeragePerOrder, tradeType]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Calculator className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">F&O Calculator</h1>
            <p className="text-slate-400 mt-1">Calculate your true Profit & Loss after brokerage and taxes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              
              {/* Toggle Options / Futures */}
              <div className="flex bg-slate-950 rounded-lg p-1 mb-6 border border-slate-800">
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tradeType === 'options' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  onClick={() => setTradeType('options')}
                >
                  Options
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tradeType === 'futures' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  onClick={() => setTradeType('futures')}
                >
                  Futures
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Quantity (Total shares)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center justify-between">
                    <span>Brokerage per Executed Order (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={brokeragePerOrder}
                    onChange={(e) => setBrokeragePerOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3 text-sm text-blue-200">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p>This calculator estimates taxes based on standard Indian equity F&O rates. Actual brokerage may vary slightly based on your broker's specific GST policies.</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {results ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-6">Trade Summary</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className={`p-5 rounded-2xl border ${results.netPnL >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-400 text-sm sm:text-base">Net P&L</p>
                      {results.netPnL >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold truncate ${results.netPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(results.netPnL)}
                    </p>
                    <p className={`text-sm mt-1 ${results.netPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}% ROI
                    </p>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm sm:text-base mb-2">Gross P&L</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white truncate">
                      {formatCurrency(results.grossPnL)}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Before charges
                    </p>
                  </div>
                </div>

                <div className="flex-grow">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-400" /> Charges Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Brokerage</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.brokerage)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">STT/CTT</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.stt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Exchange Txn Charge</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.exchangeTxn)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">GST (18%)</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.gst)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">SEBI Charges</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.sebiCharges)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Stamp Duty</span>
                      <span className="text-white text-sm">{formatCurrency(results.breakdown.stampDuty)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-1">
                      <span className="text-slate-200 font-semibold text-sm">Total Charges</span>
                      <span className="text-indigo-400 font-bold text-sm">{formatCurrency(results.totalCharges)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                <Calculator className="w-16 h-16 text-slate-800 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Enter Trade Details</h3>
                <p className="text-slate-400 max-w-sm">
                  Fill in your buy price, sell price, and quantity on the left to see your actual net profit and detailed tax breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
