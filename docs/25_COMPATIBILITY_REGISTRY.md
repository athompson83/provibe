# Compatibility Registry

## Purpose
Agent configuration formats, skills, MCP servers, CLIs and provider APIs change rapidly. Generated setup guidance must come from versioned validated registry entries rather than model memory alone.

## Entry fields
Product/name, category (`agent|skill|mcp|provider`), supported version/range, installation/configuration method, required credentials, permission risk, known conflicts, verification command/procedure, status (`validated|experimental|unsupported`), last validated date and source/reference.

## Initial agent targets
Codex: validated baseline through `AGENTS.md` and JSON task prompts.
Claude Code: experimental adapter through `CLAUDE.md` plus prompt package.
Cursor: experimental adapter through project rules plus prompt package.

## Generation rule
If an entry is stale/unvalidated for a material setup action, surface that uncertainty and require current verification instead of inventing instructions.
