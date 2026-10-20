// src/components/AdBanner.tsx
import { useEffect } from 'react';

declare global {
  interface Window { adsbygoogle: any[] }
}

interface Props {
  slot: string;
  format?: string;
}

const ADSENSE_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT || 'ca-pub-6066580021278086';

export default function AdBanner({ slot, format = 'auto' }: Props) {
  useEffect(() => {
    if (!slot || slot.includes('YOUR_')) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, [slot]);

  if (!slot || slot.includes('YOUR_')) return null;

  return (
    <div className="my-3 text-center">
      <p className="text-muted text-xs mb-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
