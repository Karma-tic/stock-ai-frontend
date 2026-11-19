// src/lib/referral.ts
// ?ref=CODE on any page is remembered for 30 days; after the visitor signs in it is claimed once.
import { claimReferral } from './api';
import { trackEvent } from './analytics';
import { toast } from './toast';
import { refreshAllowance } from './plan';

const KEY = 'bp_ref';

export function captureRef() {
  try {
    const code = new URLSearchParams(window.location.search).get('ref');
    if (code && /^[0-9A-Za-z]{10,22}$/.test(code)) localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export async function claimStoredRef() {
  let saved: { code: string; at: number } | null = null;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    saved = null;
  }
  if (!saved?.code) return;
  if (Date.now() - saved.at > 30 * 86400e3) {
    localStorage.removeItem(KEY);
    return;
  }
  try {
    const r = await claimReferral(saved.code);
    localStorage.removeItem(KEY);
    if (r.data?.ok) {
      trackEvent('ref_signup', { source: 'referral' });
      toast.success(`Welcome! You have ${r.data.bonus} extra analyses from your friend's invite.`);
      refreshAllowance();
    }
  } catch {
    /* try again next sign-in */
  }
}

/** Adds the person's ref code to a byteplay.org link. */
export function withRef(url: string, code?: string | null) {
  if (!code) return url;
  const u = new URL(url);
  u.searchParams.set('ref', code);
  return u.toString();
}
