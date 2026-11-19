// src/lib/researchLanguage.ts
// Stock AI is research, not advice. VERDICT_WORDS is the shared list of words
// that read as trading calls; the backend keeps the same list in
// research_language.py. Change both together.
export const VERDICT_WORDS = ['buy', 'sell', 'hold', 'accumulate', 'target', 'entry', 'exit', 'stop-loss'] as const;

// Whole words only ("holding" and "shareholders" are fine); plurals and -ing forms
// of the verbs are caught, and "stop loss" with a space too.
const VERDICT_RE =
  /\b(buy(?:s|ing)?|sell(?:s|ing)?|hold(?:s)?|accumulat(?:e|es|ing)|targets?|entry|entries|exit|stop[\s-]?loss(?:es)?)\b/i;

export function hasVerdictWords(text?: string | null): boolean {
  return !!text && VERDICT_RE.test(text);
}

/** A headline cut at a word boundary, never mid-word. */
export function shortHeadline(text: string, maxWords = 12): string {
  const words = (text || '').replace(/\s+/g, ' ').trim().split(' ');
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ').replace(/[,;:-]+$/, '')}…`;
}
