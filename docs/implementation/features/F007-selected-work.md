---
feature: Selected Work Section
type: feature
status: ready
release: "1.0.0"
priority: P0
component: projects
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Selected Work Section

## Summary

Implement FR-WORK-1..4 with owner-curated content (grill 2026-07-11): six featured entries — PolyX, Alara AI Agents, Digital Eye, HalloCasa, ONIT IoT, and this portfolio (meta) — plus a compact secondary row (wAI Industries, Synerge) honoring all eight owner picks while keeping the 4–6 curated-entry contract for full cards. Entries carry outcome-focused one-liners (proof, not adjectives), role/stack tags, and links where public; entries without public links render no dead CTAs (EC-WORK-1). Outcome copy is draft-quality pending owner numbers (release-gated review item).

## Acceptance Criteria

- [ ] Six featured cards render with title, outcome line, role/stack tags, and live/GitHub links where they exist
- [ ] Secondary row renders wAI + Synerge as compact links
- [ ] No dead links: entries missing a URL omit that CTA entirely
- [ ] Hover micro-interaction per design direction (CSS-only)
- [ ] Content lives in a typed data module, not in components

## Technical Approach

`lib/data/projects.ts`: typed `Project[]` (slug, title, outcome, role, stack[], links{live?,github?,post?}, featured). `components/work/work-section.tsx` renders featured cards (editorial rows, underline-sweep/accent hover) + secondary list. Landing placeholder replaced. Case-study pages remain out of scope (v1.x).

## UI / Design Contract

Editorial list rows over cards-with-images (no imagery dependency at launch): display-face title, muted outcome line, mono stack tags, accent on hover + external-link markers. Consistent with PostCard rhythm.

## Content Model Changes

None (code-level data module; content_model.md notes it).

## Dependencies

F001. Owner grill ✅ 2026-07-11.

## Test Cases

### Unit / Component Tests

- Test: renders exactly 6 featured entries with their titles
- Test: PolyX entry shows outcome line + stack tags + GitHub and live links with correct hrefs
- Test: entry with no GitHub link (e.g. HalloCasa) renders no GitHub CTA (EC-WORK-1)
- Test: meta-portfolio entry links to the repo
- Test: secondary row renders wAI + Synerge links

### Integration / E2E Tests

- Test: `next build` — landing prerender includes work content (FR-SITE-6)

### Edge Cases

- Test: data module — every project has non-empty title/outcome; slugs unique (content guard)

## Files Affected

```
lib/data/projects.ts
components/work/work-section.tsx
app/page.tsx (work section)
tests/work.test.tsx
```

## Estimated Effort

S
