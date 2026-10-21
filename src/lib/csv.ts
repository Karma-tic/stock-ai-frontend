// Build and download a CSV in the browser. Values are quoted; formula-leading cells are neutralised.
type Cell = string | number | null | undefined;

const cell = (v: Cell) => {
  if (v == null) return '';
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(header: string[], rows: Cell[][]) {
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
}

export function downloadCsv(filename: string, sections: { title?: string; header: string[]; rows: Cell[][] }[]) {
  const body = sections.map((s) => (s.title ? `${cell(s.title)}\r\n` : '') + toCsv(s.header, s.rows)).join('\r\n\r\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const today = () => new Date().toISOString().slice(0, 10);
