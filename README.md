<div align="center">

# ProVibe

**The independent control center for understanding and verifying software built with AI.**

![Stage](https://img.shields.io/badge/stage-foundation-7C3AED?style=flat-square)
![Status](https://img.shields.io/badge/main-project%20index-64748B?style=flat-square)
![Development](https://img.shields.io/badge/development-agent%2Fprovibe--foundation-7C3AED?style=flat-square)

</div>

> [!IMPORTANT]
> The implementation foundation currently lives on [`agent/provibe-foundation`](https://github.com/athompson83/provibe/tree/agent/provibe-foundation). It has not yet been merged into `main`, so the default branch must not be presented as a deployed or complete product.

## Product thesis

ProVibe is designed for nontechnical and semi-technical software owners who need to know:

1. What was planned?
2. What did a coding agent claim it finished?
3. What can GitHub, Vercel, Supabase, and deterministic analysis actually prove?
4. What is blocked, risky, or awaiting an owner decision?
5. What should happen next?

Coding-agent reports are claims. ProVibe’s value is reconciling those claims against evidence and explaining the result in plain language.

## Planned product modules

| Module | Purpose |
| --- | --- |
| Blueprint Studio | Define, import, rescue, or prepare a software project |
| Build Control Center | Show verified progress, blockers, decisions, and next actions |
| Application Intelligence | Explain repositories, deployments, databases, and change impact |
| Progress Verification | Classify claims as reported, observed, verified, contradicted, unknown, blocked, or accepted risk |

## Current development branch

The foundation branch contains a Next.js product shell, canonical project contracts, evidence reconciliation, progress-verification primitives, readiness and estimation logic, provider interfaces, a separate analyzer-worker boundary, Supabase schema/RLS work, CI gates, and product/architecture documentation.

Provider OAuth, production ingestion, AST indexing, durable jobs, authentication UI, billing, and model-grounded explanations remain future phases. Demo data must never be represented as a live provider connection.

[Review the detailed foundation README →](https://github.com/athompson83/provibe/blob/agent/provibe-foundation/README.md)

## Intended delivery path

```text
Foundation → Auth and persistence → Read-only provider connections
→ Existing-project import → Evidence-backed intelligence
→ Closed beta → Billing and launch readiness
```

## Security posture

ProVibe should remain read-only by default. Customer code should not be executed during ordinary analysis, provider tokens must remain server-side, missing provider data must fail closed, and no inferred result should be presented as a security certification.

## Next repository decision

Review and merge the foundation branch only after its exact commit passes local verification and the intended branch policy. Until then, `main` is a project index—not the application source of truth.