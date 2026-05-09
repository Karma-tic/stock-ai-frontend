// src/components/UpgradeModal.tsx
import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

declare global {
  interface Window { Razorpay: any }
}

export default function UpgradeModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

const handlePayment = async () => {
  setLoading(true);
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;

    if (!token) {
      alert('Please login again');
      setLoading(false);
      return;
    }

    console.log('Creating subscription...');
    const res = await axios.post(
      `${BASE}/api/payment/create-subscription`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Subscription created:', res.data);
    const { subscription_id, key } = res.data;

    if (!window.Razorpay) {
      alert('Razorpay failed to load. Please refresh the page.');
      setLoading(false);
      return;
    }

    const options = {
      key,
      subscription_id,
      name:        'Stock AI',
      description: 'Pro Plan — ₹49/month',
      handler: async (response: any) => {
        console.log('Payment response:', response);
        try {
          const verifyRes = await axios.post(
            `${BASE}/api/payment/verify`,
            {
              razorpay_payment_id:      response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature:       response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Verify response:', verifyRes.data);
          alert('🎉 Upgraded to Pro successfully!');
          onSuccess();
          onClose();
        } catch (e: any) {
          console.error('Verify error:', e?.response?.data);
          alert('Payment done but verification failed. Contact support@byteplay.org');
        }
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
          setLoading(false);
        }
      },
      prefill:  { contact: '', email: '' },
      theme:    { color: '#3b82f6' }
    };

    console.log('Opening Razorpay with options:', options);
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      setLoading(false);
    });
    rzp.open();

  } catch (e: any) {
    console.error('Payment setup error:', e?.response?.data || e.message);
    alert(`Error: ${e?.response?.data?.detail || e.message}`);
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-white font-bold text-xl">Upgrade to Pro</h2>
          <p className="text-slate-400 text-sm mt-1">Unlock full access to Stock AI</p>
        </div>

        <div className="space-y-2 mb-6">
          {[
            '✅ Unlimited AI stock analysis',
            '✅ Search any of 500+ stocks',
            '✅ Unlimited watchlist',
            '✅ Portfolio P&L tracker',
            '✅ Daily email digest at 8:30 AM',
            '✅ Hourly auto-refresh signals',
          ].map((f, i) => (
            <p key={i} className="text-slate-300 text-sm">{f}</p>
          ))}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center mb-4">
          <p className="text-blue-400 font-bold text-2xl">₹49<span className="text-sm font-normal">/month</span></p>
          <p className="text-slate-400 text-xs mt-1">Less than one cup of coffee ☕</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Loading...' : '🔓 Upgrade Now — ₹49/month'}
        </button>

        <button onClick={onClose} className="w-full text-slate-500 text-sm mt-3">
          Maybe later
        </button>
      </div>
    </div>
  );
}