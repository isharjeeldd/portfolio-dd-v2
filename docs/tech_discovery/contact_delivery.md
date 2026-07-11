# Tech Discovery: Contact Delivery

| | |
|---|---|
| **Status** | complete |
| **Release** | 1.0.0 |
| **Owner** | @isharjeeldd |
| **Last Updated** | 2026-07-11 |

## Problem Statement

The portfolio has a contact form (FSD FR-CONTACT-*) that must reliably deliver visitor messages to the owner's inbox. The delivery path needs to work from a serverless environment (parallel discovery is confirming Next.js App Router on Vercel — this doc assumes it; the endpoint will be a Route Handler / Server Action and must fit serverless constraints: short-lived invocations, no persistent SMTP connections).

Constraints and locked facts:

- The owner has a **working, verified Resend account** carried over from the previous portfolio: domain `sharjeelafzaal.com` is verified, sending is enabled, region `ap-northeast-1`. Mail goes from `contact@sharjeelafzaal.com` to the owner's inbox.
- Environment variables are already established: `RESEND_API_KEY`, `RESEND_EMAIL_TO`, `RESEND_EMAIL_FROM`.
- FSD requires spam protection **without visible CAPTCHA friction** — no puzzle, no checkbox challenge presented to legitimate visitors.
- FSD FR-CONTACT-2 requires explicit success/failure UX with a `mailto:` fallback so a visitor is never stranded if delivery fails.

## Options Evaluated

### Email delivery provider

**Option A — Resend (incumbent, working).**
Current state verified 2026-07-11:

- Official Node SDK `resend` is at **v6.17.2** on npm (npm registry `latest`, published within a day of checking), actively maintained, requires Node >= 20 — compatible with Vercel's Node runtimes ([npm](https://www.npmjs.com/package/resend), [releases](https://github.com/resend/resend-node/releases)).
- API status: operational, ~99.97% uptime reported across components ([status page](https://resend-status.com/)).
- The SDK is a thin HTTPS client — ideal for serverless; no persistent connections or pooling concerns.
- First-class Next.js integration docs exist ([Send with Node.js](https://resend.com/docs/send-with-nodejs)).
- Free tier comfortably covers a portfolio's contact-form volume.
- Crucially, **zero setup cost here**: domain verification, DNS (SPF/DKIM), and the env var conventions are already done and proven in production on the old portfolio.

**Option B — Nodemailer + SMTP, or Postmark (brief).**

- Nodemailer is free and provider-agnostic, but SMTP from serverless is a known anti-pattern: connection setup per invocation, port blocking on some platforms, slower cold sends — and it still requires an SMTP relay (Gmail app password or a transactional provider anyway).
- Postmark is the polished alternative in the same transactional-API category, but has no free tier beyond a trial and would mean re-verifying the domain with a second vendor.
- Neither offers anything this project needs that Resend lacks.

### Spam protection (no visible CAPTCHA allowed)

**Option A — Honeypot + minimum-fill-time + server-side validation.**

- A visually hidden form field that bots fill and humans never see.
- A timestamp check rejecting submissions completed implausibly fast (< ~3 seconds).
- Strict server-side validation of all fields regardless of any client-side checks.
- Zero vendors, zero client-side JS weight, zero visitor friction, no privacy implications.
- Defeats the commodity bot traffic a low-profile personal site actually receives.
- Weakness: will not stop a targeted or headless-browser attacker — an acceptable risk at this traffic profile.

**Option B — Cloudflare Turnstile (invisible/managed mode).**

- Free, genuinely invisible for most users, and much stronger against sophisticated bots.
- Cost: adds a vendor, a client script, two more env vars (site key / secret), and a server-side verification round-trip on every submission.
- Overkill for v1 given no observed spam problem yet.

**Option C — Provider-side filtering.**
Resend is a sending API, not an inbound spam filter — it will happily send whatever the endpoint submits. Relying on the owner's inbox spam filter just moves junk into a spam folder and burns sending quota/reputation. Not a real option on its own.

### Supporting controls (required regardless of provider)

- **Rate limiting** on the contact endpoint: per-IP fixed window (e.g. a handful of submissions per hour) implemented in the Route Handler. For a single serverless endpoint at this scale, an in-memory/best-effort limiter or Vercel's platform protections suffice for v1; a durable store (Upstash) only if abuse appears.
- **Input validation at the boundary**: schema validation (e.g. zod) of name/email/message on the server — length caps, email format, no header-injection vectors — before anything touches the Resend API.
- **Explicit success/failure UX (FR-CONTACT-2)**: the form must show a definite success state on 2xx and a definite failure state otherwise, with a visible `mailto:` link to the owner's address as fallback so failed delivery never dead-ends the visitor.

## Recommendation

**Delivery: Resend (Option A).** The account is verified, DNS is done, the SDK (v6.17.2) is current and serverless-friendly, and the service is healthy. Choosing anything else means re-doing domain verification with a new vendor for no functional gain. Pin `resend@^6.17.2`; keep the existing `RESEND_API_KEY` / `RESEND_EMAIL_TO` / `RESEND_EMAIL_FROM` contract; region stays `ap-northeast-1`.

**Spam protection: Option A (honeypot + min-fill-time + server-side validation) for v1.** Zero vendors and zero visitor friction, which is exactly what the FSD demands. **Turnstile invisible mode (Option B) is the documented escalation path** if spam volume ever exceeds what the honeypot catches — it can be added behind the same endpoint without reworking the form.

Additionally: rate-limit the endpoint per-IP, validate all input server-side at the boundary, and implement the success/failure states with `mailto:` fallback per FR-CONTACT-2.

ADR: to be recorded as ADR-0005.

## Open Questions

- Should failed sends be surfaced to the owner (e.g. logged to Vercel logs only, or also alerted)? Proposed: Vercel logs for v1.
- Does the `ap-northeast-1` sending region introduce noticeable latency from Vercel's default deployment region? Expected negligible for a fire-and-forget send; measure once in staging.
- Reply-to strategy: set the visitor's email as `reply_to` so the owner can reply directly — confirm this matches how the old portfolio behaved.

## Spike Results

None — no spikes required for this topic.
