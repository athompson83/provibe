export type SupportedAgent = 'codex' | 'claude-code' | 'cursor';

export interface TaskPromptInput {
  tool: SupportedAgent;
  objective: string;
  evidence: string[];
  constraints: string[];
  acceptanceCriteria: string[];
  verification: string[];
}

export interface TaskPrompt {
  schema_version: '1.0';
  prompt_type: 'task';
  tool: SupportedAgent;
  objective: string;
  evidence: string[];
  constraints: string[];
  acceptance_criteria: string[];
  verification: string[];
  stop_conditions: string[];
}

export function createTaskPrompt(input: TaskPromptInput): TaskPrompt {
  return {
    schema_version: '1.0', prompt_type: 'task', tool: input.tool, objective: input.objective,
    evidence: [...input.evidence], constraints: [...input.constraints], acceptance_criteria: [...input.acceptanceCriteria], verification: [...input.verification],
    stop_conditions: ['Stop if required evidence cannot be obtained without expanding permissions.', 'Stop before destructive or production-changing actions that were not explicitly authorized.']
  };
}
