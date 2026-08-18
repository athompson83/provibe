export type FileKind = 'route' | 'page' | 'component' | 'migration' | 'test' | 'config' | 'source';

export function classifyPath(path: string): FileKind {
  const normalized = path.replaceAll('\\', '/');
  if (/\/route\.(?:[cm]?[jt]sx?)$/.test(normalized)) return 'route';
  if (/\/page\.(?:[cm]?[jt]sx?)$/.test(normalized)) return 'page';
  if (normalized.includes('/components/') && /\.(?:[cm]?[jt]sx?)$/.test(normalized)) return 'component';
  if (/supabase\/migrations\/.*\.sql$/.test(normalized)) return 'migration';
  if (/\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/.test(normalized)) return 'test';
  if (/(?:^|\/)(?:next\.config|tsconfig|package|turbo|pnpm-workspace)/.test(normalized)) return 'config';
  return 'source';
}

export function extractEnvironmentKeys(source: string): string[] {
  const keys = new Set<string>();
  const dotPattern = /process\.env\.([A-Z0-9_]+)/g;
  const bracketPattern = /process\.env\[['"]([A-Z0-9_]+)['"]\]/g;
  for (const match of source.matchAll(dotPattern)) if (match[1]) keys.add(match[1]);
  for (const match of source.matchAll(bracketPattern)) if (match[1]) keys.add(match[1]);
  return [...keys].sort();
}
