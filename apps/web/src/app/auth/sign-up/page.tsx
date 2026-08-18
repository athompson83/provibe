import Link from 'next/link';
import { signUp } from '../actions';

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <div className="auth-card"><h2>Create account</h2><p>Start with one project. Keep every decision and piece of evidence attached to it.</p>{params.error ? <div className="auth-error">{params.error}</div> : null}<form className="auth-form" action={signUp}><label className="auth-field">Email<input name="email" type="email" autoComplete="email" required /></label><label className="auth-field">Password<input name="password" type="password" autoComplete="new-password" minLength={12} required /></label><button className="auth-submit" type="submit">Create account</button></form><p className="auth-switch">Already have an account? <Link href="/auth/sign-in">Sign in</Link></p></div>;
}
