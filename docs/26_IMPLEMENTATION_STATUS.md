# Implementation Status — Foundation

Date: 2026-08-18

## Implemented in this repository

### Product/UI
- Marketing entry screen.
- Portfolio view.
- Project Build Cockpit / Overview.
- Blueprint artifact view.
- Code Explorer with selectable line explanation interaction.
- Database metadata view.
- Deployment reconciliation view.
- Change Translator.
- Ask My App demo interaction.
- Responsive desktop/tablet/mobile layout foundation.
- Explicit evidence-state labels.

### Domain logic
- Canonical project revision primitive.
- Decision-driven artifact invalidation.
- Evidence record and progress-claim contracts.
- Deterministic claim-vs-evidence classification.
- Progress verifier with blockers and accepted-risk handling.
- Evidence-based launch readiness scoring.
- Transparent optimistic/likely/contingency estimate primitive.
- Adaptive Blueprint question-selection primitive.
- Revision-aware Markdown artifact renderer.
- Versioned JSON task-prompt adapter primitive.
- Deterministic path classification and environment-key-name extraction.
- Compatibility registry primitive.

### Platform boundaries
- Read-only GitHub source-provider interface.
- Read-only Vercel deployment-provider interface.
- Read-only Supabase database-provider interface.
- Separate analyzer-worker deployment boundary.
- Analyzer worker explicitly prohibited from executing repository code.

### Database
- Workspace/project tenant model.
- Canonical revision, decision, and artifact tables.
- Provider connection/capability metadata tables.
- Evidence, progress-report, claim, and verification tables.
- Launch-readiness controls.
- RLS enabled for every tenant-scoped foundation table.
- Admin/member helper functions.
- No plaintext OAuth token/service-role columns.
- Disposable-Postgres CI replay definition.

### Engineering
- pnpm/Turborepo workspace.
- Strict TypeScript configuration.
- CI workflow.
- JSON validation script.
- committed-secret heuristic gate.
- 13 dependency-light deterministic domain tests.

## Verified locally in this runtime

- 13/13 domain tests pass using Node's TypeScript type stripping.
- All implemented non-Next TypeScript package sources typecheck with the available TypeScript compiler.
- JSON validation passes.
- committed-secret heuristic passes.

## Not locally executable in this runtime

The current runtime does not include `gh`, `psql`, or installed Next.js dependencies. Therefore:

- the Next.js production build is delegated to GitHub CI after publication,
- the PostgreSQL 16 migration/RLS replay is delegated to GitHub CI,
- GitHub publication uses the connected GitHub application rather than `gh`.

These are verification boundaries, not claims that the checks passed.

## Next implementation slice

1. Supabase Auth for ProVibe users/workspaces.
2. Persist canonical project model revisions.
3. GitHub App installation/import flow.
4. GitHub webhook ingestion and normalized evidence facts.
5. Vercel OAuth/integration and deployment reconciliation.
6. Progress report ingestion → claim extraction → deterministic verification.
7. Evidence-backed next JSON prompt generation.
8. Supabase third-party OAuth and schema/advisor ingestion.
9. AST-backed TypeScript/Next.js analyzer graph.
10. Grounded model-backed explanations with evidence IDs.
