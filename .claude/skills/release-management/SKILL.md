---
name: release-management
description: Rules for release scope documents in docs/releases/, version scheme, git flow conventions, and merge rules for the portfolio. Auto-invokes when working on release files or discussing release planning.
---

# Release Management

## When This Applies

Any time you are reading, writing, or editing files in `docs/releases/`, or when discussing release planning, versioning, or merge workflows.

## Version Scheme

Strict semantic versioning: `MAJOR.MINOR.PATCH[-rc.N]`.

- **Major** (X.0.0): full redesigns or breaking changes to public contracts — URL structure / permalinks, RSS/sitemap shape, any published API endpoints.
- **Minor** (0.X.0): new backward-compatible features — new sections, new blog capabilities, new integrations.
- **Patch** (0.0.X): bug fixes, content-pipeline fixes, perf improvements, dependency bumps, internal refactors.
- **Pre-release RCs** (`1.0.0-rc.1`) may gate final review on `develop` previews before promotion.

Current line: greenfield — in-flight work buckets as `1.0.0`.

## Git Flow

Two long-lived branches — code flows **forward only**: `feature/* → develop → main`.

```
main ← production (Vercel production deploy). Carries the SemVer release tags.
  └── develop ← integration; latest tested work. Default base for all new branches. Vercel preview.
        ├── feature/<name>   ← new functionality, merges back to develop via PR
        ├── bugfix/<name>    ← non-critical fix, merges back to develop via PR
        └── spike/<name>     ← time-boxed experiment (may be discarded)
  hotfix/<version>  ← urgent prod fix cut from main; the ONLY downward merge — back-merged into develop
```

- **Never fix bugs directly on `main`** (except hotfixes). Fix forward from `develop`. Production tags live on `main` only.
- Vercel deploys `main` to production (`sharjeelafzaal.com`) and every PR / `develop` push to a preview URL — preview review replaces a staging environment.

### Standard Release Cycle

1. Stabilize on `develop`. Review the Vercel preview against the FSD's Definition of Done (functional + NFR checks: perf, a11y, SEO).
2. Optionally tag an RC on `develop`: `git tag -a 1.0.0-rc.1 -m "Release Candidate 1: <summary>"`.
3. Run `/validate --pre-merge`, then `/release-index` to (re)generate `docs/releases/<version>.md`.
4. Merge `develop → main` via PR (or `--no-ff` merge), tag the final SemVer version on `main` (`1.0.0`), push tags.
5. Verify the Vercel production deployment is healthy; capture the deployment URL/id in the release doc's Status row.
6. Create the GitHub Release with notes.

### Hotfix (the only downward merge)

Cut `hotfix/<version>` from `main`, fix, merge to `main` (tag the patch version), then **back-merge `main` into `develop`** so the fix is not lost. Delete the hotfix branch.

### Branch / PR rules

- `main` is protected — only `develop → main` promotions and `hotfix/*` reach it.
- Feature/bugfix branches open PRs against `develop` on GitHub.
- Reviewer comments in PR threads are addressed via the `pr-feedback` skill.
- A doc's `status` becomes `done` once its PR merges to `develop`.

## Release Doc Format

Release docs live in `docs/releases/` and are **auto-generated** by `/release-index`, manually adjusted for narrative after the final regeneration. File naming: `<version>.md`.

(See the `release-index` skill for the full template: goal, progress summary, features/fixes/spikes tables, ADRs, out of scope, dependencies & risks, success criteria.)

## Rules

1. **Release docs are frozen after the release is tagged.** Historical records — never edited retroactively.
2. **Auto-generate before merge.** Always run `/release-index` before promoting `develop` to `main`.
3. **One release doc per version.** Even a patch gets its own doc.
4. **Frontmatter is the source of truth.** The tables must match the feature/fix docs; if they disagree, the docs are authoritative.
5. **Status transitions for releases:** `planning` → `in-progress` → `released` (merged to main, tagged, Vercel production deploy healthy).
6. **Tags on `main` only.** Production SemVer tags live on `main`; `-rc.N` tags may live on `develop`.
