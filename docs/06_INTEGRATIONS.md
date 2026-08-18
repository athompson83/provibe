# Integrations

## Principles
OAuth/GitHub App over pasted long-lived tokens; least privilege; read-only MVP; explicit capability/freshness state; webhook verification; provider adapters normalize external schemas.

## GitHub — first
Use a GitHub App for private repositories. MVP capabilities: repository metadata/tree/files, branches/commits, pull requests/reviews, workflow/check state and relevant security-alert observations where granted. Webhooks drive incremental refresh.

No automatic commits, merges or repository settings changes in MVP.

## Vercel — first
OAuth/integration for project/deployment metadata, source SHAs, build/runtime findings/log excerpts and environment **key names** needed for reconciliation. Never expose environment secret values.

No automatic production promotion or environment mutation in MVP.

## Supabase — connected MVP
Third-party OAuth/Management API for project metadata, schema metadata, advisors and supported operational observations. Do not request/store a service-role key for normal product integration. Production row browsing is excluded by default.

## Later
Sentry, PostHog, Stripe, Expo/EAS, App Store Connect, Google Play, Cloudflare, Railway/Render, Firebase, Linear/Jira.

Every added integration gets a compatibility-registry entry containing supported versions/capabilities, scopes, setup method, known risks, verification procedure and last-validated date.
