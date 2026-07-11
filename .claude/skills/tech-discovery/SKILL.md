---
name: tech-discovery
description: Rules for writing and editing technical discovery documents in docs/tech_discovery/. Covers technical exploration, spike results, and technology evaluation. Auto-invokes when working on tech discovery files.
---

# Technical Discovery Documents

## When This Applies

Any time you are reading, writing, or editing files in `docs/tech_discovery/`.

## What Tech Discovery Docs Are

Tech discovery documents capture **how** we plan to build (or evolve) a capability. They are the exploration phase — investigating options, running spikes, evaluating technologies, and making recommendations. Once decisions are made, the conclusions move into `docs/architecture/` and `docs/adr/`.

## Structure

One file per topic:

```
docs/tech_discovery/
  framework_and_hosting.md     (framework, rendering strategy — static/SSR/ISR, Vercel deployment shape)
  styling_and_motion.md        (styling system, animation library/approach for the locked design direction)
  blog_content_pipeline.md     (authoring format — MDX/CMS/files, syntax highlighting, RSS, reading time)
  contact_delivery.md          (form handling, spam protection, delivery provider)
  analytics_and_seo.md         (analytics, metadata/OG image generation, sitemap)
```

### Document Template

```markdown
# Tech Discovery: [Topic Name]

| | |
|---|---|
| **Status** | draft / in-progress / complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | YYYY-MM-DD |

## Problem Statement

What technical problem are we solving? Include constraints (performance budgets, the locked design direction's demands — e.g. heavy motion needs a capable animation approach, authoring workflow preferences, cost — free tiers preferred, maintenance burden for a solo project).

## Options Evaluated

### Option A: [Name]
- Description
- Pros
- Cons
- Cost implications (hosting, vendor billing, free-tier limits)

### Option B: [Name]
- ...

## Recommendation

Which option and why. Reference the ADR if one was created.

## Open Questions

Unresolved technical questions that need spikes or further investigation. Each maps to either an entry under `docs/implementation/spikes/` or an external doc / vendor confirmation not yet done.

## Spike Results

Results from any technical spikes. Reference the spike docs by filename and link to any ADRs that came out of them.
```

## Rules

1. **One doc per topic.** Do not create separate docs per technology option — keep options within the same topic doc so the comparison is colocated.
2. **Status tracking.** Always update the Status field: `draft` → `in-progress` → `complete`.
3. **Verify current docs.** Evaluate options against their **current** documentation (WebSearch/WebFetch) — model knowledge of frontend tooling goes stale fast; pin versions and cite what you checked.
4. **Link to ADRs.** When a decision is made, write an ADR in `docs/adr/` and link to it from the Recommendation section.
5. **Link to architecture.** Once complete, the resulting architecture is documented in `docs/architecture/`. Link from the tech discovery doc.
6. **Spike results are permanent.** Even if a spike leads to a rejected option, keep the results — they prevent re-investigation later.
7. **No implementation details.** Code snippets, component contracts, or test cases belong in `docs/implementation/features/`, not here.
8. **Tech discovery must complete before features are created.** Implementation feature docs should not exist for a topic until its tech discovery is `complete`.
