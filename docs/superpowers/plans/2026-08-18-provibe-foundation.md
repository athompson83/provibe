# ProVibe Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Establish a buildable, testable ProVibe monorepo foundation that turns the approved product specification into real application, domain, provider, database, and CI boundaries.

**Architecture:** Use a pnpm/Turborepo monorepo with a Next.js 16.2 web application, a separate analyzer-worker runtime, shared TypeScript domain packages, read-only provider adapter contracts, and Supabase Postgres/RLS. Deterministic facts and provider observations are stored separately from AI inference; the web UI consumes normalized domain contracts and never handles provider tokens directly.

**Tech Stack:** Node.js 24 LTS, Next.js 16.2.11, React 19.2, TypeScript strict mode, pnpm workspaces, Turborepo, Supabase Postgres/Auth, native Node test runner for dependency-light domain packages.

**Spec:** `docs/01_PRD_MVP.md`, `docs/04_SYSTEM_ARCHITECTURE.md`, `docs/15_CANONICAL_PROJECT_MODEL.md`, `docs/19_PROGRESS_VERIFICATION.md`

## Global Constraints
- Provider integrations are read-only in MVP.
- Agent reports are claims, never evidence.
- Evidence statuses are `reported | observed | verified | contradicted | unknown | blocked | accepted_risk`.
- Canonical project model revisions drive artifact staleness.
- No repository code execution in the web runtime.
- Production database row browsing is excluded from this foundation.
- Provider secrets never enter generated prompts, browser bundles, or logs.
- Next.js web runtime and analyzer runtime remain separate deployment boundaries.

## Completed foundation tasks
- [x] Monorepo and quality gates.
- [x] Canonical project and evidence contracts.
- [x] Progress verification engine.
- [x] Provider and analyzer boundaries.
- [x] Web product shell.
- [x] Supabase foundation and RLS assertions.
- [x] Documentation, handoff, secret and JSON checks.

## Verification boundary
Dependency-light domain tests, JSON validation, secret heuristic, and non-Next TypeScript source checks passed in the staging runtime. The real Next.js build and PostgreSQL migration/RLS replay are intentionally delegated to GitHub CI and must not be reported as passing until CI confirms them.
