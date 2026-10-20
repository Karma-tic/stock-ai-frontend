import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Calculator, Compass, PieChart, Scale, TrendingUp, Wrench } from 'lucide-react';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';

const TOOLS = [
  { title: 'Invest Explorer', description: "Compare FDs, PPF, mutual funds, gold, bonds, REITs and global investing by return, risk, lock-in and tax, with today's best rates.", path: '/invest', Icon: Compass },
  { title: 'SIP calculator', description: 'See what a monthly SIP could grow to, year by year, with compounding.', path: '/tools/sip-calculator', Icon: Calculator },
  { title: 'Lumpsum calculator', description: 'Estimate how a one-time investment could grow over the years you choose.', path: '/tools/lumpsum-calculator', Icon: TrendingUp },
  { title: 'Compare stocks', description: 'Put NSE stocks side by side on price, P/E, dividend yield, 52-week range and market cap.', path: '/tools/stock-comparison', Icon: Scale },
  { title: 'Brokerage calculator', description: 'Every charge on a delivery or intraday trade: STT, brokerage, GST, stamp duty, and what you keep.', path: '/tools/brokerage-calculator', Icon: PieChart },
  { title: 'F&O calculator', description: 'Your real profit or loss on a futures or options trade after all charges.', path: '/tools/fno-calculator', Icon: Activity },
];

export default function ToolsHub() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Free Financial Calculators for Indian Investors | Stock AI"
        description="Use free SIP, lumpsum, brokerage, F&O, and stock comparison tools built for Indian stock market investors."
        canonicalPath="/tools"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader eyebrow="Tools" icon={Wrench} title="Free calculators for Indian investors" intro="Plan, compare and check the numbers. Every result has a link you can share." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ title, description, path, Icon }) => (
            <li key={path}>
              <Link to={path} className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 transition hover:border-accent/40">
                <span className="grid h-10 w-10 place-items-center rounded-control bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
