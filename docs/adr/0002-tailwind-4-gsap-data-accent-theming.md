# ADR-0002: Tailwind CSS v4 + GSAP, accent theming via CSS custom properties

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

The locked design direction (D2–D7) demands: kinetic typography hero, scroll-driven reveals, micro-interactions at 60fps on mid-tier hardware, global reduced-motion parity, dark-only palette with a visitor-selectable accent (4 options, live switch, persisted), and a ≤200KB landing JS budget. Full analysis: [`../tech_discovery/styling_and_motion.md`](../tech_discovery/styling_and_motion.md).

## Options Considered

### Styling — Tailwind CSS v4.2 (chosen) vs CSS Modules vs vanilla-extract
- Tailwind v4: CSS-first `@theme` config maps directly onto the token system; Oxide engine; maintainer fluency. CSS Modules: no token layer for free. vanilla-extract: plugin-mediated Next integration risk for marginal benefit.

### Motion — GSAP v3.15 (chosen) vs Motion (v12) vs native CSS scroll-driven animations
- GSAP: **100% free including SplitText/ScrollTrigger since the Webflow acquisition (verified 2026-07-11)** — SplitText is purpose-built for the kinetic hero; the reference sites all use it; `gsap.matchMedia()` gives a global reduced-motion gate. Core+ScrollTrigger+SplitText ≈ 45–50KB gzip — budgeted.
- Motion: excellent React idioms but weaker scroll-scrub/char-splitting for this direction.
- Native CSS scroll-driven animations: only ~83–85% support (Firefox flagged) — usable as progressive enhancement, not as the backbone.

## Decision

**Tailwind CSS v4 for styling; GSAP (core + ScrollTrigger + SplitText) for motion; accent theming via CSS custom properties switched by a `data-accent` attribute on `<html>`**, persisted in `localStorage` with a no-flash inline script. Reduced motion is gated globally through `gsap.matchMedia()` plus CSS media queries.

## Consequences

- All color usage flows through custom-property tokens — no hardcoded accent hexes in components; contrast rules (FR-THEME-5) become checkable.
- GSAP's ~50KB is a permanent tenant of the landing JS budget; Playground experiments must lazy-load their own dependencies.
- GSAP's license is a custom no-charge license (not OSI) — acceptable for this use; re-verify only if the project is ever relicensed/redistributed.

## Follow-ups not included in this decision

- Font faces (brand-board sign-off) and `next/font` loading specifics.
- S001 kinetic-hero performance spike — only if implementation measurements miss NFR-PERF-3.
