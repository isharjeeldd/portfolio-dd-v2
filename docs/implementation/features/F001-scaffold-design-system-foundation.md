---
feature: Scaffold & Design System Foundation
type: feature
status: ready
release: "1.0.0"
priority: P0
component: design-system
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: []
---

# Scaffold & Design System Foundation

## Summary

Bootstrap the application per ADR-0001/0002/0007: Next.js 16 (App Router, TypeScript) with Tailwind v4, the approved brand tokens (dark palette, crimson-default accent switcher with persistence and no-flash boot), self-hosted fonts (Space Grotesk / Geist / Geist Mono via `next/font`), the global layout shell (header with MS® mark, footer with socials/RSS placeholders, skip link), a branded 404, and the central env config module. Implements FR-SITE-2 (partial: nav affordance), FR-SITE-4, FR-SITE-6 (server-rendered baseline), FR-THEME-1..5, and the token base every later feature consumes. Test runner: Vitest 4 + Testing Library (per Next 16 official guide).

## Acceptance Criteria

- [ ] `npm run build` and `npm test` pass on a fresh clone (Node 22)
- [ ] Dark-only token system in Tailwind v4 `@theme`: canvas #0A0A0A, surface #141414, line #232323, ink #EDEDED, muted #8A8A8A + 4 accent palettes
- [ ] Accent switcher: crimson default; live switch via `data-accent` on `<html>`; persists in localStorage; invalid stored value falls back to crimson; no flash of wrong accent on load
- [ ] Fonts load via `next/font` (Space Grotesk display, Geist body, Geist Mono) with correct fallback metrics
- [ ] Layout shell: header (MS® mark → `/`), footer (GitHub/LinkedIn/Upwork/RSS links), skip-to-content link, semantic landmarks
- [ ] Branded 404 with links to `/` and `/blog`
- [ ] Central `config` module reads all env; `.env.example` stays authoritative
- [ ] `prefers-reduced-motion` global CSS gate present
- [ ] Accent contrast documented in code comments per role gate (crimson never body copy)

## Technical Approach

`create-next-app@latest` (TS, ESLint, Tailwind, App Router, no src-dir, `@/*` alias) scaffolded in a temp dir and merged into the repo (preserving README/.gitignore/docs). Tokens as CSS custom properties defined per `[data-accent]` in `globals.css` under Tailwind v4 `@theme inline`. Accent boot: tiny inline script in `<head>` reads localStorage before paint. `AccentSwitcher` is a small client component; everything else server components. Config module: `lib/config.ts` — typed getters, AI provider auto-detect (`openrouter | openai | anthropic | null`).

## UI / Design Contract

ADR-0007 tokens exactly; header/footer per brand board §01/§05 voice; mark is text-based MS® (tight tracking, accent ®) at this stage — no image asset yet.

## Content Model Changes

None.

## Dependencies

None (first feature).

## Test Cases

### Unit / Component Tests (Vitest 4 + Testing Library)

- Test: accent module — `setAccent('lime')` sets `data-accent` and localStorage — Input: 'lime' — Expected: `document.documentElement.dataset.accent === 'lime'`, stored value 'lime'
- Test: accent module — invalid stored value falls back — Input: localStorage 'ms-accent' = 'neon-pink' — Expected: resolved accent 'crimson' (EC-THEME-1)
- Test: accent module — no stored value → default — Expected: 'crimson' (EC-THEME-2, amended FR-THEME-2)
- Test: config — provider auto-detect — Input: only `OPENROUTER_API_KEY` set — Expected: `aiProvider === 'openrouter'`
- Test: config — zero AI keys — Expected: `aiProvider === null` (feeds FR-AI-5 degradation)
- Test: config — `AI_PROVIDER=anthropic` override with multiple keys — Expected: 'anthropic'
- Test: Header renders MS® mark as link to `/` with accessible name
- Test: Footer renders GitHub, LinkedIn, Upwork links with correct hrefs
- Test: NotFound renders links to `/` and `/blog`
- Test: AccentSwitcher renders 4 options with `aria-pressed` reflecting active accent

### Integration / E2E Tests

- Test: production build — Setup: fresh install — Action: `next build` — Assert: exit 0, `/` and 404 prerendered as static

### Edge Cases

- Test: localStorage unavailable (throws) — Scenario: `setAccent` in private-mode-like env — Expected: no crash, accent still applied to DOM
- Test: skip link is first focusable element — Expected: keyboard Tab #1 lands on skip link (NFR-A11Y-2)

## Files Affected

```
package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs
vitest.config.mts, vitest.setup.ts
app/layout.tsx, app/page.tsx (placeholder sections), app/not-found.tsx, app/globals.css
components/layout/header.tsx, components/layout/footer.tsx
components/theme/accent-switcher.tsx, components/theme/accent-script.tsx
lib/accent.ts, lib/config.ts, lib/site.ts (name/links constants)
tests/ (unit + component specs)
```

## Estimated Effort

M
