export interface CompatibilityEntry {
  id: string;
  product: string;
  category: 'agent' | 'skill' | 'mcp' | 'provider';
  supportedRange: string;
  status: 'validated' | 'experimental' | 'unsupported';
  lastValidatedAt: string;
  verification: string;
}

export const foundationRegistry: CompatibilityEntry[] = [
  { id: 'codex-agent', product: 'OpenAI Codex', category: 'agent', supportedRange: 'current', status: 'validated', lastValidatedAt: '2026-08-18', verification: 'Confirm AGENTS.md is loaded and run repository verification commands.' },
  { id: 'claude-code-agent', product: 'Claude Code', category: 'agent', supportedRange: 'current', status: 'experimental', lastValidatedAt: '2026-08-18', verification: 'Confirm generated CLAUDE.md adapter instructions before execution.' },
  { id: 'cursor-agent', product: 'Cursor', category: 'agent', supportedRange: 'current', status: 'experimental', lastValidatedAt: '2026-08-18', verification: 'Confirm generated project rules are visible in Cursor settings.' }
];
