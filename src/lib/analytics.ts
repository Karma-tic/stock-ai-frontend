// src/lib/analytics.ts
// GA4 events for the upgrade funnel: home view → analysis open → locked view → upgrade click → payment success.
// Each carries {ticker, plan, source} where it applies. Never personal data.
import ReactGA from 'react-ga4';

export type FunnelEvent =
  | 'home_view'
  | 'analysis_open'
  | 'analysis_locked_view'
  | 'paywall_view'
  | 'upgrade_click'
  | 'payment_success'
  | 'watchlist_add'
  | 'alert_create'
  | 'share_card'
  | 'ref_signup'
  | 'brief_open';

export function trackEvent(name: FunnelEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  try {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));
    ReactGA.event(name, clean);
  } catch {
    /* analytics never breaks the page */
  }
}
