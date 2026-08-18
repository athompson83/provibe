import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requirePublicSupabaseConfig } from './config';

export async function createServerSupabaseClient() {
  const config = requirePublicSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Proxy refreshes sessions before render.
        }
      }
    }
  });
}

export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;
  const subject = data?.claims?.sub;
  return typeof subject === 'string' && subject.length > 0 ? subject : null;
}
