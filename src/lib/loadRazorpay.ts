// Loads Razorpay Checkout only when a payment screen needs it, instead of on every page.
// Resolves true once window.Razorpay is available, false if the script could not load.
const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let pending: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if ((window as any).Razorpay) return Promise.resolve(true);
  if (pending) return pending;

  pending = new Promise<boolean>((resolve) => {
    const done = (ok: boolean) => {
      if (!ok) pending = null; // allow a retry on the next click
      resolve(ok);
    };
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => done(Boolean((window as any).Razorpay)));
    script.addEventListener('error', () => {
      script.remove();
      done(false);
    });
    if (!existing) {
      script.src = CHECKOUT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
  return pending;
}
