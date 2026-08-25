import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, KeyRound, Loader2, LockKeyhole, Mail, Moon, ShieldCheck, Sun, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: (token: string, user: any) => void;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export default function LoginPage({ onLogin, onBack, isDarkMode, onToggleTheme }: Props) {
  const [mode, setMode] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
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
    <div className="min-h-screen overflow-hidden bg-[#050b16] text-slate-100">
      <style>{`
        @keyframes auth-enter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auth-chart { 0%, 100% { transform: translateX(-0.5%); opacity: .78; } 50% { transform: translateX(.5%); opacity: 1; } }
        @keyframes auth-live { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .auth-motion { animation: none !important; } }
      `}</style>

      <header className="relative z-20 flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8 lg:px-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>
        <div className="flex items-center gap-3 lg:hidden">
          <TrendingUp className="h-5 w-5 text-violet-400" />
          <span className="text-sm font-semibold tracking-[0.2em] text-white">STOCK AI</span>
        </div>
        {onToggleTheme && (
          <button onClick={onToggleTheme} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white" aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
      </header>

      <main className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1.12fr_0.88fr]">
        <section className="relative hidden overflow-hidden border-r border-white/[0.08] lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-14 xl:px-20">
          <div className="relative z-10 auth-motion" style={{ animation: 'auth-enter .65s ease-out both' }}>
            <div className="mb-16 flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-violet-400" />
              <span className="text-base font-semibold tracking-[0.22em] text-white">STOCK AI</span>
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-white xl:text-6xl">
              Market intelligence.<br />
              <span className="text-violet-400">Built for Indian investors.</span>
            </h1>
            <div className="my-8 h-px w-8 bg-violet-400" />
            <p className="max-w-lg text-base leading-7 text-slate-400">
              Understand NSE and BSE stocks, follow what matters, and keep your research organized in one focused workspace.
            </p>
          </div>

          <div className="relative -mx-10 -mb-4 mt-4 h-[330px] xl:h-[390px]">
            <img src="/assets/auth-market-visual.png" alt="Subtle Indian market trend visualization" className="auth-motion h-full w-full object-cover opacity-85" style={{ animation: 'auth-chart 8s ease-in-out infinite' }} />
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-6 text-xs text-slate-400">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-slate-300" /><span><b className="block font-medium text-slate-200">Private workspace</b>Your saved research stays with your account</span></div>
            <div className="flex items-start gap-3"><KeyRound className="mt-0.5 h-4 w-4 text-slate-300" /><span><b className="block font-medium text-slate-200">Passwordless access</b>Google or secure email OTP</span></div>
            <div className="flex items-start gap-3"><TrendingUp className="mt-0.5 h-4 w-4 text-slate-300" /><span><b className="block font-medium text-slate-200">Indian markets</b>NSE and BSE research tools</span></div>
          </div>
        </section>

        <section className="relative flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="auth-motion w-full max-w-[480px]" style={{ animation: 'auth-enter .65s .12s ease-out both' }}>
            <div className="mb-9">
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Sign in to continue to your Stock AI dashboard.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 border-b border-white/10">
              {(['google', 'email'] as const).map(item => (
                <button key={item} onClick={() => resetMode(item)} className={`relative px-3 pb-4 text-sm font-semibold transition ${mode === item ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  {item === 'google' ? 'Google' : 'Email OTP'}
                  {mode === item && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-violet-400" />}
                </button>
              ))}
            </div>

            {mode === 'google' ? (
              <div className="space-y-7">
                <button onClick={loginWithGoogle} disabled={loading} className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#050b16] disabled:opacity-60">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <img src="/assets/google.svg" alt="" className="h-5 w-5" />}
                  {loading ? 'Opening Google…' : 'Continue with Google'}
                </button>
                <div className="flex items-center gap-4"><span className="h-px flex-1 bg-white/10" /><span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">or</span><span className="h-px flex-1 bg-white/10" /></div>
                <button onClick={() => resetMode('email')} className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-white/15 text-sm font-semibold text-slate-200 transition hover:border-violet-400/60 hover:bg-white/[0.03]">
                  <Mail className="h-5 w-5 text-slate-400" />
                  Continue with Email OTP
                </button>
              </div>
            ) : step === 'input' ? (
              <div className="space-y-5">
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Email address</span><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendEmailOtp()} placeholder="you@example.com" autoComplete="email" className="h-14 w-full rounded-lg border border-white/15 bg-transparent pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-1 focus:ring-violet-400" /></div></label>
                <button onClick={sendEmailOtp} disabled={loading || !email.includes('@')} className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-violet-500 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Sending code…' : 'Send OTP'}</button>
                <p className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-3.5 w-3.5" />No password. We’ll email you a six-digit code.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start gap-3 border-l-2 border-emerald-400 bg-emerald-400/[0.06] px-4 py-3"><Check className="mt-0.5 h-4 w-4 text-emerald-400" /><p className="text-sm leading-6 text-slate-300">Code sent to <strong className="font-semibold text-white">{email}</strong></p></div>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Six-digit code</span><input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} onKeyDown={e => e.key === 'Enter' && verifyEmailOtp()} placeholder="000000" maxLength={6} inputMode="numeric" autoComplete="one-time-code" className="h-14 w-full rounded-lg border border-white/15 bg-transparent px-4 text-center text-xl tracking-[0.3em] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400 focus:ring-1 focus:ring-violet-400" /></label>
                <button onClick={verifyEmailOtp} disabled={loading || otp.length < 6} className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-violet-500 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Verifying…' : 'Verify and continue'}</button>
                <button onClick={() => { setStep('input'); setOtp(''); setError(''); }} className="w-full text-sm font-medium text-slate-500 transition hover:text-slate-300">Use a different email</button>
              </div>
            )}

            {error && <div className="mt-5 border-l-2 border-red-400 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">{error}</div>}

            <div className="mt-9 flex items-start gap-3 border-t border-white/[0.08] pt-6">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
              <p className="text-xs leading-5 text-slate-500">Passwordless authentication keeps access simple while your watchlist and research remain connected to one account.</p>
            </div>

            <p className="mt-10 text-xs leading-5 text-slate-600">
              Stock AI is an educational research platform, not SEBI-registered investment advice. By continuing, you agree to our <Link to="/terms" className="text-slate-400 hover:text-white">Terms</Link> and <Link to="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
