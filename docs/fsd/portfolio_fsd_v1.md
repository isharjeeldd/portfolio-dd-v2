# Portfolio — Functional Specification Document v1

| | |
|---|---|
| **Product** | Personal developer portfolio of Muhammad Sharjeel |
| **Release** | 1.0.0 |
| **Document version** | 1.0 |
| **Status** | ✅ LOCKED — 2026-07-11 by @isharjeeldd (build gate open) |
| **Date** | 2026-07-11 |
| **Repository** | https://github.com/isharjeeldd/portfolio-dd-v2 |

## Document control

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-07-11 | Initial FSD derived from locked `portfolio_product_discovery_v1.md` |
| 1.0 | 2026-07-11 | **Locked** by @isharjeeldd — build gate open; FR IDs frozen |
| 1.1 | 2026-07-11 | **Amendment (owner sign-off, brand board / ADR-0007):** FR-THEME-2 default accent changed terminal lime → **crimson**; switcher set unchanged |

**Requirement language.** `Must` = required for 1.0.0; cutting one needs sign-off recorded here. `Should` = strongly recommended, cut only with reason. `May` = optional. Deferred items are marked `Won't (v1)` in §8.

**ID convention.** Functional requirements are `FR-<AREA>-<n>`; edge cases are `EC-<AREA>-<n>`. Areas: `SITE`, `HERO`, `WORK`, `PLAY`, `ABOUT`, `BLOG`, `AI`, `CONTACT`, `THEME`, `SEO`. IDs are stable — never renumbered within a locked version.

## §1 Introduction

### Purpose
The functional contract for release 1.0.0 of the new portfolio. Engineers (human or AI) build against this document; every implementation feature (`F###`) traces to FRs here.

### Scope
The visitor-facing portfolio site: one-page landing narrative, blog, AI features, contact — per the locked product discovery. Technology choices are **out of scope** (tech discovery / ADRs).

### Definitions
- **Landing** — the one-page scroll narrative at `/`.
- **Post** — a blog article at its own URL.
- **Accent** — the single electric color active in the UI, visitor-selectable.
- **AMA** — the "ask-me-anything" AI chat grounded in Sharjeel's content.
- **Reduced motion** — the visitor's OS/browser preference to minimize animation.

### References
- `docs/product_discovery/portfolio_product_discovery_v1.md` (✅ locked 2026-07-11) — source of all Decisions D1–D13.

## §2 Product overview

### Summary
A dark, editorial-minimal, motion-engineered portfolio presenting **Muhammad Sharjeel** (alternate name: Sharjeel Afzaal) — senior software engineer, open to opportunities and select freelance work. The site itself is a work sample: its speed, accessibility, and interaction craft carry the message. Voice: confident minimal — proof, not adjectives.

### Site context
Hybrid structure (D1): landing (`/`) with sections Hero → Selected Work → Playground → About/Experience → Blog teaser → Contact; dedicated routes `/blog` and `/blog/<post>`. Production runs on the project's hosting platform with preview environments per change; the launch domain is the platform-assigned domain, with `sharjeelafzaal.com` cutover planned post-launch.

### Visitors & audiences
1. **Recruiter / hiring manager** — skims in ≤60s; needs identity, seniority signals, proof, CV, contact.
2. **Engineering peer / blog reader** — often lands directly on a post from search/social; needs a first-class reading experience.
3. **Prospective freelance client** — needs services signal, proof of outcomes, contact or Upwork channel.
4. **Crawlers / feed readers** — need correct metadata, structured data, sitemap, RSS.

### Assumptions & dependencies
- Content inputs (CV, project write-ups, experience facts) are supplied by Sharjeel via content-phase grill sessions before the relevant features complete.
- Third-party services (AI provider, form delivery, analytics) are operator-configured; their absence must never break core browsing (§6 Resilience).
- At least one blog post exists at launch (the meta case study, D10).

## §3 Functional requirements

### SITE — global shell & navigation

| ID | Requirement | Priority |
|---|---|---|
| FR-SITE-1 | The landing page presents, in order: Hero, Selected Work, Playground, About/Experience, Blog teaser, Contact. | Must |
| FR-SITE-2 | A persistent navigation affordance provides access to each landing section and to `/blog` from any page, including keyboard-only use. | Must |
| FR-SITE-3 | Section deep-links (URL fragments) land the visitor at the correct section with the page in a legible state. | Must |
| FR-SITE-4 | A branded 404 page exists, matching the design direction, linking back to `/` and `/blog`. | Must |
| FR-SITE-5 | A footer carries the MS® mark, name, social links (GitHub, LinkedIn, Upwork), RSS link, and a "built as a work sample" pointer to the meta case study. | Should |
| FR-SITE-6 | The site renders its core content (identity, work, about, blog text, contact details) without client-side scripting. | Must |

