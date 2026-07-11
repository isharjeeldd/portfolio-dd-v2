---
name: spike-implementation
description: Rules for creating, editing, and managing spike documents in docs/implementation/spikes/. Spikes are time-boxed experimental tasks. Acceptance criteria are required for a spike to be marked ready. Human approval is required on the result for done. TDD does NOT apply to spikes. Auto-invokes when working on spike files.
---

# Spike Documents

## When This Applies

Any time you are reading, writing, or editing files in `docs/implementation/spikes/`.

## What Spikes Are

A spike is a **time-boxed experiment** to answer a specific technical question or validate an approach before committing to a production implementation. The output is **knowledge**, not a shipping deliverable. Spike code is exploratory — it may inform a feature implementation, an ADR, or be discarded entirely.

Spikes are NOT features and do NOT follow TDD. They have their own gating rules.

## When To Use a Spike

- Tech discovery surfaced a question that requires running real code or measurement (e.g., "can the hero's WebGL/canvas effect hold 60fps on a mid-range phone?").
- A feature depends on a fact we don't know yet (e.g., "does the chosen animation approach work with view transitions across route changes?").
- An architectural choice has trade-offs real measurement can resolve (e.g., "MDX build time and bundle impact at 50 posts vs a CMS fetch").

If the question can be answered by reading docs or vendor specs, it is not a spike — it is tech discovery.

## Prerequisites

```
Tech Discovery (open question identified) → Spike doc created → Spike run → Findings → Human approval → Decision
```

## Frontmatter (Required)

```yaml
---
spike: Hero Canvas Effect Performance Baseline
status: draft
release: "1.0.0"
priority: P0
component: hero
owner: @isharjeeldd
created: YYYY-MM-DD
updated: YYYY-MM-DD
timebox: "1 day"
depends_on: []
---
```

Fields as in the `feature-implementation` skill, plus **`timebox`** (hard maximum effort, e.g. "1 day"). `component` uses the same list (`hero`, `about`, `projects`, `blog`, `contact`, `design-system`, `content`, `seo`, `infrastructure`, `cross-cutting`). Priority: `P0` blocks other work, `P1` informs planned work, `P2` nice to know.

## Filename Convention

`S###-<kebab-slug>.md`, numbered sequentially (zero-padded to 3 digits), monotonic across the project's lifetime.

## Status Lifecycle & Branch Rules

```
On develop branch:    draft → ready ─────────────────────────────────→ done
On spike branch:             ready → in-progress → review → done
```

Spike branches are named `spike/<slug>` (doc filename **without the `S###-` prefix**), cut from `develop`.

- `draft`: plan being written. Acceptance criteria incomplete. **Cannot be picked up.**
- `ready`: **acceptance criteria defined.** Disposition options listed. Method described. Timebox set.
- `in-progress`: **only on a `spike/*` branch.**
- `review`: spike run; Findings and Disposition filled. **Only on a `spike/*` branch.**
- `done`: **human approver has signed off in the Approval section.** Claude cannot self-approve.

## Document Template

```markdown
---
[frontmatter as above]
---

# [Spike Name]

## Question

The single, specific technical question this spike answers. One sentence.

## Why This Spike

Which tech discovery doc, ADR, or feature surfaced this question? What blocks if we don't run it?

## Prerequisites

Concrete checklist of everything needed before the spike can start (local dev environment, sample content/fixtures, device access for perf testing, third-party API keys). Each item answers "where do I get this." Include estimated prep time.

## Acceptance Criteria

What does "we have learned enough" look like? Concrete and measurable. **Required before `draft → ready`.**

- [ ] Measured X under conditions Y, with at least N samples
- [ ] Documented failure mode Z if it occurs
- [ ] Compared against baseline W

## Disposition Options

1. **Option A**: continue with the original plan; record measurements as the new baseline.
2. **Option B**: revise approach (specify what changes).
3. **Option C**: write a new ADR superseding an existing decision (specify which).
4. **Option D**: scrap the approach; no production code from this spike.

## Method

How the spike will be run: tools, environment, sample data, what we measure, what we will NOT measure (out of scope).

## Code Location

- **Branch:** `spike/[name]`
- **Path:** where the experimental code lives
- **Merge intent:** explicitly state whether the branch is intended to merge or be discarded

## Findings

*Filled in during the spike. Empty in `draft`/`ready`.*

- What we measured / built / observed; surprises; numbers (fps, bundle size, build time, cost); links to raw data/screenshots

## Disposition

*Filled in during `review`.*

**Selected option:** [A/B/C/D/new]
**Reasoning:** why, given the findings.
**Follow-up actions:**
- [ ] e.g. "open feature doc F0XX" / "write ADR-NNNN"

## Approval

**Required before `done`. A human must sign off here.**

| Approver | Date | Notes |
|---|---|---|

## Files Affected

Spike code paths and any docs/ADRs the disposition will trigger edits to.

## Estimated Effort

Must match `timebox`. If exceeded, stop and escalate.
```

## Rules

1. **Acceptance criteria are required for `ready`.** Without explicit, measurable criteria, a spike stays `draft`.
2. **Human approval is required for `done`.** Claude cannot self-approve.
3. **TDD does not apply.** Acceptance criteria are the gating contract instead.
4. **Time-boxed, hard.** If the timebox is exceeded without an answer, stop, document "inconclusive" in Findings, and escalate.
5. **Spike code lives on `spike/*` branches**, never on `feature/*` / `bugfix/*`.
6. **Spike code may be discarded.** The spike doc itself is the durable artifact.
7. **Findings inform decisions, not vice versa.** Resulting ADR/feature edits are separate PRs that cite the spike.
8. **Update the `updated` date on every edit.**
9. **One spike = one question.** If it answers more than one, split it.
