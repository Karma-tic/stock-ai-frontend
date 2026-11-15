// src/lib/emailOptIn.ts
// The "Email me a morning brief" choice on the sign-in page. It is remembered
// while the person signs in (Google sign-in leaves the page) and sent once a
// session exists. The server only saves it for accounts with no email choice
// yet, so returning users who switched emails off are never switched back on.
import axios from 'axios';
import { BASE } from './api';

const KEY = 'stock_ai_brief_opt_in';

export function rememberBriefChoice(wantsBrief: boolean) {
  try {
    localStorage.setItem(KEY, wantsBrief ? '1' : '0');
  } catch {
    /* storage can be unavailable in private windows; the choice is then skipped */
  }
}

export async function applyPendingBriefChoice(accessToken: string) {
  let choice: string | null = null;
  try {
    choice = localStorage.getItem(KEY);
    localStorage.removeItem(KEY);
  } catch {
    return;
  }
  if (choice !== '1' || !accessToken) return;
  try {
    await axios.post(
      `${BASE}/api/notification-preferences/initial`,
      { email_digest: true },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch (error) {
    console.error('Saving the morning brief choice failed:', error);
  }
}