### HERO — first viewport (D3, D7)

| ID | Requirement | Priority |
|---|---|---|
| FR-HERO-1 | The hero presents the MS® mark, the name "Muhammad Sharjeel", the senior-engineer role line, an availability signal, and a primary contact CTA. | Must |
| FR-HERO-2 | The hero delivers a kinetic-typography signature reveal on first view; identity and role are readable within 3 seconds regardless of animation state. | Must |
| FR-HERO-3 | Under reduced motion, the hero renders a composed static (or minimally animated) variant with no information loss. | Must |
| FR-HERO-4 | A scroll affordance indicates the landing narrative continues below the fold. | Should |
| FR-HERO-5 | The hero exposes at least one accent-aware detail (mark, selection, cursor treatment). | Should |

### WORK — selected work (D10)

| ID | Requirement | Priority |
|---|---|---|
| FR-WORK-1 | Selected Work shows 4–6 curated entries drawn from: professional case studies, refreshed prior-portfolio projects, side projects/OSS, and the meta case study of this site. | Must |
| FR-WORK-2 | Each entry shows: title, a one-line outcome ("proof"), role/stack tags, and outbound links (live/GitHub) where they exist; entries without public links render without dead CTAs. | Must |
| FR-WORK-3 | Professional case studies are anonymized per the confidentiality rule — outcomes described without exposing protected client/employer specifics. | Must |
| FR-WORK-4 | Entries respond to hover/scroll with micro-interactions consistent with the design direction. | Should |
| FR-WORK-5 | One entry may receive a visually elevated "featured" treatment. | May |

### PLAY — playground (D11)

| ID | Requirement | Priority |
|---|---|---|
| FR-PLAY-1 | The Playground presents ≥3 interactive experiments at launch. | Must |
| FR-PLAY-2 | Experiments load lazily/on-idle and consume no meaningful resources until the visitor engages. | Must |
| FR-PLAY-3 | Each experiment has a non-interactive poster/fallback state for unsupported capabilities and reduced motion (motion starts only on explicit visitor action). | Must |
| FR-PLAY-4 | An experiment may link to a blog post explaining its construction. | May |

### ABOUT — about / experience (D12, D13)

| ID | Requirement | Priority |
|---|---|---|
| FR-ABOUT-1 | The About section presents role history highlights, core skills, and a short story in the confident-minimal voice, with numbers over claims. | Must |
| FR-ABOUT-2 | The CV is accessible (download or link) and its presence is verified at build time. | Must |
| FR-ABOUT-3 | The section presents "Muhammad Sharjeel" as primary name; the alternate name appears in supporting copy or metadata only. | Must |
| FR-ABOUT-4 | A "now" block (currently building/learning) may be included. | May |

### BLOG — writing (D8)

| ID | Requirement | Priority |
|---|---|---|
| FR-BLOG-1 | `/blog` lists all posts with title, date, description, tags, and reading time, newest first. | Must |
| FR-BLOG-2 | Each post lives at a stable URL `/blog/<post>` with a reading experience per the design direction: typographic rhythm, syntax-highlighted code blocks, anchorable headings. | Must |
| FR-BLOG-3 | Posts are authored as files in the repository; malformed content fails the build loudly, never ships silently broken. | Must |
| FR-BLOG-4 | An RSS feed exists and includes every published post. | Must |
| FR-BLOG-5 | The landing Blog teaser shows the latest 3 posts and hides entirely when no posts exist. | Must |
| FR-BLOG-6 | Each post shows an AI-generated TL;DR/key-takeaways block, clearly labeled as AI-generated; when unavailable the post renders without it. | Must |
| FR-BLOG-7 | Posts offer previous/next navigation. | Should |
| FR-BLOG-8 | Long posts (≥8 headings) offer a table of contents. | May |

### AI — ask-me-anything chat (D9)

