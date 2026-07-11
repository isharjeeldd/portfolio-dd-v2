# Tech Discovery: Blog Content Pipeline

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

The FSD locks the blog to MDX files committed to the repo — no CMS. The pipeline must turn a folder of `.mdx` files into `/blog` (listing with title/date/description/tags/reading time) and `/blog/[slug]` (reading view with typographic rhythm, first-class syntax-highlighted code blocks, anchorable headings, prev/next, optional TOC), while satisfying hard constraints:

- Malformed MDX or invalid frontmatter fails the build loudly (typed, schema-validated frontmatter).
- RSS feed covering every post; sitemap; each post individually indexable with a canonical URL.
- Posts without a cover image get a generated typographic OG card (dark, MS® branded).
- A build-time AI TL;DR block per post — never generated per visitor, gracefully absent if the AI provider is unavailable, and clearly labeled as AI-generated. The build must never fail because of it.
- Publishing = add one content file, zero code changes.

Framework assumption: Next.js App Router on Vercel (parallel discovery confirming; everything below depends on that outcome). Complication: Contentlayer, the former community default, is abandoned (maintainer down to ~1 day/month after Stackbit's sponsorship ended), so we must pick from its successors and verify each is alive in mid-2026.

## Options Evaluated

### Content layer (MDX ingestion, typed frontmatter, build-time validation)

**A. Velite** (`velite`, https://github.com/zce/velite) — Zod-schema content layer; latest stable 0.4.0 (republished June 2026 per npm; a v1.0.0-alpha line exists), framework-agnostic JSON/DTS output. Pros: Zod validation fails builds loudly; type inference; image/asset handling. Cons: v1.0 has been in alpha for a long stretch; single-maintainer; MDX output is a compiled function-body string you hydrate yourself — one more moving part than Content Collections' runtime helper.

**B. Content Collections** (`@content-collections/core` 0.15.2, June 2026; https://content-collections.dev) — the community's Contentlayer successor of record (Dub and others publicly migrated to it: https://dub.co/blog/content-collections). Zod (Standard Schema) frontmatter validation with loud build failure; `@content-collections/next` plugin wires generation into `next build` and `next dev` with watch mode; `@content-collections/mdx` (0.2.2 — stable, changes land in core) compiles MDX in the `transform` step and ships an RSC-friendly `<MDXContent>`. Recent core releases (TypeScript 7 peer support) show active maintenance; docs target current Next.js App Router. Cons: sub-packages iterate slowly; smaller org than a framework-backed tool.

**C. next-mdx-remote / next-mdx-remote-client** — HashiCorp's `next-mdx-remote` repo was **archived April 9, 2026** (read-only: https://github.com/hashicorp/next-mdx-remote) — eliminated. The fork `next-mdx-remote-client` v2.1.11 (May 2026, React 19 line; https://github.com/ipikuka/next-mdx-remote-client) is actively maintained and App Router/RSC-capable, but it is only a compiler: no collection model, no frontmatter schema, no generated types — we would hand-roll the validation layer the FSD demands.

**D. @next/mdx raw** (`@next/mdx` 16.2.10, July 2026; https://nextjs.org/docs/app/guides/mdx) — first-party and perfectly maintained, but it treats MDX files as pages/imports: no frontmatter schema, no typed collection API for the listing page, and per-file wiring erodes "publish = add one file." Fine for one-off pages, wrong shape for a blog collection.

### Syntax highlighting

**Shiki** (`shiki` v4.3.1, July 2026; https://shiki.matsu.io) via **rehype-pretty-code** (`rehype-pretty-code` 0.14.3, ~May 2026, supports Shiki 4; https://rehype-pretty.pages.dev). Package names verified current (the old `shiki`→`shikiji`→`shiki` churn is settled; rehype plugin lives under the `rehype-pretty` org). Runs at build time inside the MDX pipeline — zero client JS, VS Code-grade grammars, line/word highlighting, meta strings, dual-theme support. Alternative `@shikijs/rehype` is the lower-level official plugin; rehype-pretty-code adds the title/caption/highlight ergonomics we want. Prism/highlight.js are legacy by comparison — not considered further.

### OG image generation

**next/og `ImageResponse`** — the API's current home is `next/og`, built into Next.js App Router (no separate install; it wraps `@vercel/og`/Satori/Resvg). Verified: https://nextjs.org/docs/app/api-reference/functions/image-response and https://vercel.com/docs/og-image-generation. Per-post cards via an `opengraph-image.tsx` file convention or a route handler under `/blog/[slug]`; JSX + flexbox-subset CSS, custom fonts supported (embed the brand font locally — Satori needs font data). Posts with a cover image use it; otherwise the generated dark MS®-branded typographic card renders title/date/tags. Statically generated at build for known slugs. No credible alternative worth the operational cost (Puppeteer screenshots, etc.).

### RSS

Hand-rolled **route handler at `app/feed.xml/route.ts`** using the **`feed`** npm package to build the XML (RSS 2.0 + optional Atom/JSON), returned with `Content-Type: application/rss+xml`. This is the settled App Router pattern (e.g. https://spacejelly.dev/posts/how-to-add-a-sitemap-rss-feed-in-next-js-app-router, https://allanlasser.com/posts/generating-feeds-with-next-js-route-handlers). Iterates the same typed collection as `/blog`, so every post is included by construction. Sitemap via the native `app/sitemap.ts` metadata convention; canonical URLs via the Metadata API `alternates.canonical` per post.

### Build-time TL;DR strategy

**A. Pre-build script + committed cache** — a script (run locally or as a separate CI step before `next build`) sends post bodies to the AI API and writes results to a cache file (e.g. `content/.tldr-cache.json`, keyed by content hash) committed to the repo. Build reads cache only; makes **zero network calls to the AI provider**. New/changed posts without a cache entry simply render no TL;DR until the script runs again.

**B. On-miss generation inside the content pipeline** — the content layer's `transform` step checks the cache and calls the AI API on miss during `next build`, wrapped in try/catch so failures yield `tldr: null`. Fewer steps for the author, but couples build determinism to a third-party API (latency, rate limits, cost on every cold CI build) and Vercel builds can't write the cache back to the repo — misses regenerate (and re-bill) on every deploy until someone commits the cache anyway.

## Recommendation

- **Content layer: Content Collections** (`@content-collections/core` + `/next` + `/mdx`). It is the de-facto Contentlayer successor with real production adoption, Zod-typed frontmatter that fails builds loudly, generated TypeScript types for the listing page, and a Next plugin that keeps "publish = add one MDX file" true. Velite is the fallback if Content Collections stalls — the content model (folder of MDX + Zod schema) ports across with minimal friction, which caps the risk of betting on either.
- **Highlighting: rehype-pretty-code + Shiki 4**, as rehype plugins in the MDX compile step. Build-time, no client JS, meets the "first-class code blocks" bar. Pair with `rehype-slug` + autolink for anchorable headings and a remark reading-time plugin.
- **OG images: `next/og` ImageResponse** with the file-convention route per post; branded dark typographic fallback when no cover image, cover image passthrough otherwise.
- **RSS: `feed` package in an `app/feed.xml/route.ts` handler**; sitemap via `app/sitemap.ts`; canonicals via the Metadata API. No feed SaaS, no extra framework.
- **TL;DR: Option A — pre-build script with a committed, content-hash-keyed cache.** It gives hard failure isolation (the build literally cannot fail on AI outages because it makes no AI calls), deterministic and reviewable output (summaries appear in PR diffs), and near-zero marginal cost (each post summarized once, not per deploy). Graceful absence is the natural cache-miss behavior. The component renders the block only when a summary exists, always with an explicit "AI-generated" label. Option B is rejected for coupling deploys to a third-party API and for Vercel's read-only build cache-writeback problem.

ADR: to be recorded as ADR-0003.

## Open Questions

1. Does the framework discovery confirm Next.js App Router on Vercel? Every pick above (Next plugin, `next/og`, route handlers, metadata conventions) assumes it.
2. Velite's v1.0 has lingered in alpha while 0.x gets maintenance releases — if Content Collections' release cadence slows before implementation starts, re-run this comparison before ADR-0003 is finalized.
3. TL;DR generation: which model/provider and prompt shape, and should the pre-build script run as a CI job that auto-commits cache updates, or stay a manual authoring step? (Manual is simpler and fits a personal blog's cadence; decide at implementation.)
4. Dual-theme (light/dark) code blocks via Shiki's multi-theme output vs. a single dark theme — depends on the site's theming decision from the design discovery.
5. Should the RSS feed include full post HTML or description-only? (Full content is friendlier to readers; costs nothing at build time.)

## Spike Results

None — no spikes required for this topic.
