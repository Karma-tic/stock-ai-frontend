// src/components/UpgradeModal.tsx
import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

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

  const plans = [
    {
      id:       'trial' as PlanType,
      emoji:    '🎯',
      title:    '1 Day Trial',
      price:    '₹1',
      period:   'one time',
      desc:     'Try everything for 1 day',
      amount:   100,  // paise
      days:     1,
      badge:    'TRY IT',
      badgeColor: 'bg-yellow-500',
      border:   'border-yellow-500',
      popular:  false,
    },
    {
      id:       'onetime' as PlanType,
      emoji:    '🔓',
      title:    '1 Month Access',
      price:    '₹49',
      period:   'no auto-renewal',
      desc:     'Pay once, access for 30 days',
      amount:   4900,
      days:     30,
      badge:    'POPULAR',
      badgeColor: 'bg-blue-500',
      border:   'border-blue-500',
      popular:  true,
    },
    {
      id:       'subscription' as PlanType,
      emoji:    '♾️',
      title:    'Monthly Plan',
      price:    '₹49',
      period:   'auto-renews monthly',
      desc:     'Never lose access, cancel anytime',
      amount:   4900,
      days:     30,
      badge:    'BEST VALUE',
      badgeColor: 'bg-green-500',
      border:   'border-green-500',
      popular:  false,
    },
  ];

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) { alert('Please login again'); setLoading(false); return; }

      let orderData: any;

      if (plan.id === 'subscription') {
        // Razorpay subscription (auto-renew)
        const res = await axios.post(
          `${BASE}/api/payment/create-subscription`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        orderData = { type: 'subscription', ...res.data };
      } else {
        // One-time order (trial or monthly)
        const res = await axios.post(
          `${BASE}/api/payment/create-order`,
          { amount: plan.amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        orderData = { type: 'order', ...res.data };
      }

      const options: any = {
        key:         orderData.key,
        name:        'Stock AI',
        description: plan.title,
        theme:       { color: '#3b82f6' },
        modal: {
          ondismiss: () => setLoading(false)
        },
      };

      if (orderData.type === 'subscription') {
        options.subscription_id = orderData.subscription_id;
        options.handler = async (response: any) => {
          await axios.post(`${BASE}/api/payment/verify`, {
            razorpay_payment_id:      response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature:       response.razorpay_signature,
          }, { headers: { Authorization: `Bearer ${token}` } });
          alert('🎉 You are now Pro!');
          onSuccess(); onClose();
        };
      } else {
        options.order_id = orderData.order_id;
        options.amount   = orderData.amount;
        options.currency = 'INR';
        options.handler  = async (response: any) => {
          await axios.post(`${BASE}/api/payment/verify-order`, {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            days:                plan.days,
          }, { headers: { Authorization: `Bearer ${token}` } });
          const msg = plan.id === 'trial'
            ? '🎉 Trial activated! Enjoy 1 day of Pro access.'
            : '🎉 You are now Pro for 30 days!';
          alert(msg);
          onSuccess(); onClose();
        };
      }

      options.prefill = { email: session.session?.user?.email || '' };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        alert(`Payment failed: ${r.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (e: any) {
      alert(`Error: ${e?.response?.data?.detail || e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 text-center border-b border-slate-700">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-white font-bold text-xl">Upgrade to Pro</h2>
          <p className="text-slate-400 text-sm mt-1">Choose a plan that works for you</p>
        </div>

        {/* Features */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="grid grid-cols-2 gap-2">
            {[
              '✅ Unlimited AI analysis',
              '✅ Search 500+ stocks',
              '✅ Unlimited watchlist',
              '✅ Portfolio tracker',
              '✅ Morning email digest',
              '✅ Hourly signals',
            ].map(f => (
              <p key={f} className="text-slate-300 text-xs">{f}</p>
            ))}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="p-4 space-y-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition ${
                selected === plan.id
                  ? plan.border + ' bg-slate-800'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              {/* Badge */}
              <span className={`absolute -top-2.5 left-4 text-xs text-white px-2 py-0.5 rounded-full font-bold ${plan.badgeColor}`}>
                {plan.badge}
              </span>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Radio */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === plan.id ? plan.border : 'border-slate-600'
                  }`}>
                    {selected === plan.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{plan.emoji} {plan.title}</p>
                    <p className="text-slate-400 text-xs">{plan.desc}</p>
                    <p className="text-slate-500 text-xs">{plan.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-xl">{plan.price}</p>
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
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg"
          >
            {loading ? '⏳ Processing...' : selected ? `Pay ${plans.find(p => p.id === selected)?.price}` : 'Select a Plan'}
          </button>
          <button onClick={onClose} className="w-full text-slate-500 text-sm mt-3 py-2">
            Maybe later
          </button>
          <p className="text-slate-600 text-xs text-center mt-2">
            Secured by Razorpay • contact@karmatix.in
          </p>
        </div>
      </div>
    </div>
  );
}