| ID | Requirement | Priority |
|---|---|---|
| FR-AI-1 | An AMA chat lets visitors ask about Sharjeel's experience, skills, and work; answers are grounded exclusively in operator-provided content (CV, project write-ups, posts). | Must |
| FR-AI-2 | On questions outside its grounded knowledge, the chat says so and redirects to the contact section — it never fabricates facts about Sharjeel. | Must |
| FR-AI-3 | The chat is clearly labeled as AI-powered. | Must |
| FR-AI-4 | The chat resists abuse: per-visitor rate limiting, prompt-injection resistance, and refusal of off-topic/abusive use while staying in persona. | Must |
| FR-AI-5 | The chat works with any single configured AI provider from the supported set; with zero providers configured (or provider outage) it presents a friendly unavailable state and the rest of the site is unaffected. | Must |
| FR-AI-6 | The chat mounts as progressive enhancement (no SEO or no-JS dependency) and offers suggested starter questions. | Should |
| FR-AI-7 | Conversations are session-only: no accounts, no server-side persistence of visitor conversations beyond operational logs. | Must |

### CONTACT — conversion surface (D13)

| ID | Requirement | Priority |
|---|---|---|
| FR-CONTACT-1 | A contact form (name, email, message, optional intent: role · freelance · other) delivers submissions to Sharjeel's configured inbox. | Must |
| FR-CONTACT-2 | Success and failure are explicitly communicated; on delivery failure the visitor is offered the direct email address as fallback. | Must |
| FR-CONTACT-3 | The form is spam-protected without visible CAPTCHA friction for humans. | Must |
| FR-CONTACT-4 | Direct email, GitHub, LinkedIn, and the Upwork profile are linked; freelance-intent visitors see Upwork surfaced as an alternative channel. | Must |
| FR-CONTACT-5 | An availability signal ("available for select projects") appears in the contact section and hero; no rates are published. | Must |
| FR-CONTACT-6 | Form input is validated inline with accessible, field-level error messaging. | Must |

### THEME — accent theming (D4, D5)

| ID | Requirement | Priority |
|---|---|---|
| FR-THEME-1 | The site ships dark-only: near-black canvas, off-white type, monochrome base. | Must |
| FR-THEME-2 | Visitors can switch the accent color from a curated set of 4 (**crimson default** — amended v1.1 per ADR-0007; terminal lime, electric blue, signal amber); the switch applies live without reload. | Must |
| FR-THEME-3 | The accent choice persists across visits on the same device. | Must |
| FR-THEME-4 | Every accent-consuming surface (links, focus rings, selection, cursor details, mark accents, social cards where feasible) re-themes coherently; accent occupies < ~5% of any viewport. | Must |
| FR-THEME-5 | All four accents meet contrast requirements in every role they're used for (§6 Accessibility). | Must |

### SEO — discoverability & social (cross-cutting, D3)

| ID | Requirement | Priority |
|---|---|---|
| FR-SEO-1 | Every page has a unique title and description; posts carry correct article metadata. | Must |
| FR-SEO-2 | Every page ships Open Graph + Twitter card metadata with an MS®-branded card; posts without cover images get a generated typographic card. | Must |
| FR-SEO-3 | Structured data identifies the site owner as "Muhammad Sharjeel" with `alternateName` "Sharjeel Afzaal"; both names are present in indexable metadata. | Must |
| FR-SEO-4 | A sitemap and robots directives exist and include all public routes. | Must |
| FR-SEO-5 | Blog posts are individually indexable and canonical at their own URLs. | Must |

## §4 Key visitor journeys

**J1 — Recruiter, 60-second skim.** Lands on `/` → hero communicates identity/role/availability within 3s (FR-HERO-1/2) → scrolls Work, reads outcomes (FR-WORK-2) → checks About + CV (FR-ABOUT-2) → contacts via form or email (FR-CONTACT-1/4). Must complete without JS if needed (FR-SITE-6).

**J2 — Peer arrives on a post from search.** Lands on `/blog/<post>` → TL;DR orients them (FR-BLOG-6) → reads with code blocks + anchors (FR-BLOG-2) → previous/next or `/blog` (FR-BLOG-7/1) → subscribes via RSS (FR-BLOG-4) or explores the landing.

**J3 — Freelance client qualifies Sharjeel.** Lands on `/` → availability signal (FR-CONTACT-5) → Work proof (FR-WORK-1..3) → asks the AMA about relevant experience (FR-AI-1) → submits form with freelance intent or goes to Upwork (FR-CONTACT-1/4).

