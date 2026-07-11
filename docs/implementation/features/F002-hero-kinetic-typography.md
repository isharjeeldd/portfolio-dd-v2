---
feature: Hero with Kinetic Typography
type: feature
status: done
release: "1.0.0"
priority: P0
component: hero
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Hero with Kinetic Typography

## Summary

Replace the static landing hero baseline with the brand's signature moment (FR-HERO-1..5, D7): a kinetic-rise reveal of the display name using GSAP SplitText (masked lines, 38ms char stagger, expo-out — the brand board's "kinetic rise"), followed by staggered fade-up of eyebrow/role/CTA, plus a scroll affordance. Reduced-motion visitors get the composed static hero with zero information loss (FR-HERO-3); no-JS visitors see fully rendered content (FR-SITE-6).

## Acceptance Criteria

- [ ] Hero renders MS® context: availability eyebrow, "Muhammad Sharjeel", role line, CTA to #contact, scroll affordance
- [ ] Kinetic rise plays on load under full motion; identity readable ≤3s regardless of animation state
- [ ] `prefers-reduced-motion` → no split/animation; static composition (data-motion="reduced")
- [ ] No content is hidden before JS loads (server HTML fully visible)
- [ ] GSAP loads only what's used (core + SplitText); landing JS budget respected

## Technical Approach

`components/hero/hero.tsx` as a client component (`"use client"`, content still SSRs) using `useGSAP` from `@gsap/react` (auto-cleanup). SplitText on the h1 (chars, masked lines); timeline: chars rise (y:115%, slight rotate, stagger 0.038, expo.out) → eyebrow/role/CTA fade-up. Motion gating twice: a `usePrefersReducedMotion` hook (useSyncExternalStore on matchMedia) drives a `data-motion` attribute + skips the timeline, and `gsap.matchMedia()` guards inside the GSAP context. New `lib/motion.ts` hosts the hook for reuse by later features.

## UI / Design Contract

Brand board §04 "kinetic rise" exactly: 300–700ms durations, expo-out family, 30–40ms staggers. Accent appears only in: availability dot, name's terminal period, CTA border/hover. Type: display face at clamp scale (F001 tokens).

## Content Model Changes

None.

## Dependencies

F001 (tokens, fonts, layout). New deps: `gsap`, `@gsap/react`.

## Test Cases

### Unit / Component Tests

- Test: hero renders identity — Expected: heading "Muhammad Sharjeel", role text, availability eyebrow, CTA link href="#contact" all present in DOM (GSAP mocked)
- Test: scroll affordance present — Expected: element with accessible hint to scroll
- Test: full-motion path — Input: matchMedia(reduce)=false — Expected: hero root `data-motion="full"`
- Test: reduced-motion path — Input: matchMedia(reduce)=true — Expected: `data-motion="reduced"` (FR-HERO-3 / EC-HERO-1)
- Test: usePrefersReducedMotion reacts to media change — Input: dispatch change event — Expected: hook value updates

### Integration / E2E Tests

- Test: production build — Assert: `/` still prerendered static with hero content in HTML (FR-SITE-6, EC-SITE-1)

### Edge Cases

- Test: matchMedia undefined (very old env) — Expected: defaults to full motion without crash
- Manual: viewport <360px — display type scales without overflow (EC-HERO-3)

## Files Affected

```
components/hero/hero.tsx
lib/motion.ts
app/page.tsx (hero section swapped to <Hero />)
tests/hero.test.tsx
package.json (gsap, @gsap/react)
```

## Estimated Effort

M
