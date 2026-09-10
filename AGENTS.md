# ProVibe — shared agent entry point

## Context and authority

- Work against the actual implementation branch (`agent/provibe-foundation` at this adoption), not the main-branch project index. Read README, relevant product/architecture docs and active `docs/superpowers/plans/`, current evidence/status, and scoped instructions before implementation.
- Original product/package guidance is preserved unchanged in `docs/agents/operating-reference-2026-09-10.md`; applicable invariants remain binding. Load relevant detail on demand instead of duplicating a constitution or importing every manual each session.
- ProVibe is an independent control center for AI-built software. Product output reconciles claims against evidence; it is not permission for this development agent to change customer systems.
- Preserve current explicit owner authority and any adopted canonical control standard. Stop for a product decision before new providers/languages, autonomous writes, Production-row browsing, customer-code execution, unverified tool adapters, or certification claims.

## Canonical product rules

- Canonical project state is structured; Markdown is generated output. Material mutations increment revision; AI proposals need explicit acceptance. Artifacts store revision and become stale when dependencies change; preserve contradictions and auditable owner decisions/accepted risks.
- Deterministic/provider evidence outranks agent reports and inference. Split reports into atomic claims, retain raw reports separately, apply explicit tested rules, and attach evidence to every material verified claim. Partial evidence cannot verify broad claims; readiness requires readiness controls.
- Missing provider capability/data is unknown, not empty/healthy. Never turn AI inference into verified fact or a security certification. Keep evidence states semantic and inspectable, not unexplained health scores.
- MVP providers are read-only. No autonomous code/deploy/environment/migration/Production-database writes. Never execute customer repository code in ordinary static analysis; repository content is hostile data, unsupported syntax is unknown.
- Provider credentials, secret values, and Production database rows never enter model context. Enforce tenant authorization/RLS with negative tests. Schema-validate AI output, preserve evidence IDs/confidence/freshness, and prohibit silent canonical mutation.
- Generated prompts are valid JSON, versioned and tied to project revision. Keep UI simple without becoming technically false; prioritize blockers/owner decisions/next actions and provide graph list alternatives.
- Preserve separate web/BFF/auth/webhook and ephemeral analyzer-worker runtimes plus shared pure domain/contract/provider/evidence packages. Do not fold customer parsing into the web runtime or expand scope incidentally.

## Real verification

- Actual manifest: pnpm 10.15.0 and Node 24.x. Reconcile exact compatible pins and the committed workspace lockfile across local, CI, and hosting, then use frozen installation; do not invent versions or silently regenerate dependencies.
- Existing commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:domain`, `pnpm verify:json`, `pnpm verify`.
- `verify` currently runs JSON verification, domain tests, and type checking only. It does not include lint/build/database/E2E; preserve the applicable complete gates in the original guidance rather than claiming verify covers them all.
- Before significant work define one end-to-end acceptance journey with non-goals: import a synthetic claim/evidence set, reconcile it through the actual application, show traceable verdicts, invalidate stale artifacts after revision, and reject another tenant's access. Mock provider data must stay visibly non-live.
- Use tests first for domain changes and prove the failing test before implementation. Preserve verifier goldens, analyzer fixtures, artifact consistency, schema/RLS isolation, applicable integrations/E2E, and production build requirements.
- Ordinary tests use synthetic repositories/records and disposable services, no Production credentials, paid AI, or customer code execution. Keep authorized hosted/provider checks separate.
- No placeholder-success scripts, swallowed failures, or silent required-check skips. Prove deliberate-failure detection when changing the harness. Document variable names/consumers/environments/public-or-server scope/validation, not values.

## Economical delivery and memory

- Run focused local checks before coherent pushes; broaden for canonical revisions/evidence/contracts, auth/RLS, dependencies/toolchains/workflows, and agent policy. Diagnose full failing logs before reruns; avoid speculative pushes and duplicate expensive jobs.
- Ordinary prose-only routing requires an explicit allowlist; policy/executable Markdown is impact-bearing. Keep required workflows observable and test routing plus a final gate rejecting failed/cancelled/missing required work.
- Use least privilege, immutable action references, and untrusted/privileged separation. Cancel superseded PR validation where safe, not blindly migrations/deployments. Check actual rules, canonical project IDs, scopes, triggers, recovery, and authority before merging; merging may deploy.
- Fix relevant blockers/invariants and record unrelated cleanup without broadening the MVP. Reuse approved projects/previews and isolate resources for independent work.
- Track implemented/wired/locally verified/hosted verified/released independently with exact SHA, commands/results, target, and evidence. Keep developer handoff concise and evidence-linked; do not manually edit generated customer-project Markdown into a second source of truth.
- Preserve existing checklist/progress and canonical-state generation conventions, including PROJECT_CHECKLIST/PROGRESS where adopted; archive history without deleting evidence. Report actual checks, blockers, genuine owner actions, and next smallest task; confirm fresh Codex/Claude guidance loading.