**J4 — Curious visitor plays.** Explores Playground experiments (FR-PLAY-1..3) → switches accent color (FR-THEME-2) → asks the AMA something out of scope and gets an honest redirect (FR-AI-2).

## §5 Error handling & edge cases

| ID | Scenario | Expected behavior |
|---|---|---|
| EC-SITE-1 | JS disabled/failed | Core content and contact details render; enhanced surfaces (AMA, experiments, accent switcher) degrade invisibly (FR-SITE-6) |
| EC-SITE-2 | Unknown URL | Branded 404 (FR-SITE-4) |
| EC-HERO-1 | Reduced motion | Static composed hero (FR-HERO-3) |
| EC-HERO-2 | Slow connection / font delay | No layout shift; fallback metrics reserve space |
| EC-HERO-3 | Viewport < 360px | Display type scales, no horizontal overflow |
| EC-WORK-1 | Entry without public link | No dead CTA; "private engagement" label (FR-WORK-2) |
| EC-WORK-2 | Missing media | Typographic fallback card holds layout |
| EC-PLAY-1 | Capability unsupported (e.g. no canvas/GPU) | Poster state, no crash (FR-PLAY-3) |
| EC-PLAY-2 | Low-end device | Experiments idle until engaged; main thread responsive (FR-PLAY-2) |
| EC-ABOUT-1 | CV asset missing | Build fails (FR-ABOUT-2) |
| EC-BLOG-1 | Zero posts | Teaser hides; `/blog` shows composed empty state (FR-BLOG-5) |
| EC-BLOG-2 | Post without cover image | Generated typographic social card (FR-SEO-2) |
| EC-BLOG-3 | Malformed post file | Build fails loudly (FR-BLOG-3) |
| EC-BLOG-4 | TL;DR generation unavailable | Post renders without block (FR-BLOG-6) |
| EC-AI-1 | Provider outage / no key configured | Friendly unavailable state; site unaffected (FR-AI-5) |
| EC-AI-2 | Off-topic or abusive prompts | Polite in-persona refusal (FR-AI-4) |
| EC-AI-3 | Question outside grounded content | Honest "I don't have that" + contact redirect (FR-AI-2) |
| EC-AI-4 | Rapid-fire requests | Rate limit with clear message (FR-AI-4) |
| EC-CONTACT-1 | Delivery provider failure | Explicit failure + mailto fallback (FR-CONTACT-2) |
| EC-CONTACT-2 | Bot submission | Silently filtered; humans unaffected (FR-CONTACT-3) |
| EC-CONTACT-3 | Invalid input | Inline accessible errors (FR-CONTACT-6) |
| EC-THEME-1 | Stored accent value invalid/corrupt | Falls back to default accent |
| EC-THEME-2 | First visit, no stored preference | Terminal lime default (FR-THEME-2) |

## §6 Non-functional requirements

### Performance (the site is a work sample)
- **NFR-PERF-1 (Must):** Landing and post pages score **≥90 Performance (mobile)** in Lighthouse on the production deployment.
- **NFR-PERF-2 (Must):** Core Web Vitals on production: **LCP ≤ 2.5s**, **CLS < 0.1**, **INP < 200ms** on a mid-tier mobile profile.
- **NFR-PERF-3 (Must):** Scroll-driven motion sustains ~60fps on mid-tier hardware; animation work never blocks input.
- **NFR-PERF-4 (Should):** Initial script payload on first view of the landing ≤ 200 KB compressed; enhanced surfaces (AMA, experiments) load on demand.

### Accessibility
- **NFR-A11Y-1 (Must):** WCAG 2.2 AA: semantic structure, landmarks, labels, focus management.
- **NFR-A11Y-2 (Must):** Full keyboard operability with visible focus, including nav, accent switcher, form, chat, and experiments (or their fallbacks).
- **NFR-A11Y-3 (Must):** Text contrast ≥ 4.5:1 (body) / 3:1 (large text) on the dark palette; accents that fail contrast in a role are not used in that role.
- **NFR-A11Y-4 (Must):** `prefers-reduced-motion` is honored globally — no parallax/scrub/kinetic sequences; content parity preserved.

### SEO & social
- **NFR-SEO-1 (Must):** Searches for "Muhammad Sharjeel" and "Sharjeel Afzaal" both resolve to the site (structured data + metadata per FR-SEO-3).
- **NFR-SEO-2 (Must):** All FR-SEO requirements validated pre-release with automated checks (metadata presence, sitemap, feed validity).

