# UX & Design System

## Design objective
A modern operational workspace for nontechnical founders: calm, evidence-led, visually sophisticated, and not “vibe-coded.” The UI must explain complexity without hiding uncertainty.

## Visual direction
- Light neutral canvas with true white primary surfaces.
- Dark charcoal navigation/marketing contrast.
- Fresh green accent for primary action and verified-positive emphasis.
- Restrained blue/amber/red/purple semantic tones.
- Tight but readable information density; open lists/tables rather than bento-card overload.
- Strong typography and generous negative space.
- Minimal decorative gradients/glows.

## Information architecture
Portfolio → Project Workspace → Overview / Blueprint / Code / Database / Deployments / Changes / Ask.

Later surfaces: Map, Risks, Decisions, Progress Reports, Prompt History, Readiness, Costs/ETA, Integrations.

## Evidence UX
Evidence state is always inspectable and semantic:
- Verified: evidence proves the claim.
- Observed: provider/system observed it, but it may not prove the broader conclusion.
- Reported: an agent/person said it.
- Contradicted: observed evidence conflicts.
- Unknown: insufficient evidence.
- Blocked: prerequisite missing.
- Accepted risk: owner explicitly deferred risk.

Never collapse these to a single mysterious “health” color. Any health/readiness score must expose contributing controls.

## Core screen behavior
### Build Cockpit
Prioritize current verdict, top attention items, production alignment, provider freshness, owner decisions and recent evidence.

### Code Explorer
Folder/file purpose first; syntax second. Selecting a line/block reveals plain-English behavior, evidence context, data/services touched, and change risk.

### Database Explorer
Metadata-first. Table/column meaning, relationships, RLS, indexes, policies, advisor findings, code references. Do not expose production rows by default.

### Deployments
Show production/preview, source branch/SHA, checks, logs/findings and whether production aligns with repo/database expectations.

### Ask My App
Answers must include evidence and unknowns. Suggested questions should focus on blockers, risk, architecture and live-state reconciliation.

## Responsive rules
Desktop uses persistent sidebar and wide evidence tables. Tablet compresses sidebar. Mobile uses horizontal icon navigation or a controlled drawer; tables become horizontally scrollable rather than lossy card conversions.

## Accessibility
Keyboard-visible focus, semantic headings/landmarks, state text not color alone, sufficient contrast, reduced-motion support, graph/list alternative, accessible code selection and table labels.
