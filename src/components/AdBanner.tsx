// src/components/AdBanner.tsx
import { useEffect } from 'react';

declare global {
  interface Window { adsbygoogle: any[] }
}

interface Props {
  slot: string;
  format?: string;
}

export default function AdBanner({ slot, format = 'auto' }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className="my-3 text-center">
      <p className="text-slate-600 text-xs mb-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}