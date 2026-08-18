# Wireframes

These wireframes define hierarchy and workflow, not pixel-perfect styling.

## Portfolio
```text
┌─────────────────────────────────────────────────────────────┐
│ ProVibe                         [New project]                │
│ Your software portfolio                                     │
├─────────────────────────────────────────────────────────────┤
│ Project        Stage    Health   Last verified    Next       │
│ Customer Portal Building 78%     ✓ prod ready     Run QA →  │
│ Resale tool     Planning 42%     reported PRD     Scope →   │
└─────────────────────────────────────────────────────────────┘
│ Rescue a confusing project → connect repo/paste report      │
└─────────────────────────────────────────────────────────────┘
```

## Build Cockpit
```text
┌ Sidebar ─────────┬───────────────────────────────────────────┐
│ Overview         │ Know what is true before what is next.   │
│ Blueprint        │ [Current verdict: NOT READY FOR BETA]    │
│ Code             │ [Production aligned: main = a83f9c1 ✓]  │
│ Database         ├───────────────────────────────────────────┤
│ Deployments      │ Requires attention                       │
│ Changes          │ blocked Authenticated QA missing         │
│ Ask my app       │ observed RLS advisor warning             │
│                  │ verified Production matches GitHub       │
│                  ├───────────────────────────────────────────┤
│                  │ Connections        Recent evidence       │
└──────────────────┴───────────────────────────────────────────┘
```

## Blueprint Studio
```text
┌ Project revision 12 ────────────────────────────────────────┐
│ Interview completeness | Open decisions | Scope challenge  │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT-BRIEF ✓   PRD ✓   MVP-SCOPE STALE   ARCHITECTURE ✓ │
│ Screen specs ✓    Prompt package ✓          Risk register ✓ │
└─────────────────────────────────────────────────────────────┘
```

## Code Explorer
```text
Folders: src/app | src/components | src/lib | supabase
──────────────────────────────────────────────────────────────
Source code / selected block        Plain-English explanation
1 export async ...                 What it does
2 requireUser()                    Why it exists
3 normalizeSlug()                  Inputs/outputs
4 db.workspace.create(...)  ←      Writes workspaces table
                                   Change risk: HIGH
                                   Evidence: source + symbol graph
```

## Database Explorer
```text
4 tables | 100% RLS | 1 advisor warning | 3 code relationships
Table                 Purpose                 RLS     Risk
workspaces            tenant records          on      low
workspace_members     membership/roles        on      med
provider_connections  connection metadata     on      high
```

## Deployments
```text
Production: READY ✓
GitHub main a83f9c1 == Vercel production a83f9c1
──────────────────────────────────────────────────────────────
Production a83f9c1 main       12m Ready
Preview    0c91fe2 feature... 31m Ready
Preview    f281aa4 old...      1h Error → explain failure
```

## Change Translator
```text
VERIFIED  Customer billing settings
Billing settings flow changed
3 route files + 1 migration changed; production includes it.
[View evidence]

CONTRADICTED  Release readiness
Agent claims beta readiness
Authenticated QA gate remains unverified.
```

## Ask My App
```text
Suggested questions              Ask about this application
- What blocks beta?              [ question textarea        ]
- Highest-risk files?            [ Ask with evidence ]
- Does production match main?
                                 Evidence-backed answer
                                 Sources: GitHub | Vercel | DB
                                 Unknowns: ...
```

## Progress report verification
```text
Paste agent report → extract atomic claims → match rules/evidence
Claim                  State          Evidence
“All tests pass”       CONTRADICTED   GitHub check failed
“Preview deployed”     VERIFIED       Vercel ready @ SHA
“Migration applied”    UNKNOWN        DB not connected
→ project verdict → owner decision → next JSON prompt
```

## New/import/rescue/launch intake
```text
Choose mode → adaptive questions → challenge assumptions → review model
→ accept decisions → revision created → artifacts/screen specs generated
```
