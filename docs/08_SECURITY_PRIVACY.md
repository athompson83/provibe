# Security & Privacy

## MVP security posture
Read-only integrations, OAuth/GitHub App, least privilege, encrypted server-side credential vault/reference, strict tenant isolation, explicit auditability and user-controlled disconnect/deletion.

## Non-negotiables
- No provider access/refresh tokens in browser bundles, project rows, generated prompts or logs.
- No production database writes or row browsing by default.
- No automatic commits/merges/deployments/migrations.
- No customer repository code execution in normal analysis.
- Missing/degraded provider data is visible, never interpreted as healthy.
- AI cannot certify the application as secure.

## Tenant isolation
RLS on every tenant-scoped table plus server authorization. Cross-workspace negative tests are release blockers. Service credentials remain server-only.

## Source-code handling
Prefer ephemeral source materialization in isolated workers. Store durable metadata/graph facts rather than raw source where possible. Document retention and deletion; honor repository disconnect/deletion.

## Webhooks
Verify signatures/tokens, deduplicate external event IDs, bound payload size, enqueue durable jobs, and avoid doing expensive analysis in request handlers.

## Logging
Structured logs exclude secrets/source bodies/production row values. Store correlation IDs, provider capability state, job IDs, error classes and evidence pointers.

## Security findings
Aggregate authoritative scanner/provider findings and explain them. AI-inferred risk is labeled inference. No “secure” badge/certification without a separately defined audited program.
