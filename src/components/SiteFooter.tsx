import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import './siteFooter.css';

const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/refund', label: 'Refund' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/contact', label: 'Contact' },
  { to: '/beta', label: 'Join the research beta' },
];

// What each source gives the research, shown on the receipt line.
const DATA_SOURCES = [
  { label: 'NSE India', kind: 'filings', url: 'https://www.nseindia.com' },
  { label: 'BSE India', kind: 'filings', url: 'https://www.bseindia.com' },
  { label: 'Economic Times Markets', kind: 'news', url: 'https://economictimes.indiatimes.com/markets' },
  { label: 'SEBI', kind: 'circulars', url: 'https://www.sebi.gov.in' },
  { label: 'Moneycontrol', kind: 'data', url: 'https://www.moneycontrol.com' },
];

type PrintState = 'static' | 'pending' | 'play';

/**
 * "Source ledger" footer: the page ends on a printed research receipt.
 * Lines print once when the receipt scrolls into view, then the
 * "Research, not advice" stamp lands. Reduced motion (or no IntersectionObserver)
 * shows the finished receipt with no animation.
 */
export default function SiteFooter() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [print, setPrint] = useState<PrintState>(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return 'static';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'static' : 'pending';
  });

  useEffect(() => {
    if (print !== 'pending' || !receiptRef.current) return;
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPrint('play');
          footerObserver.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    footerObserver.observe(receiptRef.current);
    return () => footerObserver.disconnect();
  }, [print]);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-8 lg:py-16">
        {/* Who we are */}
        <div className="flex flex-col">
          <Logo />
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Every claim on Stock AI links to its source. The receipt shows what we read.
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Research, not advice. Not SEBI-registered. AI analysis is for education only; invest at your own risk.
          </p>

          <nav aria-label="Company" className="mt-8">
            <p className="text-xs font-medium text-muted">Company</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 sm:max-w-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex min-h-[40px] items-center gap-1.5 text-sm text-ink/80 transition-colors duration-micro hover:text-ink"
                  >
                    <span className="transition-transform duration-micro ease-micro group-hover:translate-x-0.5">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="https://t.me/byteplaystock"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-semibold text-accent hover:underline"
          >
            Follow the daily market wrap on Telegram
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-auto hidden pt-6 text-xs text-muted lg:block">© 2026 BytePlay Technologies. All rights reserved.</p>
        </div>

        {/* The research receipt */}
        <div className="lg:pt-2">
          <div ref={receiptRef} className="receipt" data-print={print}>
            <p className="receipt-title">STOCK AI · RESEARCH RECEIPT</p>
            <p className="receipt-sub">Sources read · {today}</p>
            <hr className="receipt-rule" />
            <ul aria-label="Data sources">
              {DATA_SOURCES.map((s, i) => (
                <li key={s.label} className="receipt-line" style={{ animationDelay: `${i * 90}ms` }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="receipt-row">
                    <span className="receipt-label">{s.label}</span>
                    <span className="receipt-dots" aria-hidden="true" />
                    <span className="receipt-value">
                      <span className="receipt-check" aria-hidden="true">✓</span> {s.kind}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <hr className="receipt-rule" />
            <div className="receipt-line receipt-row receipt-total" style={{ animationDelay: '470ms' }}>
              <span className="receipt-label">Buy / sell calls</span>
              <span className="receipt-dots" aria-hidden="true" />
              <span>0</span>
            </div>
            <div className="receipt-line receipt-row receipt-total" style={{ animationDelay: '560ms' }}>
              <span className="receipt-label">Price targets</span>
              <span className="receipt-dots" aria-hidden="true" />
              <span>0</span>
            </div>
            <p className="receipt-stamp">
              Research, not advice
              <small>Not SEBI-registered</small>
            </p>
          </div>
        </div>
        {/* On phones the copyright closes the page, under the receipt */}
        <p className="text-xs text-muted lg:hidden">© 2026 BytePlay Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
