// src/lib/usePlan.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function usePlan() {
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) { setLoading(false); return; }

      try {
        const res = await axios.get(`${BASE}/api/payment/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlan(res.data.plan === 'pro' ? 'pro' : 'free');
      } catch { setPlan('free'); }
      setLoading(false);
    };
    check();
  }, []);

  return { plan, isPro: plan === 'pro', loading };
}