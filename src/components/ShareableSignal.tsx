// src/components/ShareableSignal.tsx
// A vertical share card (exported at 1080×1920): the evidence balance, the top
// supporting and concerning points, and the disclaimer. No price targets.
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';
import { evidenceBalance, splitIntoPoints } from '../lib/evidence';
import { Button } from './ui/Button';

interface Props {
  signal: any;
  stock: any;
  support?: string[];
  concern?: string[];
}

const INK = '#0B0F14';
const SURFACE = '#121821';
const TEXT = '#E8EDF3';
const MUTED = '#9AA6B8';
const LINE = '#253042';
const ACCENT = '#8FA2FF';
const UP = '#4ADE80';
const DOWN = '#F87171';

const clip = (s: string, n = 120) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export default function ShareableSignal({ signal, stock, support, concern }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const sup = support ?? splitIntoPoints(signal?.analysis?.bull_case);
  const con = concern ?? splitIntoPoints(signal?.analysis?.bear_case);
  const balance = evidenceBalance(sup.length, con.length);
  const ticker = (stock?.display_ticker || '').replace('.NS', '');
  const name = stock?.company_name || ticker;
  const price = Number(stock?.current_price) || 0;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const pos = 50 + balance.lean * 46;

  const render = async () => {
    if (!cardRef.current) return null;
    // Preview is 270×480; scale 4 gives 1080×1920.
    return html2canvas(cardRef.current, { backgroundColor: INK, scale: 4, useCORS: true, logging: false });
  };

  const share = async () => {
    setBusy(true);
    try {
      const canvas = await render();
      if (!canvas) return;
      const data = canvas.toDataURL('image/png');
      const blob = await (await fetch(data)).blob();
      const file = new File([blob], `${ticker}-evidence.png`, { type: 'image/png' });
      if (navigator.share && (navigator as any).canShare?.({ files: [file] })) {
        await navigator.share({ title: `${ticker} evidence | Stock AI`, text: `${ticker}: ${balance.label}. See the sources on byteplay.org`, files: [file] });
      } else {
        const a = document.createElement('a');
        a.download = `${ticker}-evidence.png`;
        a.href = data;
        a.click();
      }
    } catch (e) {
      console.error('Share error:', e);
    }
    setBusy(false);
  };

  const download = async () => {
    setBusy(true);
    try {
      const canvas = await render();
      if (canvas) {
        const a = document.createElement('a');
        a.download = `${ticker}-evidence.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const pointRow = (text: string, up: boolean) => (
    <div style={{ display: 'flex', gap: 8, padding: '9px 10px', border: `1px solid ${LINE}`, borderRadius: 8, background: SURFACE }}>
      <span style={{ color: up ? UP : DOWN, fontSize: 10, lineHeight: '15px', fontWeight: 700 }}>{up ? '▲' : '▼'}</span>
      <span style={{ color: TEXT, fontSize: 11, lineHeight: '15px' }}>{clip(text)}</span>
    </div>
  );

  return (
    <div>
      <div
        ref={cardRef}
        style={{ width: 270, height: 480, margin: '0 auto', background: INK, borderRadius: 14, padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', fontFamily: '"Geist Variable", Geist, system-ui, sans-serif' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={SURFACE} />
            <path d="M12 45 L24 33 L33 38 L49 20" fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="19" r="6" fill="#fff" />
          </svg>
          <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>Stock AI</span>
          <span style={{ marginLeft: 'auto', color: MUTED, fontSize: 10 }}>{today}</span>
        </div>

        <p style={{ margin: '22px 0 0', color: TEXT, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{ticker}</p>
        <p style={{ margin: '2px 0 0', color: MUTED, fontSize: 11 }}>
          {clip(name, 40)}
          {price ? ` · ₹${price.toLocaleString('en-IN')}` : ''}
        </p>

        <p style={{ margin: '20px 0 0', color: TEXT, fontSize: 14, fontWeight: 600 }}>{balance.label}</p>
        <div style={{ position: 'relative', height: 6, borderRadius: 3, background: LINE, marginTop: 10 }}>
          <span style={{ position: 'absolute', top: -4, left: `calc(${pos}% - 7px)`, width: 14, height: 14, borderRadius: 7, background: ACCENT, border: `2px solid ${INK}` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: MUTED, fontSize: 9, marginTop: 6 }}>
          <span>More concerns</span>
          <span>More support</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 18 }}>
          {sup.slice(0, 2).map((p, i) => (
            <div key={`s${i}`}>{pointRow(p, true)}</div>
          ))}
          {con.slice(0, 1).map((p, i) => (
            <div key={`c${i}`}>{pointRow(p, false)}</div>
          ))}
        </div>

        <p style={{ marginTop: 'auto', marginBottom: 0, color: MUTED, fontSize: 8.5, lineHeight: '12px' }}>
          AI-generated research from filings and news, not advice. Not SEBI-registered. Sources at byteplay.org/stock/{ticker}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1" onClick={share} disabled={busy}>
          <Share2 className="h-4 w-4" strokeWidth={1.75} />
          {busy ? 'Preparing…' : 'Share'}
        </Button>
        <Button variant="ghost" onClick={download} disabled={busy} aria-label="Download image">
          <Download className="h-4 w-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
