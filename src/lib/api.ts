// src/lib/api.ts
import axios from 'axios';
import { supabase } from './supabase';

export const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

// Get fresh token every request
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('sb_token', token);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401 && window.location.pathname !== '/login') {
      const next = `${window.location.pathname}${window.location.search}`;
      localStorage.removeItem('sb_token');
      await supabase.auth.signOut({ scope: 'local' });
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
    }
    return Promise.reject(error);
  }
);

export const getTopStocks = () => api.get('/api/market/top');
export type BetaApplicationPayload = {
  email: string;
  name: string;
  investor_type: string;
  watchlist_size: number | null;
  pain_point: string;
  consent: boolean;
  website: string;
};
export const submitBetaApplication = (data: BetaApplicationPayload) => api.post('/api/beta/apply', data);
export const getStock = (ticker: string) => api.get(`/api/stock/${ticker}`);
export const getDividendTracker = () => api.get('/api/market/dividends');
export const analyzeStock = (ticker: string) => api.get(`/api/stock/${ticker}/analyze`);
export const searchStocks = (query: string) => api.get(`/api/market/search/${query}`);
export const getWatchlist = () => api.get('/api/watchlist');
export const getEventRadar = (refresh = false) => api.get('/api/event-radar', { params: refresh ? { refresh: true } : undefined });
export const getTheses = () => api.get('/api/theses');
export const getEventCalendar = () => api.get('/api/event-calendar');
export const getEarningsComparison = (ticker: string) => api.get(`/api/earnings-comparison/${ticker}`);
export const saveThesis = (ticker: string, data: any) => api.put(`/api/theses/${ticker}`, data);
export const deleteThesis = (ticker: string) => api.delete(`/api/theses/${ticker}`);
export const getNotificationPreferences = () => api.get('/api/notification-preferences');
export const saveNotificationPreferences = (data: any) => api.put('/api/notification-preferences', data);
const notifyTrackedStocksChanged = () => window.dispatchEvent(new Event('stock-ai:tracked-stocks-changed'));
export const addToWatchlist = async (ticker: string, company_name: string) => {
  const response = await api.post('/api/watchlist', { ticker, company_name });
  notifyTrackedStocksChanged();
  return response;
};
export const removeFromWatchlist = async (ticker: string) => {
  const response = await api.delete(`/api/watchlist/${ticker}`);
  notifyTrackedStocksChanged();
  return response;
};
export const getPortfolio = () => api.get('/api/portfolio');
export const addToPortfolio = async (data: any) => {
  const response = await api.post('/api/portfolio', data);
  notifyTrackedStocksChanged();
  return response;
};
export const removeFromPortfolio = async (ticker: string) => {
  const response = await api.delete(`/api/portfolio/${ticker}`);
  notifyTrackedStocksChanged();
  return response;
};
