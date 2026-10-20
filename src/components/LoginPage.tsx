import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, FileText, Loader2, LockKeyhole, Mail, Moon, Radar, Scale, Star, Sun } from 'lucide-react';
import Logo from './ui/Logo';
import { buttonClass } from './ui/Button';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: (token: string, user: any) => void;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export default function LoginPage({ onLogin, onBack, isDarkMode, onToggleTheme }: Props) {
  const location = useLocation();
  const [mode, setMode] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestedPath = new URLSearchParams(location.search).get('next');
  const safeNext = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/';

  const loginWithGoogle = async () => {
    setLoading(true);
    setError('');
    sessionStorage.setItem('stock_ai_post_auth_redirect', safeNext);
    const callback = new URL('/login', window.location.origin);
    callback.searchParams.set('next', safeNext);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback.toString() } });
    if (oauthError) {
      setError(oauthError.message || 'Google sign-in could not be started. Please try again.');
      setLoading(false);
    }
  };

  const sendEmailOtp = async () => {
    if (!email || !email.includes('@')) return setError('Enter a valid email address.');
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: undefined } });
    if (error) setError(error.message);
    else setStep('verify');
    setLoading(false);
  };

  const verifyEmailOtp = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (error) {
      setError('Invalid or expired code. Please try again.');
      setLoading(false);
      return;
    }
    const token = data.session?.access_token || '';
    localStorage.setItem('sb_token', token);
    onLogin(token, data.user);
    setLoading(false);
  };

  const resetMode = (nextMode: 'google' | 'email') => {
    setMode(nextMode);
    setStep('input');
    setError('');
    setOtp('');
  };

  const field =
    'h-12 w-full rounded-control border border-line bg-surface px-4 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25';

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <header className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-8">
        <button type="button" onClick={onBack} className="inline-flex h-11 items-center gap-2 rounded-control px-2 text-sm font-medium text-muted transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Home
        </button>
        <Link to="/" aria-label="Stock AI home" className="lg:hidden">
          <Logo />
        </Link>
        {onToggleTheme ? (
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-11 w-11 place-items-center rounded-control text-muted transition hover:bg-ink/[0.06] hover:text-ink"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkMode ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />}
          </button>
        ) : (
          <span className="w-11" />
        )}
      </header>

      <main className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* What you get: the sources-first promise, shown once */}
        <section className="hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-center lg:px-14 xl:px-20">
          <div className="max-w-xl">
            <Link to="/" aria-label="Stock AI home">
              <Logo />
            </Link>
            <h1 className="mt-12 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-ink xl:text-5xl text-balance">
              Research Indian stocks with the sources attached.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Every point links back to the filing or article it came from, so you can check it yourself.
            </p>

            {/* An illustrative evidence point, labelled as an example */}
            <figure className="mt-10 rounded-card border border-line bg-canvas p-4">
              <figcaption className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Example evidence point</figcaption>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">Quarterly revenue rose against the previous quarter, per the company's results filing.</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                <FileText className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" /> NSE filing
              </span>
            </figure>

            <ul className="mt-10 space-y-4 text-sm">
              {[
                { Icon: Scale, title: 'Evidence Board', text: 'What supports and what worries, side by side, for any NSE stock.' },
                { Icon: Radar, title: 'Today', text: 'Filings and news for your stocks, in time order.' },
                { Icon: Star, title: 'Watchlist and portfolio', text: 'Saved to your account, on every device.' },
              ].map(({ Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <b className="block font-semibold text-ink">{title}</b>
                    <span className="text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The form */}
        <section className="flex items-start justify-center px-4 py-10 sm:items-center sm:px-10">
          <div className="w-full max-w-[420px]">
            <h2 className="text-3xl font-bold tracking-[-0.025em] text-ink">Sign in or sign up</h2>
            <p className="mt-2 text-sm leading-6 text-muted">One step either way. New here? An account is created the first time you sign in.</p>

            {mode === 'google' ? (
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className={buttonClass('ghost', 'lg', 'w-full bg-surface')}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <img src="/assets/google.svg" alt="" className="h-5 w-5" />}
                  {loading ? 'Opening Google…' : 'Continue with Google'}
                </button>
                <div className="flex items-center gap-4" aria-hidden="true">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-xs text-muted">or</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <button type="button" onClick={() => resetMode('email')} className={buttonClass('ghost', 'lg', 'w-full bg-surface')}>
                  <Mail className="h-5 w-5 text-muted" strokeWidth={1.75} />
                  Continue with email
                </button>
              </div>
            ) : step === 'input' ? (
              <div className="mt-8 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendEmailOtp()}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    className={field}
                  />
                </label>
                <button type="button" onClick={sendEmailOtp} disabled={loading || !email.includes('@')} className={buttonClass('primary', 'lg', 'w-full')}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Sending code…' : 'Email me a code'}
                </button>
                <p className="flex items-center gap-2 text-xs text-muted">
                  <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.75} /> No password. We'll email you a six-digit code.
                </p>
                <button type="button" onClick={() => resetMode('google')} className="text-sm font-medium text-accent hover:underline">
                  Use Google instead
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <p className="flex items-start gap-2 rounded-control bg-up/10 px-3 py-2.5 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-up" strokeWidth={2} />
                  <span>
                    Code sent to <strong className="font-semibold">{email}</strong>. Check spam if it isn't there in a minute.
                  </span>
                </p>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Six-digit code</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && verifyEmailOtp()}
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    className={`${field} num text-center text-xl tracking-[0.4em]`}
                  />
                </label>
                <button type="button" onClick={verifyEmailOtp} disabled={loading || otp.length < 6} className={buttonClass('primary', 'lg', 'w-full')}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Verifying…' : 'Verify and continue'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Use a different email
                </button>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-5 rounded-control bg-down/10 px-3 py-2.5 text-sm text-down">
                {error}
              </p>
            )}

            <p className="mt-10 border-t border-line pt-6 text-xs leading-5 text-muted">
              Stock AI is an educational research tool, not SEBI-registered investment advice. By continuing you agree to our{' '}
              <Link to="/terms" className="text-ink underline-offset-2 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-ink underline-offset-2 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
