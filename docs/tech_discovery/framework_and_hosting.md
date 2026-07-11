# Tech Discovery: Framework & Hosting

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

Select the web framework for Muhammad Sharjeel's personal portfolio v2, deployed on **Vercel** (deployment target is fixed: production on `main`, preview deployments on PRs). The site is a one-page landing at `/`, plus `/blog` and `/blog/[slug]`, with a dark editorial-minimalist design driven by heavy engineered motion (GSAP-style scroll animation, kinetic typography hero). The framework must satisfy the locked FSD constraints:

- **No-JS core content:** identity, work, about, blog text, and contact details must render without client-side JS → SSG/SSR is mandatory; a client-rendered SPA is disqualified.
- **Performance budgets:** Lighthouse ≥90 mobile; LCP ≤2.5s, CLS <0.1, INP <200ms; initial compressed JS on the landing page ≤200KB (Should).
- **Content pipeline:** blog posts are MDX files in the repo; RSS feed, sitemap, and OG cards are required.
- **Build-time AI:** TL;DR summaries are generated at build time, so the build step must be able to call an external AI API.
- **Server endpoints:** runtime API routes for an AI chat endpoint (streaming-friendly) and a contact-form endpoint.
- **Maintainer profile:** solo maintainer with deep existing fluency in Next.js + Tailwind + shadcn/ui (the previous portfolio stack).

## Options Evaluated

### Option A: Next.js App Router — v16 (current stable 16.2.10, LTS)

**Description.** Vercel's first-party React framework. Next.js 16 shipped as stable on 2025-10-22 and the current patch is 16.2.10 (2026-07-01); Next.js 15 leaves security support on 2026-10-21, so 16 is the only sensible pin ([endoflife.date/nextjs](https://endoflife.date/nextjs)). v16 made **Turbopack the default bundler** for dev and production, requires Node 20+ and ships React 19.2, and replaced the old implicit caching model with **Cache Components**: an explicit `use cache` directive plus `cacheComponents: true`, which removes the old experimental PPR flag and makes Partial Prerendering (static shell + Suspense-bounded dynamic holes) the standard rendering strategy ([nextjs.org/blog/next-16](https://nextjs.org/blog/next-16), [upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)). For this project the relevant modes are plain static generation (`generateStaticParams` for `/blog/[slug]`) and Route Handlers for the two API endpoints.

**Pros.**
- Zero-friction Vercel fit: first-party framework, streaming Route Handlers for the AI chat endpoint, preview deployments, ISR/image optimization all work with no adapter.
- Static rendering of all three routes satisfies the no-JS core-content constraint; MDX is first-class via `@next/mdx` or contentlayer-style tooling; RSS/sitemap/OG image generation (`ImageResponse`) are well-trodden.
- Build step is Node — calling an AI API at build time for TL;DRs is trivial.
- Maintainer already fluent in Next.js + Tailwind + shadcn/ui (shadcn/ui is Next-native); lowest ramp-up and lowest long-term solo-maintenance risk.
- Turbopack-default builds in 16 are 2–5x faster than webpack, which matters for a build that also calls an AI API.

**Cons.**
- Heaviest baseline JS of the three: React + Next runtime puts real pressure on the ≤200KB landing budget; GSAP-style animation code must be code-split and lazily hydrated deliberately.
- v16's caching-semantics change (implicit fetch caching → explicit `use cache`) is a genuine mental-model migration from the maintainer's Next 13/14-era habits.
- Framework complexity (RSC boundaries, caching directives) is arguably overkill for a 3-route site.

**Cost implications.** Free on Vercel Hobby for a personal site; API routes run as serverless/Fluid functions within free-tier limits. No adapter or third-party service costs. AI API cost is per-build and per-chat-call, framework-independent.

### Option B: Astro — v7.0 (released 2026-06-22)

