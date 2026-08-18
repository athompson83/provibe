# System Architecture

## Architectural thesis
Provider APIs and deterministic parsers create facts. AI explains those facts. The canonical project model stores planned state. Agent reports store claims. Reconciliation links layers without collapsing contradictions.

## Deployment boundaries
```text
Browser
  ↓
Next.js Web/BFF (Vercel)
  ├─ Auth/session/workspace authorization
  ├─ Project model / Blueprint / artifacts / prompts
  ├─ Webhook verification + job enqueue
  └─ Read APIs for product UI
           ↓
Supabase Postgres/Auth
           ↓
Durable job queue/orchestrator
  ├─ provider refresh jobs
  └─ analyzer jobs
           ↓
Separate analyzer worker
  ├─ ephemeral repository materialization
  ├─ AST/static parsing only
  └─ graph facts (never execute repository code)
```

## Core services
- Project Model Service: revisions, accepted decisions, stale artifacts.
- Blueprint Service: adaptive intake, challenge logic, gaps.
- Artifact Renderer: canonical model → versioned artifacts.
- Prompt Adapter Service: project/evidence → valid JSON tool prompt.
- Evidence Store/Reconciler: provider/deterministic/reported/inferred evidence.
- Progress Verification Service: report claims → rules → verdict.
- Provider adapters: GitHub, Vercel, Supabase, read-only MVP.
- Analysis service: static TypeScript/Next.js graph.
- Readiness/Estimate service: evidence-based controls/ranges.
- Explanation service: minimal evidence subgraph → structured answer.

## Graph model
Nodes: repository, folder, file, symbol, route, component, env key, DB table/column/policy, deployment, service, test, inferred feature.

Edges: contains, imports, exports, calls, renders, reads_from, writes_to, references_env, invokes_rpc, uses_service, tests, built_from, deployed_as, related_to.

Every edge stores source kind, confidence, evidence pointer, observed time, analyzer version.

## Cache/version keys
Repository analysis: `repo + commit_sha + analyzer_version`.
Summary: `entity + evidence_revision + prompt_version + model_profile`.

## Incremental refresh
Verified webhook → resolve before/after → changed files → invalidate affected nodes → parse changed files → recompute dependent edges/summaries → emit change event. Full reindex after analyzer semantic changes, critical config changes or graph integrity failure.

## Trust boundaries
- Web runtime never executes customer code.
- Analyzer receives short-lived source access and has no production DB/provider-secret access beyond the minimum job materialization mechanism.
- AI receives no provider credentials and only minimal relevant evidence/source excerpts.
- Provider failure does not erase previous verified data; capability freshness/state is stored separately.
