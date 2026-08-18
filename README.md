# ProVibe

**The control center for software built with AI.**

ProVibe helps nontechnical and semi-technical software owners understand what their application is made of, verify what coding agents actually finished, reconcile what is live across GitHub/Vercel/Supabase, and decide exactly what should happen next.

> **Know what to build, what your agent actually finished, what is live, what could break, and exactly what to do next.**

## Current repository status

This repository contains the **foundation implementation** of the approved product architecture:

- polished Next.js product shell and responsive demo surfaces,
- canonical project-model contracts and revision logic,
- deterministic evidence reconciliation,
- progress-claim verification,
- readiness and ETA primitives,
- adaptive Blueprint interview primitive,
- versioned JSON task-prompt adapter primitive,
- deterministic code path/environment-key analysis helpers,
- read-only GitHub/Vercel/Supabase provider interfaces,
- separate analyzer-worker runtime boundary,
- Supabase schema/RLS migration and assertions,
- CI quality gates,
- product/design/architecture/market documentation.

**Not yet live:** provider OAuth, repository ingestion, AST indexing, production Supabase connection, durable job queue, authentication UI, billing, and model-backed explanations. These remain explicit implementation phases rather than simulated integrations.

See [`docs/26_IMPLEMENTATION_STATUS.md`](docs/26_IMPLEMENTATION_STATUS.md) for the exact boundary.

## Product modules

### Blueprint Studio
Start, import, rescue, or prepare a software project for launch. ProVibe maintains one canonical structured project model and renders only the artifacts that project needs.

### Build Control Center
Answers five owner questions immediately:

1. What is actually complete?
2. What is being worked on?
3. What is blocked?
4. What requires an owner decision?
5. What should happen next?

### Application Intelligence
Explains repository structure, source behavior, database metadata, deployments, change impact, and code/data/deployment relationships in plain English.

### Progress Verification
Coding-agent reports are claims, not proof. Material claims are classified as:

`reported | observed | verified | contradicted | unknown | blocked | accepted_risk`

## Trust model

```text
Canonical planned state
        +
Agent-reported claims
        +
GitHub / Vercel / Supabase observations
        +
Deterministic repository analysis
        ↓
Evidence reconciliation
        ↓
Plain-English explanation / verdict / next prompt
```

AI is an explanation and synthesis layer. It is not the source of truth.

## Golden-path stack

The first commercial product deliberately targets GitHub, Vercel, Supabase, Next.js/TypeScript, and Codex/Claude Code/Cursor. Provider access is read-only by default in MVP.

## Repository structure

```text
provibe/
├─ apps/
│  ├─ web/                    # Next.js product UI / BFF boundary
│  └─ analyzer-worker/        # isolated untrusted-source analysis runtime
├─ packages/
│  ├─ contracts/
│  ├─ project-model/
│  ├─ evidence/
│  ├─ progress-verifier/
│  ├─ analysis-core/
│  ├─ blueprint-engine/
│  ├─ artifact-renderer/
│  ├─ prompt-adapters/
│  ├─ readiness/
│  ├─ estimation/
│  ├─ compatibility-registry/
│  └─ provider-*/
├─ supabase/
├─ schemas/
├─ docs/
└─ .github/workflows/ci.yml
```

## Local development

Requirements: Node.js 24 LTS, pnpm 10, and PostgreSQL 16 or Supabase CLI for database verification.

```bash
corepack enable
pnpm install
pnpm test:domain
pnpm typecheck
pnpm --filter @provibe/web dev
```

Then open `http://localhost:3000`.

The product shell uses deterministic demo data until provider connections are implemented. Demo UI state must never be presented as a live provider connection.

## Verification

```bash
pnpm verify:json
node scripts/check-no-secrets.mjs
pnpm test:domain
pnpm typecheck
pnpm --filter @provibe/web build
```

CI also replays the foundation migration against disposable PostgreSQL 16 and verifies RLS enablement.

## Documentation map

Start with:

- [`docs/01_PRD_MVP.md`](docs/01_PRD_MVP.md)
- [`docs/02_UX_DESIGN_SYSTEM.md`](docs/02_UX_DESIGN_SYSTEM.md)
- [`docs/03_WIREFRAMES.md`](docs/03_WIREFRAMES.md)
- [`docs/04_SYSTEM_ARCHITECTURE.md`](docs/04_SYSTEM_ARCHITECTURE.md)
- [`docs/08_SECURITY_PRIVACY.md`](docs/08_SECURITY_PRIVACY.md)
- [`docs/15_CANONICAL_PROJECT_MODEL.md`](docs/15_CANONICAL_PROJECT_MODEL.md)
- [`docs/19_PROGRESS_VERIFICATION.md`](docs/19_PROGRESS_VERIFICATION.md)
- [`docs/25_COMPATIBILITY_REGISTRY.md`](docs/25_COMPATIBILITY_REGISTRY.md)
- [`docs/superpowers/plans/2026-08-18-provibe-foundation.md`](docs/superpowers/plans/2026-08-18-provibe-foundation.md)

## Security constraints

- Do not execute customer repository code during normal analysis.
- Do not place provider OAuth tokens or service-role secrets in project rows, prompts, logs, or client bundles.
- Do not browse production customer rows by default.
- Do not convert an inferred security assessment into a “secure” certification.
- Do not silently treat missing provider data as healthy state.
- Do not add provider write scopes without an explicit product/security decision.

## Build path

```text
Foundation
    ↓
Auth + canonical project persistence
    ↓
GitHub App + Vercel read-only connections
    ↓
Existing-project import + progress verification
    ↓
Supabase OAuth + metadata/advisors
    ↓
Analyzer AST graph + code/database relationships
    ↓
Grounded Ask My App + prompt generation
    ↓
Closed beta + billing + launch readiness
```

The target is not to become another coding agent. ProVibe remains the independent planning, understanding, evidence, and owner-decision layer above the tools people already use.
