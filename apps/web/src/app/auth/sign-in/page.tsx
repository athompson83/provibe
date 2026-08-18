import Link from 'next/link';
import { signIn } from '../actions';

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return <div className="auth-card"><h2>Sign in</h2><p>Return to your project control center.</p>{params.message ? <div className="auth-message">{params.message}</div> : null}{params.error ? <div className="auth-error">{params.error}</div> : null}<form className="auth-form" action={signIn}><label className="auth-field">Email<input name="email" type="email" autoComplete="email" required /></label><label className="auth-field">Password<input name="password" type="password" autoComplete="current-password" minLength={12} required /></label><button className="auth-submit" type="submit">Sign in</button></form><p className="auth-switch">New to ProVibe? <Link href="/auth/sign-up">Create an account</Link></p></div>;
}
