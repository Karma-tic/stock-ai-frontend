import { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import SEO from './SEO';
import Segmented from './ui/Segmented';
import { ChargesResult, NumberField, ShareResult, useUrlChoice, useUrlNumber } from './calc/CalcKit';

const TYPES = ['options', 'futures'] as const;

// Indian F&O charges (approximate). Formulas unchanged from the previous version.
const OPTION_STT = 0.001; // 0.1% on sell premium
const FUTURE_STT = 0.0002; // 0.02% on sell turnover
const OPTION_EXCHANGE_TXN = 0.0005; // 0.05% on premium turnover
const FUTURE_EXCHANGE_TXN = 0.00002; // 0.002% on turnover
const SEBI_TURNOVER = 0.000001; // ₹10 per crore

export default function FnOCalculator() {
  const [tradeType, setTradeType] = useUrlChoice('type', 'options', TYPES);
  const [buyPrice, setBuyPrice] = useUrlNumber('buy', 0, 0, 10000000);
  const [sellPrice, setSellPrice] = useUrlNumber('sell', 0, 0, 10000000);
  const [quantity, setQuantity] = useUrlNumber('qty', 50, 0, 100000000);
  const [brokeragePerOrder, setBrokeragePerOrder] = useUrlNumber('brokerage', 20, 0, 100000);

  const r = useMemo(() => {
    const buy = buyPrice || 0;
    const sell = sellPrice || 0;
    const qty = quantity || 0;
    if (!buy || !sell || !qty) return null;
    const buyTurnover = buy * qty;
    const sellTurnover = sell * qty;
    const turnover = buyTurnover + sellTurnover;
    const gross = sellTurnover - buyTurnover;
    const brokerage = (brokeragePerOrder || 0) * 2; // buy and sell orders
    const stt = sellTurnover * (tradeType === 'options' ? OPTION_STT : FUTURE_STT);
    const exchangeTxn = turnover * (tradeType === 'options' ? OPTION_EXCHANGE_TXN : FUTURE_EXCHANGE_TXN);
    const sebi = turnover * SEBI_TURNOVER;
    const gst = (brokerage + exchangeTxn + sebi) * 0.18;
    const stamp = buyTurnover * 0.00003; // 0.003% on buy side
    const charges = brokerage + stt + exchangeTxn + sebi + gst + stamp;
    const net = gross - charges;
    return {
      turnover,
      gross,
      net,
      roi: buyTurnover > 0 ? (net / buyTurnover) * 100 : 0,
      rows: [
        { label: 'STT', value: stt },
        { label: 'Exchange transaction charge', value: exchangeTxn },
        { label: 'Brokerage', value: brokerage },
        { label: 'GST (18%)', value: gst },
        { label: 'Stamp duty', value: stamp },
        { label: 'SEBI charges', value: sebi },
      ],
    };
  }, [buyPrice, sellPrice, quantity, brokeragePerOrder, tradeType]);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="F&O Calculator India | Futures and Options Charges Calculator | Stock AI"
        description="Calculate true F&O profit and loss after brokerage, STT, GST, exchange charges, stamp duty, and SEBI charges for Indian derivatives."
        canonicalPath="/tools/fno-calculator"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-accent">
            <Calculator className="h-4 w-4" strokeWidth={1.75} /> Calculator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">F&amp;O calculator</h1>
          <p className="mt-3 text-base text-muted">Your real profit or loss on a futures or options trade after brokerage, STT, GST and exchange charges. The link updates so you can share the result.</p>
        </header>

        <section className="grid gap-8 rounded-card border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="space-y-5">
            <Segmented<(typeof TYPES)[number]>
              label="Instrument"
              value={tradeType}
              onChange={setTradeType}
              options={[
                { value: 'options', label: 'Options' },
                { value: 'futures', label: 'Futures' },
              ]}
            />
            <NumberField label={tradeType === 'options' ? 'Buy premium' : 'Buy price'} prefix="₹" placeholder="e.g. 150" value={buyPrice} onChange={setBuyPrice} />
            <NumberField label={tradeType === 'options' ? 'Sell premium' : 'Sell price'} prefix="₹" placeholder="e.g. 180" value={sellPrice} onChange={setSellPrice} />
            <NumberField label="Quantity (lot size × lots)" placeholder="e.g. 75" value={quantity} onChange={setQuantity} hint="Check your contract's current lot size on NSE." />
            <NumberField label="Brokerage per executed order" prefix="₹" value={brokeragePerOrder} onChange={setBrokeragePerOrder} />
          </div>
          <div className="flex flex-col">
            {r ? (
              <ChargesResult
                rows={r.rows}
                gross={r.gross}
                net={r.net}
                turnover={r.turnover}
                extra={<p className="num mt-1 text-xs text-muted">Return on buy value {r.roi >= 0 ? '+' : '−'}{Math.abs(r.roi).toFixed(2)}%</p>}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-card border border-dashed border-line p-8 text-center">
                <Calculator className="h-8 w-8 text-muted" strokeWidth={1.5} />
                <p className="mt-3 font-semibold text-ink">Enter a trade</p>
                <p className="mt-1 max-w-xs text-sm text-muted">Add a buy price, sell price and quantity to see your net result and every charge.</p>
              </div>
            )}
            {r && (
              <div className="mt-auto flex justify-end pt-5">
                <ShareResult />
              </div>
            )}
          </div>
        </section>
        <p className="mt-4 text-xs text-muted">Approximate rates. Your broker's charges may differ.</p>

        {/* SEO Text Content for AdSense */}
        <article className="calc-article mx-auto mt-16 max-w-[70ch] text-[15px] leading-relaxed text-ink/85">
          <h2 className="text-2xl font-bold mb-4 text-ink">What is Futures & Options (F&O) Trading?</h2>
          <p className="mb-6 leading-relaxed">
            Futures and Options (F&O) are derivative instruments traded on stock exchanges like the NSE and BSE in India. Unlike cash market trading where you actually own the underlying shares, F&O allows you to trade contracts that derive their value from an underlying asset (like Nifty 50, BankNifty, or individual stocks like Reliance and HDFC Bank). These instruments are primarily used for hedging against market risk, speculation, and arbitrage.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">Understanding Options: Call and Put</h2>
          <p className="mb-4 leading-relaxed">
            Options trading gives the buyer the right, but not the obligation, to buy or sell the underlying asset at a predetermined price (strike price) on or before a specific date (expiry).
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Call Option (CE):</strong> You buy a Call option when you are bullish and expect the market price to go up.</li>
            <li><strong>Put Option (PE):</strong> You buy a Put option when you are bearish and expect the market price to go down.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            In options buying, your risk is limited to the premium paid, while your potential reward is theoretically unlimited. However, most options expire worthless due to <em>Time Decay (Theta)</em>. Options selling (writing), on the other hand, requires a high margin and carries unlimited risk, but sellers benefit from time decay.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-ink">The Hidden Costs of F&O Trading</h2>
          <p className="mb-4 leading-relaxed">
            Many retail traders focus only on Gross Profit and Loss, completely ignoring the massive impact of taxes and statutory charges. In India, F&O trading incurs several fees that eat into your margins:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Brokerage:</strong> Usually a flat fee (e.g., ₹20 per executed order) charged by brokers like Zerodha, Upstox, or Groww.</li>
            <li><strong>Securities Transaction Tax (STT):</strong> A direct tax levied by the government on the sell side. It is 0.1% on the premium for options, and 0.02% on the turnover for futures.</li>
            <li><strong>Exchange Transaction Charges:</strong> Levied by the NSE or BSE. For options, it is generally 0.05% of the premium turnover.</li>
            <li><strong>GST:</strong> 18% Goods and Services Tax applied on the sum of Brokerage, Exchange Transaction Charges, and SEBI charges.</li>
            <li><strong>Stamp Duty:</strong> Charged by the state government, applicable only on the buy side.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-ink">How to Use the Stock AI F&O Calculator</h2>
          <p className="mb-4 leading-relaxed">
            Our F&O Brokerage and Tax calculator helps you find your exact Net P&L.
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-ink/85">
            <li><strong>Select Trade Type:</strong> Toggle between Options or Futures, as the STT and Exchange charges differ significantly.</li>
            <li><strong>Enter Prices & Quantity:</strong> Enter your Buy Price, Sell Price, and the total quantity (Lot size × Number of lots). Lot sizes change from time to time, so check the current lot size for your contract on the NSE website.</li>
            <li><strong>Adjust Brokerage:</strong> Enter the brokerage your specific broker charges per executed order.</li>
          </ol>
          <p className="mb-6 leading-relaxed">
            The calculator will instantly break down every single charge, showing you exactly how much money will actually hit your ledger balance at the end of the day. This is crucial for scalpers who trade for small point movements.
          </p>

          <div className="bg-caution/20 border border-caution/30 rounded-card p-6 mt-8">
            <h3 className="text-caution font-bold mb-2">SEBI Warning & Disclaimer</h3>
            <p className="text-sm text-muted leading-relaxed">
              9 out of 10 individual traders in equity Futures and Options Segment incur net losses. On average, loss makers register net trading loss close to ₹ 50,000. F&O trading carries high risk and is not suitable for everyone. This calculator provides estimates based on standard Indian F&O tax rates; actual amounts may vary slightly. Stock AI does not provide financial advice.
            </p>
          </div>
        </article>

      </div>
    </div>
  );
}
