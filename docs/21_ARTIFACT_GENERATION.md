# Artifact Generation

## Rule
Markdown is a rendered view of canonical project state, not the database.

## Artifact metadata
Project ID, canonical revision, template ID/version, generated timestamp, dependency areas, tool target where relevant, and stale flag.

## Example artifact families
Product/business: PRODUCT-BRIEF, PRD, MVP-SCOPE, PERSONAS, USER-STORIES, ROADMAP, BUSINESS-MODEL, SUCCESS-METRICS, RISK-REGISTER.

UX/design: UX-FLOWS, SCREEN-INVENTORY, WIREFRAME-CONTEXT, DESIGN-SYSTEM, DESIGN-TOKENS, RESPONSIVE-BEHAVIOR, ACCESSIBILITY, UI-STATES.

Engineering: ARCHITECTURE, DATA-MODEL, API-CONTRACTS, AUTHORIZATION, SECURITY, ENVIRONMENTS, MIGRATION-STRATEGY, OBSERVABILITY, TEST-PLAN, DEPLOYMENT, ROLLBACK, DEFINITION-OF-DONE.

Agent/execution: MASTER-PROMPT, AGENTS/CLAUDE/rules, IMPLEMENTATION-PLAN, TASKS, VERIFICATION-CONTRACT, PROGRESS/HANDOFF templates, DECISION-LOG, OPEN-QUESTIONS, EVIDENCE-LEDGER.

Setup/launch: ACCOUNT/MCP/SKILLS/SECRETS setup, LAUNCH/BETA/APP-STORE/PRIVACY-LEGAL checklists.

Generate only relevant files. Regeneration is explicit and revision-aware.
