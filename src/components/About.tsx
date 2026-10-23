import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import { ButtonLink } from './ui/Button';

const DOES = [
  { title: 'Evidence Board', desc: 'For any NSE stock, the points that support it and the points that worry, side by side. Each point links to the filing, article or data it came from.' },
  { title: 'Today', desc: 'Exchange filings and news for the stocks you follow, in time order, with why each one matters and a link to the original.' },
  { title: 'Stock pages', desc: 'Live price, a price chart, key numbers and the latest source-linked events for each company.' },
  { title: 'Watchlist and portfolio', desc: 'Follow companies and track what you own: live value, profit or loss, and how your money is spread.' },
  { title: 'Market wrap and alerts', desc: 'A one-minute summary after each market close, and email when something material happens to a stock you follow.' },
  { title: 'Invest Explorer and calculators', desc: 'Every way to invest from India compared on return, risk, lock-in and tax, plus SIP, lumpsum, brokerage and F&O calculators.' },
];

const STEPS = [
  { title: 'Collect', desc: 'Live price and valuation data, official NSE and BSE filings, and recent news from several publications.' },
  { title: 'Summarise', desc: 'An AI model reads the material and writes the supporting and concerning points. It can only cite items we fetched, so it cannot invent a source.' },
  { title: 'Link', desc: 'Every point carries the link to its filing, article or data, so you can check it in one tap.' },
  { title: 'You decide', desc: 'We do not give buy or sell calls, price targets or stop losses. The decision, and the research behind it, stay with you.' },
];

const SOURCES = [
  { name: 'NSE India', url: 'https://www.nseindia.com', desc: 'Corporate announcements, results, board meetings and market data' },
  { name: 'BSE India', url: 'https://www.bseindia.com', desc: 'Listed company disclosures and corporate actions' },
  { name: 'Screener.in', url: 'https://www.screener.in', desc: 'Fundamentals such as P/E, EPS, book value and dividend yield' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', desc: 'Historical closing prices for charts and returns' },
  { name: 'News publications', url: 'https://news.google.com', desc: 'Recent coverage from Business Standard, Mint, Economic Times, Moneycontrol and others' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="About"
        icon={Info}
        title="Stock research with the sources attached"
        intro="Stock AI, by BytePlay, helps Indian investors understand what is happening to a company and why, with every claim linked to where it came from. Research, not tips."
      />

      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">Why we built it</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-ink/85">
          <p>Following a stock properly means reading exchange filings, results and news from several places, after work, with little time. Most shortcuts on offer are tips with a target price and no reasoning you can check.</p>
          <p>We think the useful shortcut is different: read the sources for you, lay out what supports a stock and what worries, and link every point back to its source. You see the evidence and make the call yourself.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">What Stock AI does</h2>
        <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          {DOES.map((d) => (
            <li key={d.title} className="bg-surface p-5">
              <h3 className="font-semibold text-ink">{d.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">How an Evidence Board is made</h2>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-card border border-line bg-surface p-5">
              <span className="num grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">{i + 1}</span>
              <span>
                <span className="block font-semibold text-ink">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{s.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-14 rounded-card border border-caution/30 bg-caution/[0.06] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink">Research, not advice</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/85">
          <p>Stock AI and BytePlay are not registered with SEBI as investment advisers or research analysts, and nothing on the platform is a personal recommendation.</p>
          <p>AI summaries can be incomplete or wrong. Market investments carry risk and past performance does not predict future results. Check the original sources, and consult a SEBI-registered adviser for personal advice.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-2 text-xl font-semibold tracking-[-0.015em] text-ink">Where the data comes from</h2>
        <p className="mb-4 text-sm text-muted">Public sources, credited on every page that uses them.</p>
        <ul className="overflow-hidden rounded-card border border-line bg-surface">
          {SOURCES.map((s) => (
            <li key={s.name} className="border-b border-line last:border-0">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-ink/[0.03]">
                <span>
                  <span className="block font-semibold text-ink group-hover:text-accent">{s.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{s.desc}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
        <div className="bg-surface p-5">
          <p className="text-xs text-muted">Company</p>
          <p className="mt-1 font-semibold text-ink">Karmatix (BytePlay)</p>
          <p className="mt-1 text-sm text-muted">Independent software company building research tools for Indian retail investors.</p>
        </div>
        <div className="bg-surface p-5">
          <p className="text-xs text-muted">Location</p>
          <p className="mt-1 font-semibold text-ink">Bhopal, Madhya Pradesh</p>
          <p className="mt-1 text-sm text-muted">Working remotely across India.</p>
        </div>
        <div className="bg-surface p-5">
          <p className="text-xs text-muted">Contact</p>
          <a href="mailto:contact@karmatix.in" className="mt-1 inline-flex min-h-[40px] items-center font-semibold text-accent hover:underline">contact@karmatix.in</a>
          <p className="mt-1 text-sm text-muted">Monday to Friday, 9 am to 6 pm IST.</p>
        </div>
        <div className="bg-surface p-5">
          <p className="text-xs text-muted">Policies</p>
          <p className="mt-1 text-sm">
            <Link to="/disclaimer" className="text-accent hover:underline">Disclaimer</Link> · <Link to="/privacy" className="text-accent hover:underline">Privacy</Link> ·{' '}
            <Link to="/terms" className="text-accent hover:underline">Terms</Link> · <Link to="/refund" className="text-accent hover:underline">Refunds</Link>
          </p>
        </div>
      </section>

      <section className="rounded-card border border-accent/30 bg-accent/[0.06] p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink">Research your next stock with the sources attached</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">Free to start. Two Evidence Boards a day, every tool and calculator, no card needed.</p>
        <ButtonLink to="/login" size="lg" className="mt-5">
          Start free
        </ButtonLink>
      </section>
    </div>
  );
}
