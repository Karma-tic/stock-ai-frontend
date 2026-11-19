// src/lib/toast.ts
// Small confirmations for things the person just did. Android gets a short
// haptic tick where the browser supports it; iOS Safari ignores it.
import { toast } from 'sonner';

export function haptic() {
  try {
    if ('vibrate' in navigator) navigator.vibrate?.(8);
  } catch {
    /* not supported */
  }
}

export function toastAdded(ticker: string) {
  haptic();
  toast.success(`${ticker} added. You'll see its news here each morning.`);
}

export function toastRemoved(ticker: string, undo: () => void) {
  toast(`${ticker} removed`, { duration: 5000, action: { label: 'Undo', onClick: undo } });
}

export { toast };
