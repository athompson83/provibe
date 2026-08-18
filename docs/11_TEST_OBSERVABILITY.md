# Testing & Observability

## Test pyramid
1. Pure deterministic domain tests.
2. JSON/schema validation.
3. Database migration/RLS tests against disposable PostgreSQL/Supabase.
4. Provider adapter contract fixtures.
5. Analyzer golden repositories.
6. Progress-verification golden reports.
7. Integration tests.
8. Browser E2E for critical owner workflows.

## High-value negative tests
Cross-tenant access, missing provider capability, contradictory evidence, partial evidence for broad claims, prompt injection in repository content, stale artifact after decision, secret/log leakage and unsupported syntax.

## Observability
Structured events with workspace/project/job/correlation IDs, provider/capability, analyzer/prompt version, duration, error class and retry state. Metrics: job success/latency, provider freshness, analysis cost, model cost, evidence coverage, claim-verification distribution, stale artifacts and failed launch controls.

## Release rule
No “ready” status when required evidence controls are missing. CI/build/migration evidence is recorded separately from agent assertions.
