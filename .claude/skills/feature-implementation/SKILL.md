---
name: feature-implementation
description: Rules for creating, editing, and managing feature and fix implementation documents in docs/implementation/features/ and docs/implementation/fixes/. Covers frontmatter format, status lifecycle, TDD requirement, test case standards, and branch-status rules. Auto-invokes when working on feature or fix files.
---

# Feature & Fix Implementation Documents

## When This Applies

Any time you are reading, writing, or editing files in `docs/implementation/features/` or `docs/implementation/fixes/`.

## What These Docs Are

Feature docs are granular implementation plans. Each doc covers one specific deliverable — small enough to complete in a few focused sessions. They are the handoff artifact between planning and coding: detailed enough that Claude (or any engineer) can pick one up and implement it without ambiguity.

**Fix docs** (`docs/implementation/fixes/`) record bug fixes. Same frontmatter and lifecycle, with `type: fix` and the `X###-` filename prefix. A bug fix may skip product/tech discovery and start directly from a `docs/known-issues.md` entry.

## Prerequisites

```
Product Discovery (locked) → FSD (locked) → Tech Discovery (complete) → Feature docs created
```

For pure bug fixes or refactors, work from the known-issue entry and (optionally) write a fix doc — full feature docs are for net-new behavior or significant changes.

## Frontmatter (Required)

```yaml
---
feature: Blog Post Reading Experience
type: feature           # feature | fix
status: draft
release: "1.0.0"
priority: P1
component: blog
owner: @isharjeeldd
created: YYYY-MM-DD
updated: YYYY-MM-DD
depends_on: []
---
```

(For a fix, use `fix:` as the title key and `type: fix`.)

### Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `feature` / `fix` | Yes | Human-readable name |
| `type` | Yes | `feature` or `fix` |
| `status` | Yes | `draft`, `ready`, `in-progress`, `review`, or `done` |
| `release` | Yes | Target release version (e.g., "1.0.0") |
| `priority` | Yes | `P0` (must-have), `P1` (should-have), `P2` (nice-to-have) |
| `component` | Yes | `hero`, `about`, `projects`, `blog`, `contact`, `design-system`, `content`, `seo`, `infrastructure`, or `cross-cutting` |
| `owner` | Yes | Person responsible |
| `created` / `updated` | Yes | Dates |
| `depends_on` | Yes | List of feature/fix/spike file names (e.g. `F002-...`) this depends on (empty list if none) |

## Filename Convention

- **Features:** `F###-<kebab-slug>.md` · **Fixes:** `X###-<kebab-slug>.md`

Numbers are assigned sequentially (zero-padded to 3 digits) at creation — find the highest existing number and increment. Numbers never reset across releases. Reference docs by their full `F###-<slug>` / `X###-<slug>` form in `depends_on` and links.

## Status Lifecycle & Branch Rules

```
On develop branch:    draft → ready ─────────────────────────────────→ done (after merge)
On working branch:           ready → in-progress → review → done (then merge)
```

Working branches: `feature/<name>` for features, `bugfix/<name>` for fixes, cut from `develop`. Use the doc's slug **without the `F###-` / `X###-` prefix** in the branch name. Code flows forward only: `feature/* → develop → main`.

**Critical rules:**

- `draft`: plan being written. **Cannot be picked up for implementation.**
- `ready`: plan complete. Test cases defined. Contracts specified. Dependencies listed. **The only status from which work can begin.**
- `in-progress`: **only exists on a working branch.** Never on `develop` or `main`.
- `review`: code written, tests pass, PR open. **Only on a working branch.**
- `done`: merged to `develop`.

## Document Template

```markdown
---
[frontmatter as above]
---

# [Feature Name]

## Summary

One paragraph: what this feature does and why. Reference the FRs it implements (e.g. `FR-BLOG-1..4`).

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Technical Approach

How this will be implemented: key design decisions, data/rendering flow, integration points (content sources, third-party services, shared design-system components).

## UI / Design Contract (if applicable)

Which design-system tokens/components are used or created; responsive behavior per breakpoint; motion behavior (including `prefers-reduced-motion`); loading/empty/error states. Reference the locked design direction — deviations need sign-off.

## Content Model Changes (if applicable)

New content types, fields, or frontmatter for posts/projects. Note the `docs/architecture/content_model.md` update.

## Dependencies

What must be complete before this can start (other features, fixes, spikes, ADRs, operator setup).

## Test Cases

### Unit / Component Tests

- Test: [description] — Input: [input] — Expected: [expected]

### Integration / E2E Tests

- Test: [description] — Setup: [preconditions] — Action: [what happens] — Assert: [expected]

### Edge Cases

- Test: [description] — Scenario: [e.g. zero posts, missing cover image, form delivery failure, reduced motion, tiny viewport] — Expected: [behavior]

## Files Affected

List of files created or modified.

## Estimated Effort

T-shirt size: S / M / L / XL
```

## Rules

1. **No feature is `ready` without test cases.** The single most important rule. TDD — tests are written before implementation code (test runner per the stack decision; check `package.json`).
2. **Granularity matters.** If a doc covers more than a few sessions of work, break it up. Each doc = one deliverable.
3. **Acceptance criteria are checkboxes** (`- [ ]`) so progress can be tracked.
4. **Files Affected is required** — enables impact analysis.
5. **Dependencies reference file names**, not prose.
6. **Update the `updated` date** on every edit.
7. **Contracts are binding.** Once `ready`, the UI/design and content-model contracts in the doc are the contract. Changes require updating the doc and any dependent docs.
8. **NFRs are testable.** Features whose FRs carry performance/accessibility/SEO requirements must include test cases (or measurable checks) for them — a11y assertions, metadata presence, budget checks — not just functional tests.
