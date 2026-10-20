// src/components/invest/GlobalTab.tsx — legal routes for investing abroad from India.
import { ArrowRight } from 'lucide-react';
import { LivePayload } from '../../data/investCatalog';
import { LiveTag } from './investShared';

const ROUTES = [
  {
    title: 'Indian international mutual funds',
    body: 'Invest in rupees through an Indian fund house that buys US or global stocks for you. The simplest route: no LRS form and no TCS.',
    flow: ['Your bank (₹)', 'Indian AMC', 'Nasdaq / S&P / global stocks'],
    note: "Best for beginners and SIP investors. Some funds pause new money when the industry's overseas limit fills up.",
    live: 'MON100',
  },
  {
    title: 'Direct US stocks and ETFs via LRS',
    body: 'Send money abroad under the Liberalised Remittance Scheme to a US broker partnered with an Indian app, then buy stocks or ETFs directly, including fractional shares.',
    flow: ['Your bank (₹)', 'LRS remittance', 'US broker ($)', 'Stocks / ETFs'],
    note: 'Lowest ongoing cost and full choice. Mind the 20% TCS above ₹10 lakh a year and the forex spread.',
  },
  {
    title: 'GIFT City (IFSC)',
    body: "India's international financial centre in Gujarat, regulated by IFSCA. Offers USD fixed deposits and feeder funds into global funds.",
    flow: ['Your bank (₹)', 'LRS to IFSC unit', 'USD deposits / global funds'],
    note: 'For larger investors who want dollar assets while staying under Indian regulation.',
  },
  {
    title: 'Indian-listed global ETFs',
    body: 'ETFs on NSE/BSE that track foreign indices, bought through your normal demat account like any Indian share.',
    flow: ['Demat account (₹)', 'NSE / BSE ETF', 'Nasdaq 100 / Hang Seng etc.'],
    note: 'Easy for existing stock investors. Can trade above fair value when fund inflows are capped.',
  },
];

const RULES = [
  <>Each resident, minors included, can send up to <b>USD 250,000</b> abroad per financial year under LRS. The limit resets on 1 April.</>,
  <>Banks collect <b>20% TCS</b> on investment remittances above <b>₹10 lakh</b> a year. You get it back as a credit in your income tax return.</>,
  <>International mutual funds and ETFs bought through an Indian fund house are not LRS remittances and attract no TCS.</>,
  <>Margin products and crypto are not permitted investments under LRS.</>,
  <>Declare every foreign asset in Schedule FA of your ITR, even if it earned nothing.</>,
];

const SOURCES = [
  ['Xflow – LRS guide', 'https://www.xflowpay.com/blog/lrs-liberalized-remittance-scheme'],
  ['Regi Tom Antony & Associates – TCS rules', 'https://www.regitom.com/understanding-the-tcs-rules-for-foreign-remittances-in-india'],
  ['ClearTax – foreign remittance tax', 'https://cleartax.in/s/tax-on-foreign-remittance'],
];

export default function GlobalTab({ live }: { live: LivePayload | null }) {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-lavender-text">Investing outside India, from India</h2>
        <p className="mt-1 text-lavender-text/70">Four legal routes, each with different limits, taxes and paperwork.</p>
        {live?.usd_inr && (
          <p className="mt-3 text-sm text-lavender-text/80 tabular-nums">
            USD/INR right now: <b>₹{live.usd_inr.price.toFixed(2)}</b>
            <span className={live.usd_inr.change_pct >= 0 ? 'ml-2 text-down dark:text-down' : 'ml-2 text-up dark:text-up'}>
              ({live.usd_inr.change_pct >= 0 ? 'rupee weaker' : 'rupee stronger'} {Math.abs(live.usd_inr.change_pct).toFixed(2)}% today)
            </span>
          </p>
        )}
      </div>

      <ol className="grid gap-4 lg:grid-cols-2">
        {ROUTES.map((r, i) => (
          <li key={r.title} className="app-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-lavender text-xs font-bold text-white">{i + 1}</span>
              <h3 className="text-lg font-bold text-lavender-text">{r.title}</h3>
            </div>
            <p className="text-sm text-lavender-text/80">{r.body}</p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {r.flow.map((s, j) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  {j > 0 && <ArrowRight className="h-3 w-3 text-lavender-text/40" />}
                  <span className="rounded-lg bg-lavender-surface px-2 py-1 text-lavender-text/80">{s}</span>
                </span>
              ))}
            </div>
            {r.live && <LiveTag symbol={r.live} quote={live?.prices[r.live]} />}
            <p className="text-sm text-lavender-text/60">{r.note}</p>
          </li>
        ))}
      </ol>

      <section className="app-card p-5 space-y-3">
        <h3 className="text-lg font-bold text-lavender-text">Rules that apply to direct overseas investing</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-lavender-text/85 marker:text-lavender-primary">
          {RULES.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
        <p className="text-xs text-lavender-text/60">
          Sources:{' '}
          {SOURCES.map(([n, u], i) => (
            <span key={u}>{i > 0 && ', '}<a href={u} target="_blank" rel="noopener noreferrer" className="text-lavender-primary underline underline-offset-2">{n}</a></span>
          ))}. Rules as of September 2026.
        </p>
      </section>
    </div>
  );
}