**Description.** Content-first islands framework. Astro 7.0 shipped 2026-06-22 with Vite 8 (Rolldown bundler), a Rust rewrite of the `.astro` compiler and of Markdown/MDX processing (the "Sätteri" pipeline replacing unified), advanced routing via a `src/fetch.ts` entrypoint with Hono middleware support, and 15–61% faster builds ([astro.build/blog/astro-7](https://astro.build/blog/astro-7)). Vercel supports Astro with zero config for static output and via `@astrojs/vercel` for on-demand rendering; Astro 7 adds an experimental Vercel CDN cache provider (`cacheVercel()`) ([vercel.com/docs/frameworks/frontend/astro](https://vercel.com/docs/frameworks/frontend/astro), [docs.astro.build](https://docs.astro.build/en/guides/integrations-guide/vercel/)).

**Pros.**
- Best possible fit for the JS budget: zero JS by default, HTML-first output makes the no-JS constraint and CWV targets nearly automatic; the ≤200KB budget becomes trivial even with GSAP islands.
- Content collections + first-class MDX, plus official RSS/sitemap/OG integrations — the blog pipeline is Astro's home turf.
- API endpoints and build-time AI calls are fully supported (server endpoints via the Vercel adapter; build is Node).
- v7's Rust MD/MDX pipeline and faster builds are attractive for an MDX-heavy blog.

**Cons.**
- Maintainer would be learning Astro's component model, islands hydration, and the brand-new v7 routing/caching surface from scratch — the single biggest schedule and maintenance risk for a solo project.
- v7.0 is ~3 weeks old at time of writing; the Rust MDX pipeline (Sätteri) and the Vercel CDN cache provider are new/experimental, and ecosystem plugins (remark/rehype-based) may lag the unified→Sätteri transition.
- shadcn/ui and the existing React component habits port awkwardly: React islands work, but a heavily interactive hero + AI chat widget means multiple hydrated React islands, eroding Astro's zero-JS advantage exactly where this design is heaviest.
- Vercel support is adapter-based (second-party), not first-party.

**Cost implications.** Free on Vercel Hobby; server endpoints via the adapter run on the same function pricing. No incremental cost vs Option A; potential hidden cost is maintainer time on an unfamiliar, freshly-rewritten toolchain.

### Option C: React Router v7 (framework mode) — superseded by v8 (released 2026-06-17)

**Description.** The Remix lineage merged into React Router at v7 (framework mode: file/config routes, loaders/actions, SSR + prerendering). Note the version reality: **React Router v8 shipped 2026-06-17** as a deliberately small, yearly-cadence major (ESM-only, Node 22+, React 19.2.7+, Vite 7+, middleware and Split Route Modules stabilized; RSC support still unstable), with v7 receiving security fixes only going forward ([remix.run/blog/react-router-v8](https://remix.run/blog/react-router-v8)). So "React Router v7" today really means adopting v8. Vercel supports React Router as a framework, including SSR on Fluid compute, since Feb 2025 ([vercel.com/changelog/support-for-react-router-v7](https://vercel.com/changelog/support-for-react-router-v7), [vercel.com/docs/frameworks/frontend/react-router](https://vercel.com/docs/frameworks/frontend/react-router)).

**Pros.**
- Clean, minimal data-loading model (loaders/actions) with less framework magic than Next's RSC/caching layer; prerendering covers the static-HTML constraint.
- Portable: deploys identically to Vercel, Cloudflare, Netlify, or a VPS — no platform lock-in.
- React-based, so shadcn/ui and existing React fluency carry over better than to Astro.
- v8's "boring, yearly majors" policy is friendly to a solo maintainer.

**Cons.**
- Weakest fit for this content pipeline: no first-class MDX/content-collections story — MDX, RSS, sitemap, and OG-card generation are all DIY/community wiring, versus built-in or canonical solutions in A and B.
- Vercel support is real but not first-party; fewer platform niceties (no native ISR story equivalent, image optimization requires extra setup).
- RSC support is still unstable in v8; you'd ship a classic SSR/hydration model, so the landing page hydrates the full route — similar JS-budget pressure to Next.js without Next's PPR tooling.
- Smaller ecosystem/community for the "framework mode" deployment path; the v7→v8 transition (ESM-only, Node 22) adds churn right now.

**Cost implications.** Free on Vercel Hobby; SSR runs on Fluid compute within the free tier. No adapter cost; incremental cost is maintainer time hand-rolling the blog/SEO plumbing.

## Recommendation

**Option A: Next.js App Router, pinned to major version 16 (currently 16.2.10), deployed on Vercel.**

Rationale, in weight order:

1. **Maintainer fluency dominates.** This is a solo-maintained portfolio; the prior version was Next.js + Tailwind + shadcn/ui. Options B and C both trade the maintainer's strongest asset for marginal (B) or negative (C) technical gains.
2. **Vercel-native integration.** The deployment target is fixed. Next.js is the only first-party option: streaming Route Handlers for AI chat, preview deployments, OG image generation, and image optimization work with zero adapter risk.
3. **All hard constraints are met.** Static generation of `/`, `/blog`, and `/blog/[slug]` satisfies the no-JS core-content requirement; MDX, RSS, sitemap, and build-time AI TL;DR calls are all standard Next.js patterns; the two API endpoints are Route Handlers.
4. **No disqualifier found in research.** Astro 7 is technically the best pure-performance fit, but it is three weeks old with an experimental MDX pipeline and would be net-new to the maintainer. React Router v8 fails the content-pipeline test relative to the other two. Next 16's caching change is a migration cost, not a blocker — this site barely uses dynamic caching anyway.
5. **The JS budget is the one real risk** and it is manageable: static rendering, lazy-hydrated animation code, and dynamic import of the chat widget keep the landing bundle under 200KB compressed. This is tracked as an open question and will be enforced with a bundle-size CI check.

Pin: `next@16` (16.2.x line, LTS; Next 15 exits support 2026-10-21). Turbopack default, Node 20+, React 19.2.

ADR: to be recorded as ADR-0001.

## Open Questions

- **Bundle budget enforcement:** exact code-splitting strategy for the GSAP-driven hero and the AI chat widget to hold the ≤200KB compressed landing-JS budget; needs a size-limit check in CI before it can be marked resolved.
- **Cache Components adoption:** enable `cacheComponents: true` from day one, or ship plain static rendering first and adopt `use cache` only if a dynamic surface appears? (Site is ~fully static; leaning "later".)
- **Next 16.3:** currently in preview (AI/agent-workflow improvements); adopt 16.3 stable when released or hold the 16.2.x line for launch.
- **MDX tooling choice** (raw `@next/mdx` vs content-collection layer such as Velite/Content Collections) is deferred to the content-pipeline discovery doc.

## Spike Results

None — no spikes required for this topic.
