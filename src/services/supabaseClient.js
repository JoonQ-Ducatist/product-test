import { createClient } from '@supabase/supabase-js';

// Node contract tests do not provide Vite's import.meta.env object.
const environment = import.meta.env ?? {};
const url = environment.VITE_SUPABASE_URL;
const publishableKey = environment.VITE_SUPABASE_ANON_KEY;

/**
 * The browser receives only Supabase's publishable key. All data access must
 * remain protected by RLS; service-role credentials must never be imported here.
 */
export const supabase = url && publishableKey
  ? createClient(url, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

export function getSupabaseConnectionState() {
  return supabase ? 'configured' : 'missing_public_config';
}
