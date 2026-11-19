// src/lib/paywall.ts
// When to show an upgrade prompt. Rules:
// - never before the person has seen value (at least one Evidence Board),
// - after a "Not now", at most one more prompt this session,
// - prompts the person asked for (tapping Go Pro, a locked feature) always open.
const NOT_NOW = 'bp_paywall_notnow';
const SHOWN_AFTER = 'bp_paywall_after';
const BOARDS = 'bp_boards_seen';

const ss = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
};

/** Proactive prompts (banners, nudges) ask here first. */
export function canPrompt(): boolean {
  if (boardsSeen() < 1) return false;
  if (!ss.get(NOT_NOW)) return true;
  return !ss.get(SHOWN_AFTER);
}

export function notePromptShown() {
  if (ss.get(NOT_NOW)) ss.set(SHOWN_AFTER, '1');
}

export function noteNotNow() {
  ss.set(NOT_NOW, '1');
}

// Evidence Boards read, by day, kept 7 days: used for "value seen" and the weekly count.
function readLog(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BOARDS) || '{}') || {};
  } catch {
    return {};
  }
}
const istDay = (d = new Date()) => new Date(d.getTime() + 5.5 * 3600e3).toISOString().slice(0, 10);

export function noteBoardSeen() {
  const log = readLog();
  const today = istDay();
  log[today] = (log[today] || 0) + 1;
  const cutoff = istDay(new Date(Date.now() - 7 * 86400e3));
  for (const k of Object.keys(log)) if (k < cutoff) delete log[k];
  try {
    localStorage.setItem(BOARDS, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

export function boardsSeen(): number {
  return Object.values(readLog()).reduce((a, b) => a + b, 0);
}

// Distinct days the app was opened, kept 7 days.
const VISITS = 'bp_visit_days';
export function noteVisitDay(): string[] {
  let days: string[] = [];
  try {
    days = JSON.parse(localStorage.getItem(VISITS) || '[]') || [];
  } catch {
    days = [];
  }
  const today = istDay();
  if (!days.includes(today)) days.push(today);
  const cutoff = istDay(new Date(Date.now() - 7 * 86400e3));
  days = days.filter((d) => d >= cutoff).sort();
  try {
    localStorage.setItem(VISITS, JSON.stringify(days));
  } catch {
    /* ignore */
  }
  return days;
}

/** Visited on 3 distinct days within the last 3 days (today included). */
export function threeDayVisitor(days: string[]): boolean {
  const cutoff = istDay(new Date(Date.now() - 2 * 86400e3));
  return days.filter((d) => d >= cutoff).length >= 3;
}

export { istDay };
