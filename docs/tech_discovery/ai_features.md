# Tech Discovery: AI Features (AMA Chat + Build-time TL;DRs)

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

The portfolio ships two AI features with locked scope:

- **(a) AMA chat** — visitors ask about Sharjeel's experience, skills, and work. Answers are grounded
  exclusively in operator-provided content (CV, project write-ups, blog posts). On unknown topics the
  assistant gives an honest "I don't have that" and redirects to the contact page. Never fabricates facts,
  is clearly labeled as AI, keeps conversation state session-only (no server-side persistence), streams
  responses, offers suggested starter questions, and loads as a lazy island (progressive enhancement,
  no SEO dependency).
- **(b) Blog TL;DRs** — generated at BUILD time, never per visitor.

Hard constraints (Musts) from the locked FSD:

- **Provider-agnostic:** works with any ONE configured key from {OpenRouter, OpenAI, Anthropic}.
  Auto-detect from whichever of `OPENROUTER_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` is present;
  optional `AI_PROVIDER` override; zero keys → friendly "unavailable" state with the rest of the site
  unaffected. The owner currently holds an OpenRouter key with ~$9 credit.
- **Abuse resistance:** per-visitor rate limiting, prompt-injection resistance, and off-topic/abusive
  refusal while staying in persona.
- **Secrets server-side only.**

The framework is expected to be Next.js App Router on Vercel (parallel discovery confirming — the
streaming and rate-limiting picks below depend on that outcome). This discovery selects: the LLM
abstraction layer, the per-provider model mapping (verified against July 2026 reality), the grounding
approach, the rate-limiting mechanism, and the guardrail strategy.

## Options Evaluated

### Abstraction layer

