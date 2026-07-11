# ADR-0005: Resend for contact delivery; honeypot + timing for spam protection

**Status:** Accepted — 2026-07-11
**PR:** — (bootstrap phase, committed to `develop`)

## Context

The contact form must deliver reliably to the owner's inbox with explicit success/failure UX and a mailto fallback (FR-CONTACT-1/2), spam-protected without visible CAPTCHA friction (FR-CONTACT-3), rate-limited and boundary-validated (NFR-SEC-2). The owner has a **working, verified Resend account** (domain `sharjeelafzaal.com`, sending enabled, verified 2025-04-20) reused from the previous portfolio. Full analysis: [`../tech_discovery/contact_delivery.md`](../tech_discovery/contact_delivery.md).

## Options Considered

### Delivery — Resend (chosen) vs Nodemailer+SMTP / Postmark
- Resend: incumbent, verified domain, current SDK `resend@6.17.2` healthy, ~99.97% uptime. Alternatives add setup cost for zero benefit at portfolio volume.

### Spam — honeypot + minimum-fill-time + server validation (chosen) vs invisible Turnstile vs provider-side filtering
- Honeypot + timing: zero vendors, zero visitor friction, catches commodity bots. Turnstile invisible: effective but adds a vendor + script weight — documented **escalation path** if spam volume demands. Provider-side filtering alone: insufficient.

## Decision

**Resend (`resend` SDK) from `contact@sharjeelafzaal.com` to the configured inbox; spam protection via honeypot field + minimum-fill-time + server-side validation; per-IP rate limiting on the endpoint; explicit success/failure states with mailto fallback.**

## Consequences

- Env contract already established: `RESEND_API_KEY` / `RESEND_EMAIL_TO` / `RESEND_EMAIL_FROM` (in `.env.example`; secrets in Vercel env).
- The pasted-in-chat API key is rotated before launch (operator-docs task).
- If spam breaches the honeypot approach, Turnstile invisible mode is the pre-decided escalation — a new ADR only if it changes the visitor experience.

## Follow-ups not included in this decision

- Intent-field routing/labeling of messages (feature plan).
- Key rotation at launch (operator runbook).
