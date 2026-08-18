# Prompt Adapter System

## Principle
Do not rely on one giant master prompt that becomes stale. Render the next correct prompt from canonical project revision + current evidence + target-tool compatibility profile.

## Prompt types
1. Project Constitution.
2. Initial Build.
3. Phase.
4. Task.
5. Verification.
6. Handoff.
7. Recovery.

## Initial target adapters
Codex, Claude Code, Cursor. Later adapters may include GitHub Copilot, Kiro, Lovable, Replit, Bolt and others only after compatibility validation.

## JSON contract
User-facing prompts are valid JSON containing schema version, prompt type, target tool, project revision, objective, evidence/context, scope constraints, prohibited actions, acceptance criteria, verification, expected evidence and stop conditions.

## Safety
Generated prompts never contain OAuth tokens, API keys, secret values or production customer rows. Prompt instructions cannot authorize destructive actions outside explicit project/user approval.

## Staleness
Prompt artifacts record project/evidence revision and adapter version. Regenerate when relevant state changes rather than appending contradictory context indefinitely.
