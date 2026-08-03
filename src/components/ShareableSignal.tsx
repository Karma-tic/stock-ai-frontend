// src/components/ShareableSignal.tsx
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download } from 'lucide-react';

interface Props {
  signal: any;
  stock:  any;
}

export default function ShareableSignal({ signal, stock }: Props) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const signalData   = signal?.signal || 'HOLD';
  const confidence   = signal?.confidence || 0;
  const entry        = signal?.entry_strategy || {};
  const companyName  = stock?.company_name || stock?.display_ticker;
  const ticker       = stock?.display_ticker || '';
  const price        = stock?.current_price || 0;
  const today        = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const signalColors = {
    BUY:  { bg: '#052e16', border: '#22c55e', text: '#22c55e' },
    HOLD: { bg: '#1c1a04', border: '#eab308', text: '#eab308' },
    SELL: { bg: '#2d0a0a', border: '#ef4444', text: '#ef4444' },
  };
  const colors = signalColors[signalData as keyof typeof signalColors]
    || signalColors.HOLD;

  const captureAndShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale:           2, // high resolution
        useCORS:         true,
        logging:         false,
      });

      const imageData = canvas.toDataURL('image/png');

      // Try native share API first (works on mobile)
      if (navigator.share) {
        const blob     = await (await fetch(imageData)).blob();
        const file     = new File([blob], `${ticker}-signal.png`, { type: 'image/png' });
        await navigator.share({
          title: `${ticker} — ${signalData} Signal | Stock AI`,
          text:  `AI says ${signalData} on ${ticker}. Check byteplay.org for full analysis.`,
          files: [file],
        });
      } else {
        // Fallback — download the image
        const link    = document.createElement('a');
        link.download = `${ticker}-stockai-signal.png`;
        link.href     = imageData;
        link.click();
      }
    } catch (e) {
      console.error('Share error:', e);
    }
    setSharing(false);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas  = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale:           2,
        useCORS:         true,
        logging:         false,
      });
      const link    = document.createElement('a');
      link.download = `${ticker}-stockai-signal.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
    setSharing(false);
  };

  return (
    <div>
      {/* The shareable card — this gets captured */}
      <div
        ref={cardRef}
        style={{
          background:   '#ffffff',
          padding:      '24px',
          borderRadius: '16px',
          border:       `2px solid ${colors.border}`,
          width:        '100%',
          maxWidth:     '400px',
          margin:       '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <p style={{ color: '#78716c', fontSize: '11px',
                        textTransform: 'uppercase', letterSpacing: '2px',
                        margin: 0 }}>
              AI Analysis
            </p>
            <p style={{ color: '#1c1917', fontSize: '24px', fontWeight: 900,
                        margin: '4px 0 0 0' }}>
              {ticker}
            </p>
            <p style={{ color: '#57534e', fontSize: '12px', margin: 0 }}>
              {companyName?.substring(0, 30)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#78716c', fontSize: '11px', margin: 0 }}>
              {today}
            </p>
            <p style={{ color: '#1c1917', fontSize: '20px',
                        fontWeight: 700, margin: '4px 0 0 0' }}>
              ₹{price?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Signal */}
        <div style={{
          background:   colors.bg,
          border:       `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding:      '16px',
          textAlign:    'center',
          marginBottom: '16px',
        }}>
          <p style={{ color: colors.text, fontSize: '48px',
                      fontWeight: 900, margin: 0,
                      letterSpacing: '4px' }}>
            {signalData}
          </p>
          <p style={{ color: '#78716c', fontSize: '13px', margin: '4px 0 0 0' }}>
            Confidence: {confidence}%
          </p>
        </div>

        {/* Price targets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                      gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'Entry',     value: `₹${entry.suggested_buy_price}`,  color: '#d97706' },
            { label: 'Target 1',  value: `₹${entry.target_price_1}`,       color: '#16a34a' },
            { label: 'Target 2',  value: `₹${entry.target_price_2}`,       color: '#22c55e' },
            { label: 'Stop Loss', value: `₹${entry.stop_loss}`,            color: '#dc2626' },
          ].map(item => (
            <div key={item.label} style={{
              background: '#fef3c7', borderRadius: '8px',
              padding: '10px', textAlign: 'center'
            }}>
              <p style={{ color: '#78716c', fontSize: '10px',
                          margin: 0, textTransform: 'uppercase' }}>
                {item.label}
              </p>
              <p style={{ color: item.color, fontSize: '15px',
                          fontWeight: 700, margin: '2px 0 0 0' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <div style={{
          borderTop:  '1px solid #fde68a',
          paddingTop: '12px',
          display:    'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ color: '#1c1917', fontSize: '12px',
                        fontWeight: 700, margin: 0 }}>
              byteplay.org
            </p>
            <p style={{ color: '#78716c', fontSize: '10px', margin: 0 }}>
              AI analysis • Not SEBI advice
            </p>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-3 mt-4 justify-center">
        <button
          onClick={captureAndShare}
          disabled={sharing}
          className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          {sharing ? 'Preparing...' : 'Share Signal'}
        </button>
        <button
          onClick={downloadImage}
          disabled={sharing}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}