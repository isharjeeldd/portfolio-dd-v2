# Tech Discovery: Styling & Motion

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

The locked design direction is dark editorial minimalism with engineered motion: a kinetic typography hero (staggered, scroll-scrubbed character reveals), scroll-driven section reveals, micro-interactions on work cards, and a Playground of small interactive experiments. The FSD imposes hard constraints that directly shape this choice:

- 60fps scroll motion on mid-tier hardware; animation must never block input.
- `prefers-reduced-motion` honored globally with content parity (static variants, nothing hidden).
- Dark-only theme with a visitor-selectable accent (terminal lime default, electric blue, signal amber, crimson) that switches live without reload, persists across visits, stays under 5% of viewport, and passes WCAG contrast (4.5:1 body / 3:1 large) in every role it is used.
- Initial JS ≤200KB compressed on the landing route (Should), so motion-library weight is a first-order selection criterion.

We need to pick: (1) a styling system, (2) a motion stack, and (3) a theming mechanism for the accent switcher. **Dependency:** a parallel discovery is confirming Next.js App Router on Vercel as the framework; the recommendations below assume it (notably `next/font` and RSC-compatible zero-runtime styling) and should be re-checked if that discovery lands elsewhere.

## Options Evaluated

### Styling — Option A: Tailwind CSS v4 (recommended)

