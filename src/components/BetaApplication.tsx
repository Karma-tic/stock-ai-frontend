import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitBetaApplication } from '../lib/api';

export default function BetaApplication() {
  const [form, setForm] = useState({ email: '', name: '', investor_type: '', watchlist_size: '', pain_point: '', consent: false, website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string | boolean) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitBetaApplication({
        ...form,
        watchlist_size: form.watchlist_size === '' ? null : Number(form.watchlist_size),
      });
      setSuccess(true);
    } catch (reason: unknown) {
      const detail = typeof reason === 'object' && reason !== null && 'response' in reason
        ? (reason as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      setError(detail || 'We could not save your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[75vh] bg-lavender-surface px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section className="pt-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender-primary">BytePlay research beta</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-lavender-text sm:text-5xl">Help build a calmer way to follow Indian stocks.</h1>
          <p className="mt-5 text-base leading-7 text-lavender-text/70">We are recruiting a small group of Indian investors to test the Portfolio Event Radar and tell us what is genuinely useful.</p>
          <div className="mt-7 space-y-3">
            {['Track up to five stocks free', 'See source-linked company events', 'Receive a concise after-market brief', 'Give honest feedback—positive or negative'].map(item => (
              <div key={item} className="flex items-start gap-3 text-sm text-lavender-text/80"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-up" /><span>{item}</span></div>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-lavender-text/10 bg-surface/60 p-4 text-xs leading-5 text-lavender-text/60">
            <ShieldCheck className="mb-2 h-5 w-5 text-lavender-primary" />We use your email only for beta access and feedback communication. We do not sell contact data or add applicants to unrelated mailing lists.
          </div>
        </section>

        <section className="app-card p-5 sm:p-8">
          {success ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-up" />
              <h2 className="mt-4 text-2xl font-bold text-lavender-text">Application received</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-lavender-text/65">Thank you. We will email you about beta access and short product-feedback requests.</p>
              <Link to="/" className="mt-6 inline-flex rounded-xl bg-gradient-lavender px-5 py-2.5 text-sm font-bold text-white">Explore BytePlay</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><h2 className="text-2xl font-bold text-lavender-text">Join the first 25 testers</h2><p className="mt-1 text-sm text-lavender-text/60">About two minutes. No payment required.</p></div>
              <label className="block text-sm font-semibold text-lavender-text">Email address *<input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="mt-1.5 w-full rounded-xl border border-lavender-text/15 bg-surface px-3 py-3 font-normal outline-none focus:border-lavender-primary" placeholder="you@example.com" /></label>
              <label className="block text-sm font-semibold text-lavender-text">Name or alias<input value={form.name} maxLength={100} onChange={e => update('name', e.target.value)} className="mt-1.5 w-full rounded-xl border border-lavender-text/15 bg-surface px-3 py-3 font-normal outline-none focus:border-lavender-primary" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-lavender-text">How do you invest?<select value={form.investor_type} onChange={e => update('investor_type', e.target.value)} className="mt-1.5 w-full rounded-xl border border-lavender-text/15 bg-surface px-3 py-3 font-normal outline-none focus:border-lavender-primary"><option value="">Select</option><option>Long-term investor</option><option>Swing trader</option><option>Intraday trader</option><option>New investor</option><option>Research professional</option></select></label>
                <label className="block text-sm font-semibold text-lavender-text">Stocks followed<input type="number" min="0" max="10000" value={form.watchlist_size} onChange={e => update('watchlist_size', e.target.value)} className="mt-1.5 w-full rounded-xl border border-lavender-text/15 bg-surface px-3 py-3 font-normal outline-none focus:border-lavender-primary" placeholder="e.g. 15" /></label>
              </div>
              <label className="block text-sm font-semibold text-lavender-text">What wastes the most time in your stock research?<textarea required value={form.pain_point} maxLength={1000} rows={4} onChange={e => update('pain_point', e.target.value)} className="mt-1.5 w-full resize-none rounded-xl border border-lavender-text/15 bg-surface px-3 py-3 font-normal outline-none focus:border-lavender-primary" placeholder="For example: I miss important NSE filings…" /></label>
              <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => update('website', e.target.value)} /></label>
              <label className="flex items-start gap-3 rounded-xl bg-lavender-primary/5 p-3 text-xs leading-5 text-lavender-text/70"><input type="checkbox" required checked={form.consent} onChange={e => update('consent', e.target.checked)} className="mt-1 h-4 w-4 accent-cobalt" /><span>I agree that BytePlay may email me about beta access and product-feedback requests. I can opt out at any time. See the <Link to="/privacy" className="font-bold text-lavender-primary underline">Privacy Policy</Link>.</span></label>
              {error && <p className="rounded-xl border border-down/20 bg-down/10 p-3 text-sm text-down">{error}</p>}
              <button disabled={submitting || !form.consent} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-lavender px-5 py-3 font-bold text-white disabled:opacity-50">{submitting ? 'Submitting…' : 'Apply for free beta'}<ArrowRight className="h-4 w-4" /></button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
