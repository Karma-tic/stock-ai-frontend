// src/lib/marketClock.ts
// NSE session from the IST clock: Pre-open 9:00-9:15, Open 9:15-15:30, Mon-Fri.
// Exchange holidays are not known here yet, so a holiday shows as a normal day.

export type MarketPhase = 'pre-open' | 'open' | 'closed';

const PRE = 9 * 60;
const OPEN = 9 * 60 + 15;
const CLOSE = 15 * 60 + 30;

function istParts(now: Date) {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return { ist, day: ist.getDay(), secs: ist.getHours() * 3600 + ist.getMinutes() * 60 + ist.getSeconds() };
}

/** Seconds until the next weekday 9:15 IST open. */
function secondsToNextOpen(day: number, secs: number) {
  const weekday = day >= 1 && day <= 5;
  if (weekday && secs < OPEN * 60) return OPEN * 60 - secs;
  let add = 1;
  let d = (day + 1) % 7;
  while (d === 0 || d === 6) {
    add += 1;
    d = (d + 1) % 7;
  }
  return 86400 - secs + (add - 1) * 86400 + OPEN * 60;
}

export function marketClock(now = new Date()) {
  const { day, secs } = istParts(now);
  const weekday = day >= 1 && day <= 5;
  if (weekday && secs >= OPEN * 60 && secs < CLOSE * 60) {
    return { phase: 'open' as MarketPhase, label: 'Open', until: CLOSE * 60 - secs, untilWhat: 'closes' };
  }
  if (weekday && secs >= PRE * 60 && secs < OPEN * 60) {
    return { phase: 'pre-open' as MarketPhase, label: 'Pre-open', until: OPEN * 60 - secs, untilWhat: 'opens' };
  }
  return { phase: 'closed' as MarketPhase, label: 'Closed', until: secondsToNextOpen(day, secs), untilWhat: 'opens' };
}

/** "42 min", "3 h 5 min", "1 day 18 h". */
export function durationWords(totalSeconds: number) {
  const mins = Math.max(0, Math.round(totalSeconds / 60));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return m ? `${h} h ${m} min` : `${h} h`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh ? `${d} day${d > 1 ? 's' : ''} ${rh} h` : `${d} day${d > 1 ? 's' : ''}`;
}

export function greeting(now = new Date()) {
  const { ist } = istParts(now);
  const h = ist.getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
