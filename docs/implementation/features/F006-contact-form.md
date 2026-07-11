---
feature: Contact — Form, Resend Delivery, Spam Protection
type: feature
status: ready
release: "1.0.0"
priority: P0
component: contact
owner: @isharjeeldd
created: 2026-07-11
updated: 2026-07-11
depends_on: [F001-scaffold-design-system-foundation]
---

# Contact — Form, Resend Delivery, Spam Protection

## Summary

Implement FR-CONTACT-1..6 per ADR-0005: a contact form (name, email, message, optional intent role/freelance/other) delivering via the verified Resend account, spam-protected by honeypot + minimum-fill-time + server validation (no visible CAPTCHA), explicit success/failure states with a mailto fallback, inline accessible validation, and the availability signal with Upwork surfaced to freelance-intent visitors.

## Acceptance Criteria

- [ ] Valid submission delivers an email to the configured inbox via Resend
- [ ] Honeypot-filled or too-fast submissions are silently dropped (bot sees generic success; nothing sent)
- [ ] Missing Resend config or provider failure → explicit failure UI with direct-email fallback (EC-CONTACT-1)
- [ ] Inline, accessible field validation (aria-describedby, field-level messages)
- [ ] Selecting "freelance" intent surfaces the Upwork profile link
- [ ] Endpoint validates at the boundary and applies best-effort rate limiting

## Technical Approach

`lib/contact.ts`: zod payload schema + `evaluateContactRequest()` (pure): returns `delivered-candidate | spam | invalid`. Spam gates: hidden `company` honeypot must be empty; `startedAt` must be ≥3s old (EC-CONTACT-2). `app/api/contact/route.ts` (POST): parse → evaluate → spam gets a generic 200 (don't teach bots) → send via `resend` SDK using `lib/config.ts` → 503 when unconfigured, 502 on provider error. Best-effort in-memory per-IP limiter (serverless caveat documented; Upstash is the ADR-0005/0004 escalation once provisioned). `components/contact/contact-form.tsx` (client): controlled fields, honeypot (visually hidden, tabIndex -1), mount-time `startedAt`, aria-live status region, failure state renders mailto. Landing contact section rebuilt around the form.

## UI / Design Contract

Form on surface tokens, mono labels, accent only on focus rings/CTA/status accents; error text uses a dedicated readable tone (not raw accent). CTA uses the magnetic-fill button style (hover fill accent).

## Content Model Changes

None.

## Dependencies

F001. New dep: `resend`. Env: `RESEND_API_KEY/EMAIL_TO/EMAIL_FROM` (already in `.env.local` / `.env.example`).

## Test Cases

### Unit / Component Tests

- Test: schema — valid payload passes; bad email / empty message / oversize message fail with field errors
- Test: evaluate — honeypot filled → `spam` (EC-CONTACT-2)
- Test: evaluate — submitted <3s after start → `spam`
- Test: evaluate — clean payload → `delivered-candidate`
- Test: route POST valid (resend mocked) → 200, resend called with configured from/to and intent-labelled subject
- Test: route POST spam → 200 generic, resend NOT called
- Test: route POST with zero Resend config → 503 (EC-CONTACT-1)
- Test: route POST resend throws → 502
- Test: form renders name/email/message/intent + no visible honeypot label
- Test: form submit success (fetch mocked 200) → success state announced
- Test: form submit failure (fetch mocked 502) → failure state with mailto link
- Test: freelance intent selected → Upwork link visible

### Integration / E2E Tests

- Test: `next build` — contact route compiles; landing prerender intact
- Manual (pre-release, F013): real end-to-end delivery to the inbox

### Edge Cases

- Test: invalid JSON body → 400 without crash
- Test: fetch network error in form → failure state with mailto (not a hang)

## Files Affected

```
lib/contact.ts
app/api/contact/route.ts
components/contact/contact-form.tsx
app/page.tsx (contact section)
tests/contact-lib.test.ts, tests/contact-route.test.ts, tests/contact-form.test.tsx
package.json (resend)
```

## Estimated Effort

M
