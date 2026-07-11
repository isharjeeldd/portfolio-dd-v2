---
name: product-discovery
description: Rules for writing and editing product discovery documents in docs/product_discovery/. Covers changelog format, versioning conventions, and scope definition standards for the portfolio's visitor-facing surface (hero, about, projects, blog, contact, design direction, SEO). Auto-invokes when working on product discovery files.
---

# Product Discovery Documents

## When This Applies

Any time you are reading, writing, or editing files in `docs/product_discovery/`.

## What Product Discovery Docs Are

Product discovery documents define **what** we are building and **why** for the portfolio's visitor-facing surface. They are not technical architecture or implementation docs. They cover: the hero/landing experience, about/experience/skills, projects & case studies, the blog (listing, reading experience, discoverability), contact, and the cross-cutting visitor experience — design direction & theming, accessibility, performance as perceived by visitors, SEO/social presence.

Internal-only changes (refactors, infra moves, perf fixes) generally do not need product discovery — those start at tech discovery.

## Stage 1 of the workflow — and the lock → FSD gate

Product discovery is **Stage 1**. A release's discovery doc lists the features in scope and **locks** them; once locked it is handed to an **FSD** (`docs/fsd/portfolio_fsd_v<N>.md`) that turns the scope into `FR-<area>-<n>` requirements. **No FSD — and therefore no implementation feature records — until the product discovery is locked.**

```
product discovery v<N> (draft → 🔒 lock) → FSD v<N> → tech discovery → ADRs → architecture → features
```

## Structure Conventions

Product discovery is **versioned per release**: one file per version, `portfolio_product_discovery_v<N>.md`.

- `portfolio_product_discovery_v1.md` — scopes the first release (1.0.0) of the new portfolio.
- `_v2`, `_v3`, … — each scopes that release's **new** features (a delta on what shipped). The "current scope" is the highest-numbered **locked** version.

Each version doc opens with a **status banner** stating its lock state (`✅ SCOPE LOCKED (v<N>.0.0)` or `🚧 DRAFT — scope not yet locked`) and the next-stage pointer to its FSD. A version is a **living draft until locked**; after lock it is **frozen** — further scope changes go into the *next* version (or an ADR for hard-to-reverse shifts), never silent edits to a locked doc.

### Design direction belongs here

For this project the **look & feel is scope**: the discovery doc must capture the chosen design direction — inspiration references (e.g., awwwards sites), the mood/tone (minimal, brutalist, editorial, playful, terminal-inspired, …), and what visitors should feel — as Decisions (`D#`) that the FSD and later the design system trace back to. Keep it about *what and why*, not CSS.

### Changelog (Required)

The doc must have a `## Changelog` section immediately after the Table of Contents. Every time scope changes, add an entry:

```markdown
## Changelog

### 1.0.0 — [Month YYYY]
- Added: [what was added]
- Changed: [what changed]
- Removed: [what was removed]
- Clarified: [what was ambiguous and is now pinned down]
```

Use these prefixes: `Added`, `Changed`, `Removed`, `Clarified`.

## Rules

1. **Versioned per release; living until locked.** Edit the current version in place while draft. Once locked (🔒), it is frozen — start `_v<N+1>` for the next release.
2. **Lock is a human gate.** Moving a version from draft to 🔒 SCOPE LOCKED is Sharjeel's call. After lock, write the FSD; do not create implementation features before the FSD exists.
3. **Changelog first.** Before editing content, add the changelog entry. No change goes unrecorded.
4. **Edge cases are mandatory.** Every feature section includes an edge cases table: `| Scenario | Expected Behavior | Resolution |`. Examples: blog with zero posts, a post with no cover image, contact form submission failure/spam, JS disabled, slow connection, small screens, `prefers-reduced-motion`, dark/light preference, a project with a dead external link.
5. **Out-of-scope is explicit.** Features not in the current release are listed in "Out of Scope" with a reason and expected release.
6. **Language is precise.** "Must" = non-negotiable for the release. "Should" = strongly recommended. "May" = optional.
7. **No technical architecture.** If you're writing about frameworks, component code, or data schemas, that belongs in `docs/tech_discovery/` or `docs/architecture/`, not here.
8. **The visitor contract belongs here.** Anything that constrains what visitors (or crawlers/feed readers) experience — URL structure/permalinks, RSS availability, social-card behavior, page structure a reader relies on — is in scope for product discovery, even if the immediate trigger was a technical change.
