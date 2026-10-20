import { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import SEO from './SEO';
import Segmented from './ui/Segmented';
import { ChargesResult, NumberField, ShareResult, useUrlChoice, useUrlNumber } from './calc/CalcKit';

const TYPES = ['delivery', 'intraday'] as const;

export default function BrokerageCalculator() {
  const [tradeType, setTradeType] = useUrlChoice('type', 'delivery', TYPES);
  const [buyPrice, setBuyPrice] = useUrlNumber('buy', 1000, 0, 10000000);
  const [sellPrice, setSellPrice] = useUrlNumber('sell', 1100, 0, 10000000);
  const [quantity, setQuantity] = useUrlNumber('qty', 100, 0, 100000000);

  // Approximate discount-broker rates. Formulas unchanged from the previous version.
  const r = useMemo(() => {
    const buyValue = buyPrice * quantity;
    const sellValue = sellPrice * quantity;
    const turnover = buyValue + sellValue;
    let brokerage = 0;
    let stt = 0;
    let stamp = 0;
    if (tradeType === 'delivery') {
      brokerage = 0; // zero brokerage for delivery
      stt = Math.round(buyValue * 0.001 + sellValue * 0.001); // 0.1% on buy and sell
      stamp = Math.round(buyValue * 0.00015); // 0.015% on buy side
    } else {
      brokerage = +(Math.min(20, buyValue * 0.0003) + Math.min(20, sellValue * 0.0003)).toFixed(2);
      stt = Math.round(sellValue * 0.00025); // 0.025% on sell side
      stamp = Math.round(buyValue * 0.00003); // 0.003% on buy side
    }
    const txn = +(turnover * 0.0000325).toFixed(2); // NSE transaction charge about 0.00325%
    const gst = +((brokerage + txn) * 0.18).toFixed(2); // 18% on brokerage and transaction charges
    const sebi = +(turnover * 0.000001).toFixed(2); // ₹10 per crore
    const charges = brokerage + stt + txn + gst + sebi + stamp;
    const gross = sellValue - buyValue;
    return {
      turnover,
      gross,
      net: +(gross - charges).toFixed(2),
      rows: [
        { label: 'STT', value: stt },
        { label: 'Brokerage', value: brokerage },
        { label: 'Exchange transaction charge', value: txn },
        { label: 'GST (18%)', value: gst },
        { label: 'Stamp duty', value: stamp },
        { label: 'SEBI charges', value: sebi },
      ],
    };
  }, [buyPrice, sellPrice, quantity, tradeType]);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Brokerage Calculator India | STT, GST and Trading Charges | Stock AI"
        description="Calculate Indian equity delivery and intraday brokerage, STT, exchange charges, GST, stamp duty, SEBI charges, and net P&L."
        canonicalPath="/tools/brokerage-calculator"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-accent">
            <PieChart className="h-4 w-4" strokeWidth={1.75} /> Calculator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">Brokerage calculator</h1>
          <p className="mt-3 text-base text-muted">See exactly what a trade costs in STT, brokerage, GST and other charges, and what you keep. The link updates so you can share the result.</p>
        </header>

        <section className="grid gap-8 rounded-card border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="space-y-5">
            <Segmented<(typeof TYPES)[number]>
              label="Trade type"
              value={tradeType}
              onChange={setTradeType}
              options={[
                { value: 'delivery', label: 'Delivery (CNC)' },
                { value: 'intraday', label: 'Intraday (MIS)' },
              ]}
            />
            <NumberField label="Buy price" prefix="₹" value={buyPrice} onChange={setBuyPrice} />
            <NumberField label="Sell price" prefix="₹" value={sellPrice} onChange={setSellPrice} />
            <NumberField label="Quantity (shares)" value={quantity} onChange={setQuantity} />
            <p className="text-xs text-muted">Rates approximate a typical discount broker. Your broker's charges may differ.</p>
          </div>
          <div className="flex flex-col">
            <ChargesResult rows={r.rows} gross={r.gross} net={r.net} turnover={r.turnover} />
            <div className="mt-auto flex justify-end pt-5">
              <ShareResult />
            </div>
          </div>
        </section>

        {/* SEO Text Content for AdSense */}
        <article className="calc-article mx-auto mt-16 max-w-[70ch] text-[15px] leading-relaxed text-ink/85">
          <h2 className="text-2xl font-bold mb-4 text-ink">Why Do You Need a Brokerage Calculator?</h2>
          <p className="mb-6 leading-relaxed">
            When you buy or sell shares in the Indian stock market (NSE or BSE), the price you see on the screen is not the only amount you pay or receive. Every transaction attracts a series of fees, taxes, and statutory charges. A brokerage calculator helps you uncover these hidden costs so you can accurately determine your net profit or loss (Net P&L) before you even place the trade.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">Understanding the Charges in Indian Stock Trading</h2>
          <p className="mb-4 leading-relaxed">
            Whether you use a discount broker like Zerodha, Groww, or Upstox, or a full-service broker like HDFC Securities, the statutory charges remain largely the same. Here is a breakdown of what eats into your trading profits:
          </p>
          
          <ul className="list-disc pl-6 mb-6 space-y-3 text-ink/85">
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

          <h2 className="text-2xl font-bold mb-4 text-ink">Intraday (MIS) vs. Delivery (CNC) Charges</h2>
          <p className="mb-6 leading-relaxed">
            As you can see by toggling the options in the calculator, <strong>Intraday trading is significantly cheaper</strong> in terms of taxes. Because intraday traders execute hundreds of trades, the government keeps STT and Stamp Duty very low. However, you pay brokerage on intraday trades. Conversely, equity delivery usually has zero brokerage with discount brokers, but the STT is much higher because the government taxes long-term wealth creation differently.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">How This Impacts Break-Even Points</h2>
          <p className="mb-6 leading-relaxed">
            The break-even point is how much a stock price must move in your favor just to cover the taxes and charges. For example, if you buy ₹10 Lakhs worth of shares in delivery, your total charges could exceed ₹1,500. This means the stock needs to go up by at least ₹1,500 just for you to exit at a "no profit, no loss" scenario. Active traders must use a brokerage calculator to ensure their profit targets are far larger than their transaction costs.
          </p>

          <div className="rounded-card border border-line bg-surface p-6 mt-8">
            <h3 className="text-ink font-bold mb-2">Important Notes</h3>
            <p className="text-sm text-muted leading-relaxed">
              The calculations provided are approximate and based on standard discount broker rates (e.g., Zerodha) as of 2024. Actual charges may vary depending on your specific broker, DP charges (for selling delivery shares), and regulatory updates. Always verify final contract notes provided by your broker.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
