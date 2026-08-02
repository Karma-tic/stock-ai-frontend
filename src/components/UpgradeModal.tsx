// src/components/UpgradeModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { Target, Unlock, RefreshCw, Check } from 'lucide-react';


const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

declare global {
  interface Window { Razorpay: any }
}

type PlanType = 'trial' | 'onetime' | 'subscription' | null;

export default function UpgradeModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState<PlanType>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.has_used_trial) {
        setHasUsedTrial(true);
      }
    });
  }, []);
    const features = [
    'Unlimited AI analysis',
    'Search 500+ stocks',
    'Unlimited watchlist',
    'Portfolio tracker',
    'Morning email digest',
    'Hourly signals',
  ];
const plans = [
  {
    id:       'trial' as PlanType,
    emoji:    '🎯',
    title:    '1 Day Trial',
    price:    '₹1',
    period:   'one time',
    desc:     'Try everything for 1 day',
    amount:   100,
    days:     1,
    badge:    'TRY IT',
    badgeColor: 'bg-yellow-500',
    border:   'border-yellow-500',
  },
  {
    id:       'onetime' as PlanType,
    emoji:    '🔓',
    title:    '1 Month Access',
    price:    '₹99',
    originalPrice: '₹499',
    period:   'no auto-renewal',
    desc:     'Pay once, access for 30 days',
    amount:   9900,
    days:     30,
    badge:    'POPULAR',
    badgeColor: 'bg-blue-500',
    border:   'border-blue-500',
  },
  // REMOVED subscription plan — UPI AutoPay not supported yet
];
  const planIcons: Record<PlanType, React.ReactNode> = {
  trial: <Target className="w-5 h-5 text-yellow-400" />,
  onetime: <Unlock className="w-5 h-5 text-blue-600" />,
  subscription: <RefreshCw className="w-5 h-5 text-green-600" />
};

  const handlePayment = async (plan: typeof plans[0]) => {
  setLoading(true);
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) {
      alert('Please login again');
      setLoading(false);
      return;
    }

    // Always use one-time order — no subscriptions
    const res = await axios.post(
      `${BASE}/api/payment/create-order`,
      { amount: plan.amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderData = res.data;
    console.log('Order created:', orderData);

    const options: any = {
      key:         orderData.key,
      order_id:    orderData.order_id,
      amount:      orderData.amount,
      currency:    'INR',
      name:        'Stock AI',
      description: plan.title,
      theme:       { color: '#3b82f6' },
      modal: {
        ondismiss: () => {
          console.log('Payment dismissed');
          setLoading(false);
        }
      },
      handler: async (response: any) => {
        console.log('Payment success:', response);
        try {
          const verifyRes = await axios.post(
            `${BASE}/api/payment/verify-order`,
            {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              days:                plan.days,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log('Verify success:', verifyRes.data);
          alert(
            plan.days === 1
              ? '✅ Trial activated! Enjoy 1 day Pro access.'
              : '✅ You are now Pro for 30 days!'
          );
          onSuccess();
          onClose();
        } catch (e: any) {
          const detail = e?.response?.data?.detail || e.message;
          console.error('Verify failed:', detail);
          alert(
            `Payment received but activation failed.\n` +
            `Error: ${detail}\n` +
            `Payment ID: ${response.razorpay_payment_id}\n` +
            `Email contact@karmatix.in with this ID for manual activation.`
          );
        }
      },
      prefill: { email: session.session?.user?.email || '' },
    };

    if (!window.Razorpay) {
      alert('Payment gateway failed to load. Please refresh the page.');
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      console.error('Payment failed:', r.error);
      alert(`Payment failed: ${r.error.description}\nTry a different payment method.`);
      setLoading(false);
    });
    rzp.open();

  } catch (e: any) {
    console.error('Payment error:', e?.response?.data || e.message);
    alert(`Error: ${e?.response?.data?.detail || e.message}`);
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-white/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-gray-300 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 text-center border-b border-gray-300">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-gray-900 font-bold text-xl">Upgrade to Pro</h2>
          <p className="text-gray-500 text-sm mt-1">Choose a plan that works for you</p>
        </div>

        {/* Features */}


       {features.map(f => (
  <div key={f} className="flex items-center gap-2">
    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
    <p className="text-gray-600 text-xs">{f}</p>
  </div>
))}

        {/* Plan Cards */}
        <div className="p-4 space-y-3">
          {plans.filter(p => !(p.id === 'trial' && hasUsedTrial)).map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition ${
                selected === plan.id
                  ? plan.border + ' bg-gray-50'
                  : 'border-gray-300 hover:border-slate-500'
              }`}
            >
              {/* Badge */}
              <span className={`absolute -top-2.5 left-4 text-xs text-gray-900 px-2 py-0.5 rounded-full font-bold ${plan.badgeColor}`}>
                {plan.badge}
              </span>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Radio */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === plan.id ? plan.border : 'border-gray-400'
                  }`}>
                    {selected === plan.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold flex items-center gap-2">
  {planIcons[plan.id]}
  {plan.title}
</p>
                    <p className="text-gray-500 text-xs">{plan.desc}</p>
                    <p className="text-gray-400 text-xs">{plan.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {'originalPrice' in plan && (
                      <p className="text-gray-400 text-sm line-through">{(plan as any).originalPrice}</p>
                    )}
                    <p className="text-gray-900 font-black text-xl">{plan.price}</p>
                    {'originalPrice' in plan && (
                      <span className="text-xs bg-green-500 text-black px-1.5 py-0.5 rounded font-bold">80% OFF</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-4 pt-0">
          <button
            onClick={() => {
              const plan = plans.find(p => p.id === selected);
              if (plan) handlePayment(plan);
              else alert('Please select a plan');
            }}
            disabled={loading || !selected}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-gray-900 font-bold py-4 rounded-xl transition text-lg"
          >
           {loading ? '⏳ Processing...' : selected ? `Pay ${plans.find(p => p.id === selected)?.price} →` : 'Select a Plan'}
          </button>
          <button onClick={onClose} className="w-full text-gray-400 text-sm mt-3 py-2">
            Maybe later
          </button>
          <p className="text-gray-300 text-xs text-center mt-2">
            Secured by Razorpay • contact@karmatix.in
          </p>
        </div>
      </div>
    </div>
  );
}