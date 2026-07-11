# loop.md — Build Loop for Release 1.0.0

> **Goal (fixed):** Every Must-FR of `docs/fsd/portfolio_fsd_v1.md` implemented and tested → merged to `main` → tagged `1.0.0` → deployed to Vercel under the **Sharjeel's projects** team → `*.vercel.app` domain assigned → NFR budgets green **on production**.
>
> The loop does not stop until the FSD §10 Definition of Done is fully satisfied. Everything else in this file describes *how* each iteration moves toward that state.

## Iteration protocol

Each iteration:

1. **Validate** — run `/validate` (Mode 2) on `develop`. FAIL blocks the iteration; fix first.
2. **Select** — take the highest item off the Roadmap below that isn't `done`.
   - If its feature doc doesn't exist yet → write it (`docs/implementation/features/F###-*.md`), `draft → ready` **with test cases** (build gate: FSD is locked, so FRs are quotable).
   - If it's marked **[GRILL]** → run the operator grill first; the answers become content/inputs the doc depends on.
3. **Branch** — `feature/<slug>` (or `bugfix/<slug>`) off `develop`; doc status → `in-progress`.
4. **TDD** — tests first, then implementation. Verify any external-library syntax against current docs before writing code.
5. **Verify** — project test + build scripts pass; for UI work, run the app and observe the behavior (screenshot Vercel preview or local run).
6. **Integrate** — commit (explicit files, conventional message, Claude trailer), merge `--no-ff` into `develop`, push. Doc status → `done`.
   *Loop-mode deviation (documented):* solo velocity — feature branches merge directly after green verification; GitHub PRs + `/pr-feedback` are reserved for post-launch changes.
7. **Document** — update `docs/architecture/*` in the same iteration that changes system shape (`Last verified` bumped). Operator-side setup goes to `docs/operator-docs/` as it happens.
8. **Report** — one short progress note per iteration: what shipped, what's next, budget status if measured.

## Roadmap (selection order)

| # | Item | Component | Priority | Needs |
|---|---|---|---|---|
| F001 | Scaffold + design system foundation — Next 16, Tailwind v4, tokens (ADR-0007), fonts, accent switcher, layout shell, 404 | design-system / infrastructure | P0 | — |
| F002 | Hero with kinetic typography (GSAP SplitText, reduced-motion parity) | hero | P0 | F001 |
| F003 | Navigation, footer, section deep-links | cross-cutting | P0 | F001 |
| F004 | Blog pipeline — Content Collections, `/blog`, `/blog/[slug]`, Shiki, RSS, per-post metadata | blog | P0 | F001 |
| F005 | SEO surface — Metadata API, JSON-LD (both names), sitemap/robots, OG cards incl. generated typographic card | seo | P0 | F001, F004 |
| F006 | Contact — form, Resend delivery, honeypot+timing, states + mailto fallback, Upwork channel | contact | P0 | F001 |
| F007 | Selected Work section **[GRILL: projects]** | projects | P0 | F001, grill |
| F008 | About / Experience + CV **[GRILL: experience]** | about | P0 | F001, grill |
| F009 | Playground — ≥3 lazy experiments with poster fallbacks | playground | P1 | F001 |
| F010 | TL;DR build script + committed cache + post block | blog / content | P1 | F004 |
| F011 | AMA chat — AI SDK v7 provider-agnostic, grounding pack, Upstash rate limit, unavailable state **[GRILL feeds grounding]** | cross-cutting | P1 | F004, F007, F008 |
| F012 | Meta case-study blog post (launch content) | content | P1 | F004, F010 |
| F013 | Production release — `/validate --pre-merge`, `/release-index`, merge `develop → main`, tag `1.0.0`, Vercel prod deploy + domain, NFR validation on prod | infrastructure | P0 | all Musts above |

Fixes discovered along the way become `X###` records and jump the queue at their priority.

## Operator gates inside the loop

- **[GRILL: projects]** — before F007: owner supplies/corrects the 4–6 work entries (titles, outcomes, links, anonymization).
- **[GRILL: experience]** — before F008: owner supplies/corrects roles, years, skills, CV file.
- **Vercel project creation + env vars** (Resend, AI keys, Upstash) — operator-docs entry when performed; needed before F006/F011 preview-verification and F013.
- **Key rotation** (Resend + OpenRouter were shared in chat) — before F013 completes.

## Exit condition

`/validate --pre-merge` passes AND FSD §10 items 1–8 are checked AND the production URL responds with the release build. Then the loop ends; post-launch work opens `portfolio_product_discovery_v2.md`.
