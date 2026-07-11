---
feature: Playground — Interactive Experiments
type: feature
status: done
release: "1.0.0"
priority: P1
component: playground
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Playground — Interactive Experiments

## Summary

Implement FR-PLAY-1..3: three interactive experiments as poster cards that mount **only on explicit "Run"** — satisfying lazy/idle mounting (FR-PLAY-2) and reduced-motion opt-in (FR-PLAY-3) with one mechanism for all visitors. Experiments: **Kinetic rise** (replayable stagger on a word, GSAP), **Accent field** (pointer-reactive canvas particles in the live accent color, capability-checked), **Terminal** (typewriter loop of confident-minimal lines, mono).

## Acceptance Criteria

- [ ] Three experiment cards render with title/description/Run affordance; nothing mounts before Run
- [ ] Canvas experiment falls back to its poster state when canvas is unavailable (EC-PLAY-1)
- [ ] Experiments re-theme with the live accent (FR-THEME-4)
- [ ] Landing JS untouched until interaction (dynamic imports)

## Technical Approach

`components/playground/experiments.tsx` registry: `{ slug, title, description, Component: dynamic(() => import(...), { ssr: false }) }`. `PlaygroundSection` renders poster cards; Run swaps poster → mounted component. Each experiment reads `var(--accent)` at draw-time. Canvas experiment guards `getContext("2d")`.

## UI / Design Contract

Cards on surface with hairline borders matching Work rows; mono Run button; experiments stay inside fixed-height stages (no layout shift).

## Content Model Changes

None.

## Dependencies

F001 (F002's GSAP reused).

## Test Cases

### Unit / Component Tests

- Test: section renders exactly 3 cards with titles and Run buttons; no experiment content mounted initially (FR-PLAY-2)
- Test: clicking Run mounts that experiment (registry mocked with stubs)
- Test: other experiments stay unmounted when one runs
- Test: registry entries have unique slugs and non-empty copy

### Integration / E2E Tests

- Test: `next build` — landing prerender intact

### Edge Cases

- Test: canvas unavailable → Accent field renders fallback text, no crash (EC-PLAY-1)

## Files Affected

```
components/playground/playground-section.tsx
components/playground/experiments.tsx
components/playground/experiments/rise.tsx, particles.tsx, terminal.tsx
app/page.tsx
tests/playground.test.tsx
```

## Estimated Effort

M
