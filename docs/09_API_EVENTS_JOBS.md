# API, Events & Jobs

## API style
Next.js BFF/server endpoints authorize workspace/project access and return normalized contracts. The browser never calls providers with stored OAuth credentials.

## Core API domains
Projects/revisions/decisions/artifacts, evidence, progress reports/claims/verdicts, readiness, provider connections/capabilities, repository/application intelligence, prompts and Ask.

## Event types
`project.revision.created`, `artifact.stale`, `provider.connected`, `provider.capability.changed`, `github.push.observed`, `github.check.changed`, `vercel.deployment.changed`, `supabase.advisor.changed`, `analysis.completed`, `claim.verification.changed`, `readiness.changed`.

## Job requirements
Durable, idempotent, retryable, observable and bounded. External event ID or deterministic idempotency key. Persist attempt/error class/retry-after. Never convert timeout/failure to an empty result.

## Initial job families
Provider refresh, incremental repository analysis, full reindex, progress-report extraction/verification, artifact regeneration, summary regeneration and readiness recalculation.
