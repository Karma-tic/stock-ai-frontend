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
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Calculator className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">F&O Calculator</h1>
            <p className="text-gray-500 mt-1">Calculate your true Profit & Loss after brokerage and taxes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              
              {/* Toggle Options / Futures */}
              <div className="flex bg-white rounded-lg p-1 mb-6 border border-gray-200">
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tradeType === 'options' ? 'bg-indigo-600 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => setTradeType('options')}
                >
                  Options
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tradeType === 'futures' ? 'bg-indigo-600 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => setTradeType('futures')}
                >
                  Futures
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Quantity (Total shares)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center justify-between">
                    <span>Brokerage per Executed Order (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={brokeragePerOrder}
                    onChange={(e) => setBrokeragePerOrder(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-sm text-stone-600 shadow-sm">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p>This calculator estimates taxes based on standard Indian equity F&O rates. Actual brokerage may vary slightly based on your broker's specific GST policies.</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {results ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Trade Summary</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className={`p-5 rounded-2xl border ${results.netPnL >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-500 text-sm sm:text-base">Net P&L</p>
                      {results.netPnL >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                    </div>
                    <p className={`text-2xl sm:text-3xl font-bold truncate ${results.netPnL >= 0 ? 'text-emerald-400' : 'text-red-600'}`}>
                      {formatCurrency(results.netPnL)}
                    </p>
                    <p className={`text-sm mt-1 ${results.netPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}% ROI
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm sm:text-base mb-2">Gross P&L</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                      {formatCurrency(results.grossPnL)}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Before charges
                    </p>
                  </div>
                </div>

                <div className="flex-grow">
                  <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-400" /> Charges Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">Brokerage</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.brokerage)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">STT/CTT</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.stt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">Exchange Txn Charge</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.exchangeTxn)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">GST (18%)</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.gst)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">SEBI Charges</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.sebiCharges)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-sm">Stamp Duty</span>
                      <span className="text-gray-900 text-sm">{formatCurrency(results.breakdown.stampDuty)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-1">
                      <span className="text-gray-800 font-semibold text-sm">Total Charges</span>
                      <span className="text-indigo-400 font-bold text-sm">{formatCurrency(results.totalCharges)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                <Calculator className="w-16 h-16 text-slate-800 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Trade Details</h3>
                <p className="text-gray-500 max-w-sm">
                  Fill in your buy price, sell price, and quantity on the left to see your actual net profit and detailed tax breakdown.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none mt-16 prose-headings:text-gray-900 prose-a:text-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">What is Futures & Options (F&O) Trading?</h2>
          <p className="mb-6 leading-relaxed">
            Futures and Options (F&O) are derivative instruments traded on stock exchanges like the NSE and BSE in India. Unlike cash market trading where you actually own the underlying shares, F&O allows you to trade contracts that derive their value from an underlying asset (like Nifty 50, BankNifty, or individual stocks like Reliance and HDFC Bank). These instruments are primarily used for hedging against market risk, speculation, and arbitrage.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Understanding Options: Call and Put</h2>
          <p className="mb-4 leading-relaxed">
            Options trading gives the buyer the right, but not the obligation, to buy or sell the underlying asset at a predetermined price (strike price) on or before a specific date (expiry).
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Call Option (CE):</strong> You buy a Call option when you are bullish and expect the market price to go up.</li>
            <li><strong>Put Option (PE):</strong> You buy a Put option when you are bearish and expect the market price to go down.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            In options buying, your risk is limited to the premium paid, while your potential reward is theoretically unlimited. However, most options expire worthless due to <em>Time Decay (Theta)</em>. Options selling (writing), on the other hand, requires a high margin and carries unlimited risk, but sellers benefit from time decay.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">The Hidden Costs of F&O Trading</h2>
          <p className="mb-4 leading-relaxed">
            Many retail traders focus only on Gross Profit and Loss, completely ignoring the massive impact of taxes and statutory charges. In India, F&O trading incurs several fees that eat into your margins:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Brokerage:</strong> Usually a flat fee (e.g., ₹20 per executed order) charged by brokers like Zerodha, Upstox, or Groww.</li>
            <li><strong>Securities Transaction Tax (STT):</strong> A direct tax levied by the government on the sell side. It is 0.1% on the premium for options, and 0.02% on the turnover for futures.</li>
            <li><strong>Exchange Transaction Charges:</strong> Levied by the NSE or BSE. For options, it is generally 0.05% of the premium turnover.</li>
            <li><strong>GST:</strong> 18% Goods and Services Tax applied on the sum of Brokerage, Exchange Transaction Charges, and SEBI charges.</li>
            <li><strong>Stamp Duty:</strong> Charged by the state government, applicable only on the buy side.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Use the Stock AI F&O Calculator</h2>
          <p className="mb-4 leading-relaxed">
            Our F&O Brokerage and Tax calculator helps you find your exact Net P&L.
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Select Trade Type:</strong> Toggle between Options or Futures, as the STT and Exchange charges differ significantly.</li>
            <li><strong>Enter Prices & Quantity:</strong> Enter your Buy Price, Sell Price, and the total quantity (Lot size × Number of lots). For example, Nifty's lot size is currently 50.</li>
            <li><strong>Adjust Brokerage:</strong> Enter the brokerage your specific broker charges per executed order.</li>
          </ol>
          <p className="mb-6 leading-relaxed">
            The calculator will instantly break down every single charge, showing you exactly how much money will actually hit your ledger balance at the end of the day. This is crucial for scalpers who trade for small point movements.
          </p>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mt-8">
            <h3 className="text-yellow-400 font-bold mb-2">SEBI Warning & Disclaimer</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              9 out of 10 individual traders in equity Futures and Options Segment incur net losses. On average, loss makers register net trading loss close to ₹ 50,000. F&O trading carries high risk and is not suitable for everyone. This calculator provides estimates based on standard Indian F&O tax rates; actual amounts may vary slightly. Stock AI does not provide financial advice.
            </p>
          </div>
        </article>

      </div>
    </div>
  );
}
