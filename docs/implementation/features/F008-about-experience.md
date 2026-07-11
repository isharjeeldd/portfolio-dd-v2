---
feature: About / Experience Section
type: feature
status: ready
release: "1.0.0"
priority: P0
component: about
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# About / Experience Section

## Summary

Implement FR-ABOUT-1..3 with grill-confirmed facts (2026-07-11): title **Senior Software Engineer** at ISSM.AI (Mar 2024–present; Alara, PolyX, PolyApi), MERN Stack Developer at CodeFrenetics (Aug 2021–Mar 2024), BSCS @ NUML (2017–2021). Confident-minimal story, role timeline, grouped skills, CV link. The old resume PDF ships as placeholder — **replacement with an updated CV is a release gate** (F013 pre-merge check). Numbers-over-claims copy pending owner metrics (same gate).

## Acceptance Criteria

- [ ] Story paragraph + timeline (companies, roles, periods, highlights) + grouped skills render
- [ ] "Muhammad Sharjeel" is the only name displayed (FR-ABOUT-3)
- [ ] CV downloadable at `/cv.pdf`; a test asserts the asset exists (FR-ABOUT-2)
- [ ] Content lives in a typed data module

## Technical Approach

`lib/data/experience.ts`: typed roles + education + skill groups. `components/about/about-section.tsx`: story, timeline rows (mono period labels, display-face roles), skills, CV button. Landing placeholder replaced. CV copied from the old portfolio's `resume-sharjeel.pdf` to `public/cv.pdf` (placeholder, release-gated).

## UI / Design Contract

Timeline as hairline-separated rows matching Work/PostCard rhythm; no photo at launch (OBSCURA-style, owner can add later); accent only on the CV CTA and period markers.

## Content Model Changes

None (data module).

## Dependencies

F001. Owner grill ✅ (title confirmed).

## Test Cases

### Unit / Component Tests

- Test: renders both roles with company, confirmed title, and periods
- Test: renders education entry
- Test: CV link points at /cv.pdf with download affordance
- Test: displays "Muhammad Sharjeel" and never "Sharjeel Afzaal" in the section (FR-ABOUT-3)
- Test: skills groups render with items

### Integration / E2E Tests

- Test: `public/cv.pdf` exists on disk (FR-ABOUT-2 build guard)

### Edge Cases

- Test: roles are ordered most-recent-first regardless of data order

## Files Affected

```
lib/data/experience.ts
components/about/about-section.tsx
public/cv.pdf
app/page.tsx
tests/about.test.tsx
```

## Estimated Effort

S
