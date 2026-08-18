import Link from 'next/link';
import './auth.css';

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="auth-shell"><section className="auth-brand"><Link href="/" className="auth-wordmark"><span>P</span>ProVibe</Link><h1>Understand the app your AI agent built.</h1><p>One evidence-backed workspace for code, deployments, databases, decisions, and next actions.</p></section><section className="auth-panel">{children}</section></main>;
}
