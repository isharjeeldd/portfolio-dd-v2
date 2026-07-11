---
feature: AI TL;DR Pipeline — Build-time Generation with Committed Cache
type: feature
status: ready
release: "1.0.0"
priority: P1
component: blog
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F004-blog-pipeline]
---

# AI TL;DR Pipeline — Build-time Generation with Committed Cache

## Summary

Implement FR-BLOG-6 / NFR-OPS-4 per ADR-0003/0004: every post shows an AI-generated key-takeaways block, clearly labeled, generated **before** build by a script and stored in a content-hash-keyed cache committed to the repo. The build makes zero AI calls — provider outages can't fail deploys; a cache miss simply renders no block (EC-BLOG-4). Generation is provider-agnostic (any one configured key).

## Acceptance Criteria

- [ ] `npm run tldr` generates takeaways for new/changed posts only (hash-keyed), via whichever AI provider is configured
- [ ] `next build` performs zero AI calls; TL;DRs attach from the cache at content-transform time
- [ ] Post pages render the block labeled as AI-generated; posts without a cache entry render cleanly without it
- [ ] Stale cache entries (content changed) are ignored, not shown
- [ ] Zero configured AI keys → script exits with a clear message; site unaffected

## Technical Approach

`lib/tldr.ts` (pure): `contentHash(content)` (sha-256) + `getCachedTldr(slug, content, cache)` returning `string[] | null` (null on miss/stale). `content/tldr-cache.json` is the committed cache `{ [slug]: { hash, takeaways: string[] } }`. `content-collections.ts` transform reads the cache with `getCachedTldr` and attaches `tldr`. `scripts/generate-tldr.mjs`: walks `content/posts`, hashes, generates for misses via Vercel AI SDK v7 `generateText` with the ADR-0004 provider detection + model map (TL;DR tier), writes the cache. Post page renders the block above the prose. Installs the AI SDK stack (`ai`, provider adapters) — shared with F011.

## UI / Design Contract

Block on surface with hairline border, mono label `TL;DR — AI-generated`, 2–4 takeaway bullets in muted ink. Sits between header and prose.

## Content Model Changes

`post` gains computed `tldr: string[] | null` (from cache). Update `docs/architecture/content_model.md`.

## Dependencies

F004. New deps: `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@openrouter/ai-sdk-provider`.

## Test Cases

### Unit / Component Tests

- Test: `contentHash` is deterministic and content-sensitive
- Test: `getCachedTldr` — matching hash → takeaways array
- Test: `getCachedTldr` — changed content (stale hash) → null
- Test: `getCachedTldr` — unknown slug / empty cache → null (EC-BLOG-4)
- Test: post page block — fixture with tldr renders labeled list; fixture with tldr:null renders no block

### Integration / E2E Tests

- Test: `next build` with current cache — posts prerender; no network use by the content layer

### Edge Cases

- Test: malformed cache JSON shape for a slug → treated as miss, no crash

## Files Affected

```
lib/tldr.ts
content/tldr-cache.json
content-collections.ts (attach tldr from cache)
scripts/generate-tldr.mjs, package.json (tldr script + AI SDK deps)
app/blog/[slug]/page.tsx (TL;DR block)
tests/tldr.test.ts, tests/fixtures/posts.ts (tldr field)
docs/architecture/content_model.md (changelog)
```

## Estimated Effort

M
