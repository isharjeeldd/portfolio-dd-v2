# Product Discovery Documents

Product discovery defines **what** we are building and **why** for the portfolio's visitor-facing surface — never how. It is **Stage 1** of the workflow and versioned per release: one file per version, `portfolio_product_discovery_v<N>.md`.

## How it fits the workflow

```
product discovery v<N> (draft → 🔒 lock) → FSD v<N> → tech discovery → ADRs → architecture → features
```

A release's discovery doc lists the features in scope and **locks** them; once locked it is handed to an **FSD** (`../fsd/portfolio_fsd_v<N>.md`) that turns the scope into `FR-<area>-<n>` requirements. **No FSD — and therefore no implementation feature records — until the product discovery is locked.**

## Files

| File | Purpose |
|---|---|
| [`portfolio_product_discovery_v1.md`](./portfolio_product_discovery_v1.md) | **v1 — 1.0.0 scope. ✅ LOCKED 2026-07-11.** Design direction, 13 Decisions, feature scope with edge cases, out-of-scope table. |

## Rules

See the `product-discovery` skill (`.claude/skills/product-discovery/`) for the full format and rules.
