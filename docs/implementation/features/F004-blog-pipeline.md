---
feature: Blog Pipeline — MDX, Listing, Reading Experience, RSS
type: feature
status: ready
release: "1.0.0"
priority: P0
component: blog
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Blog Pipeline — MDX, Listing, Reading Experience, RSS

## Summary

Implement FR-BLOG-1..5/7 and the blog half of D8 per ADR-0003: Content Collections as the typed content layer (Zod frontmatter, build fails loudly on malformed content), MDX compiled with Shiki syntax highlighting (rehype-pretty-code, build-time, zero client JS), `/blog` listing (title/date/description/tags/reading time, newest first), `/blog/[slug]` reading experience (typographic rhythm, anchorable headings, prev/next), RSS at `/feed.xml`, and the landing Blog teaser (latest 3; hides at zero posts — EC-BLOG-1). Ships with one short real post so the full pipeline is exercised end-to-end; the launch meta case study lands in F012. TL;DR blocks come in F010.

## Acceptance Criteria

- [ ] Posts are `.mdx` files in `content/posts/`; adding one requires zero code changes (NFR-OPS-3)
- [ ] Malformed frontmatter or MDX fails `next build` with a clear error (FR-BLOG-3)
- [ ] `/blog` lists posts newest-first with title, date, description, tags, reading time
- [ ] `/blog/[slug]` renders with heading anchors, Shiki-highlighted code, prev/next nav, per-post metadata (title/description)
- [ ] `/feed.xml` is a valid RSS feed containing every post (FR-BLOG-4)
- [ ] Landing teaser shows latest 3; renders nothing with zero posts
- [ ] All pages statically prerendered

## Technical Approach

`@content-collections/core` + `/mdx` + `/next` (config wraps `withContentCollections` — outermost plugin). Collection schema: title, date, description, tags[], cover?, draft?. Transform: `compileMDX` with `rehype-pretty-code` (Shiki), `rehype-slug` + autolink for heading anchors; computed slug (`_meta.path`) and readingTime (238 wpm). `lib/posts.ts` wraps the generated collection (sorted, adjacent-post lookup, latest-n). RSS via `feed` package in `app/feed.xml/route.ts` reading the same collection. Prose styling via `@tailwindcss/typography` (v4 `@plugin`) customized to brand tokens. Tests mock the generated `content-collections` module with fixtures (vitest alias) — the real pipeline is exercised by `next build` with the shipped post.

## UI / Design Contract

Listing: editorial rows (title in display face, mono date/reading-time labels, muted description) with underline-sweep hover. Reading view: 65ch measure, ink body (never accent), accent only on links/anchors; code blocks on surface with line highlighting support. Dark `github-dark`-class Shiki theme aligned to tokens.

## Content Model Changes

New content type **post** (`content/posts/*.mdx`): frontmatter `{ title: string, date: ISO string, description: string, tags: string[], cover?: string, draft?: boolean }`; computed `{ slug, readingTime, mdx }`. Documented in `docs/architecture/content_model.md` (created this iteration).

## Dependencies

F001. New deps: `@content-collections/{core,mdx,next}`, `zod`, `rehype-pretty-code`, `shiki`, `rehype-slug`, `rehype-autolink-headings`, `feed`, `@tailwindcss/typography`.

## Test Cases

### Unit / Component Tests

- Test: `sortedPosts` orders newest-first — Input: fixtures with 3 dates — Expected: descending order
- Test: `sortedPosts` excludes drafts — Input: fixture with draft:true — Expected: not listed
- Test: `latestPosts(3)` caps at 3
- Test: `adjacentPosts(slug)` returns prev/next; endpoints return null sides
- Test: `buildFeed(posts)` emits RSS XML containing each post title and canonical URL
- Test: PostCard renders title, formatted date, description, tags, reading time
- Test: BlogTeaser with zero posts renders nothing (EC-BLOG-1)
- Test: BlogTeaser with posts renders ≤3 cards and a "all posts" link

### Integration / E2E Tests

- Test: `next build` with the shipped post — Assert: `/blog`, `/blog/[slug]`, `/feed.xml` all prerender; build exit 0
- Manual: break frontmatter locally → build fails loudly (FR-BLOG-3)

### Edge Cases

- Test: post without tags renders card without tag list crash
- Test: feed with zero posts is still a valid (empty) channel

## Files Affected

```
content-collections.ts, next.config.ts, tsconfig.json, .gitignore (.content-collections)
content/posts/docs-folder-portfolio.mdx (first real post)
lib/posts.ts, lib/feed.ts, lib/format.ts
app/blog/page.tsx, app/blog/[slug]/page.tsx, app/feed.xml/route.ts
components/blog/post-card.tsx, components/blog/blog-teaser.tsx
app/page.tsx (teaser section), app/globals.css (prose/typography)
tests/posts.test.ts, tests/feed.test.ts, tests/blog-components.test.tsx, tests/fixtures/content-collections.ts
docs/architecture/content_model.md (new)
```

## Estimated Effort

L
