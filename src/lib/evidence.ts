// Helpers that turn an AI analysis into evidence the board can show.

export function splitIntoPoints(text?: unknown): string[] {
  // Cached signals may hold bull_case/bear_case as arrays, objects or strings.
  if (!text) return [];
  if (Array.isArray(text)) return text.map((t) => String(t).trim()).filter(Boolean);
  if (typeof text !== 'string') return [String(text)];

  let points = text.split(/\.\s+(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);
  // One long blob with no punctuation: split where a lowercase letter meets an uppercase one.
  if (points.length <= 1) points = text.split(/(?<=[a-z%])(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);
  return points.map((p) => p.replace(/\.$/, '').replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
}

export type Balance = { support: number; concern: number; label: string; lean: number };

// Counts supporting vs concerning points and says it in words. lean: -1 (concerns) … +1 (support).
export function evidenceBalance(support: number, concern: number): Balance {
  const total = support + concern;
  const lean = total ? (support - concern) / total : 0;
  let label = 'Balanced';
  if (lean >= 0.5) label = 'Mostly supportive';
  else if (lean >= 0.15) label = 'Leans supportive';
  else if (lean <= -0.5) label = 'Mostly concerning';
  else if (lean <= -0.15) label = 'Leans concerning';
  return { support, concern, label: `${label}, ${support} vs ${concern}`, lean };
}

const clamp10 = (v: unknown) => Math.max(0, Math.min(10, Number(v) || 0));

// A 0–10 score as 5 dots plus a word, so meaning never relies on a bar's length or colour.
export function factor(kind: 'technical' | 'valuation' | 'momentum', score: unknown) {
  const s = clamp10(score);
  const dots = Math.round(s / 2);
  const words = {
    technical: ['weak', 'mixed', 'firm', 'strong'],
    valuation: ['stretched', 'fair', 'reasonable', 'attractive'],
    momentum: ['weak', 'steady', 'building', 'strong'],
  }[kind];
  const word = s < 3.5 ? words[0] : s < 5.5 ? words[1] : s < 7.5 ? words[2] : words[3];
  return { score: s, dots, word };
}

export function relDay(input?: string): string {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input.slice(0, 16);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const cleanTicker = (t: string) => (t || '').toUpperCase().replace('.NS', '').replace('.BO', '').trim();

export type PointSource = { name: string; url: string; title?: string };
export type EvidencePoint = { text: string; sources: PointSource[] };

const safeUrl = (u: unknown) => typeof u === 'string' && /^https?:\/\//i.test(u);

// New analyses carry `analysis.evidence` with source links attached by the backend
// (the model only cites numbered headlines). Older saved analyses fall back to the plain text.
export function evidencePoints(analysis: any, side: 'bull' | 'bear'): EvidencePoint[] {
  const list = Array.isArray(analysis?.evidence) ? analysis.evidence : null;
  if (list && list.length) {
    const pts = list
      .filter((e: any) => e && e.side === side && typeof e.point === 'string' && e.point.trim())
      .map((e: any) => ({
        text: e.point.trim(),
        sources: (Array.isArray(e.sources) ? e.sources : [])
          .filter((s: any) => s && safeUrl(s.url))
          .map((s: any) => ({ name: String(s.name || 'Source'), url: s.url, title: s.title ? String(s.title) : undefined })),
      }));
    if (pts.length) return pts;
  }
  return splitIntoPoints(side === 'bull' ? analysis?.bull_case : analysis?.bear_case).map((text) => ({ text, sources: [] }));
}
