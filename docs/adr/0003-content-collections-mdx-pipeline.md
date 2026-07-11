# ADR-0003: Content Collections MDX pipeline; build-time TL;DRs with committed cache

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

The blog is MDX-in-repo (D8) with typed, validated frontmatter that fails builds loudly (FR-BLOG-3), syntax-highlighted code with zero client JS, RSS, sitemap, generated typographic OG cards (FR-SEO-2), and AI TL;DRs generated at build time that must never break deploys (FR-BLOG-6, NFR-OPS-4). Contentlayer — the previous ecosystem standard — is abandoned. Full analysis: [`../tech_discovery/blog_content_pipeline.md`](../tech_discovery/blog_content_pipeline.md).

## Options Considered

### Content layer — Content Collections (chosen) vs Velite vs next-mdx-remote(-client) vs @next/mdx
- **Content Collections** (`@content-collections/core` 0.15.2, active June 2026; Dub migrated to it publicly): Zod-typed schemas, build-fails-loudly, first-class Next integration — the community successor to Contentlayer.
- Velite 0.4.0: capable but v1.0 stalled in alpha. next-mdx-remote **archived April 2026**; its fork is compiler-only (no typed collections). @next/mdx: healthy but no schema/validation layer.

### Highlighting / OG / RSS
- **Shiki v4.3.1 via rehype-pretty-code 0.14.3** — build-time highlighting, zero client JS.
- **`next/og` `ImageResponse`** for generated typographic cards (built into Next 16).
- **`feed` package** in an `app/feed.xml` route handler; sitemap via native `app/sitemap.ts`.

### TL;DR strategy — pre-build script + committed cache (chosen) vs in-pipeline generation
- A pre-build script generates TL;DRs keyed by content hash and commits the cache file; the build itself makes **zero AI calls**. AI outages can't fail deploys; a cache miss simply renders no TL;DR block (EC-BLOG-4). In-pipeline generation couples deploy success to a third-party API — rejected.

## Decision

**Content Collections + Shiki/rehype-pretty-code + `next/og` + `feed`; TL;DRs via a pre-build generation script with a content-hash-keyed cache committed to the repo.**

## Consequences

- Publishing stays "add one `.mdx` file" (NFR-OPS-3); TL;DR refresh is one script run when content changes.
- The TL;DR cache file is repo state — reviewable, diffable, and deploy-independent.
- Frontmatter schema becomes the content contract documented in `docs/architecture/content_model.md`.

## Follow-ups not included in this decision

- Exact frontmatter schema (feature plan for the blog).
- OG card design (brand board tokens).
