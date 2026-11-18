// src/lib/track.ts
// Reports the steps the page sees (visit, sign-up, upgrade offer shown) so the
// owner can see where people drop off. No cookies and no third parties: a random
// visitor id in this browser, the page path and where the visit came from.
import { BASE } from './api';

type PageEvent = 'visit' | 'signup' | 'upgrade_view';

const VISITOR_KEY = 'bp_visitor';

function visitorId(): string | null {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function source(): string | null {
  try {
    const utm = new URLSearchParams(window.location.search).get('utm_source');
    if (utm) return utm.slice(0, 60);
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    return host && !host.endsWith('byteplay.org') ? host : null;
  } catch {
    return null;
  }
}

export function track(event: PageEvent, accessToken?: string | null) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'text/plain' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    void fetch(`${BASE}/api/track`, {
      method: 'POST',
      keepalive: true,
      headers,
      body: JSON.stringify({ event, visitor: visitorId(), path: window.location.pathname, ref: source() }),
    }).catch(() => undefined);
  } catch {
    /* tracking must never affect the page */
  }
}

/** One visit per browser tab session. */
export function trackVisitOnce() {
  try {
    if (sessionStorage.getItem('bp_visit_sent')) return;
    sessionStorage.setItem('bp_visit_sent', '1');
  } catch {
    /* no storage: still report this once */
  }
  track('visit');
}

/** Ask the server to count a sign-up; it only counts accounts created in the last hour, once. */
export function trackSignupOnce(userId: string, accessToken: string) {
  const key = `bp_signup_checked_${userId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
  } catch {
    /* fall through: the server de-duplicates */
  }
  track('signup', accessToken);
}
