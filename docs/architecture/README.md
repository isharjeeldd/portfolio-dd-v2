# Architecture Documents

Architecture documents describe **how the system works right now**. They are the living reference for the current state of the codebase — when the system changes, these docs are updated in the same change. They answer: "If someone opened this repo today, what do they read to understand the site?"

## Relationship to other docs

- **Tech discovery** (`../tech_discovery/`) is the exploration: "we investigated X, Y, Z and chose Y." May become stale.
- **Architecture** is the result: "the site currently uses Y, here's how it works." Must never be stale.
- **ADRs** (`../adr/`) are the reasoning: "we chose Y because of A, B, C." Immutable history.

## Expected structure (created as the system is built)

```
docs/architecture/
  system_overview.md      Entry point: site map, rendering strategy, how everything connects
  content_model.md        Blog posts, project entries, profile data — where content lives and flows
  design_system.md        Tokens, typography, components, motion vocabulary
  infrastructure.md       Vercel deployment, domains/DNS, env vars, third-party services
```

## Rules

See the `architecture` skill (`.claude/skills/architecture/`). Key ones: always current, `Last verified` dates, diagrams required, no aspirational content.
