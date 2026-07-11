# ADR-0004: Vercel AI SDK v7 for provider-agnostic AI features

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

The AMA chat and build-time TL;DRs must work with any ONE configured provider key from {OpenRouter, OpenAI, Anthropic} (NFR-OPS-1 / FR-AI-5), auto-detected with an `AI_PROVIDER` override, degrading gracefully with zero keys. Answers must be grounded exclusively in operator content (FR-AI-1/2), streamed, rate-limited, and injection-resistant (FR-AI-4). The owner currently holds an OpenRouter key (~$9 credit). Full analysis: [`../tech_discovery/ai_features.md`](../tech_discovery/ai_features.md).

## Options Considered

### Abstraction — Vercel AI SDK v7 (chosen) vs LangChain vs hand-rolled adapters
- **AI SDK v7** (`ai@7.0.x` + `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@openrouter/ai-sdk-provider@2.10.x`): one-line provider swap, Vercel-native streaming + React hooks — exactly the shape of the requirement.
- LangChain: heavyweight orchestration we don't need. Hand-rolled: three streaming implementations to maintain solo.

### Grounding — static grounding pack (chosen) vs RAG
- Estimated pack size at v1 content volume: ~6–8K tokens (<4% of a 200K window; ~$0.008/request on Haiku). Zero infra. **This resolves the FSD §7 open question** — RAG is reconsidered only if the pack exceeds ~30–40K tokens.

### Rate limiting — Upstash Redis `@upstash/ratelimit` (chosen) vs Vercel WAF vs in-memory
- In-memory state doesn't survive serverless instances — broken by design. WAF is coarse/complementary. Upstash free tier: durable sliding-window limits on hashed IP at ~$0.

## Decision

**Vercel AI SDK v7 with the three provider adapters; provider auto-detected from configured env keys (`AI_PROVIDER` override). Static grounding pack compiled at build. `@upstash/ratelimit` on Upstash Redis for rate limiting.** Model mapping:

| Provider | AMA chat | TL;DR (build-time) |
|---|---|---|
| Anthropic | `claude-haiku-4-5` | `claude-sonnet-4-6` |
| OpenAI | `gpt-5.4-mini` | `gpt-5.4` |
| OpenRouter | `anthropic/claude-haiku-4.5` | `anthropic/claude-sonnet-4.6` |

Guardrails: hardened system prompt (grounding-only persona, honest refusal + contact redirect), ~1,000-char input cap, capped output tokens, no server-side conversation persistence (FR-AI-7).

## Consequences

- Adds one operator dependency: a free Upstash Redis database (env: `UPSTASH_REDIS_REST_URL`/`_TOKEN`) — documented in operator-docs when provisioned. Until then the chat endpoint ships behind a conservative fallback limit.
- Model IDs live in one config map — pricing/model drift is a one-file change.
- OpenRouter's ~$9 credit ≈ tens of thousands of chat turns at Haiku-class pricing — no cost concern for v1.

## Follow-ups not included in this decision

- Grounding-pack compiler design (feature plan; content-phase input).
- Moderation pass — deferred unless abuse observed.