Verified July 2026: Tailwind v4 is current and mature — v4.0 shipped January 2025 with the Rust-based Oxide engine and a CSS-first configuration model (design tokens declared in CSS via `@theme` instead of `tailwind.config.js`); v4.2.0 (Feb 2026) added a first-class webpack plugin, new palettes, and logical-property utilities ([tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4), [InfoQ on v4.2](https://www.infoq.com/news/2026/04/tailwind-css-4-2-webpack/)).

- **Fit:** the `@theme` directive emits real CSS custom properties, which is exactly the substrate the accent-switching mechanism needs — theme tokens and utilities share one source of truth. Zero runtime JS, so it contributes nothing to the 200KB budget.
- **Fit:** dark-only simplifies things further — no `dark:` variant machinery needed; the base palette *is* the dark palette.
- **Risk:** utility-heavy markup in highly bespoke editorial layouts; mitigated by extracting components and leaning on custom properties for the motion-driven values.

### Styling — Option B: CSS Modules + custom properties

Zero-dependency, framework-native (built into Next.js), fully compatible with the theming mechanism. Viable, but it forgoes a shared token/utility layer: spacing, type scale, and color roles must be hand-maintained across module files, which historically drifts on solo projects. No bundle cost advantage over Tailwind v4 (both are zero-runtime).

### Styling — Option C: vanilla-extract

Verified July 2026: `@vanilla-extract/css` 1.20.1, actively maintained ([vanilla-extract.style](https://vanilla-extract.style/), [npm](https://www.npmjs.com/package/@vanilla-extract/css)). Zero-runtime, type-safe tokens are attractive, but its Next.js App Router integration remains plugin-mediated and historically laggy behind Next releases, and the project's long-term stewardship has been an open community question ([GitHub discussion #1144](https://github.com/vanilla-extract-css/vanilla-extract/discussions/1144)). Higher integration risk for no capability we need beyond Options A/B.

### Motion — Option A: GSAP (recommended)

Verified July 2026: GSAP is **100% free for all users, including all formerly-paid Club plugins and commercial use**, funded by Webflow following its October 2024 acquisition of GreenSock; the free release happened April 2025 and remains in effect ([gsap.com/pricing](https://gsap.com/pricing/), [webflow.com/updates/gsap-becomes-free](https://webflow.com/updates/gsap-becomes-free)). Current release line is v3.15 per the official docs (npm latest 3.14.x) ([gsap.com/docs/v3/Installation](https://gsap.com/docs/v3/Installation/)). Note: free, but under GSAP's standard no-charge license, not an OSI open-source license.

Plugins that matter here:
- **SplitText** — character/word/line splitting for the kinetic hero; rewritten in the 3.13 cycle with ~50% smaller filesize, built-in screen-reader accessibility (aria handling on split output), and masking for reveal effects ([Codrops overview](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)).
- **ScrollTrigger** — scroll-scrubbed timelines, pinning, and section reveals; the industry benchmark for the scrub-quality the hero demands.
- **`gsap.matchMedia()`** — first-class `prefers-reduced-motion` gating, central to the reduced-motion strategy.
- MorphSVG / DrawSVG — now also free; optional candidates for Playground experiments only.

Weight: core ~25KB gzipped, ScrollTrigger ~14KB, SplitText ~8KB — roughly 45–50KB total, comfortably inside the 200KB envelope alongside the framework baseline.

### Motion — Option B: Motion (motion.dev, formerly Framer Motion)

Verified July 2026: renamed from Framer Motion to **Motion**, independent of Framer since mid-2025, imported from `motion/react`; current major is v12 (latest ~12.42.x) with a hybrid engine that offloads to WAAPI where possible ([motion.dev](https://motion.dev/), [github.com/motiondivision/motion](https://github.com/motiondivision/motion), [changelog](https://motion.dev/changelog)). Excellent React ergonomics (layout animations, gestures, `AnimatePresence`) and a tiny `motion/mini` entry point. However: scroll-scrub + pin + split-text choreography is where GSAP is stronger, and running two animation libraries would double-spend the budget. Not selected; revisit only if React-lifecycle-bound layout animation becomes a real need.

### Motion — Option C: Native CSS scroll-driven animations

Verified July 2026: `animation-timeline: scroll()/view()` sits at ~83–85% global support — shipped in Chrome, Edge, and Safari, but still behind a flag in Firefox stable as of Firefox 152 (June 2026); it is a named Interop 2026 priority, and separately Chrome 145 introduced scroll-*triggered* animations ([caniuse](https://caniuse.com/mdn-css_properties_animation-timeline_scroll), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [Chrome blog](https://developer.chrome.com/blog/scroll-triggered-animations)). Compositor-driven (off main thread) and zero-JS — the best possible answer to "animation never blocks input" — but the Firefox gap and limited orchestration rule it out as the primary engine. Use as progressive enhancement for simple ambient effects where a no-animation fallback is acceptable.

## Recommendation

**Styling: Tailwind CSS v4** (CSS-first `@theme` config). **Motion: GSAP v3.15+ core + ScrollTrigger + SplitText** as the single motion engine, with native CSS scroll-driven animations as progressive enhancement for low-stakes ambient reveals. **Theming:** CSS custom properties driven by a `data-accent` attribute on `<html>`.

Why: Tailwind v4's token model and the accent mechanism are the same primitive (CSS custom properties), giving one source of truth with zero runtime cost. GSAP is now free including every plugin the kinetic hero needs, and SplitText's rewrite ships smaller with accessibility baked in — the exact tool for staggered/scroll-scrubbed character reveals. Motion (Option B) is excellent but redundant next to GSAP for this design's scroll-choreography center of gravity.

**Theming mechanism (mechanism level only):** each of the four accents is defined as a set of role-scoped custom properties (`--accent-text`, `--accent-large`, `--accent-surface`, …) under `html[data-accent="..."]` selectors, with each role's value pre-validated against WCAG 4.5:1 / 3:1 on the dark background at design time — the switcher can therefore never produce a failing combination. Switching writes the attribute (live, no reload — pure CSS cascade) and persists the choice to `localStorage`. A tiny inline script in `<head>` reads `localStorage` and sets the attribute before first paint to prevent accent flash; default is terminal lime when unset. Fits naturally with Next.js App Router's root layout (framework dependency noted above).

**Bundle-size strategy (200KB budget):** GSAP core + ScrollTrigger + SplitText ≈ 45–50KB gzip on the landing route — budgeted and capped there; no second animation library. Everything else is deferred: Playground experiments and any optional plugins (MorphSVG etc.) load via route-level code splitting / dynamic import, never on landing. Tailwind and the theming mechanism add ~0KB JS (inline theme script is <1KB). A size-limit CI check should enforce the landing-route budget.

**Reduced-motion strategy:** all motion registered through a single `gsap.matchMedia()` layer keyed on `(prefers-reduced-motion: no-preference)`, so reduced-motion users get the static variant by construction — content parity, not removal: split text renders whole, scroll reveals render visible, scrubbed sequences show their end state. CSS-native effects are wrapped in the equivalent `@media` query. This is a global architectural gate, not per-component opt-in.

ADR: to be recorded as ADR-0002.

## Open Questions

1. Does the kinetic hero need a performance spike on low-end mobile? SplitText produces one element per character; a long headline scrubbed by ScrollTrigger could pressure style/layout on mid-tier Android. FSD §7 (performance budgets) says measure before committing to per-character scrub density — see Spike Results.
2. Variable-font strategy pending the brand board: the loading *mechanism* is settled (`next/font` self-hosting, variable single-file weights, `latin` subsetting, metrics-adjusted fallbacks to hold CLS at zero), but whether the chosen display face ships a usable variable axis range — and its subsetted size — is unknown until faces are picked.
3. Firefox posture for CSS scroll-driven enhancements: ship with no-animation fallback now, or hold until Interop 2026 lands it in Firefox stable?
4. Accent persistence scope: `localStorage` only, or mirror to a cookie if any server-rendered surface ever needs to know the accent (depends on framework discovery outcome).

## Spike Results

None yet — S001 (kinetic hero performance) may be opened if implementation measurement is needed.
