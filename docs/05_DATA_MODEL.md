# Data Model

## Rules
Separate tenancy, canonical/planned state, agent reports, provider observations, deterministic facts, inference, summaries, change history and analytics. AI output never overwrites deterministic/provider facts.

## Foundation tables implemented now
- `workspaces`
- `workspace_members`
- `projects`
- `project_revisions`
- `project_decisions`
- `project_artifacts`
- `provider_connections`
- `provider_capabilities`
- `evidence_records`
- `progress_reports`
- `progress_claims`
- `claim_verifications`
- `readiness_controls`

All are workspace/project scoped; RLS is enabled. `provider_connections.credential_reference` is an opaque server-side vault reference, not a token.

## Later connected-intelligence tables
Repository bindings, deployment/database bindings, analysis runs, repo files, code symbols, graph nodes/edges, database tables/columns/constraints/indexes/policies, deployments, normalized deployment findings, security/performance findings, entity summaries, AI answers and change events.

## Canonical rules
Every material accepted project change increments revision. Generated artifacts store `rendered_from_revision` and dependency areas. An affected artifact becomes stale; it is not silently rewritten.

## Evidence rules
Evidence records are independently addressable with source kind (`deterministic|provider|reported|inferred|owner`), subject, polarity, pointer, confidence where applicable, and observed timestamp. Claims link to verification records rather than replacing report text.

## RLS path
`auth.uid() → workspace_members → workspace → project → object`.

RLS is defense in depth; server routes/actions also authorize.

## Index priorities
Every FK plus hot composites for project/revision, project/evidence time, subject lookup, provider capability, report/claim, readiness category and later graph traversal/open findings.
