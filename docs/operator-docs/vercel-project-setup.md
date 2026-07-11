# Operator: Vercel Project Setup (release 1.0.0)

**What it is:** One-time dashboard setup connecting the GitHub repo to the Vercel project and configuring production secrets.

**Why this shape:** The project (`portfolio-dd-v2`) was created by an initial MCP file-push deploy; linking git makes `main` auto-deploy production and gives previews per branch (ADR-0001). Secrets live only in Vercel env vars — never in the repo (NFR-SEC-1).

## Click-path

1. **Rotate keys first (recommended):** Resend dashboard → API Keys → create new, revoke old. OpenRouter → Keys → same. (Originals were exposed in a chat session during setup.)
2. vercel.com → team **Sharjeel's projects** → project **portfolio-dd-v2** → **Settings → Git** → Connect `isharjeeldd/portfolio-dd-v2`, production branch `main`.
3. **Settings → Environment Variables** (Production, and Preview if desired): `RESEND_API_KEY`, `RESEND_EMAIL_TO`, `RESEND_EMAIL_FROM`, `OPENROUTER_API_KEY` (values per rotated keys; names per `.env.example`).
4. **Settings → Deployment Protection → Disabled** (site must be public).
5. Trigger/await a `main` deployment.

## Verification

- Production alias returns 200 anonymously (no SSO redirect).
- Contact form delivers to the inbox; chat answers a question.
- `/validate --pre-merge` NFR checks run against the production URL (performed by the release protocol, F013).

## Decisions / deviations

- Initial deploy was file-push (pre-git-link) — superseded by the git link; no redeploy of that artifact.

## Cross-references

F013 (release) · ADR-0005 (key rotation note) · [infrastructure.md](../architecture/infrastructure.md)
