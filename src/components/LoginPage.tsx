// src/components/LoginPage.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [mode, setMode] = useState<'google' | 'phone'>('google');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectEmail, setCollectEmail] = useState(false);
const [userEmail, setUserEmail] = useState('');
const [savingEmail, setSavingEmail] = useState(false);

const loginWithGoogle = async () => {
  setLoading(true);
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://byteplay.org'
    }
  });
};

  const sendOtp = async () => {
    setLoading(true); setError('');
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) setError(error.message);
    else setStep('verify');
    setLoading(false);
  };

  const verifyOtp = async () => {
  setLoading(true); setError('');
  const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formatted, token: otp, type: 'sms'
  });
  if (error) { setError(error.message); setLoading(false); return; }

  const token = data.session?.access_token || '';
  localStorage.setItem('sb_token', token);

  // Check if user has email — if not, ask for it
  if (!data.user?.email) {
    setCollectEmail(true);
    setLoading(false);
    return;
  }

  onLogin(token, data.user);
  setLoading(false);
};
const saveEmail = async () => {
  if (!userEmail || !userEmail.includes('@')) {
    setError('Please enter a valid email'); return;
  }
  setSavingEmail(true);
  try {
    await supabase.auth.updateUser({ email: userEmail });
    const { data } = await supabase.auth.getSession();
    onLogin(data.session?.access_token || '', data.session?.user);
  } catch (e: any) {
    setError(e.message);
  }
  setSavingEmail(false);
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📈</div>
          <h1 className="text-3xl font-black text-white">Stock AI</h1>
          <p className="text-slate-400 mt-2">AI-powered NSE/BSE analysis</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          {/* Mode tabs */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
            {(['google', 'phone'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === m ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                {m === 'google' ? '🔵 Google' : '📱 Phone OTP'}
              </button>
            ))}
          </div>

          {/* Google login */}
          {mode === 'google' && (
            <button onClick={loginWithGoogle} disabled={loading}
              className="w-full bg-white text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2">
              {loading ? '⏳ Signing in...' : '🔵 Continue with Google'}
            </button>
          )}

          {/* Phone OTP */}
          {mode === 'phone' && (
            <div className="space-y-3">
              {step === 'input' ? (
                <>
                  <div className="flex">
                    <span className="bg-slate-700 border border-slate-600 border-r-0 rounded-l-xl px-3 flex items-center text-slate-400 text-sm">+91</span>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="9876543210" maxLength={10}
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-r-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button onClick={sendOtp} disabled={loading || phone.length < 10}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-slate-400 text-sm text-center">OTP sent to +91{phone}</p>
                  <input
                    type="text" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP" maxLength={6}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-center text-xl tracking-widest focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={verifyOtp} disabled={loading || otp.length < 6}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                    {loading ? 'Verifying...' : '✅ Verify & Login'}
                  </button>
                  <button onClick={() => setStep('input')} className="w-full text-slate-500 text-sm">← Back</button>
                </>
              )}
            </div>
          )}
           {/* Email collection after phone OTP */}
{collectEmail && (
  <div className="space-y-3">
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
      <p className="text-blue-400 text-sm font-semibold mb-1">
        📧 One last step
      </p>
      <p className="text-slate-400 text-xs">
        Add your email to receive daily AI stock signals at 8:30 AM
      </p>
    </div>
    <input
      type="email"
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      placeholder="your@email.com"
      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
    />
    <button
      onClick={saveEmail}
      disabled={savingEmail}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
    >
      {savingEmail ? 'Saving...' : '✅ Save & Continue'}
    </button>
    <button
      onClick={() => {
        const token = localStorage.getItem('sb_token') || '';
        onLogin(token, null);
      }}
      className="w-full text-slate-500 text-sm"
    >
      Skip for now
    </button>
  </div>
)}
          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        </div>

        <p className="text-slate-600 text-xs text-center mt-6">
          AI signals are for educational purposes only. Not SEBI-registered advice.
        </p>
      </div>
    </div>
  );
}