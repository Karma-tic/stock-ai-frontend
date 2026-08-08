// src/components/LoginPage.tsx
import { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Loader2,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: (token: string, user: any) => void;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const marketPreview = [
  { symbol: 'RELIANCE', signal: 'BUY', confidence: 78, change: '+0.74%', color: 'text-green-500' },
  { symbol: 'TCS', signal: 'HOLD', confidence: 65, change: '+3.36%', color: 'text-amber-500' },
  { symbol: 'HDFCBANK', signal: 'WATCH', confidence: 61, change: '-0.45%', color: 'text-red-500' },
];

const consoleSteps = [
  'Reading NSE market data',
  'Checking sector momentum',
  'Scoring news sentiment',
  'Preparing your dashboard',
];

export default function LoginPage({ onLogin, onBack, isDarkMode, onToggleTheme }: Props) {
  const [mode, setMode] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const sendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: undefined,
      }
    });

    if (error) setError(error.message);
    else setStep('verify');
    setLoading(false);
  };

  const verifyEmailOtp = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
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
    <div className="relative min-h-screen overflow-hidden bg-lavender-surface text-lavender-text">
      <style>{`
        @keyframes auth-pulse-line {
          0%, 100% { transform: translateX(-8%) scaleY(0.96); opacity: 0.55; }
          50% { transform: translateX(8%) scaleY(1.04); opacity: 0.95; }
        }
        @keyframes auth-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes auth-scan {
          0% { transform: translateX(-100%); opacity: 0; }
          20%, 80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-lavender-primary/20 to-transparent" />
        <div className="absolute left-1/2 top-20 h-48 w-[70vw] -translate-x-1/2 rounded-full bg-lavender-primary/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(118,75,162,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(118,75,162,0.55)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-lavender-text/10 bg-white px-3 py-2 text-sm font-semibold text-lavender-text shadow-sm transition hover:bg-lavender-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
        ) : (
          <div />
        )}

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-lavender-text/10 bg-white text-lavender-text shadow-sm transition hover:bg-lavender-base"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDarkMode ? 'Light theme' : 'Dark theme'}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-10 pt-2 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="order-2 lg:order-1">
          <div className="mx-auto max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lavender-primary/25 bg-lavender-primary/10 shadow-lavender">
                <TrendingUp className="h-6 w-6 text-lavender-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-lavender-primary">Stock AI</p>
                <h1 className="text-3xl font-black leading-tight text-lavender-text sm:text-5xl">
                  Your market desk, ready in seconds.
                </h1>
              </div>
            </div>

            <p className="mb-6 max-w-lg text-base leading-relaxed text-lavender-text/70 sm:text-lg">
              Sign in to analyze NSE/BSE stocks, track watchlists, compare setups, and keep your research organized in one smooth dashboard.
            </p>

            <div className="app-card relative overflow-hidden p-4 sm:p-5" style={{ animation: 'auth-float 6s ease-in-out infinite' }}>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lavender-primary/70 to-transparent" style={{ animation: 'auth-scan 3s ease-in-out infinite' }} />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-lavender-text/50">Live preview</p>
                  <p className="text-lg font-black text-lavender-text">AI Market Console</p>
                </div>
                <span className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500">
                  ONLINE
                </span>
              </div>

              <div className="mb-5 h-28 overflow-hidden rounded-2xl border border-lavender-text/10 bg-lavender-base p-3">
                <svg viewBox="0 0 420 110" className="h-full w-full" role="img" aria-label="Animated market line">
                  <path
                    d="M8 76 C42 48, 72 56, 102 42 S165 24, 204 48 S272 86, 318 44 S380 30, 412 52"
                    fill="none"
                    stroke="rgb(var(--color-lavender-primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ animation: 'auth-pulse-line 4s ease-in-out infinite' }}
                  />
                  <path
                    d="M8 96 C42 78, 72 82, 102 68 S165 50, 204 70 S272 96, 318 68 S380 58, 412 74"
                    fill="none"
                    stroke="rgb(34 197 94 / 0.45)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ animation: 'auth-pulse-line 5s ease-in-out infinite reverse' }}
                  />
                </svg>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {marketPreview.map(item => (
                  <div key={item.symbol} className="rounded-2xl border border-lavender-text/10 bg-lavender-base p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-lavender-text">{item.symbol}</span>
                      <span className={`text-xs font-bold ${item.color}`}>{item.change}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-lavender-text/60">
                      <span>{item.signal}</span>
                      <span>{item.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {consoleSteps.map((item, index) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-lavender-text/10 bg-lavender-base px-3 py-2 text-sm text-lavender-text/70">
                  <span className="h-2 w-2 rounded-full bg-lavender-primary" style={{ opacity: 0.45 + index * 0.15 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-5 text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lavender-primary/20 bg-lavender-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-lavender-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Secure access
              </div>
              <h2 className="text-3xl font-black text-lavender-text sm:text-4xl">Sign in or create account</h2>
              <p className="mt-2 text-sm leading-relaxed text-lavender-text/70">
                Use Google or email OTP. No password to remember.
              </p>
            </div>

            <div className="app-card p-5 sm:p-6">
              <div className="mb-6 grid grid-cols-2 rounded-2xl border border-lavender-text/10 bg-lavender-base p-1">
                {(['google', 'email'] as const).map(item => (
                  <button
                    key={item}
                    onClick={() => resetMode(item)}
                    className={`rounded-2xl px-3 py-2.5 text-sm font-bold transition ${
                      mode === item
                        ? 'bg-gradient-lavender text-white shadow-lavender'
                        : 'text-lavender-text/70 hover:text-lavender-text'
                    }`}
                  >
                    {item === 'google' ? 'Google' : 'Email OTP'}
                  </button>
                ))}
              </div>

              {mode === 'google' && (
                <div className="space-y-4">
                  <button
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-lavender-text/10 bg-lavender-base px-4 py-3 font-bold text-lavender-text transition hover:border-lavender-primary/30 hover:bg-white disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-slate-900">G</span>}
                    {loading ? 'Opening Google sign in...' : 'Continue with Google'}
                  </button>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-lavender-primary">
                      <ShieldCheck className="h-4 w-4" />
                      Fastest way in
                    </div>
                    <p className="text-sm leading-relaxed text-lavender-text/70">
                      Google sign in keeps your watchlist and dashboard tied to one secure account.
                    </p>
                  </div>
                </div>
              )}

              {mode === 'email' && (
                <div className="space-y-4">
                  {step === 'input' ? (
                    <>
                      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-lavender-primary">
                          <Mail className="h-4 w-4" />
                          Password-free email access
                        </div>
                        <p className="text-sm leading-relaxed text-lavender-text/70">
                          We will send a 6-digit code to your email. New users are created automatically.
                        </p>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-lavender-text/75">Email address</span>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendEmailOtp()}
                          placeholder="you@example.com"
                          className="w-full rounded-2xl border border-lavender-text/10 bg-white px-4 py-3 text-lavender-text shadow-sm outline-none transition placeholder:text-lavender-text/40 focus:border-lavender-primary/50 focus:ring-2 focus:ring-lavender-primary/15"
                        />
                      </label>
                      <button
                        onClick={sendEmailOtp}
                        disabled={loading || !email.includes('@')}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-lavender py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Sending code...' : 'Send sign in code'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-4">
                        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-green-500">
                          <ShieldCheck className="h-4 w-4" />
                          Code sent
                        </div>
                        <p className="text-sm leading-relaxed text-lavender-text/70">
                          Enter the code sent to <strong className="text-lavender-text">{email}</strong>. Check spam if it is not in your inbox.
                        </p>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-lavender-text/75">6-digit code</span>
                        <input
                          type="text"
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          onKeyDown={e => e.key === 'Enter' && verifyEmailOtp()}
                          placeholder="000000"
                          maxLength={6}
                          inputMode="numeric"
                          className="w-full rounded-2xl border border-lavender-text/10 bg-white px-4 py-3 text-center text-xl tracking-widest text-lavender-text shadow-sm outline-none transition placeholder:text-lavender-text/40 focus:border-lavender-primary/50 focus:ring-2 focus:ring-lavender-primary/15"
                        />
                      </label>
                      <button
                        onClick={verifyEmailOtp}
                        disabled={loading || otp.length < 6}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-500 disabled:opacity-50"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Verifying...' : 'Verify and continue'}
                      </button>
                      <button
                        onClick={() => { setStep('input'); setOtp(''); setError(''); }}
                        className="w-full rounded-2xl border border-lavender-text/10 py-2.5 text-sm font-semibold text-lavender-text/70 transition hover:bg-lavender-base hover:text-lavender-text"
                      >
                        Change email
                      </button>
                    </>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Secure OTP', icon: ShieldCheck },
                { label: 'Live data', icon: Activity },
                { label: 'AI signals', icon: BarChart3 },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-lavender-text/10 bg-lavender-base px-2 py-3">
                    <Icon className="mx-auto mb-1 h-4 w-4 text-lavender-primary" />
                    <p className="text-[11px] font-semibold text-lavender-text/60">{item.label}</p>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-lavender-text/50">
              Stock AI is an educational research platform and is not SEBI-registered investment advice.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
