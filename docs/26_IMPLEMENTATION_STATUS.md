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
- Disposable-Postgres CI replay.

### Engineering
- pnpm/Turborepo workspace plus npm workspace metadata for Git deployment compatibility.
- Strict TypeScript configuration.
- CI workflow.
- JSON validation script.
- committed-secret heuristic gate.
- 13 dependency-light deterministic domain tests.
- core product/architecture/security/SEO/legal documentation.
- generated-project Markdown and JSON prompt template library.

## Verified on GitHub

GitHub CI run #3 on commit `0e467fd3aeb3130ed903f9af78645bea40b31e14` completed successfully.

Verified gates:
- dependency installation,
- JSON validation,
- committed-secret heuristic,
- deterministic domain tests,
- TypeScript typecheck,
- full Next.js production build,
- disposable PostgreSQL 16 migration replay,
- foundation RLS assertions.

The prior database-only run also completed its PostgreSQL/RLS job successfully.

## Current external deployment blocker

The connected Vercel project was auto-created while the repository contained only an initial README, so its project framework remains `null` / generic static. The repository now builds successfully as Next.js in GitHub CI, but Vercel Git previews fail after the build because the project expects a `public` static output directory.

Correct Vercel project settings:
- Framework Preset: **Next.js**
- Root Directory: **`apps/web`**
- Node.js: **24.x**

Do not add a fake `public` directory or convert the app to static output just to satisfy the incorrect project preset. See `docs/27_VERCEL_DEPLOYMENT.md`.

## Not yet live

Provider OAuth, repository ingestion, AST indexing, production Supabase application connection, durable job queue, authentication UI, billing, and model-backed grounded explanations.

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
