# Claude Code Instructions

Read `AGENTS.md` first and treat it as the project constitution.

Before implementation, read the relevant product/architecture documents under `docs/` and the active plan under `docs/superpowers/plans/`.

Key rules:
- Evidence/provider facts outrank agent claims.
- Never mark a claim verified without evidence.
- Provider integrations remain read-only in MVP.
- Never execute customer repository code during normal analysis.
- Never place provider credentials or production DB rows in model context.
- Generated prompts must be valid JSON and tied to canonical project revision.
- Keep analyzer and web runtimes separate.
- Use tests first for domain behavior changes.
