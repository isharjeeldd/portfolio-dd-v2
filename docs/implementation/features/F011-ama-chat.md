---
feature: AMA Chat — Grounded, Provider-Agnostic, Streaming
type: feature
status: ready
release: "1.0.0"
priority: P1
component: cross-cutting
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F004-blog-pipeline, F007-selected-work, F008-about-experience]
---

# AMA Chat — Grounded, Provider-Agnostic, Streaming

## Summary

Implement FR-AI-1..7 per ADR-0004: a floating chat surface where visitors ask about Sharjeel's experience, skills, and work. Answers stream from the ADR chat-tier model of whichever provider is configured, grounded exclusively in a system-prompt pack compiled from the site's data modules (identity, roles, skills, projects, post metadata). Unknown → honest redirect to contact; zero keys or provider failure → friendly unavailable state; session-only; rate-limited; input-capped.

## Acceptance Criteria

- [ ] Launcher (labeled AI) opens a panel with 3 starter questions; conversations are session-only (FR-AI-3/6/7)
- [ ] Responses stream token-by-token from `/api/chat`
- [ ] Grounding pack contains identity, roles, projects, and post facts; system prompt forbids fabrication and mandates the contact redirect (FR-AI-1/2)
- [ ] Zero configured providers → 503 → UI unavailable state; rest of site unaffected (FR-AI-5)
- [ ] Input >1000 chars or >20 messages rejected; per-IP rate limiting (FR-AI-4)

## Technical Approach

`lib/ai/provider.ts`: chat-tier model per detected provider (openrouter `anthropic/claude-haiku-4.5`, openai `gpt-5.4-mini`, anthropic `claude-haiku-4-5` — ADR-0004 map). `lib/ai/grounding.ts`: pure `buildGroundingPack()` from `lib/site`, `lib/data/*`, `lib/posts` + hardened persona rules. `app/api/chat/route.ts`: validate → rate limit (same best-effort pattern as contact) → `streamText(...).toTextStreamResponse()`. `components/chat/chat-launcher.tsx`: client island (launcher + panel), hand-rolled stream reader (no UI-hook version coupling), aria-live updates.

## UI / Design Contract

Launcher: fixed bottom-right mono pill `ASK MS® — AI`. Panel on surface, hairline border; visitor messages ink, replies muted; starter questions as mono chips. Clearly labeled AI-powered.

## Content Model Changes

None (grounding reads existing modules).

## Dependencies

F004/F007/F008 (grounding sources). Deps already installed (F010).

## Test Cases

### Unit / Component Tests

- Test: grounding pack contains name, title, PolyX, blog post title, contact rule text
- Test: chat model resolution — openrouter key → openrouter chat model id; zero keys → null
- Test: route — zero providers → 503 (FR-AI-5)
- Test: route — >1000-char input → 422; >20 messages → 422; invalid body → 400
- Test: route — valid request (ai mocked) → 200 streaming response; system prompt passed contains grounding
- Test: route — rate limit after threshold → 429 (FR-AI-4)
- Test: UI — launcher renders AI label; opens panel with 3 starter questions
- Test: UI — 503 response → unavailable state message
- Test: UI — streamed chunks render into the reply (mocked ReadableStream)

### Integration / E2E Tests

- Test: `next build` — /api/chat compiles; landing static intact

### Edge Cases

- Test: provider throws mid-request → 502 handled, UI shows failure gracefully

## Files Affected

```
lib/ai/provider.ts, lib/ai/grounding.ts
app/api/chat/route.ts
components/chat/chat-launcher.tsx
app/layout.tsx (launcher mount)
tests/ai-grounding.test.ts, tests/chat-route.test.ts, tests/chat-ui.test.tsx
```

## Estimated Effort

L
