'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../../lib/supabase/server';

function credentials(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email.includes('@')) return { error: 'Enter a valid email address.' as const };
  if (password.length < 12) return { error: 'Use a password with at least 12 characters.' as const };
  return { email, password };
}

export async function signIn(formData: FormData) {
  const input = credentials(formData);
  if ('error' in input) redirect(`/auth/sign-in?error=${encodeURIComponent(input.error)}`);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.password });
  if (error) redirect(`/auth/sign-in?error=${encodeURIComponent(error.message)}`);
  redirect('/projects');
}

export async function signUp(formData: FormData) {
  const input = credentials(formData);
  if ('error' in input) redirect(`/auth/sign-up?error=${encodeURIComponent(input.error)}`);

  const supabase = await createServerSupabaseClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const signUpInput = siteUrl
    ? { email: input.email, password: input.password, options: { emailRedirectTo: `${siteUrl}/auth/callback` } }
    : { email: input.email, password: input.password };
  const { data, error } = await supabase.auth.signUp(signUpInput);
  if (error) redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  if (data.session) redirect('/projects');
  redirect('/auth/sign-in?message=Check%20your%20email%20to%20confirm%20your%20account.');
}
