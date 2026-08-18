# Canonical Project Model

## Purpose
One structured source of planned project truth that survives agent sessions, generated files and tool changes.

## Major domains
Project identity/stage; product definition; scope and exclusions; users/roles; workflows; entities/data; integrations; architecture decisions; design/tokens/screens; requirements; tasks/milestones; risks; owner decisions; open questions; evidence links; observed-state references; artifacts; prompt history; estimates; readiness.

## Revision model
Every accepted material mutation creates a new integer revision. AI suggestions are proposals until a user/system-authorized rule accepts them. Historical revisions are immutable.

## Artifact relationship
Markdown, agent configuration, screen specifications and prompt packages record the project revision/template version used to create them. When an accepted decision changes a dependency area, affected artifacts become `stale=true` until intentionally regenerated.

## Truth separation
The canonical model represents **planned/accepted project intent**. It does not overwrite provider observations, deterministic source facts, agent claims or AI inferences. Reconciliation surfaces conflicts.

## Decision workflow
Proposal → impact preview → owner acceptance/rejection → revision increment → affected artifacts stale → optional regeneration → decision log entry.

## Schema
Machine-readable baseline: `schemas/project-model.schema.json`.