### Resilience & security
- **NFR-RES-1 (Must):** No third-party outage (AI provider, form delivery, analytics) breaks core browsing.
- **NFR-SEC-1 (Must):** All secrets are server-side only; nothing sensitive ships to the client.
- **NFR-SEC-2 (Must):** AI and contact endpoints are rate-limited and validate input at the boundary.
- **NFR-PRIV-1 (Should):** Analytics, if any, are privacy-respecting (no invasive tracking, no consent-wall needed).

### Operability (solo-maintainer constraints)
- **NFR-OPS-1 (Must):** AI features operate with any **one** configured provider key from the supported set (provider auto-detected; explicit override supported); zero keys → graceful degradation (FR-AI-5).
- **NFR-OPS-2 (Must):** All environment configuration flows through a central config module and is documented in the env example file.
- **NFR-OPS-3 (Must):** Publishing a post requires only adding a content file — no code changes.
- **NFR-OPS-4 (Should):** TL;DR generation happens at build/publish time, not per visitor request.

## §7 Spikes & open technical questions

| Question | Disposition |
|---|---|
| Can the kinetic-typography hero hold its performance budget (NFR-PERF-2/3) on low-end mobile? | Spike candidate (`S001`) if tech discovery can't answer from prior art |
| AMA grounding quality — does a single-prompt grounding pack suffice at v1 content volume, or is retrieval needed? | Resolve in tech discovery (`ai_features`); spike only if measurement required |

## §8 Out of scope for v1

**Never / not planned:** blog comments; i18n; full old-site content migration.

**Deferred (revisit in v2+):** per-project case-study pages (`/work/<slug>`); semantic blog search (needs 10+ posts); generative visual (Playground candidate); light mode (blog readability permitting); headless CMS; newsletter.

## §9 Traceability

| Decision | Realized by |
|---|---|
| D1 Hybrid structure | FR-SITE-1..3, FR-BLOG-1/2/5 |
| D2 Design direction | FR-HERO-2/5, FR-WORK-4, design contract in every feature; NFR-PERF-3 |
| D3 MS® mark, name policy | FR-HERO-1, FR-ABOUT-3, FR-SEO-2/3, FR-SITE-5 |
| D4 Dark-only + accent | FR-THEME-1/4/5, NFR-A11Y-3 |
| D5 Visitor-selectable accent | FR-THEME-2..5, EC-THEME-1/2 |
| D6 Typography system | FR-HERO-2, FR-BLOG-2 (type-led design contract; faces chosen in tech discovery/brand board) |
| D7 Kinetic hero | FR-HERO-2..4, EC-HERO-1..3, NFR-A11Y-4 |
| D8 MDX-in-repo blog | FR-BLOG-1..5/7/8, NFR-OPS-3, EC-BLOG-1..3 |
| D9 AI: AMA + TL;DR | FR-AI-1..7, FR-BLOG-6, NFR-OPS-1/4, EC-AI-1..4, EC-BLOG-4 |
| D10 Work sources | FR-WORK-1..3, FR-SITE-5 (meta case study) |
| D11 Playground | FR-PLAY-1..4, EC-PLAY-1/2 |
| D12 Confident-minimal voice | FR-ABOUT-1 + copy standard across all features |
| D13 Conversion surface | FR-CONTACT-1..6, FR-HERO-1, EC-CONTACT-1..3 |

## §10 Definition of done — release 1.0.0

1. Every **Must** FR implemented and covered by tests written before implementation (TDD), including edge cases in §5.
2. All NFR budgets validated **against the production deployment**: Lighthouse/CWV (NFR-PERF-1/2), a11y audit (NFR-A11Y-1..4), SEO checks (NFR-SEO-2).
3. Zero configured AI keys and provider-outage paths manually verified (FR-AI-5, EC-AI-1).
4. Contact delivery verified end-to-end to the real inbox, including the failure fallback.
5. At least one published post (the meta case study) live with TL;DR, RSS, and social card.
6. All spikes for the release `done` (human-approved) or explicitly deferred.
7. Architecture docs current (`Last verified` ≤ 30 days); `/validate --pre-merge` passes.
8. Code merged to `main`, tagged `1.0.0`, production deployment healthy with the platform domain assigned.
