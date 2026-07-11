# portfolio-dd-v2

Personal developer portfolio of **Sharjeel Afzaal** — successor to [portfolio-dd](https://github.com/isharjeeldd/portfolio-dd), serving [sharjeelafzaal.com](https://www.sharjeelafzaal.com/).

## Status

🚧 **Greenfield — design discovery in progress.** The look & feel is being defined (inspiration research → product discovery → FSD) before any application code is written.

## How this repo works

This project runs on a documentation-first workflow (adapted from the Architect-Era system):

```
Product Discovery (lock scope) → FSD (build gate) → Tech Discovery → ADRs → Architecture
  → Implementation features (TDD) → Code
```

| Where | What |
|---|---|
| `docs/product_discovery/` | What each release offers and why (scope lock) |
| `docs/fsd/` | The functional contract per release (`FR-<area>-<n>`) — the build gate |
| `docs/tech_discovery/` | Technical exploration & tradeoffs (stack, styling, content pipeline) |
| `docs/adr/` | Architecture Decision Records — immutable once accepted |
| `docs/architecture/` | How the system works *right now* |
| `docs/implementation/` | Feature plans (`F###`), fix records (`X###`), spikes (`S###`) |
| `docs/releases/` | Auto-generated release scope docs |
| `AGENTS.md` | Full project context, workflow rules, and conventions |

## Git flow

`feature/* → develop → main` (forward only). `main` deploys to production on Vercel; `develop` and PRs get preview deployments.

## License

MIT
