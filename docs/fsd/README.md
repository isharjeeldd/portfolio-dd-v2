# Functional Specification Documents (FSD)

The **FSD** is the functional contract for a release and the **build gate** — no implementation features are created for a release until its FSD is **locked** (per the document lifecycle in [`../../AGENTS.md`](../../AGENTS.md)).

## How it fits the workflow

```
Product Discovery v<N>  →  FSD v<N>  →  Tech Discovery → ADRs → Architecture → Features → Implementation
(lock scope: what & why)   (lock: FR-<area>-<n>           (the "how" — stack, styling, tradeoffs)
                            requirements; BUILD GATE)
```

A release's **Product Discovery** doc (`../product_discovery/portfolio_product_discovery_v<N>.md`) lists the features and **locks the scope** — *what the site offers and why, never how*. The FSD then turns that locked scope into a precise, testable **functional contract**: `FR-<area>-<n>` requirements (Must / Should / May), visitor journeys, edge cases, non-functional requirements (performance, accessibility, SEO), and a **Traceability** table mapping every product-discovery Decision to the FRs that realize it. The FSD is **technology-agnostic** — stack, styling, and library choices are decided in tech discovery and recorded in ADRs.

## Files

| File | Purpose |
|---|---|
| [`portfolio_fsd_v1.md`](./portfolio_fsd_v1.md) | **v1 — functional contract for 1.0.0.** 🚧 Draft, awaiting lock. Derived from `portfolio_product_discovery_v1.md` (locked 2026-07-11). |

## Rules

- **Derive, don't invent.** Every FR traces to a locked product-discovery Decision (the Traceability table is mandatory).
- **Technology-agnostic.** No stack/framework/library names — those live in `../tech_discovery/` and `../adr/`.
- **Lock before build.** Implementation feature records (`F###`) for a release are created only after that release's FSD is locked/approved.
- **Frozen on lock.** Once a version's FSD is locked, scope changes go into the *next* version's product discovery + FSD, not by editing the locked FSD in place (hard-to-reverse changes need an ADR).

See the `fsd` skill (`.claude/skills/fsd/`) for the full format.
