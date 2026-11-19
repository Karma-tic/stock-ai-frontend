// src/lib/relativeTime.ts
// "Updated 3 min ago" for recent times; the clock time after 6 hours.
export function relativeTime(input?: string | number | Date | null, now = Date.now()): string {
  if (input === null || input === undefined || input === '') return '';
  const d = input instanceof Date ? input : new Date(typeof input === 'number' && input < 1e12 ? input * 1000 : input);
  const t = d.getTime();
  if (Number.isNaN(t)) return '';
  const secs = Math.round((now - t) / 1000);
  if (secs < 45) return 'just now';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 6) return `${hours} h ago`;
  const sameDay = new Date(now).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  if (sameDay) return `at ${time}`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }) + `, ${time}`;
}
