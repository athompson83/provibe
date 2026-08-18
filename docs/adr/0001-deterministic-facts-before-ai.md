# ADR 0001 — Deterministic Facts Before AI

**Status:** Accepted

Provider APIs and deterministic/static parsers create observed facts. AI may summarize/infer above those facts but cannot write over them or silently mark inference verified. This improves auditability and reduces false confidence for nontechnical users.
