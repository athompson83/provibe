import type { ReactNode } from 'react';
import { AppShell } from '../../../components/app-shell';
export default async function ProjectLayout({ children, params }: { children: ReactNode; params: Promise<{ projectId: string }> }) { const { projectId } = await params; return <AppShell projectId={projectId}>{children}</AppShell>; }
