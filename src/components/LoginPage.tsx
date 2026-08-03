// src/components/LoginPage.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: (token: string, user: any) => void;
  onBack?: () => void;
}

export default function LoginPage({ onLogin, onBack }: Props) {
  const [mode, setMode]       = useState<'google' | 'email'>('google');
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [step, setStep]       = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const loginWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

const sendEmailOtp = async () => {
  if (!email || !email.includes('@')) {
    setError('Please enter a valid email'); return;
  }
  setLoading(true); setError('');

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo:  undefined,
    }
  });

  if (error) setError(error.message);
  else setStep('verify');
  setLoading(false);
};

const verifyEmailOtp = async () => {
  setLoading(true); setError('');
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type:  'email',
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

  return (
    <div className="min-h-screen bg-lavender-surface flex flex-col">
      {onBack && (
        <div className="p-4">
          <button onClick={onBack}
            className="flex items-center gap-2 text-lavender-text/70 hover:text-lavender-text transition text-sm">
            ← Back to Home
          </button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📈</div>
            <h1 className="text-3xl font-black text-lavender-text">Stock AI</h1>
            <p className="text-lavender-text/70 mt-2">AI-powered NSE/BSE analysis</p>
          </div>

          <div className="bg-white border border-lavender-text/10 shadow-sm rounded-2xl p-6">
            {/* Mode tabs */}
            <div className="flex bg-lavender-surface rounded-2xl p-1 mb-6">
              {(['google', 'email'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setStep('input'); setError(''); }}
                  className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition ${
                    mode === m ? 'bg-gradient-lavender text-white' : 'text-lavender-text/70'
                  }`}>
                  {m === 'google' ? '🔵 Google' : '📧 Email OTP'}
                </button>
              ))}
            </div>

            {/* Google login */}
            {mode === 'google' && (
              <button onClick={loginWithGoogle} disabled={loading}
                className="w-full bg-lavender-surface text-slate-900 font-semibold py-3 rounded-2xl hover:bg-slate-100 transition flex items-center justify-center gap-2">
                {loading ? '⏳ Signing in...' : '🔵 Continue with Google'}
              </button>
            )}

            {/* Email OTP */}
            {mode === 'email' && (
              <div className="space-y-3">
                {step === 'input' ? (
                  <>
                    <div className="bg-blue-500/10 border border-white/50 rounded-2xl p-3">
                      <p className="text-lavender-primary text-xs">
                        📧 We'll send a 6-digit OTP to your email. No password needed.
                      </p>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendEmailOtp()}
                      placeholder="your@email.com"
                      className="w-full bg-white border border-lavender-text/10 shadow-sm rounded-2xl px-4 py-3 text-lavender-text focus:outline-none focus:border-white/50"
                    />
                    <button onClick={sendEmailOtp}
                      disabled={loading || !email.includes('@')}
                      className="w-full bg-gradient-lavender hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition">
                      {loading ? 'Sending...' : 'Send OTP to Email'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3">
                      <p className="text-green-600 text-xs">
                        ✅ OTP sent to <strong>{email}</strong>
                        <br />Check your inbox (and spam folder)
                      </p>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && verifyEmailOtp()}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full bg-white border border-lavender-text/10 shadow-sm rounded-2xl px-4 py-3 text-lavender-text text-center text-xl tracking-widest focus:outline-none focus:border-white/50"
                    />
                    <button onClick={verifyEmailOtp}
                      disabled={loading || otp.length < 6}
                      className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-lavender-text font-semibold py-3 rounded-2xl transition">
                      {loading ? 'Verifying...' : '✅ Verify & Login'}
                    </button>
                    <button onClick={() => { setStep('input'); setOtp(''); setError(''); }}
                      className="w-full text-lavender-text/60 text-sm">
                      ← Change email
                    </button>
                  </>
                )}
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center mt-3">❌ {error}</p>
            )}
          </div>

          <p className="text-gray-300 text-xs text-center mt-6">
            AI signals are for educational purposes only. Not SEBI-registered advice.
          </p>
        </div>
      </div>
    </div>
  );
}