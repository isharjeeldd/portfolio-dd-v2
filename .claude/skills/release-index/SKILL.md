---
name: release-index
description: Generate or update the release scope document by scanning all feature, fix, and spike doc frontmatter. Run /release-index before merging develop to main. Produces docs/releases/[version].md.
disable-model-invocation: true
---

# /release-index — Generate Release Scope Document

## What This Does

Scans all feature docs in `docs/implementation/features/`, fix docs in `docs/implementation/fixes/`, and spike docs in `docs/implementation/spikes/`, reads their frontmatter, and generates (or updates) the release scope document in `docs/releases/[version].md`. Also indexes ADRs accepted during the release window.

## Execution Steps

### Step 1: Determine Release Version

Read `AGENTS.md` (or the highest-numbered file in `docs/releases/`) for the current release version. If no version is pinned, ask once.

### Step 2: Scan All Implementation Docs

Read every `.md` file in the three implementation directories. Parse frontmatter. Collect all items where `release` matches the current version.

### Step 3: Build Tables

**Features & Fixes** — group by `component` (`hero`, `about`, `projects`, `blog`, `contact`, `design-system`, `content`, `seo`, `infrastructure`, `cross-cutting`). For each, record: name, component, priority, status, owner. Keep features and fixes in separate tables. Sort within each component by priority (P0 first), then name.

**Spikes** — separate table: name, component, status, disposition (if reached `review`/`done`), approver (if `done`).

### Step 4: Index ADRs Accepted in This Release Window

List ADRs whose acceptance date falls within this release's window. Source: `docs/adr/*.md` where the Status line includes `Accepted — YYYY-MM-DD`.

### Step 5: Calculate Summary Stats

Count features/fixes by status (done / in-progress / ready / draft) and spikes by status.

### Step 6: Pull Out-of-Scope from Product Discovery

Read the latest locked `docs/product_discovery/portfolio_product_discovery_v<N>.md` (and matching FSD if present). Extract the "Out of Scope" section. If none exists yet, skip and note it.

### Step 7: Generate Release Doc

Write `docs/releases/[version].md`:

```markdown
# Release [Version]

| | |
|---|---|
| **Release Date** | [date or "Planned"] |
| **Status** | [planning/in-progress/released] |
| **Goal** | [one sentence] |

**Generated:** [current date]

## Release Goal
[2-3 sentences]

## Progress Summary

### Features & Fixes
| Status | Count |
|--------|-------|
| Done / In Progress / Ready / Draft / **Total** | [n] |

### Spikes
| Status | Count |
|--------|-------|
| Done / Review (awaiting approval) / In Progress / Ready / Draft / **Total** | [n] |

## Features by Component
### [component]
| Feature | Priority | Status | Owner |
|---------|----------|--------|-------|

## Fixes by Component
| Fix | Component | Status | Owner |
|-----|-----------|--------|-------|

## Spikes
| Spike | Component | Status | Disposition | Approver |
|-------|-----------|--------|-------------|----------|

## ADRs Accepted in This Release
| # | Title | Date |
|---|-------|------|

## Out of Scope
[from product discovery]

## Blocking Issues
[draft features that need to become ready, unresolved dependencies, spikes stuck in review]
```

### Step 8: Report

Output: release version, totals + done/remaining, ADRs accepted, blocking issues, and the path to the generated file.

## Rules

1. **Always overwrite.** The release doc is regenerated fresh each time. Re-add manual narrative (release goal, summaries) after the final regeneration before merge.
2. **Docs are authoritative.** If the release doc and a feature/fix doc disagree, the feature/fix doc wins.
3. **Flag draft features.** Any feature still `draft` for this release appears in Blocking Issues. The release cannot ship with `draft` features.
4. **Flag review-stuck spikes.** Spikes in `review` awaiting human approval are blockers.
5. **Run before every promotion of `develop → main`.** Not optional.
6. **The release doc is not a roadmap.** It reflects committed work for *this* version. Future intent goes in product discovery.
