---
name: discover
description: Find the next ready feature, fix, OR spike to work on. Scans implementation/features/, implementation/fixes/, and implementation/spikes/ for the highest-priority ready item, validates completeness, and presents the plan. Use /discover to invoke.
disable-model-invocation: true
---

# /discover — Find Next Item to Work On

## What This Does

Scans `docs/implementation/features/`, `docs/implementation/fixes/`, and `docs/implementation/spikes/` for the next item to work on, validates it, and presents the plan for approval before starting.

Features/fixes and spikes differ in lifecycle (TDD vs time-boxed experiment), branch naming (`feature/*` / `bugfix/*` vs `spike/*`), and required-content rules. This skill handles all of them.

## Execution Steps

### Step 1: Identify Current Release

Read `AGENTS.md` (or the highest-numbered file in `docs/releases/`) to determine the current release version. Only consider items targeting this release.

### Step 2: Scan Items

Read all files in the three implementation directories. Parse YAML frontmatter; tag each item with its type. Filter to: `release` matches current release AND `status` is `ready`.

### Step 3: Priority Sort

1. `priority`: P0 first, then P1, then P2
2. Dependencies: items with no unmet dependencies come first
3. `created` date: older first (FIFO within same priority)

Type is **not** a sort key.

### Step 4: Check Dependencies

For the top item, verify all entries in `depends_on` have `status: done`. If any dependency is not `done`, skip and try the next. Report blocked items with their dependency chains.

### Step 5: Validate Completeness

**For a feature or fix** (per `feature-implementation` skill):

- [ ] `owner` field is set
- [ ] Acceptance Criteria section is non-empty
- [ ] Technical Approach section is non-empty
- [ ] Test Cases section contains at least one unit/component test and at least one edge case test
- [ ] Files Affected section is non-empty
- [ ] If the feature carries perf/a11y/SEO requirements from the FSD, at least one test case or measurable check covers them
- [ ] If `Content Model Changes` is non-empty, the doc lists the `docs/architecture/content_model.md` update

**For a spike** (per `spike-implementation` skill):

- [ ] `owner` and `timebox` are set
- [ ] Question section is non-empty (single specific question)
- [ ] Acceptance Criteria section is non-empty
- [ ] Method section is non-empty
- [ ] Disposition Options lists at least two options
- [ ] Files Affected section is non-empty
- [ ] Test cases are **not** required (TDD does not apply)

**If validation fails, report exactly what's missing and do NOT proceed.**

### Step 6: Present the Plan

Present type, priority, component, owner, estimated effort, branch type, and the doc's Summary / Acceptance Criteria / Test Strategy / Files Affected / Dependencies / Approach. For features/fixes note: "Tests will be written FIRST before implementation (TDD)." For spikes present Question / Acceptance Criteria / Method / Disposition Options / Timebox.

### Step 7: Wait for Approval

For a feature/fix, ask:
> "Shall I create the `feature/<name>` (or `bugfix/<name>`) branch from `develop` and start? I will write the tests first, then implement."

For a spike, ask:
> "Shall I create the `spike/<name>` branch from `develop` and start the experiment? TDD does not apply; the spike cannot move to `done` without human approval on the result."

**Do not proceed until confirmed.**

### Step 8: Start Work (after approval)

**For a feature / fix:**

1. `git checkout develop && git pull --ff-only`
2. `git checkout -b feature/[slug]` (or `bugfix/[slug]`) — slug = doc filename with the `F###-` / `X###-` prefix stripped
3. Update the doc's `status` to `in-progress` and the `updated` date
4. Write the test files first (TDD — runner per `package.json`)
5. Implement (verify external-library syntax against current docs first)
6. Run the project's test and build scripts; both must pass
7. Stage explicit files (never `git add -A`; never stage `.env*`)
8. Commit with the conventional message (`feat:`/`fix:`/`refactor:`, < 50-char subject, detailed body) + the Claude `Co-Authored-By` trailer
9. `git push -u origin <branch>`
10. Open a GitHub PR against `develop` (GitHub API or `gh` CLI)
11. Update doc `status` to `review`

**For a spike:**

1. `git checkout develop && git pull --ff-only`
2. `git checkout -b spike/[slug]` (filename with the `S###-` prefix stripped)
3. Update `status` to `in-progress` and the `updated` date
4. Run the experiment per the Method section
5. Fill Findings with measurements, surprises, links to data
6. Fill Disposition (pick an option or propose a new one) with reasoning + follow-ups
7. Update `status` to `review`
8. **Stop.** A human must sign the Approval table before the spike moves to `done`.

## Edge Cases

- **No `ready` items found:** report the current state of all items with statuses.
- **All `ready` items blocked:** report the dependency chains.
- **Malformed frontmatter:** report the parsing error and skip the file.
- **A `ready` item fails Step 5 validation:** report what's missing; do not start; suggest updating the doc and re-running `/discover`.
- **In-flight uncommitted work on develop:** `git checkout -b` from current state — don't stash + rebase to clean.
