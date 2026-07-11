---
name: architecture
description: Rules for writing and maintaining architecture documents in docs/architecture/. Covers system diagrams, site structure, content model, design system, and current system state. Auto-invokes when working on architecture files.
---

# Architecture Documents

## When This Applies

Any time you are reading, writing, or editing files in `docs/architecture/`.

## What Architecture Docs Are

Architecture documents describe **how the system works right now**. They are the living reference for the current state of the codebase. When the system changes, these docs must be updated. They answer: "If someone opened this repo today, what do they read to understand the site?"

## Relationship to Other Docs

- **Tech discovery** (`docs/tech_discovery/`) is the exploration: "we investigated X, Y, Z and chose Y." May become stale.
- **Architecture** is the result: "the site currently uses Y, here's how it works." Must never be stale.
- **ADRs** (`docs/adr/`) are the reasoning: "we chose Y because of A, B, C." Immutable history.

## Structure

Created as the system is built (not pre-written):

```
docs/architecture/
  system_overview.md      Entry point: site map, rendering strategy, how everything connects
  content_model.md        Blog posts, project entries, profile data — where content lives, its shape, how it flows to pages
  design_system.md        Tokens, typography scale, spacing, components, motion vocabulary
  infrastructure.md       Vercel deployment, domains/DNS, env vars, third-party services (forms, analytics)
```

### Document Template

```markdown
# Architecture: [Area Name]

**Last verified:** YYYY-MM-DD
**Reflects release:** X.Y.Z

## Overview

One-paragraph description of what this area does and where it fits.

## Diagram

[Mermaid or ASCII diagram]

## Data / Rendering Flow

Step-by-step: what data enters, how it's processed or rendered, what comes out.

## Key Interfaces

Routes/pages, content sources, API routes or server actions, third-party integrations.

## Dependencies

What this area depends on — internal modules and external services (hosting, form delivery, analytics, fonts, CDNs).

## Current Limitations

Known constraints or technical debt. Cross-link to entries in `docs/known-issues.md` where applicable.
```

## Rules

1. **Always current.** If you implement a change that affects architecture, update the relevant architecture doc in the same PR. Architecture docs that don't match the code are worse than no docs.
2. **Last verified date.** Every architecture doc has a `Last verified` date. Update it when you confirm the doc matches reality (even with no edits).
3. **Diagrams are required.** Every architecture doc must have at least one diagram (Mermaid preferred for git-friendliness).
4. **system_overview.md is the entry point.** It must link to all other architecture docs. A newcomer should be able to read it and understand how the whole site fits together.
5. **The content model is authoritative.** If there's a conflict between code and `content_model.md`, the doc is wrong and must be updated — but the doc should be the reference checked before adding content types or fields.
6. **No aspirational content.** Architecture docs describe what IS, not what WILL BE. Future plans go in tech discovery, implementation features, or product discovery.
7. **Cross-link with operator docs.** When architecture relies on manually-applied setup (Vercel config, DNS, third-party dashboards, env vars), link to the relevant entry in `docs/operator-docs/`.
