# Portfolio — Agent Project Context

## What This Is

**portfolio-dd-v2** is the personal developer portfolio of Sharjeel Afzaal (senior software engineer) — the successor to [isharjeeldd/portfolio-dd](https://github.com/isharjeeldd/portfolio-dd), which currently serves [sharjeelafzaal.com](https://www.sharjeelafzaal.com/). The new site is developer-themed and modern; its exact look & feel is being defined through design discovery (inspiration research → product discovery → FSD).

The customer-facing surface (scoped per release in `docs/product_discovery/`):

- **Hero / landing** — first impression, identity, role
- **About** — background, experience, skills
- **Projects / work** — selected projects and case studies
- **Blog** — technical writing, listed + individual posts
- **Contact** — contact form / links / socials
- **Cross-cutting** — design system & theming, SEO / social cards, accessibility, performance

**Deployment target:** Vercel (team *Sharjeel's projects*). `main` → production; `develop` and PR branches → Vercel preview deployments. Domain `sharjeelafzaal.com` cuts over from the old project at launch.

## Repo Structure

```
docs/                     Architect-Era workflow docs (this system)
  product_discovery/      Per-release customer-facing scope (`portfolio_product_discovery_v<N>.md`); locked before its FSD
  fsd/                    Functional Specification per release (`portfolio_fsd_v<N>.md`) — the functional contract + BUILD GATE
  tech_discovery/         Per-topic technical exploration and tradeoffs (stack, styling, content pipeline, hosting, analytics)
  architecture/           Current system state: diagrams, site structure, content model, infra, integrations
  adr/                    Architecture Decision Records (append-only, immutable once Accepted)
  implementation/
    features/             Feature implementation plans (TDD; test cases required). `F###-<kebab>.md`, monotonic.
    fixes/                Bug-fix records (same frontmatter, `type: fix`). `X###-<kebab>.md`, monotonic.
    spikes/               Time-boxed experiments (acceptance criteria + human approval). `S###-<kebab>.md`, monotonic.
  releases/               Per-release scope docs (auto-generated; see /release-index)
  operator-docs/          Operator runbook: manual setup that can't live in code (Vercel project config, DNS, env vars, third-party services)
  conventions/            Folded engineering standards (coding, testing, content/SEO) — populated once the stack is chosen
  known-issues.md         Running log of open / recently-fixed bugs
.claude/skills/           Project skills (workflow folder-rules + operator commands)
```

Application source folders (`app/`, `src/`, etc.) are created once the stack is decided (see Tech Stack below).

## Version Scheme

Semantic versioning (`MAJOR.MINOR.PATCH[-rc.N]`):

- **Major** (X.0.0): full redesigns or breaking changes to public contracts (URL structure / permalinks, RSS/sitemap shape, published API endpoints).
- **Minor** (0.X.0): new backward-compatible features — new sections, new blog capabilities, new integrations.
- **Patch** (0.0.X): bug fixes, content-pipeline fixes, perf improvements, dependency bumps, internal refactors.
- Pre-release RCs (`1.0.0-rc.1`) may gate final review on `develop` previews before promoting to `main`.
- **Current line:** greenfield — in-flight work buckets as `1.0.0` (the first release of the new portfolio).

## Git Flow

Two long-lived branches — code flows **forward only**: `feature/* → develop → main`.

- `main` — production (Vercel production deployment). Carries the SemVer release tags.
- `develop` — integration; latest tested work. Default base for all new branches. Gets a Vercel preview deployment.
- Working branches off `develop`:
  - `feature/<name>` — new functionality
  - `bugfix/<name>` — non-critical fix
  - `spike/<name>` — time-boxed experiment
- `hotfix/<version>` — urgent prod fix off `main`; the **only** downward merge — back-merged into `develop`.

**Never fix bugs directly on `main`** (except hotfixes). Fix forward from `develop`. Production tags live on `main` only. PRs open on GitHub against `develop`; `develop → main` promotion is a PR (or `--no-ff` merge) once the release validates.

Run `/release-index` to (re)generate `docs/releases/<version>.md` before promoting a release.

## Document Lifecycle

```
Product Discovery (lock scope) → FSD (lock = BUILD GATE) → Tech Discovery → Architecture docs updated
  → ADRs written → Implementation features created → Test cases defined → Implementation (TDD)
                                                          ↘
                                              (or) Spike → Findings → Human approval → Decision
```

Each **release** is scoped this way: a **Product Discovery** doc (`docs/product_discovery/portfolio_product_discovery_v<N>.md`) lists the features for that release and **locks the scope** (what & why — never how); once locked, an **FSD** (`docs/fsd/portfolio_fsd_v<N>.md`) turns that scope into the functional contract (`FR-<area>-<n>` requirements, traceable back to the discovery Decisions). **The FSD is the build gate: no implementation features are created for a release until its FSD is locked.** Each is technology-agnostic — stack lives in tech discovery / ADRs.

Pure bug fixes / dependency bumps / refactors skip the upstream stages: open a `bugfix/` branch and (optionally) write a fix record in `docs/implementation/fixes/`. Reserve product/tech discovery and a new FSD for net-new behavior or significant design/architectural moves.

## Feature Status Lifecycle

```
draft → ready → in-progress → review → done
```

- `draft`: implementation plan being written (on develop)
- `ready`: plan complete WITH test cases defined (on develop) — only then can work begin
- `in-progress`: actively being built (only on a working branch, never on develop/main)
- `review`: code complete, PR open (only on a working branch)
- `done`: merged to develop

Fix records (`docs/implementation/fixes/`) follow the same lifecycle and frontmatter, with `type: fix`.

## Spike Status Lifecycle

Spikes are time-boxed experiments in `docs/implementation/spikes/`, run on `spike/*` branches.

```
draft → ready → in-progress → review → done
```

- `ready` requires **defined acceptance criteria**.
- `done` requires **human approval recorded on the spike result**. Claude cannot self-approve.
- TDD does not apply to spikes.

## Critical Rules

### Features (TDD)
- **TDD applies to features.** Test cases must be defined before a feature is `ready`. Tests are written before implementation code (test runner per the stack decision — check `package.json`).
- **Never mark a feature `ready` without test cases.**
- **`in-progress` only exists on working branches**, never on develop/main.

### Cross-cutting
- **ADRs are immutable.** Never edit a published ADR — write a new one that supersedes it.
- **Architecture docs must reflect current state.** Update them in the same change that alters the system; bump the `Last verified` date.
- **Release docs are frozen after the release is tagged.** They are historical records.
- **Stage explicit files in commits** — never `git add -A` (never stage `.env*`, build output, or `node_modules`).
- **Commit messages:** short description (< 50 chars) prefixed `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`, blank line, then an informal detailed body (list significant changes, no file names, no "this commit").
- **Commits produced via Claude include the Claude `Co-Authored-By` trailer** (as emitted by the harness).

### Implementation
- **Verify latest documentation before coding.** Before writing/editing code that uses an external library/framework/vendor API, run `WebSearch`/`WebFetch` against canonical docs to confirm current syntax. Model knowledge trails releases by months — assume prior knowledge is stale until verified. Skip only for purely internal refactors in code already documented here.
- **Build + tests before commit.** Run the project's test and build scripts (see `package.json`) after changes. Build must pass before commit.
- **Config is centralized.** Environment variables are read through a single config module; add new env there and to `.env.example`, never read `process.env` ad hoc.
- **Content is data.** Blog posts, project entries, and profile facts live in the content layer (defined in tech discovery), not hardcoded in components.

### Design & quality bars (portfolio-specific)
- **Design fidelity is a requirement, not polish.** The locked design direction (typography, spacing, motion, color) is part of the functional contract — deviations need sign-off.
- **Accessibility:** semantic HTML, keyboard navigation, contrast, reduced-motion support. Treat as acceptance criteria, not afterthoughts.
- **Performance:** the portfolio is itself a work sample — Lighthouse / Core Web Vitals targets are set in the FSD's NFR section and validated before release.
- **SEO / social:** every page ships with correct metadata, Open Graph / Twitter cards, sitemap and RSS where applicable.

## Tech Stack (ADRs 0001–0007)

- **Framework:** Next.js 16 App Router (TypeScript), statically prerendered; API routes only for contact + chat. Vercel hosting.
- **Styling/motion:** Tailwind v4 (`@theme inline` over CSS custom properties) + GSAP (ScrollTrigger/SplitText); accent theming via `data-accent` on `<html>`; reduced-motion gated globally.
- **Content:** Content Collections (zod-validated MDX in `content/posts/`), Shiki highlighting, `feed` RSS, `next/og` cards. TL;DRs pre-built by `npm run tldr` into a committed cache — builds make zero AI calls.
- **AI:** Vercel AI SDK v7, provider-agnostic (any one of OpenRouter/OpenAI/Anthropic keys; auto-detected, `AI_PROVIDER` override). Grounded AMA chat streams from `/api/chat`.
- **Contact:** Resend + honeypot/fill-time spam gates.
- **Tests:** Vitest 4 + Testing Library (`npm test`); build with `npm run build`. Both must pass before commit.
- **Data-as-content:** identity in `lib/site.ts`, projects/experience in `lib/data/` — these feed pages, SEO, and the AI grounding pack. Never hardcode identity facts in components.

## Folder-level AGENTS.md files

`AGENTS.md` files may exist at folder level for folder-scoped context, lazy-loaded and additively merged with this file. Pattern: `AGENTS.md` holds the content; sibling `CLAUDE.md` contains the single line `@AGENTS.md`. Target **< 200 lines per AGENTS.md**. New folder AGENTS.md files are added by the change that creates the corresponding code, not pre-written speculatively. The `docs/` subfolders are covered by auto-invoking skills (`adr`, `architecture`, `feature-implementation`, `spike-implementation`, `tech-discovery`, `product-discovery`, `fsd`, `release-management`) — no AGENTS.md needed there.

## Conventions

- **Communication:** be concise; explain non-obvious decisions briefly; ask before large refactors or design-direction changes; never delete files without clarification; don't build features outside the locked scope.
- Engineering standards live in `docs/conventions/` and are folded here once the stack is chosen.
