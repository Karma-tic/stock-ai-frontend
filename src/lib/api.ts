// src/lib/api.ts
import axios from 'axios';
import { supabase } from './supabase';

const BASE = 'http://localhost:8000';

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

export const getTopStocks = () => api.get('/api/market/top');
export const getStock = (ticker: string) => api.get(`/api/stock/${ticker}`);
export const analyzeStock = (ticker: string) => api.get(`/api/stock/${ticker}/analyze`);
export const searchStocks = (query: string) => api.get(`/api/market/search/${query}`);
export const getWatchlist = () => api.get('/api/watchlist');
export const addToWatchlist = (ticker: string, company_name: string) =>
  api.post('/api/watchlist', { ticker, company_name });
export const removeFromWatchlist = (ticker: string) =>
  api.delete(`/api/watchlist/${ticker}`);
export const getPortfolio = () => api.get('/api/portfolio');
export const addToPortfolio = (data: any) => api.post('/api/portfolio', data);
export const removeFromPortfolio = (ticker: string) =>
  api.delete(`/api/portfolio/${ticker}`);