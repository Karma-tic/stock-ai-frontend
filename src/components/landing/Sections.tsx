import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CalendarDays, Coins, Compass, Newspaper, Search, ShieldCheck, BookOpenCheck, FileSearch } from 'lucide-react';
import { InvestRates, Ipo, MarketWrap, fmtDay, fmtRate, pickIpos, useApi, useInView } from './hooks';

export function SectionHeader({ eyebrow, title, intro, id, center }: { eyebrow: string; title: string; intro?: string; id: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lavender-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-balance text-3xl font-bold tracking-tight text-lavender-text sm:text-[2.6rem] sm:leading-[1.1]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-lavender-text/70 sm:text-lg">{intro}</p>}
    </div>
  );
}

// ── Tools ──
export function ToolsGrid() {
  const [ref, near] = useInView<HTMLElement>('300px');
  const rates = useApi<InvestRates>('/api/invest/rates');
  const ipos = useApi<{ ipos: Ipo[] }>('/api/market/ipos', near, 20000);
  const wraps = useApi<{ wraps: MarketWrap[] }>('/api/market-wraps', near);
  const { open, upcoming } = pickIpos(ipos.data?.ipos || []);
  const topFd = rates.data?.rates.bank_fd?.[0]?.rate;
  const wrap = wraps.data?.wraps?.[0];

  const tools = [
    {
      to: '/stocks', icon: Search, title: 'Stock research',
      body: 'Browse popular stocks with quick filters, then open any company for its numbers, filings and news in one summary.',
      stat: 'Quick filters and stock pages',
    },
    {
      to: '/invest', icon: Compass, title: 'Invest Explorer',
      body: 'Compare FDs, PPF, gold, bonds, mutual funds and global options by return, risk, lock-in and tax.',
      stat: topFd !== undefined ? `Best bank FD today: ${fmtRate(topFd)}` : '35 options compared',
    },
    {
      to: '/ipos', icon: CalendarDays, title: 'IPO tracker',
      body: 'Opening dates, price bands, grey-market premium and subscription for upcoming mainboard and SME IPOs.',
      stat: ipos.data ? `${open.length} open · ${upcoming.length} upcoming` : 'Mainboard and SME',
    },
    {
      to: '/stocks/dividends', icon: Coins, title: 'Dividends',
      body: 'Dividend yield, cash paid, payment consistency and upcoming dividend events for widely followed stocks.',
      stat: 'Yield and payment history',
    },
    {
      to: '/market-wrap', icon: Newspaper, title: 'Market wrap',
      body: 'A 500-word summary of the Nifty 50, Sensex and the news that moved them, every weekday at 4:15 PM.',
      stat: wrap ? `Latest: ${fmtDay(wrap.date)}` : 'Weekdays at 4:15 PM IST',
    },
    {
      to: '/tools', icon: Calculator, title: 'Calculators',
      body: 'SIP, lumpsum, brokerage and F&O calculators, plus a side-by-side stock comparison.',
      stat: 'Free, no sign-up',
    },
  ];

  return (
    <section ref={ref} aria-labelledby="tools-heading" className="border-y border-lavender-text/10 bg-lavender-base py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="tools-heading"
          eyebrow="Everything in one place"
          title="Tools for every step of your research"
          intro="From a single stock to your whole plan: each tool below is free to open, and most need no account."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, body, stat }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-[210px] flex-col rounded-2xl border border-lavender-text/10 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-lavender-primary/30 hover:shadow-lavender motion-reduce:hover:translate-y-0 dark:border-lavender-text/15"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lavender-primary/10 text-lavender-primary">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-lavender-text">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-lavender-text/70">{body}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <span className="text-xs font-semibold tabular-nums text-lavender-text/55">{stat}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-lavender-text/35 transition group-hover:translate-x-0.5 group-hover:text-lavender-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Trust ──
export function Trust() {
  const sources = ['NSE and BSE filings', 'Reuters', 'Business Standard', 'Mint', 'Moneycontrol', 'Economic Times'];
  return (
    <section aria-labelledby="trust-heading" className="bg-lavender-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader id="trust-heading" eyebrow="Built on sources" title="Where the information comes from, and how we check it" />
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          <div className="border-t border-lavender-text/15 pt-6">
            <FileSearch className="h-6 w-6 text-lavender-primary" />
            <h3 className="mt-4 text-lg font-bold text-lavender-text">Official filings and trusted news</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sources.map((s) => (
                <li key={s} className="rounded-full border border-lavender-text/15 px-3 py-1 text-xs font-medium text-lavender-text/75">{s}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-lavender-text/15 pt-6">
            <BookOpenCheck className="h-6 w-6 text-lavender-primary" />
            <h3 className="mt-4 text-lg font-bold text-lavender-text">A public track record</h3>
            <p className="mt-3 text-sm leading-relaxed text-lavender-text/70">
              We publish how past AI analyses turned out, including the ones that were wrong, so you can judge the tool for yourself.
            </p>
            <Link to="/track-record" className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lavender-primary">
              See every tracked outcome
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="border-t border-lavender-text/15 pt-6">
            <ShieldCheck className="h-6 w-6 text-lavender-primary" />
            <h3 className="mt-4 text-lg font-bold text-lavender-text">Research, not advice</h3>
            <p className="mt-3 text-sm leading-relaxed text-lavender-text/70">
              Stock AI is an educational research tool. We are not SEBI-registered and nothing here is a personal recommendation. Do your own
              research, or speak to a registered adviser, before you invest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──
const FAQS = [
  {
    q: 'Is Stock AI free to use?',
    a: 'Yes. The free plan includes 2 AI analyses a day, a 5-stock watchlist and every free tool on the site. The Pro plan is ₹99 for 30 days (a limited offer; the regular price is ₹499) and removes the limits. It does not renew automatically.',
  },
  {
    q: 'Is this SEBI-registered investment advice?',
    a: 'No. Stock AI is an educational platform. Its analysis is AI-generated for information only, and we are not SEBI-registered investment advisers or research analysts. Always consult a qualified financial adviser before investing.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'The AI works from price data, valuation numbers, filings and recent news, and like any tool it is sometimes wrong. We publish how past analyses turned out on the Track Record page. Use it as one input among many.',
  },
  {
    q: 'Which stocks can I research?',
    a: "Search covers every company on NSE's equity list, from Nifty 50 leaders to PSUs, mid-caps and small caps.",
  },
  {
    q: 'How often is the information updated?',
    a: 'Prices refresh through the trading day. Analyses for watched stocks refresh every hour from 9 AM to 4 PM IST on weekdays, the market wrap arrives at 4:15 PM, and Pro users get a morning email digest at 8:30 AM.',
  },
  {
    q: 'Can I track my own portfolio?',
    a: 'Yes. Add your stocks, quantity and average buy price in the Portfolio tab, and Stock AI shows the live profit or loss against what you invested.',
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-lavender-surface py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <SectionHeader id="faq-heading" eyebrow="Questions" title="Frequently asked questions" />
        <div className="divide-y divide-lavender-text/10 border-y border-lavender-text/10">
          {FAQS.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-lavender-text marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-lavender-text/15 text-lavender-text/60 transition group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="-mt-1 pb-5 pr-12 text-[15px] leading-relaxed text-lavender-text/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final call to action ──
export function FinalCta({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="dark relative isolate overflow-hidden bg-[#0e0c1b] py-20 sm:py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(118,75,162,0.55),transparent),radial-gradient(ellipse_40%_60%_at_85%_0%,rgba(94,234,212,0.12),transparent)]"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">Start your next research in seconds</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">Free to start. No card needed, and nothing renews automatically.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full rounded-xl bg-gradient-lavender px-7 py-3.5 text-base font-semibold text-white shadow-lavender transition hover:opacity-90 sm:w-auto"
          >
            Start researching free
          </button>
          <Link to="/invest" className="w-full rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto">
            Explore investments
          </Link>
        </div>
      </div>
    </section>
  );
}