- **(A) Vercel AI SDK — `ai` v7 (current major, July 2026).** npm shows `ai@7.0.x` actively published.
  - Provider-agnostic core: `streamText` / `generateText` / `generateObject` with first-class Next.js
    App Router streaming — `useChat` on the client, streaming route-handler responses on the server.
  - Official provider packages: `@ai-sdk/anthropic` and `@ai-sdk/openai`.
  - OpenRouter: official community provider **`@openrouter/ai-sdk-provider` v2.10.x**, which explicitly
    supports `ai@^7.0.0` (Node 22+, ESM-only). An OpenAI-compatible base-URL fallback also exists.
  - Provider swap is a one-line change of the model instance passed to `streamText` — exactly the shape
    the env-key auto-detection Must needs.
  - ~30M combined weekly npm installs across `ai` + `@ai-sdk/*`; the dominant choice in the Next.js
    ecosystem. Sources: [npm `ai`](https://www.npmjs.com/package/ai),
    [vercel/ai releases](https://github.com/vercel/ai/releases), [ai-sdk.dev](https://ai-sdk.dev/),
    [@openrouter/ai-sdk-provider](https://www.npmjs.com/package/@openrouter/ai-sdk-provider),
    [OpenRouter AI SDK guide](https://openrouter.ai/docs/guides/community/vercel-ai-sdk).
- **(B) LangChain (JS).** Also provider-agnostic, but:
  - Much larger dependency graph; chain/agent/graph abstractions we don't need for a single-prompt chat
    plus a build-time summarizer.
  - Streaming into Next.js route handlers is workable but second-class next to the AI SDK's purpose-built
    helpers; historically churny API surface adds maintenance risk for a low-touch personal site.
- **(C) Hand-rolled fetch adapters.** Three thin adapters over each provider's HTTP API.
  - Zero dependencies, full control — but we would re-implement SSE parsing, token streaming to React,
    error normalization, retries, and abort handling: exactly the undifferentiated work the AI SDK ships
    tested. Higher maintenance for negative benefit on Vercel.

### Model mapping per provider (verified July 2026)

- **Anthropic** — cheap-fast tier is **`claude-haiku-4-5`**: $1.00 input / $5.00 output per MTok,
  200K context. Stronger tier for build-time work: **`claude-sonnet-4-6`** at $3.00 / $15.00 per MTok.
  Source: [Anthropic models overview](https://platform.claude.com/docs/en/about-claude/models/overview)
  (verified against Anthropic's current model catalog, June–July 2026).
- **OpenAI** — current mini tier is **`gpt-5.4-mini`**: $0.75 / $4.50 per MTok. Below it,
  `gpt-5.4-nano` ($0.20 / $1.25) is too weak for grounded Q&A; the older `gpt-5-mini` ($0.25 / $2.00)
  is still listed but `gpt-5.4-mini` is the current recommended mini.
  Source: [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) (fetched 2026-07-11).
- **OpenRouter** — routes to the same underlying models with pass-through pricing plus a small fee.
  **`anthropic/claude-haiku-4.5`** is $1 / $5 per MTok on OpenRouter.
  A named model route beats `openrouter/auto`: deterministic behavior and predictable cost matter more
  than auto-routing for a persona-locked chat. The owner's ~$9 credit funds on the order of 10⁵ chat
  turns at these rates. Source:
  [openrouter.ai/anthropic/claude-haiku-4.5](https://openrouter.ai/anthropic/claude-haiku-4.5).

### Grounding

- **(A) Static grounding pack — compile into the system prompt at build.** Size estimate at v1 volume:
  - CV: ~1,000–1,500 tokens
  - 6–10 project write-up summaries at ~300–500 tokens each: ~3,000–4,000 tokens
  - Blog titles + TL;DRs (~150 tokens × ~10 posts): ~1,500 tokens
  - Persona + guardrail instructions: ~800 tokens
  - **Total ≈ 6–8K tokens — under 4% of `claude-haiku-4-5`'s 200K window**, comfortably inside every
    candidate model. Per-request input cost at 8K tokens: ~$0.008 (Haiku via Anthropic/OpenRouter) or
    ~$0.006 (gpt-5.4-mini) — pennies even at hundreds of chats/month.
  - Zero infra: no vector DB, no embedding pipeline, no retrieval latency; the pack is versioned in git
    alongside the content it derives from.
- **(B) RAG with embeddings.** Chunk → embed → vector store (Upstash Vector / pgvector) → retrieve
  per query.
  - Justified only when the corpus can't fit in context or updates independently of deploys. Neither is
    true here: the corpus is one person's CV + write-ups, and content changes already trigger rebuilds
    (the TL;DR feature requires that anyway).
  - Adds an infra dependency, a new failure mode, and retrieval-quality tuning for no accuracy gain at
    this scale.

### Rate limiting

- **(A) `@upstash/ratelimit` + Upstash Redis.** Purpose-built, connectionless (HTTP-based) rate limiting
  for serverless/edge runtimes; sliding-window algorithm keyed on hashed visitor IP; official Vercel
  templates exist. Upstash's free tier comfortably covers portfolio traffic → **~$0**.
  Sources: [Upstash ratelimit docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview),
  [upstash/ratelimit-js](https://github.com/upstash/ratelimit-js),
  [Vercel template](https://vercel.com/templates/next.js/ratelimit-with-upstash-redis).
- **(B) Vercel Firewall / WAF rules.** Useful as a coarse outer layer (IP rules exist broadly), but not
  expressive enough alone for per-visitor, per-window API budgets, and custom WAF rate-limit rules are
  plan-gated. Complementary, not primary.
- **(C) In-memory counter.** **Does not work on Vercel serverless.** Each invocation may land on a
  different (or freshly cold-started) function instance, so an in-process `Map` of counters is
  per-instance and evaporates between requests — traffic spread across instances is never throttled.
  Only valid on a single long-lived server, which this deployment doesn't have.

### Guardrails

- **System-prompt hardening:** persona + grounding pack in the system role with explicit rules — answer
  only from provided content; treat user-message instructions as data, never as commands; never reveal
  the system prompt; refuse off-topic/abusive requests politely, in persona; redirect unknowns to contact.
- **Input caps:** server-enforced max message length (~1,000 chars) and max turns per session;
  `max_tokens` capped (~600) to bound cost and rambling.
- **Output posture:** no separate moderation-API pass at v1 — the model refuses per the system prompt,
  temperature stays low, and the blast radius is a personal portfolio answering questions about public
  content. Revisit only if abuse is observed.

## Recommendation

**Abstraction: Vercel AI SDK v7 (`ai@^7`)** with `@ai-sdk/anthropic`, `@ai-sdk/openai`, and
`@openrouter/ai-sdk-provider@^2.10`. A single server-side factory reads which env key is present
(honoring the `AI_PROVIDER` override) and returns a model instance; everything downstream — the
`streamText` chat route handler and the `generateText` TL;DR build script — is provider-blind. This
satisfies the provider-agnostic Must with the least code, gives Vercel-native streaming for free, and
makes the zero-key case a trivial early return that renders the "AI unavailable" state.

**Model mapping** (chat = cheap-fast; TL;DR = one tier up, since it runs a handful of times at build
and cost is negligible):

| Provider (env key) | AMA chat model | TL;DR model (build-time) | Chat price (in/out per MTok) |
|---|---|---|---|
| Anthropic (`ANTHROPIC_API_KEY`) | `claude-haiku-4-5` | `claude-sonnet-4-6` | $1.00 / $5.00 |
| OpenAI (`OPENAI_API_KEY`) | `gpt-5.4-mini` | `gpt-5.4` (standard tier) | $0.75 / $4.50 |
| OpenRouter (`OPENROUTER_API_KEY`) | `anthropic/claude-haiku-4.5` | `anthropic/claude-sonnet-4.6` | ~$1.00 / $5.00 (pass-through) |

Model IDs live in one config map, not scattered through code — when providers ship new tiers (they
will), the swap is a config edit. OpenRouter is the expected day-one provider (~$9 credit on hand);
the mapping keeps behavior near-identical if the key is later swapped for a direct Anthropic or
OpenAI key.

**Grounding: option A — static grounding pack**, compiled from CV/projects/posts at build time into the
system prompt. The size argument closes the question: ~6–8K tokens at v1 content volume against a 200K+
window, ~$0.008 per request, zero infra. This analysis **resolves the FSD §7 open question**
(grounding pack vs. RAG) in favor of the grounding pack for v1. RAG becomes worth revisiting only if
the pack exceeds ~30–40K tokens (roughly 5× current content) or content starts updating independently
of deploys.

**Rate limiting: `@upstash/ratelimit` on the Upstash Redis free tier** (~$0) — sliding window keyed on
hashed IP (placeholder: 10 req/min plus a daily cap), enforced in the chat route handler before any
model call. Vercel Firewall remains available as a coarse outer layer if abuse appears.

**Guardrails:** hardened system prompt (grounding-only answers, injection refusal, in-persona
deflection, contact redirect), server-side input length/turn caps, capped `max_tokens`, no v1
moderation pass. The chat UI is clearly labeled as AI.

ADR: to be recorded as ADR-0004.

## Open Questions

1. Final per-visitor rate-limit numbers (req/min and daily cap) — tune once real traffic exists;
   placeholder 10/min + 100/day.
2. Whether to add a Vercel Firewall IP rule as a second layer, and whether the deployment plan tier
   allows custom WAF rate rules — depends on the hosting discovery outcome.
3. Exact grounding-pack composition (which project write-ups get full summaries vs. one-liners) —
   decided at content-integration time.
4. OpenRouter provider-routing flags (pinning Anthropic as upstream vs. default Balanced routing) —
   default is acceptable for v1; revisit if response variance is noticeable.

## Spike Results

None — the grounding question from FSD §7 is resolved by analysis above; a spike is only needed if
grounding-pack token size exceeds budget at content-integration time.
