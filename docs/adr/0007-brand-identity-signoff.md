# ADR-0007: Brand identity — MS® tight lockup, Space Grotesk, crimson default accent

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

The locked design direction (discovery D2–D7) required concrete identity choices before feature code: the monogram treatment, the display face, the default accent, and the ® detail. These are hard to reverse once pages, OG cards, and the favicon are built against them. Options were presented on the interactive brand board (rendered in the candidate faces with the live accent switcher) and signed off by the owner on 2026-07-11.

## Options Considered

### Monogram
- **1 — Tight lockup (chosen):** MS in heavy display type, negative tracking, accent ® superscript.
- 2 — Terminal prompt: `~/ms` in monospace with blinking accent cursor.
- 3 — Sliced stack: solid M over outlined S with accent hairline.

### Display face
- **A — Space Grotesk (chosen):** character without costume; closest to the locked references; reliable at all sizes. Variable, free (Google Fonts).
- B — Syne: more art-directed, riskier outside hero scale.

### Default accent (visitor-switchable set stays: crimson, lime, blue, amber)
- Lime #B6FF2E (proposed default), blue #47A3FF, amber #FFB224, **crimson #FF4438 (chosen default)**.

### ® detail
- **Keep (chosen)** — stylistic studio-energy detail, always set in the accent; not a legal trademark claim. / Drop.

## Decision

**Identity:** MS® tight-lockup monogram · display **Space Grotesk**, body **Geist**, mono **Geist Mono** (all variable, self-hosted via `next/font`) · dark tokens `canvas #0A0A0A / surface #141414 / line #232323 / ink #EDEDED / muted #8A8A8A` · **default accent crimson #FF4438**, switcher set {crimson, lime, blue, amber} · motion vocabulary: kinetic rise, underline sweep, magnetic fill (expo-out family, 300–700ms, 30–40ms staggers).

This **amends the default named in discovery D5 / FR-THEME-2 (was: terminal lime)** — owner sign-off recorded in the FSD Document control table.

## Consequences

- Crimson sits near the 4.5:1 threshold on canvas: it is **gated to links, UI, and large type — never long-form body copy**; the contrast gate (FR-THEME-5) is now load-bearing and must be enforced in CI.
- OG cards, favicon, and the loading state all derive from the tight-lockup mark.
- Token values become `docs/architecture/design_system.md` when the design system is implemented (F-series feature).

## Follow-ups not included in this decision

- Favicon/mark production assets (design-system feature).
- Per-accent OG card tinting — feasibility decided in the SEO feature.
