// src/components/ui/Term.tsx
// Jargon with a dotted underline. Tap or click for a two-sentence plain
// explanation: a small popover on desktop, a bottom sheet on phones.
import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';

export const GLOSSARY: Record<string, { title: string; text: string }> = {
  pe: {
    title: 'P/E ratio',
    text: 'Price to earnings: the share price divided by one year of profit per share. A P/E of 20 means buyers pay ₹20 for every ₹1 the company earns in a year; compare it with similar companies, not across sectors.',
  },
  pb: {
    title: 'P/B ratio',
    text: "Price to book: the share price divided by the company's net assets per share. Banks and asset-heavy firms are often compared on it.",
  },
  vix: {
    title: 'India VIX',
    text: 'A gauge of how much the Nifty is expected to swing over the next 30 days, worked out from option prices. Higher means traders expect bigger moves, often called fear.',
  },
  fii: {
    title: 'FII',
    text: 'Foreign institutional investors: overseas funds that buy and sell Indian shares. A net sell figure means they sold more than they bought that day.',
  },
  dii: {
    title: 'DII',
    text: 'Domestic institutional investors: Indian mutual funds, insurers and banks investing in shares. Their buying often balances days when foreign funds sell.',
  },
  dividendYield: {
    title: 'Dividend yield',
    text: 'The dividends paid over the last year as a percentage of today\'s share price. A 2% yield means about ₹20 a year for every ₹1,000 invested, if the payout stays the same.',
  },
  week52: {
    title: '52-week range',
    text: 'The lowest and highest prices the share traded at over the past year. It shows where today\'s price sits within the year\'s swings, not whether it is cheap.',
  },
  marketCap: {
    title: 'Market cap',
    text: 'The value of all the company\'s shares at today\'s price. In India, companies above about ₹1 lakh crore are usually called large caps.',
  },
};

function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

export default function Term({ k, children }: { k: keyof typeof GLOSSARY; children?: ReactNode }) {
  const entry = GLOSSARY[k];
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open || phone) return;
    const onDown = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, phone]);

  if (!entry) return <>{children}</>;
  const trigger = (
    <button
      type="button"
      onClick={() => {
        // Keep the popover on screen: open leftwards when the term sits near the right edge.
        const r = wrap.current?.getBoundingClientRect();
        setAlignRight(!!r && r.left + 288 > window.innerWidth - 16);
        setOpen((o) => !o);
      }}
      aria-expanded={open}
      aria-controls={phone ? undefined : id}
      className="cursor-help underline decoration-muted/60 decoration-dotted underline-offset-[3px] hover:decoration-accent"
    >
      {children || entry.title}
    </button>
  );

  if (phone) {
    return (
      <Drawer.Root open={open} onOpenChange={setOpen}>
        {trigger}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[95] bg-canvas/60" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-[96] rounded-t-card border border-line bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 outline-none">
            <span className="mx-auto block h-1 w-10 rounded-full bg-ink/15" aria-hidden="true" />
            <Drawer.Title className="mt-4 text-base font-semibold text-ink">{entry.title}</Drawer.Title>
            <Drawer.Description className="mt-2 text-[15px] leading-relaxed text-ink/85">{entry.text}</Drawer.Description>
            <Drawer.Close className="mt-5 h-11 w-full rounded-control border border-line text-sm font-semibold text-ink">Got it</Drawer.Close>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <span ref={wrap} className="relative inline-block">
      {trigger}
      {open && (
        <span
          id={id}
          role="dialog"
          aria-label={entry.title}
          className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full z-50 mt-2 block w-72 rounded-card border border-line bg-surface p-3.5 text-left shadow-lift`}
        >
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{entry.title}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="-mr-1 -mt-1 grid h-7 w-7 place-items-center rounded text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </span>
          <span className="mt-1.5 block text-[13px] font-normal leading-relaxed text-ink/85">{entry.text}</span>
        </span>
      )}
    </span>
  );
}
