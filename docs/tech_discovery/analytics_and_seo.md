# Tech Discovery: Analytics & SEO Tooling

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

The portfolio needs (a) basic traffic insight and (b) strong search/social presence, under these FSD constraints:

- **Analytics (NFR-PRIV-1, Should):** privacy-respecting — no invasive tracking, no cross-site cookies, and no consent banner required.
- **SEO (Musts):** unique metadata per page; Open Graph and Twitter cards; sitemap + robots; JSON-LD `Person` structured data with `name: "Muhammad Sharjeel"` and `alternateName: "Sharjeel Afzaal"` (the owner is findable under both names); automated pre-release SEO checks.

Context that weights the decision: solo maintainer, strong $0 preference, and the stack is (pending parallel confirmation) Next.js App Router deployed on Vercel — so Vercel-native and Next.js-built-in options get priority.

## Options Evaluated

### Analytics

**Option A — Vercel Web Analytics.**
Verified 2026-07-11 against [Vercel's pricing docs](https://vercel.com/docs/analytics/limits-and-pricing) (doc last updated 2026-06-26):

- **Hobby plan: 50,000 events/month included free**, unlimited projects, 1-month reporting window.
- Collection pauses when the cap is hit — Hobby is never billed for overage.
- Pro is usage-billed at $0.03 per 1K events, 12-month reporting window, custom events.
- Cookieless and privacy-friendly by design — no consent banner needed (satisfies NFR-PRIV-1).
- Integration is one first-party package plus one component in the root layout; data lives in the dashboard the owner already uses for deploys.
- 50K events/month is far above realistic portfolio traffic.

**Option B — Plausible (paid).**

- Excellent privacy-first product; plans start at **$9/month for 10K pageviews** ([Plausible plans](https://plausible.io/docs/subscription-plans)).
- A recurring ~$108/year for a solo, low-traffic site fails the $0 preference; the longer retention it buys over Vercel Hobby's 1-month window is not worth it here.

**Option C — Umami (self-host or cloud).**

- Open source (MIT); self-hosting is free but adds a database plus an app to run and patch — real operational load for a solo maintainer.
- Umami Cloud's free Hobby tier (~100K events/month, 3 sites, limited retention) is viable ([Umami pricing](https://umami.is/pricing)) but is still a second vendor and a second dashboard for no capability the project needs at v1.

**Option D — No analytics at v1.**

- Zero cost, zero privacy surface.
- But Option A is also effectively zero cost, zero maintenance, and consent-free — skipping it just discards useful signal (which projects/posts get traffic) for nothing.

### SEO tooling

**Metadata, sitemap, robots — Next.js built-ins.**
Verified current App Router conventions 2026-07-11 ([Metadata & OG images guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)):

- Each route exports a static `metadata` object or a `generateMetadata` function (server components only) for unique titles/descriptions and OG/Twitter card fields; a root `metadataBase` makes relative OG image URLs absolute.
- File convention [`app/sitemap.(js|ts)`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) is served at `/sitemap.xml` as a cached route handler, typed via `MetadataRoute.Sitemap`.
- File convention [`app/robots.(js|ts)`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) is served at `/robots.txt`, typed via `MetadataRoute.Robots`.
- Together these cover every SEO Must except JSON-LD and automated checks — with zero third-party dependencies.

**JSON-LD `Person` — hand-rolled vs `schema-dts`.**
Two approaches: (a) a hand-rolled `<script type="application/ld+json">` rendered from a plain object in the layout/home page — simplest, but typos in property names fail silently; (b) the same script tag but with the object typed using Google's [`schema-dts`](https://www.npmjs.com/package/schema-dts) package — compile-time-only TypeScript types (zero runtime bytes) that catch invalid schema.org properties. Next.js's own docs recommend the script-tag approach and mention `schema-dts` for typing. Either way the payload is a `Person` with `name: "Muhammad Sharjeel"`, `alternateName: "Sharjeel Afzaal"`, plus `url`, `jobTitle`, and `sameAs` profile links.

**Automated pre-release SEO checks.**
- *Lighthouse CI* ([GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)): runs Lighthouse's SEO category in CI with score assertions. Broad but coarse — it checks "has a meta description," not "has *this* description," and won't validate the JSON-LD name fields.
- *Playwright assertions on rendered metadata*: a small spec that visits each route on a preview build and asserts exact `<title>`, description, OG/Twitter tags, presence of `/sitemap.xml` and `/robots.txt`, and parses the JSON-LD script asserting `name`/`alternateName` values. Precise, cheap, and the project will likely have Playwright anyway.
- These are complementary: Playwright for exact per-page assertions, Lighthouse CI optionally later for holistic scoring.

## Recommendation

**Analytics: Option A — Vercel Web Analytics** on the Hobby plan (50K events/month free, cookieless, no consent wall — satisfies NFR-PRIV-1 at $0 with zero extra vendors). Revisit only if the 1-month reporting window or traffic growth ever bites; Umami Cloud free tier is the fallback, Plausible only if budget appears.

**SEO: Next.js built-ins for everything structural** — per-route `metadata`/`generateMetadata` with OG/Twitter fields and a root `metadataBase`; `app/sitemap.ts` and `app/robots.ts` file conventions. **JSON-LD via an inline script tag typed with `schema-dts`** (type-safety for free, no runtime cost), emitting the `Person` entity with `name: "Muhammad Sharjeel"` and `alternateName: "Sharjeel Afzaal"`. **Automated checks via Playwright metadata assertions** run against preview builds as the pre-release gate, with Lighthouse CI noted as an optional later addition.

ADR: to be recorded as ADR-0006.

## Open Questions

- Should OG images be static files or generated with `next/og` (`ImageResponse`)? Deferred to the design phase; the Metadata API supports both.
- Exact `sameAs` link set for the `Person` JSON-LD (GitHub, LinkedIn, X, etc.) — needs the owner's canonical profile list.
- Does the FSD's "automated pre-release checks" gate belong in CI on every PR or only on release branches? Proposed: every PR against the preview deployment.
- Confirm final framework decision from the parallel Next.js/Vercel discovery before locking file-convention specifics.

## Spike Results

None — no spikes required for this topic.
