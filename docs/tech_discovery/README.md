# Technical Discovery Documents

Tech discovery documents capture **how** we plan to build (or evolve) a capability. They are the exploration phase — investigating options, running spikes, evaluating technologies, and making recommendations. Once decisions are made, the conclusions move into `../architecture/` and `../adr/`.

## Topics (release 1.0.0 — all complete, 2026-07-11)

| File | Recommendation | ADR |
|---|---|---|
| [`framework_and_hosting.md`](./framework_and_hosting.md) | Next.js 16 App Router on Vercel | [0001](../adr/0001-nextjs-16-app-router-on-vercel.md) |
| [`styling_and_motion.md`](./styling_and_motion.md) | Tailwind v4 + GSAP; `data-accent` custom-property theming | [0002](../adr/0002-tailwind-4-gsap-data-accent-theming.md) |
| [`blog_content_pipeline.md`](./blog_content_pipeline.md) | Content Collections + Shiki + `next/og`; pre-build TL;DR cache | [0003](../adr/0003-content-collections-mdx-pipeline.md) |
| [`ai_features.md`](./ai_features.md) | Vercel AI SDK v7, provider-agnostic; grounding pack; Upstash ratelimit | [0004](../adr/0004-vercel-ai-sdk-provider-agnostic.md) |
| [`contact_delivery.md`](./contact_delivery.md) | Resend (incumbent) + honeypot/timing spam protection | [0005](../adr/0005-resend-contact-delivery-honeypot.md) |
| [`analytics_and_seo.md`](./analytics_and_seo.md) | Vercel Web Analytics; Next Metadata API + `schema-dts` | [0006](../adr/0006-vercel-analytics-metadata-seo.md) |

## Rules

See the `tech-discovery` skill (`.claude/skills/tech-discovery/`) for the template and rules. Key ones:

- One doc per topic; keep option comparisons colocated.
- Link to the ADR from the Recommendation section once a decision is made.
- Tech discovery must be `complete` for a topic before implementation features touching it are created.
