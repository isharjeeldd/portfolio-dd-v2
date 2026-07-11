---
name: validate
description: Audit repository health and feature/fix/spike readiness. Checks docs for completeness, validates frontmatter, ensures test cases exist, and verifies cross-document consistency. Run /validate before starting work or before merging.
disable-model-invocation: true
---

# /validate — Repository Health Check

## What This Does

Audits the repository for consistency, completeness, and readiness. Behavior adapts based on context: validating a single item, the full release, or pre-merge readiness.

## Execution Modes

### Mode 1: Single Item Validation

**When:** An argument is provided (e.g., `/validate blog-reading-experience`).

Locate the file in `docs/implementation/features/`, `fixes/`, or `spikes/`. Validate that specific doc.

**For a feature / fix:**

- [ ] Frontmatter is valid YAML with all required fields (incl. `type`)
- [ ] `status` is valid (`draft`, `ready`, `in-progress`, `review`, `done`)
- [ ] `release` matches a known release version
- [ ] `component` is valid (`hero`, `about`, `projects`, `blog`, `contact`, `design-system`, `content`, `seo`, `infrastructure`, `cross-cutting`)
- [ ] `priority` is P0, P1, or P2
- [ ] `depends_on` references existing doc filenames
- [ ] All dependencies are `done` or `ready` (warn if `draft`)
- [ ] Acceptance Criteria section non-empty
- [ ] Technical Approach section non-empty
- [ ] Test Cases section exists with ≥1 unit/component test and ≥1 edge case test
- [ ] If the feature carries FSD perf/a11y/SEO requirements, ≥1 test case or measurable check covers them
- [ ] Files Affected non-empty
- [ ] If `Content Model Changes` non-empty, lists the `content_model.md` update
- [ ] `owner` is set
- [ ] If `status` is `ready`, ALL of the above must pass.

**For a spike:**

- [ ] Frontmatter valid with all required fields including `timebox`
- [ ] `status` valid; `component` valid; `depends_on` references exist
- [ ] Question section contains a single specific question
- [ ] Acceptance Criteria non-empty (gates `draft → ready`)
- [ ] Disposition Options lists ≥2 options
- [ ] Method section non-empty
- [ ] Files Affected non-empty
- [ ] If `status` is `done`: Approval section filled by a human approver
- [ ] If `status` is `review`: Findings and Disposition sections filled

### Mode 2: Release Validation

**When:** No argument, running on `develop`.

- [ ] Run Mode 1 on every feature/fix/spike doc where `release` matches current version
- [ ] Check for circular dependencies
- [ ] Verify no feature/fix/spike is `in-progress` on `develop` (only on working branches; never on `main` either)
- [ ] Count items by status and report
- [ ] Check product discovery changelog has an entry for this release
- [ ] Check tech discovery docs for touched topics are `complete`
- [ ] Flag any `draft` features as blockers
- [ ] Flag any spikes stuck in `review` (awaiting human approval) as blockers

### Mode 3: Pre-Merge Validation (develop → main)

**When:** Explicitly invoked as `/validate --pre-merge`.

Everything in Mode 2, plus:

- [ ] ALL features/fixes for this release are `done`
- [ ] ALL spikes for this release are `done` (human-approved) or explicitly deferred in frontmatter
- [ ] Release doc in `docs/releases/<version>.md` exists and is current (re-run `/release-index` if in doubt)
- [ ] Architecture docs have `Last verified` dates within the last 30 days
- [ ] No TODO/FIXME/HACK in feature/fix docs
- [ ] Product discovery changelog has the current release entry
- [ ] `docs/known-issues.md` reviewed; no `Open` items are P0 for this release
- [ ] The project's test and build scripts pass (build must pass before code reaches `main`)
- [ ] FSD §10 Definition-of-Done NFR checks (perf / accessibility / SEO validation) have been run and pass

## Output Format

```
## Validation Report

**Mode:** [single/release/pre-merge]
**Release:** [version]
**Date:** [current date]

### Summary

| Check | Status |
|-------|--------|
| Feature/fix frontmatter | [PASS/FAIL (n issues)] |
| Spike frontmatter | [PASS/FAIL (n issues)] |
| Test cases defined | [PASS/FAIL (n missing)] |
| Spike approvals signed | [PASS/FAIL (n unapproved)] |
| Dependencies resolved | [PASS/FAIL (n blocked)] |
| Changelog current | [PASS/FAIL] |
| Architecture docs current | [PASS/FAIL/SKIP] |
| Known issues reviewed | [PASS/FAIL] |

### Issues Found
1. **[FAIL]** `F003-...md`: Missing test cases section
2. **[WARN]** `S001-...md`: Spike in `review` — awaiting human approval

### Blocking Issues / Warnings / Result: [PASS / FAIL]
```

## Rules

1. **FAIL is blocking.** If validation returns FAIL, do not proceed with `/discover` or merging. Fix first.
2. **WARN is advisory.**
3. **Be specific.** Every issue references the exact file and problem.
4. **Validate before work.** `/discover` runs Mode 1 internally; `/validate` can run independently any time.
5. **Pre-merge is strict.** Mode 3 has zero tolerance — the final gate before code reaches `main`.
6. **Spike approval is hard-gated.** A spike in `review` blocks the release until a human signs the Approval table.
