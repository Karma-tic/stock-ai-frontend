// src/components/InvitePage.tsx
// Invite friends: your link, WhatsApp first on phones, and how many friends joined.
import { useEffect, useState } from 'react';
import { Check, Copy, Gift } from 'lucide-react';
import { getReferral } from '../lib/api';
import { toast } from '../lib/toast';
import { trackEvent } from '../lib/analytics';
import { Button } from './ui/Button';
import SEO from './SEO';

type Ref = { code: string; link: string; joined: number; rewarded_up_to: number; referrer_days: number; newcomer_bonus: number };

export default function InvitePage() {
  const [ref, setRef] = useState<Ref | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const phone = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    getReferral()
      .then((r) => setRef(r.data))
      .catch(() => setFailed(true));
  }, []);

  const message = ref
    ? `I use Stock AI to read Indian stocks with every source linked: filings, news and a balance of what supports and concerns. Free to start, and you get ${ref.newcomer_bonus} extra analyses with my link: ${ref.link}`
    : '';

  const copy = async () => {
    if (!ref) return;
    try {
      await navigator.clipboard.writeText(ref.link);
      setCopied(true);
      trackEvent('share_card', { source: 'invite_copy' });
      toast.success('Link copied');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const whatsapp = (
    <a
      href={ref ? `https://wa.me/?text=${encodeURIComponent(message)}` : undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('share_card', { source: 'invite_whatsapp' })}
      className="press inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-[#1FA855] px-4 text-sm font-semibold text-white hover:bg-[#1A9149]"
    >
      Share on WhatsApp
    </a>
  );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl px-4 pb-24 pt-8 sm:px-6">
      <SEO title="Invite friends | Stock AI" description="Invite friends to Stock AI." />
      <Gift className="h-7 w-7 text-accent" strokeWidth={1.75} aria-hidden="true" />
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">Invite friends, get Pro</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
        When a friend signs up with your link, you get <strong>7 days of Pro</strong> and they get <strong>3 extra analyses</strong>.
        Pro days count for your first 10 friends.
      </p>

      {failed && <p className="mt-6 text-sm text-down">Your link could not be loaded. Please refresh the page.</p>}
      {!ref && !failed && <div className="skeleton mt-6 h-28 w-full" />}
      {ref && (
        <>
          <div className="mt-6 rounded-card border border-line bg-surface p-4">
            <p className="text-xs font-medium text-muted">Your link</p>
            <p className="num mt-1 break-all text-sm text-ink">{ref.link}</p>
            <div className={`mt-4 flex gap-2 ${phone ? 'flex-col' : ''}`}>
              {phone && whatsapp}
              <Button variant={phone ? 'ghost' : 'primary'} className="h-12 flex-1" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              {!phone && whatsapp}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            <span className="num font-semibold text-ink">{ref.joined}</span> {ref.joined === 1 ? 'friend has' : 'friends have'} joined
            {ref.joined > 0 ? ` · ${Math.min(ref.joined, ref.rewarded_up_to) * ref.referrer_days} days of Pro earned` : ''}.
          </p>
        </>
      )}
    </div>
  );
}
