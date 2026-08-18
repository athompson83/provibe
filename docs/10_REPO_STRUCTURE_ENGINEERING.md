# Repository Structure & Engineering

## Monorepo
```text
apps/web                 Next.js UI/BFF
apps/analyzer-worker     isolated static-analysis runtime
packages/contracts       shared domain types/contracts
packages/project-model   canonical revision/invalidation
packages/evidence        evidence reconciliation
packages/progress-verifier
packages/analysis-core
packages/blueprint-engine
packages/artifact-renderer
packages/prompt-adapters
packages/readiness
packages/estimation
packages/compatibility-registry
packages/provider-github
packages/provider-vercel
packages/provider-supabase
supabase/migrations
supabase/tests
schemas
docs
```

## Engineering rules
Strict TypeScript. Focused files/packages. Direct imports where practical. Avoid client components unless interaction requires them. Parallelize independent server I/O. Minimize serialized props. Keep heavy analysis out of Vercel request handlers.

## Testing
TDD for domain behavior. Unit/golden fixtures for analyzer/verifier. RLS negative tests. Provider contract fixtures. E2E golden path after auth/integrations land. Production build required in CI.

## Dependency policy
Prefer mature narrowly scoped dependencies. Pin/lock through pnpm lockfile once generated. Do not add agent frameworks or graph databases until Postgres/typed application graph proves insufficient.
