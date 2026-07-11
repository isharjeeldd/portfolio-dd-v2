---
feature: SEO Surface — Metadata, JSON-LD, Sitemap, OG Cards
type: feature
status: ready
release: "1.0.0"
priority: P0
component: seo
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation, F004-blog-pipeline]
---

# SEO Surface — Metadata, JSON-LD, Sitemap, OG Cards

## Summary

Implement FR-SEO-1..5 and NFR-SEO-1 per ADR-0006: canonical metadata via the Next Metadata API (`metadataBase`, unique title/description per page, article metadata on posts), JSON-LD Person with `name` "Muhammad Sharjeel" and `alternateName` "Sharjeel Afzaal" (typed with `schema-dts`), `app/sitemap.ts` + `app/robots.ts` covering all public routes, and generated MS®-branded typographic OG cards via `next/og` `ImageResponse` — one for the site, one per post (covers posts without cover images, EC-BLOG-2).

## Acceptance Criteria

- [ ] Every route emits unique title + description; posts carry article OG metadata and canonical URLs
- [ ] JSON-LD Person in the layout includes both names + role + sameAs socials
- [ ] `/sitemap.xml` lists `/`, `/blog`, and every published post; `/robots.txt` allows crawling and points at the sitemap
- [ ] `/opengraph-image` (site) and per-post OG images render dark MS®-branded typographic cards
- [ ] Both names present in indexable metadata (keywords + JSON-LD)

## Technical Approach

Add `site.url` to `lib/site.ts` (current Vercel alias; swapped at domain cutover). `lib/seo.ts`: `personJsonLd()` (schema-dts) + `sitemapEntries(posts)` (pure, testable). Layout gains `metadataBase`, keywords, OG/Twitter defaults, and the JSON-LD script. OG images: `app/opengraph-image.tsx` and `app/blog/[slug]/opengraph-image.tsx` with `ImageResponse` (dark canvas, crimson accent, mark + title). Automated checks: unit tests on the pure builders; full metadata E2E assertions land with the pre-merge validation (F013).

## UI / Design Contract

OG cards: canvas #0A0A0A, ink type, crimson accent details, MS® mark — brand board tokens. Default system sans inside `ImageResponse` for v1 (embedding brand fonts in OG render is a noted polish item).

## Content Model Changes

None (consumes `cover?` already defined).

## Dependencies

F001, F004. New dev dep: `schema-dts`.

## Test Cases

### Unit / Component Tests

- Test: `personJsonLd()` — Expected: `@type` Person, name "Muhammad Sharjeel", alternateName "Sharjeel Afzaal", sameAs includes GitHub/LinkedIn/Upwork (NFR-SEO-1)
- Test: `sitemapEntries(fixtures)` — Expected: contains `/`, `/blog`, and each published post URL; drafts excluded
- Test: `sitemapEntries([])` — Expected: still contains `/` and `/blog` (zero-post edge)
- Test: post `generateMetadata` — Input: fixture slug — Expected: title/description/canonical/article OG from post
- Test: robots config — Expected: allows `/`, references sitemap URL

### Integration / E2E Tests

- Test: `next build` — Assert: `/sitemap.xml`, `/robots.txt`, `/opengraph-image` routes generate

### Edge Cases

- Test: post without cover — per-post OG card still generates (typographic card, EC-BLOG-2)

## Files Affected

```
lib/site.ts (url), lib/seo.ts, lib/feed.ts (use site.url)
app/layout.tsx (metadataBase, OG defaults, keywords, JSON-LD)
app/sitemap.ts, app/robots.ts
app/opengraph-image.tsx, app/blog/[slug]/opengraph-image.tsx
app/blog/[slug]/page.tsx (canonical + article OG)
tests/seo.test.ts
```

## Estimated Effort

M
