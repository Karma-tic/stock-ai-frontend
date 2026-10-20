import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, KeyRound, Loader2, LockKeyhole, Mail, Moon, ShieldCheck, Sun, TrendingUp } from 'lucide-react';
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

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b16] text-muted">
      <style>{`
        @keyframes auth-enter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auth-chart { 0%, 100% { transform: translateX(-0.5%); opacity: .78; } 50% { transform: translateX(.5%); opacity: 1; } }
        @keyframes auth-live { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .auth-motion { animation: none !important; } }
      `}</style>

      <header className="relative z-20 flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8 lg:px-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>
        <div className="flex items-center gap-3 lg:hidden">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold tracking-[0.2em] text-white">STOCK AI</span>
        </div>
        {onToggleTheme && (
          <button onClick={onToggleTheme} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted transition hover:border-white/20 hover:text-white" aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
      </header>

      <main className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1.12fr_0.88fr]">
        <section className="relative hidden overflow-hidden border-r border-white/[0.08] lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-14 xl:px-20">
          <div className="relative z-10 auth-motion" style={{ animation: 'auth-enter .65s ease-out both' }}>
            <div className="mb-16 flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-accent" />
              <span className="text-base font-semibold tracking-[0.22em] text-white">STOCK AI</span>
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-white xl:text-6xl">
              Market intelligence.<br />
              <span className="text-accent">Built for Indian investors.</span>
            </h1>
            <div className="my-8 h-px w-8 bg-cobalt" />
            <p className="max-w-lg text-base leading-7 text-muted">
              Understand NSE and BSE stocks, follow what matters, and keep your research organized in one focused workspace.
            </p>
          </div>

          <div className="relative -mx-10 -mb-4 mt-4 h-[330px] xl:h-[390px]">
            <img src="/assets/auth-market-visual.png" alt="Subtle Indian market trend visualization" className="auth-motion h-full w-full object-cover opacity-85" style={{ animation: 'auth-chart 8s ease-in-out infinite' }} />
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-6 text-xs text-muted">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-muted" /><span><b className="block font-medium text-muted">Private workspace</b>Your saved research stays with your account</span></div>
            <div className="flex items-start gap-3"><KeyRound className="mt-0.5 h-4 w-4 text-muted" /><span><b className="block font-medium text-muted">Passwordless access</b>Google or secure email OTP</span></div>
            <div className="flex items-start gap-3"><TrendingUp className="mt-0.5 h-4 w-4 text-muted" /><span><b className="block font-medium text-muted">Indian markets</b>NSE and BSE research tools</span></div>
          </div>
        </section>

        <section className="relative flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="auth-motion w-full max-w-[480px]" style={{ animation: 'auth-enter .65s .12s ease-out both' }}>
            <div className="mb-9">
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Sign in to continue to your Stock AI dashboard.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 border-b border-white/10">
              {(['google', 'email'] as const).map(item => (
                <button key={item} onClick={() => resetMode(item)} className={`relative px-3 pb-4 text-sm font-semibold transition ${mode === item ? 'text-accent' : 'text-muted hover:text-muted'}`}>
                  {item === 'google' ? 'Google' : 'Email OTP'}
                  {mode === item && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-cobalt" />}
                </button>
              ))}
            </div>

            {mode === 'google' ? (
              <div className="space-y-7">
                <button onClick={loginWithGoogle} disabled={loading} className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#f8fafc] px-5 text-sm font-semibold text-[#0f172a] transition hover:bg-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-[#050b16] disabled:opacity-60">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <img src="/assets/google.svg" alt="" className="h-5 w-5" />}
                  {loading ? 'Opening Google…' : 'Continue with Google'}
                </button>
                <div className="flex items-center gap-4"><span className="h-px flex-1 bg-surface/10" /><span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">or</span><span className="h-px flex-1 bg-surface/10" /></div>
                <button onClick={() => resetMode('email')} className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-white/15 text-sm font-semibold text-muted transition hover:border-accent/60 hover:bg-surface/[0.03]">
                  <Mail className="h-5 w-5 text-muted" />
                  Continue with Email OTP
                </button>
              </div>
            ) : step === 'input' ? (
              <div className="space-y-5">
                <label className="block"><span className="mb-2 block text-sm font-medium text-muted">Email address</span><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendEmailOtp()} placeholder="you@example.com" autoComplete="email" className="h-14 w-full rounded-lg border border-white/15 bg-transparent pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-accent/40 focus:ring-1 focus:ring-accent/40" /></div></label>
                <button onClick={sendEmailOtp} disabled={loading || !email.includes('@')} className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-cobalt text-sm font-semibold text-white transition hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-40">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Sending code…' : 'Send OTP'}</button>
                <p className="flex items-center gap-2 text-xs text-muted"><LockKeyhole className="h-3.5 w-3.5" />No password. We’ll email you a six-digit code.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start gap-3 border-l-2 border-up/40 bg-up/[0.06] px-4 py-3"><Check className="mt-0.5 h-4 w-4 text-up" /><p className="text-sm leading-6 text-muted">Code sent to <strong className="font-semibold text-white">{email}</strong></p></div>
                <label className="block"><span className="mb-2 block text-sm font-medium text-muted">Six-digit code</span><input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} onKeyDown={e => e.key === 'Enter' && verifyEmailOtp()} placeholder="000000" maxLength={6} inputMode="numeric" autoComplete="one-time-code" className="h-14 w-full rounded-lg border border-white/15 bg-transparent px-4 text-center text-xl tracking-[0.3em] text-white outline-none transition placeholder:text-ink focus:border-accent/40 focus:ring-1 focus:ring-accent/40" /></label>
                <button onClick={verifyEmailOtp} disabled={loading || otp.length < 6} className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-cobalt text-sm font-semibold text-white transition hover:bg-cobalt disabled:opacity-40">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Verifying…' : 'Verify and continue'}</button>
                <button onClick={() => { setStep('input'); setOtp(''); setError(''); }} className="w-full text-sm font-medium text-muted transition hover:text-muted">Use a different email</button>
              </div>
            )}

            {error && <div className="mt-5 border-l-2 border-down/40 bg-down/[0.06] px-4 py-3 text-sm text-down">{error}</div>}

            <div className="mt-9 flex items-start gap-3 border-t border-white/[0.08] pt-6">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-xs leading-5 text-muted">Passwordless authentication keeps access simple while your watchlist and research remain connected to one account.</p>
            </div>

            <p className="mt-10 text-xs leading-5 text-muted">
              Stock AI is an educational research platform, not SEBI-registered investment advice. By continuing, you agree to our <Link to="/terms" className="text-muted hover:text-white">Terms</Link> and <Link to="/privacy" className="text-muted hover:text-white">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
