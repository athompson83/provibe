# Progress Verification

## Problem
Coding-agent status reports often mix completed work, assumptions, environment limitations and unverified claims. Persuasive prose is not evidence.

## Pipeline
Raw report → atomic claim extraction → claim classification → applicable verification rules → evidence lookup → state decision → contradiction/blocker/scope-drift analysis → project verdict → next prompt.

## States
- `reported`: agent/person says it happened.
- `observed`: provider/system saw a relevant event/fact.
- `verified`: evidence is sufficient for the specific claim.
- `contradicted`: evidence conflicts.
- `unknown`: insufficient capability/evidence.
- `blocked`: prerequisite prevents completion/readiness.
- `accepted_risk`: owner explicitly accepts an unresolved risk.

## Rules
Contradictory evidence outranks a report. Partial evidence cannot verify a broader claim. Provider outage/missing integration produces unknown/degraded capability, not success. Broad readiness claims are evaluated through readiness controls, not report wording.

## Example
“All tests pass” + failed GitHub check → contradicted.
“Preview deployed” + Vercel ready at expected SHA → verified.
“Migration applied” + no DB capability → unknown.
“Ready for beta” + missing authenticated QA → blocked/not ready.

## Auditability
Store raw report separately from extracted claims. Verification stores rule/version, reason and evidence IDs so outcomes can be reproduced as rules evolve.
