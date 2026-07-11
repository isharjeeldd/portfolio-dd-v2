# ADR-0006: Vercel Web Analytics; Next Metadata API for SEO surface

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

Analytics must be privacy-respecting with no consent wall (NFR-PRIV-1) at ~$0 for a solo maintainer. SEO Musts: unique metadata per page, OG/Twitter cards, sitemap + robots, JSON-LD Person with `name` "Muhammad Sharjeel" + `alternateName` "Sharjeel Afzaal" (FR-SEO-1..5, NFR-SEO-1/2), with automated pre-release checks. Full analysis: [`../tech_discovery/analytics_and_seo.md`](../tech_discovery/analytics_and_seo.md).

## Options Considered

### Analytics — Vercel Web Analytics (chosen) vs Plausible vs Umami vs none
- Vercel: cookieless, consent-wall-free, Hobby tier includes 50K events/month free (collection pauses rather than bills), zero-config on the chosen platform. Plausible: $9/mo — cost without added value here. Umami: self-hosting burden. None: forfeits basic insight for no gain.

### SEO tooling
- **Next.js Metadata API** (`metadata`/`generateMetadata`) + file conventions `app/sitemap.ts`, `app/robots.ts` — first-party, verified current in Next 16.
- JSON-LD via inline script typed with `schema-dts`.
- Automated checks: Playwright assertions on rendered metadata (part of the test suite); Lighthouse CI optional later.

## Decision

**Vercel Web Analytics for measurement; Next.js Metadata API + `sitemap.ts`/`robots.ts` file conventions for the SEO surface; JSON-LD Person (with both names) typed via `schema-dts`; metadata validated by Playwright checks pre-release.**

## Consequences

- Zero consent banner — nothing invasive is collected.
- SEO assertions become part of the Definition-of-Done test run (FSD §10.2).
- If event volume ever exceeds the free tier, collection pauses — acceptable failure mode for a portfolio.

## Follow-ups not included in this decision

- OG card template design (brand tokens).
- Search Console registration at launch (operator runbook).
