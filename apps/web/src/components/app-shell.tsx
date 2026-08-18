import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icons } from './icons';
import { project } from '../lib/demo-data';
const nav = [
  { label: 'Overview', href: '', icon: Icons.overview }, { label: 'Blueprint', href: '/blueprint', icon: Icons.blueprint }, { label: 'Code', href: '/code', icon: Icons.code },
  { label: 'Database', href: '/database', icon: Icons.database }, { label: 'Deployments', href: '/deployments', icon: Icons.deployments }, { label: 'Changes', href: '/changes', icon: Icons.changes }, { label: 'Ask my app', href: '/ask', icon: Icons.ask }
];
export function AppShell({ projectId, children }: { projectId: string; children: ReactNode }) {
  return <div className="app-frame"><aside className="sidebar"><Link className="brand" href="/projects"><span className="brand-mark">P</span><span>ProVibe</span></Link><div className="project-switcher"><span className="eyebrow">Current project</span><strong>{project.name}</strong><span>{project.stage} · {project.health}% health</span></div><nav className="side-nav" aria-label="Project navigation">{nav.map(({label,href,icon:Icon}) => <Link key={label} href={`/projects/${projectId}${href}`}><Icon /><span>{label}</span></Link>)}</nav><div className="sidebar-bottom"><span>Read-only foundation</span><span>Evidence before AI</span></div></aside><div className="app-main"><header className="topbar"><span className="crumb">Projects / {project.name}</span><div className="top-actions"><span className="sync-dot" /> Last verified {project.lastVerified}<Link className="button button-quiet" href="/projects">All projects</Link></div></header><main className="page">{children}</main></div></div>;
}
