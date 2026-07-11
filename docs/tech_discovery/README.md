# Technical Discovery Documents

Tech discovery documents capture **how** we plan to build (or evolve) a capability. They are the exploration phase — investigating options, running spikes, evaluating technologies, and making recommendations. Once decisions are made, the conclusions move into `../architecture/` and `../adr/`.

## Expected topics for this project

One file per topic, created as each investigation starts (not pre-written):

```
docs/tech_discovery/
  framework_and_hosting.md     (framework choice, rendering strategy, Vercel deployment shape)
  styling_and_motion.md        (styling system, animation approach for the chosen design direction)
  blog_content_pipeline.md     (where posts live, authoring format, syntax highlighting, RSS)
  contact_delivery.md          (form handling, spam protection, delivery provider)
  analytics_and_seo.md         (analytics, metadata/OG generation, sitemap)
```

## Rules

See the `tech-discovery` skill (`.claude/skills/tech-discovery/`) for the template and rules. Key ones:

- One doc per topic; keep option comparisons colocated.
- Link to the ADR from the Recommendation section once a decision is made.
- Tech discovery must be `complete` for a topic before implementation features touching it are created.
