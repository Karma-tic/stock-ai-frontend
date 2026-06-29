import { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';

export default function BrokerageCalculator() {
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1100);
  const [quantity, setQuantity] = useState(100);
  const [tradeType, setTradeType] = useState<'delivery' | 'intraday'>('delivery');
  
  const [turnover, setTurnover] = useState(0);
  const [brokerage, setBrokerage] = useState(0);
  const [stt, setStt] = useState(0);
  const [txnCharge, setTxnCharge] = useState(0);
  const [gst, setGst] = useState(0);
  const [sebiCharge, setSebiCharge] = useState(0);
  const [stampDuty, setStampDuty] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  useEffect(() => {
    const buyValue = buyPrice * quantity;
    const sellValue = sellPrice * quantity;
    const totalTurnover = buyValue + sellValue;
    
    // Approximate discount broker rates (like Zerodha/Groww)
    let calcBrokerage = 0;
    let calcStt = 0;
    let calcStamp = 0;

    if (tradeType === 'delivery') {
      calcBrokerage = 0; // Zero brokerage for delivery
      calcStt = Math.round((buyValue * 0.001) + (sellValue * 0.001)); // 0.1% on both buy and sell
      calcStamp = Math.round(buyValue * 0.00015); // 0.015% on buy side only
    } else {
      // Intraday
      const buyBrokerage = Math.min(20, buyValue * 0.0003);
      const sellBrokerage = Math.min(20, sellValue * 0.0003);
      calcBrokerage = +(buyBrokerage + sellBrokerage).toFixed(2);
      calcStt = Math.round(sellValue * 0.00025); // 0.025% on sell side only
      calcStamp = Math.round(buyValue * 0.00003); // 0.003% on buy side only
    }

    const calcTxn = +(totalTurnover * 0.0000325).toFixed(2); // NSE transaction charge ~0.00325%
    const calcGst = +((calcBrokerage + calcTxn) * 0.18).toFixed(2); // 18% on brokerage and txn charges
    const calcSebi = +(totalTurnover * 0.000001).toFixed(2); // ₹10 per crore

    const totalTaxes = calcBrokerage + calcStt + calcTxn + calcGst + calcSebi + calcStamp;
    const grossProfit = sellValue - buyValue;
    const net = grossProfit - totalTaxes;

    setTurnover(totalTurnover);
    setBrokerage(calcBrokerage);
    setStt(calcStt);
    setTxnCharge(calcTxn);
    setGst(calcGst);
    setSebiCharge(calcSebi);
    setStampDuty(calcStamp);
    setTotalCharges(+totalTaxes.toFixed(2));
    setNetProfit(+net.toFixed(2));

  }, [buyPrice, sellPrice, quantity, tradeType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PieChart className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Brokerage Calculator</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Calculate exactly how much you'll pay in taxes, STT, and brokerage per trade.
          </p>
        </div>

        {/* Interactive Calculator Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 mb-16 shadow-xl flex flex-col md:flex-row gap-10">
          
          {/* Controls */}
          <div className="flex-1 space-y-6">
            
            {/* Trade Type Toggle */}
            <div className="flex p-1 bg-slate-800 rounded-xl mb-6">
              <button 
                onClick={() => setTradeType('delivery')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tradeType === 'delivery' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Delivery (CNC)
              </button>
              <button 
                onClick={() => setTradeType('intraday')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tradeType === 'intraday' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Intraday (MIS)
              </button>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Buy Price (₹)</label>
              <input
                type="number"
                min="0"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Sell Price (₹)</label>
              <input
                type="number"
                min="0"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Quantity (Shares)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="md:w-80 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold text-lg border-b border-slate-700 pb-3 mb-4">Charges Breakdown</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Turnover</span>
                <span className="text-white">{formatCurrency(turnover)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Brokerage</span>
                <span className="text-white">{formatCurrency(brokerage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STT Total</span>
                <span className="text-white">{formatCurrency(stt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exchange Txn Charge</span>
                <span className="text-white">{formatCurrency(txnCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST (18%)</span>
                <span className="text-white">{formatCurrency(gst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SEBI Charges</span>
                <span className="text-white">{formatCurrency(sebiCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stamp Duty</span>
                <span className="text-white">{formatCurrency(stampDuty)}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-700 flex justify-between font-bold">
                <span className="text-red-400">Total Charges</span>
                <span className="text-red-400">{formatCurrency(totalCharges)}</span>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl text-center border ${netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <p className="text-slate-400 text-sm mb-1">Net P&L</p>
              <p className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* SEO Text Content for AdSense */}
        <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-purple-400">
          <h2 className="text-2xl font-bold mb-4 text-white">Why Do You Need a Brokerage Calculator?</h2>
          <p className="mb-6 leading-relaxed">
            When you buy or sell shares in the Indian stock market (NSE or BSE), the price you see on the screen is not the only amount you pay or receive. Every transaction attracts a series of fees, taxes, and statutory charges. A brokerage calculator helps you uncover these hidden costs so you can accurately determine your net profit or loss (Net P&L) before you even place the trade.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Understanding the Charges in Indian Stock Trading</h2>
          <p className="mb-4 leading-relaxed">
            Whether you use a discount broker like Zerodha, Groww, or Upstox, or a full-service broker like HDFC Securities, the statutory charges remain largely the same. Here is a breakdown of what eats into your trading profits:
          </p>
          
          <ul className="list-disc pl-6 mb-6 space-y-3 text-slate-300">
            <li>
              <strong>Brokerage:</strong> This is the fee charged by your stockbroker. Most discount brokers charge zero brokerage for equity delivery (holding shares for more than a day) and a flat fee (e.g., ₹20 or 0.03%, whichever is lower) for intraday trading.
            </li>
            <li>
              <strong>Securities Transaction Tax (STT):</strong> This is a direct tax levied by the Government of India. For equity delivery, STT is 0.1% on both buy and sell orders. For intraday trading, STT is only charged on the sell side (currently 0.025%). This is usually the largest chunk of your trading costs.
            </li>
            <li>
              <strong>Exchange Transaction Charges:</strong> The stock exchanges (NSE/BSE) charge a fee to process your trades. For the NSE, this is typically around 0.00325% of your turnover.
            </li>
            <li>
              <strong>GST (Goods and Services Tax):</strong> The government charges an 18% GST on the sum of your brokerage fee and the exchange transaction charges. GST is not applied to STT or Stamp Duty.
            </li>
            <li>
              <strong>SEBI Turnover Fees:</strong> The Securities and Exchange Board of India (SEBI) charges a tiny regulatory fee of ₹10 per crore (0.0001%) on the turnover.
            </li>
            <li>
              <strong>Stamp Duty:</strong> A state government tax applied only when you buy shares. The rate is 0.015% for delivery and 0.003% for intraday trades.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-white">Intraday (MIS) vs. Delivery (CNC) Charges</h2>
          <p className="mb-6 leading-relaxed">
            As you can see by toggling the options in the calculator, <strong>Intraday trading is significantly cheaper</strong> in terms of taxes. Because intraday traders execute hundreds of trades, the government keeps STT and Stamp Duty very low. However, you pay brokerage on intraday trades. Conversely, equity delivery usually has zero brokerage with discount brokers, but the STT is much higher because the government taxes long-term wealth creation differently.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">How This Impacts Break-Even Points</h2>
          <p className="mb-6 leading-relaxed">
            The break-even point is how much a stock price must move in your favor just to cover the taxes and charges. For example, if you buy ₹10 Lakhs worth of shares in delivery, your total charges could exceed ₹1,500. This means the stock needs to go up by at least ₹1,500 just for you to exit at a "no profit, no loss" scenario. Active traders must use a brokerage calculator to ensure their profit targets are far larger than their transaction costs.
          </p>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mt-8">
            <h3 className="text-purple-400 font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The calculations provided are approximate and based on standard discount broker rates (e.g., Zerodha) as of 2024. Actual charges may vary depending on your specific broker, DP charges (for selling delivery shares), and regulatory updates. Always verify final contract notes provided by your broker.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
