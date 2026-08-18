# ADR 0004 — Monorepo with Separate Analyzer Runtime

**Status:** Accepted

Keep shared contracts/product code in one pnpm monorepo while deploying repository analysis in a separate worker trust boundary. Web request handlers must not execute or dependency-install customer repository code.
