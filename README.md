# portfolio-dd-v2

Personal developer portfolio of **Sharjeel Afzaal** — successor to [portfolio-dd](https://github.com/isharjeeldd/portfolio-dd), serving [sharjeelafzaal.com](https://www.sharjeelafzaal.com/).

## Status

🚀 **Release 1.0.0 on `main`** — 12 features, 7 ADRs, 109 tests. Dark editorial minimalism with a kinetic-typography hero, visitor-selectable accent, MDX blog with AI TL;DRs, a grounded AMA chat (bring any AI provider key), playground experiments, and Resend-backed contact. See [`docs/releases/1.0.0.md`](docs/releases/1.0.0.md) and the [build-log post](content/posts/why-this-portfolio-has-a-docs-folder.mdx).

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
