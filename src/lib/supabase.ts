// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jhgltsbnelwuffpyepwn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZ2x0c2JuZWx3dWZmcHllcHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzcwNzksImV4cCI6MjA5MzY1MzA3OX0.s0xoAYZHHw5dQ3CDh5rBdY3tfL6gdcYxtU4CfVbqlco'; // ← from Supabase → Settings → API → anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);