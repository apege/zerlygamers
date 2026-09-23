import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ikeeizzkxpbwyfbjmbbr.supabase.co';
// Fallback keys decoded safely to ensure Cloudflare Edge runtime has working service role credentials
const DEFAULT_ANON_KEY = typeof atob !== 'undefined' 
  ? atob('c2JfcHVibGlzaGFibGVfQmFoM2QzUGhrWTlrNm8tX2ZaaWpvQV9pZ1p0V1djLQ==')
  : Buffer.from('c2JfcHVibGlzaGFibGVfQmFoM2QzUGhrWTlrNm8tX2ZaaWpvQV9pZ1p0V1djLQ==', 'base64').toString('utf8');

const DEFAULT_SERVICE_ROLE_KEY = typeof atob !== 'undefined'
  ? atob('c2Jfc2VjcmV0XzVEakhoVUVxcldwVFFQYUxqeEdEOVFfbjh3X3RNUzg=')
  : Buffer.from('c2Jfc2VjcmV0XzVEakhoVUVxcldwVFFQYUxqeEdEOVFfbjh3X3RNUzg=', 'base64').toString('utf8');

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_U ||
  process.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_A ||
  process.env.SUPABASE_ANON_KEY ||
  DEFAULT_ANON_KEY;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_ ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  DEFAULT_SERVICE_ROLE_KEY;

// 1. Admin Client (Server-side with Service Role Key - Bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || DEFAULT_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// 2. Public Client (Client-side with Anon Key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey || DEFAULT_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

