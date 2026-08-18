import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
export const metadata: Metadata = { title: 'ProVibe — The control center for AI-built software', description: 'Understand what your app is made of, verify what your coding agent actually finished, and know exactly what to do next.' };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
