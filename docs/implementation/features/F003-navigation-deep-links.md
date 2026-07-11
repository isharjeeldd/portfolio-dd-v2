---
feature: Navigation & Section Deep-Links
type: feature
status: ready
release: "1.0.0"
priority: P0
component: cross-cutting
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Navigation & Section Deep-Links

## Summary

Complete FR-SITE-2/3: section deep-links must land legibly below the sticky header (scroll-margin on every anchored section), and the section navigation must be reachable on mobile (currently `hidden sm:block`). Mobile approach: the nav row becomes horizontally scrollable — zero JS, no overlay to maintain.

## Acceptance Criteria

- [ ] Visiting `/#about` (or any section fragment) lands with the heading fully visible below the sticky header
- [ ] All section links + Blog reachable on every viewport width
- [ ] Keyboard: nav fully tabbable in order; focus visible
- [ ] No horizontal page scroll introduced (nav scrolls inside its own container)

## Technical Approach

Add a shared `scroll-mt-*` utility to all landing sections (offset = header height + breathing room). Header nav: drop the `hidden sm:block`, wrap the list in an `overflow-x-auto` container with `whitespace-nowrap` and hidden scrollbar. Sections keep semantic ids from `lib/site.ts`.

## UI / Design Contract

No visual change on ≥sm. Mobile: mono nav row scrolls; edges fade is optional polish (skip if it costs JS).

## Content Model Changes

None.

## Dependencies

F001.

## Test Cases

### Unit / Component Tests

- Test: Header renders ALL section links (work, playground, about, contact) with hrefs `/#<id>` — no viewport-conditional hiding classes on section items
- Test: Header nav list container carries the horizontal-scroll class contract (`overflow-x-auto`)
- Test: landing sections carry scroll-margin — render page sections and assert each anchored section id has the `scroll-mt` utility class

### Integration / E2E Tests

- Test: build — `/` static prerender still passes

### Edge Cases

- Manual: 320px viewport — nav scrolls horizontally, page body does not
- Test: hero section keeps `id="hero"` so `/#hero` remains valid

## Files Affected

```
components/layout/header.tsx
app/page.tsx (scroll-mt on sections)
components/hero/hero.tsx (scroll-mt)
tests/navigation.test.tsx
```

## Estimated Effort

S
