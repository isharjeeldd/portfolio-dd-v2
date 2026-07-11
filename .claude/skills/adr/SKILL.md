---
name: adr
description: Rules for writing Architecture Decision Records in docs/adr/. Covers ADR format, numbering, immutability rules, and when to create new ADRs. Auto-invokes when working on ADR files.
---

# Architecture Decision Records (ADRs)

## When This Applies

Any time you are reading, writing, or editing files in `docs/adr/`.

## What ADRs Are

ADRs capture **why** a significant technical decision was made. They record the context, options considered, and rationale. They are the historical trail that prevents relitigating past decisions without new information.

## Format

File naming: `NNNN-short-kebab-title.md` (e.g., `0001-nextjs-app-router-on-vercel.md`). Sequence is global across the repo, zero-padded to four digits.

```markdown
# ADR-NNNN: [Decision Title]

**Status:** Proposed / Accepted — YYYY-MM-DD / Superseded by ADR-NNNN / Deprecated
**PR:** [#NNN](https://github.com/isharjeeldd/portfolio-dd-v2/pull/NNN)

## Context

What is the situation? What problem are we facing? What constraints / metrics motivated looking at this in the first place? Include reproducible numbers where the decision is performance-related (e.g., Lighthouse scores, bundle sizes).

## Options Considered

### A. [Name]

- Description
- Pros
- Cons

### B. [Name] (the chosen option)

- Description
- Pros
- Cons

## Decision

State plainly which option was chosen, and the diff / scope of the change.

## Consequences

What changes downstream? What did we trade away? What follow-ups did this create?
Include before/after measurements when the decision was perf-related.

## Follow-ups not included in this decision

Optional. Items deferred to future ADRs / PRs.
```

## Rules

1. **ADRs are immutable.** Once an ADR has status `Accepted`, its content must never be edited. If a decision is revisited, write a new ADR that supersedes it and update the old ADR's status to `Superseded by ADR-NNNN`.
2. **Sequential numbering.** ADRs are numbered sequentially (`0001`, `0002`, ...). Never reuse a number, even if an ADR is deprecated.
3. **One decision per ADR.** If a tech discovery results in three decisions, write three ADRs.
4. **Link from tech discovery.** When you write an ADR based on a tech discovery, add a link to the ADR in the tech discovery doc's Recommendation section.
5. **Link from architecture.** Architecture docs should reference relevant ADRs so readers understand the reasoning behind the current design.
6. **Link from the README index.** Update `docs/adr/README.md`'s Index table with the new ADR row.
7. **Not every decision needs an ADR.** Write ADRs for decisions that are: hard to reverse, affect the whole site (framework, styling system, content pipeline, URL structure, hosting), involve significant tradeoffs, or will be questioned later. Routine choices (library version bump, config tweak, single-file refactor) do not need ADRs.
8. **Design-direction decisions count.** Locking the visual direction (typography system, motion vocabulary, layout paradigm) after design discovery is an ADR-worthy decision — it is hard to reverse once pages are built against it.
9. **Keep them short.** An ADR that takes more than 5 minutes to read is doing too much; split it.
10. **Status transitions:** `Proposed` → written, not yet agreed · `Accepted` → agreed, dated · `Deprecated` → no longer relevant · `Superseded by ADR-NNNN`.
