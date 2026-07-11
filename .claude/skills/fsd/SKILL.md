---
name: fsd
description: Rules for writing and maintaining Functional Specification Documents in docs/fsd/. Covers the FSD format (FR-<area>-<n> requirements, journeys, edge cases, NFRs, traceability, definition of done), the per-release versioning scheme, the scope-lock→FSD build gate, and the technology-agnostic rule. Auto-invokes when working on FSD files.
---

# Functional Specification Documents (FSD)

## When This Applies

Any time you are reading, writing, or editing files in `docs/fsd/`.

## What an FSD Is

The FSD is the **functional contract for one release** and the **build gate**: it specifies *what the site does* — functional behavior, visitors, journeys, and constraints — derived from a **locked** product discovery doc. It is **technology-agnostic**: frameworks, styling systems, and library choices are outputs of tech discovery (`docs/tech_discovery/`) and recorded in ADRs (`docs/adr/`) — never in the FSD.

## Prerequisite: a locked product discovery

```
Product Discovery v<N> (lock scope 🔒) → FSD v<N> (lock = BUILD GATE) → Tech Discovery → ADRs → Architecture → Features
```

An FSD is written **only after** the matching product discovery (`docs/product_discovery/portfolio_product_discovery_v<N>.md`) is **locked**. **No implementation feature records (`F###`) are created for a release until its FSD is locked.**

## Per-version scheme

One FSD per release: `portfolio_fsd_v<N>.md` (Markdown is the source of truth).

## Required Structure

1. **Title block** — Product, Release, Document version, Status, Date, Repository.
2. **Document control** — version history table + **Requirement language** (Must / Should / May; `Won't (v<N>)` / `Should (future)` for out/deferred) and the `FR-<area>-<n>` ID convention.
3. **§1 Introduction** — Purpose, Scope, Definitions, References (must reference the source product discovery version).
4. **§2 Product overview** — Summary, Site context, Visitors & audiences (recruiters, peers, readers, crawlers), Assumptions & dependencies.
5. **§3 Functional requirements** — one subsection per area (`HERO`, `ABOUT`, `PROJ`, `BLOG`, `CONTACT`, `DESIGN`, `SEO`, …), each a table `ID | Requirement | Priority`. IDs are `FR-<AREA>-<n>` (e.g. `FR-BLOG-3`).
6. **§4 Key visitor journeys** — e.g. recruiter skims in 30 seconds; reader arrives at a blog post from search; visitor sends a contact message.
7. **§5 Error handling & edge cases** — `EC-<AREA>-<n>` table.
8. **§6 Non-functional requirements** — stack-agnostic: performance targets (Core Web Vitals / Lighthouse goals), accessibility (keyboard, contrast, reduced motion), SEO/social metadata, responsiveness, resilience (form failure behavior).
9. **§7 Spikes & open technical questions** — link to `S###` spikes.
10. **§8 Out of scope for v<N>** — split "never" from "deferred (revisit)".
11. **§9 Traceability** — **mandatory** table mapping every product-discovery Decision (`D#`) to the FR IDs (and edge cases / ADRs) that realize it.
12. **§10 Definition of done** — all Must FRs implemented + tested under TDD, edge cases handled, NFRs validated (perf/a11y/SEO checks), spikes closed with human approval, architecture docs current.

## Rules

1. **Derive, don't invent.** Every FR must trace to a locked product-discovery Decision. The §9 Traceability table is required and must cover all Decisions.
2. **Technology-agnostic.** No stack, framework, or library names — if you're tempted, it belongs in tech discovery / an ADR. (Design *behavior* — "motion respects reduced-motion", "theme persists across visits" — is functional and belongs here; the CSS/library achieving it does not.)
3. **Lock before build.** Do not create `F###` feature records for a release until that release's FSD is locked/approved by Sharjeel.
4. **Frozen on lock.** Scope changes after lock go to the *next* version's product discovery + FSD; hard-to-reverse changes need an ADR.
5. **Requirement IDs are stable.** `FR-<area>-<n>` IDs are referenced by features, tests, and traceability — never renumber within a locked version.
6. **Must = ships.** Cutting a `Must` requirement needs explicit human sign-off recorded in Document control.
