import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { requirePublicSupabaseConfig } from './config';

export function createSupabaseAdminClient() {
  const config = requirePublicSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error('SUPABASE_SECRET_KEY is required for trusted provider ingestion.');

  return createClient(config.url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
  });
}
