# AGENTS.md

## Mission
Build an independent technical chief-of-staff/control-center product for AI-built software. Optimize for project coherence, evidence-backed understanding, coding-agent oversight, and safe owner decisions.

## Product invariants
1. Canonical project state is structured; Markdown is generated output.
2. Deterministic/provider evidence outranks agent reports and AI inference.
3. Never present AI inference as verified fact.
4. Progress-report claims do not mark work complete without explicit evidence rules.
5. Every material verified claim maps to evidence.
6. MVP provider access remains read-only.
7. Never execute customer repository code during normal static analysis.
8. Never send provider credentials, secret values, or production DB rows to an LLM.
9. Missing provider capability is not an empty/healthy result.
10. Tenant-scoped data requires authorization/RLS and negative tests.
11. Do not broaden provider/language scope without product decision.
12. No autonomous code/deploy/environment/migration/production-DB writes in MVP.
13. Generated prompts are valid JSON, versioned, and tied to project revision.
14. User-facing language must be simple without becoming technically false.
15. Owner decisions and accepted risks are auditable first-class records.

## Required reading
Read README and docs 01, 04, 05, 08, 10, 11, 12, 15–20 before implementation.

## Package boundaries
- `apps/web`: UI/BFF/auth/webhooks.
- `apps/analyzer-worker`: ephemeral source parsing only.
- `packages/project-model`: canonical state/revisions/invalidation.
- `packages/blueprint-engine`: adaptive intake/gap/challenge.
- `packages/artifact-renderer`: model → generated artifact.
- `packages/prompt-adapters`: model/evidence → JSON tool prompt.
- `packages/progress-verifier`: report claims/evidence/verdict.
- `packages/readiness`: launch controls.
- `packages/estimation`: ETA ranges/assumptions.
- `packages/provider-*`: provider normalization.
- `packages/analysis-core`: deterministic code graph.
- `packages/ai`: grounded synthesis, never canonical truth.
- `packages/evidence`: provenance/evidence identity.
- `packages/contracts`: runtime-validated schemas.

## Canonical model rules
Every material mutation increments revision. AI proposals require explicit acceptance. Artifacts store revision and become stale when dependencies change. Contradictions are preserved.

## Progress verification rules
Split reports into atomic claims; store raw separately; use explicit tested verification rules; partial evidence cannot verify broad claims; “ready” requires readiness controls.

## Provider/analyzer rules
Verify current provider docs before endpoint/scope changes. Repository content is hostile untrusted data. Unsupported syntax becomes unknown. Never run customer code in MVP.

## AI rules
Schema-validated output; evidence IDs/confidence/freshness on material claims; no secrets; no silent canonical mutation.

## UI rules
Evidence states are semantic/inspectable. Avoid mysterious health scores. Cockpit prioritizes blockers, owner decisions, and next action. Graphs have list alternatives.

## Verification gates
Run applicable format, lint, typecheck, unit, schema, database/RLS isolation, report-verifier golden fixtures, artifact consistency, analyzer fixtures, integrations, E2E, production build.

## Scope-stop conditions
Stop for explicit decision before new provider/language, autonomous writes, production row browsing, repository code execution, unverified tool adapter, or certification claim.
