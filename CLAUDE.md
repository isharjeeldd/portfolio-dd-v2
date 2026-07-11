@AGENTS.md

## Claude-Specific
- Use plan mode for changes spanning the design system, the content pipeline, URL structure, or deployment config — anything hard to reverse or visible across the whole site.
- Verify with the project's test and build scripts (see `package.json`) after every change you make. Build must pass before commit.
- The design direction, once locked in product discovery, is part of the contract — don't "improve" typography, spacing, motion, or color outside the locked scope without asking.
- Release scoping is gated: Product Discovery (`docs/product_discovery/portfolio_product_discovery_v<N>.md`) locks scope, then the FSD (`docs/fsd/portfolio_fsd_v<N>.md`) turns it into `FR-<area>-<n>` requirements. **Do not create implementation features for a release until its FSD is locked.** Keep product discovery & FSD technology-agnostic (stack lives in tech discovery / ADRs).
- Git flow is forward-only `develop → main`. Don't merge `main` down into `develop` except documented hotfix back-merges. Production tags live on `main` only.
- Before coding against any external library/framework API, verify current syntax via WebSearch/WebFetch — assume prior knowledge is stale.
- **Next.js 16 is NOT the Next.js you know** — breaking changes vs training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
