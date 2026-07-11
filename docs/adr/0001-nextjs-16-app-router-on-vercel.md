# ADR-0001: Next.js 16 (App Router) on Vercel

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

Release 1.0.0 needs a framework that delivers: core content without client JS (FR-SITE-6 → SSG/SSR mandatory), server routes for the AI chat and contact endpoints, first-class MDX, heavy client-side motion, and Lighthouse ≥90 mobile within a ≤200KB landing JS budget. Deployment on Vercel is fixed. The maintainer is solo and fluent in Next.js + Tailwind from the previous portfolio. Full analysis: [`../tech_discovery/framework_and_hosting.md`](../tech_discovery/framework_and_hosting.md).

## Options Considered

### A. Next.js App Router (v16.2.10, LTS) — chosen
- Vercel-native (zero-config previews, `next/og`, analytics), App Router static-first with Cache Components, API route handlers for AI/contact, maintainer fluency.
- Cons: React runtime baseline makes the 200KB budget tighter than Astro's; framework churn between majors.

### B. Astro 7.0
- Islands architecture would make the JS budget trivial; strong content story.
- Cons: server-endpoint + streaming-AI story weaker on Vercel; maintainer has no Astro fluency; GSAP-heavy interactive surfaces end up as islands everywhere, eroding the benefit.

### C. React Router v8 (framework mode)
- Modern SSR framework, good streaming.
- Cons: RSC still unstable; smaller Vercel integration surface; no MDX-native content conventions; ESM-only/Node 22 constraints add friction without offsetting benefit.

## Decision

**Next.js 16 App Router (pinned major 16, currently 16.2.10) deployed on Vercel**, production from `main`, previews per PR.

## Consequences

- The ≤200KB landing budget needs deliberate discipline: dynamic imports for AMA chat and Playground experiments, and a CI bundle-size check (carried into feature plans).
- Next 15 support ends 2026-10-21 — starting on 16 avoids an early forced migration.
- Turbopack is the default bundler; build tooling assumptions follow Next 16 semantics (`use cache` / Cache Components rather than the old experimental PPR flag).

## Follow-ups not included in this decision

- Bundle-size CI enforcement mechanism (feature-level concern).
- Adoption of Cache Components beyond static defaults — revisit when a real need appears.
