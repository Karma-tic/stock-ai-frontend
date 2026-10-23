// Small display formatters shared across pages.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-10-27' -> '27 Oct' (adds the year when it isn't this year). Anything else is returned as is. */
export function fmtDay(value?: string | null, withYear = false): string {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return value;
  const [, y, mo, d] = m;
  const thisYear = String(new Date().getFullYear());
  return `${Number(d)} ${MONTHS[Number(mo) - 1]}${withYear || y !== thisYear ? ` ${y}` : ''}`;
}

/** '2026-10-27','2026-10-29' -> '27–29 Oct'; across months '30 Oct – 2 Nov'. */
export function fmtDayRange(a?: string | null, b?: string | null): string {
  if (!a || !b) return fmtDay(a || b);
  const ma = /^(\d{4})-(\d{2})-(\d{2})/.exec(a);
  const mb = /^(\d{4})-(\d{2})-(\d{2})/.exec(b);
  if (!ma || !mb) return `${a} – ${b}`;
  if (ma[1] === mb[1] && ma[2] === mb[2]) return `${Number(ma[3])}–${fmtDay(b)}`;
  return `${fmtDay(a)} – ${fmtDay(b)}`;
}

/** Number ranges written with a hyphen ('₹154-162') get a proper en dash. */
export const fmtRange = (value?: string | null) => (value ? value.replace(/(\d)\s*-\s*(?=[₹\d])/g, '$1–') : value || '');

/** Placeholder values from data sources ('-', 'N/A', '') become null so the UI can say "Not disclosed". */
export const blankToNull = <T,>(value: T): T | null =>
  value == null || (typeof value === 'string' && /^\s*(-|–|—|n\/?a|na|null)?\s*$/i.test(value)) ? null : value;
