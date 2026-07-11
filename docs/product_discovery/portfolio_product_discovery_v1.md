# Portfolio Product Discovery — v1

> 🚧 **DRAFT — scope not yet locked**
> Next stage on lock: `docs/fsd/portfolio_fsd_v1.md`
> Target release: **1.0.0**

**Owner:** @isharjeeldd · **Created:** 2026-07-11 · **Updated:** 2026-07-11

## Table of Contents

1. [Changelog](#changelog)
2. [Vision & Positioning](#vision--positioning)
3. [Design Direction](#design-direction)
4. [Decisions](#decisions)
5. [Feature Scope](#feature-scope)
6. [Cross-cutting Visitor Experience](#cross-cutting-visitor-experience)
7. [Out of Scope for v1](#out-of-scope-for-v1)

## Changelog

### 1.0.0 — July 2026
- Changed: primary display name is **Muhammad Sharjeel** (per CNIC); brand mark becomes **MS®**. "Sharjeel Afzaal" is retained as alternate name for SEO and domain continuity (`sharjeelafzaal.com`).
- Added: initial product discovery for the new portfolio, derived from design-inspiration research (awwwards) and the grill sessions of 2026-07-11.

## Vision & Positioning

The portfolio presents **Muhammad Sharjeel — senior software engineer** (professionally also known as Sharjeel Afzaal; both names must resolve to him in search) — to three audiences: recruiters/hiring managers, engineering peers (via the blog), and prospective freelance clients. Positioning is a deliberate hybrid:

- **Primary:** senior engineer, open to opportunities — craft-first showcase, "get in touch" conversion.
- **Secondary:** selectively available for freelance/contract work — an understated availability signal; no rates published; the contact form qualifies intent.
- **Long-game:** the brand is built to grow into an independent studio/business later — hence a mark-led identity (MS®) rather than a purely personal one.

The site itself must function as a **work sample**: its performance, accessibility, and interaction craft are part of the message.

**Voice:** confident minimal — short declarative lines, no hype adjectives, numbers over claims. *Proof, not adjectives.*

## Design Direction

**Direction: dark editorial minimalism with engineered motion.**

Locked inspiration references (researched 2026-07-11):

| Reference | What we take from it |
|---|---|
| [OBSCURA](https://obscurastudio.webflow.io/) | Monochrome restraint, airy modular grid, type-scale hierarchy, "studio" exclusivity |
| [Elliott Mangham](https://elliott.mangham.dev/) ([SOTD Dec 2025](https://www.awwwards.com/sites/elliott-mangham)) | One-page narrative, credibility engineering (awards/metrics), meticulous micro-interactions, information-dense-yet-breathing |
| [Roshan Sahu](https://www.roshan-sahu.com/) | Dark-mode developer aesthetic, scroll-driven reveals, the Playground section |
| [TRIONN](https://trionn.com/) | Bold geometric display type, one playful signature interaction, premium-yet-approachable mood |

What visitors should feel: *this person engineers experiences with restraint and precision.* One or two unforgettable moments; everything else calm, fast, and typographic.

## Decisions

| # | Decision |
|---|---|
| **D1** | **Hybrid structure.** One-page scroll-narrative landing (Hero → Selected Work → Playground → About/Experience → Blog teaser → Contact) plus dedicated routes `/blog` and `/blog/<post>`. Per-project case-study pages are deferred (see Out of Scope). |
| **D2** | **Design direction** is dark editorial minimalism with engineered motion, per the four locked inspiration references above. |
| **D3** | **Brand mark is monogram-led: MS®** (from *Muhammad Sharjeel*, the primary display name per CNIC). The mark leads nav/favicon/social cards; the full name appears secondary (hero, metadata, SEO). "Sharjeel Afzaal" is the alternate name — kept in metadata/structured data so existing searches and `sharjeelafzaal.com` continuity hold. Chosen to scale into a future studio brand. |
| **D4** | **Dark-only theme; monochrome base + one electric accent.** Near-black canvas, off-white type, accent used sparingly (< ~5% of any viewport). |
| **D5** | **Visitor-selectable accent.** The accent color is themeable by the visitor from a curated set (~4 options: terminal lime *(default)*, electric blue, signal amber, crimson); choice persists across visits. This doubles as a signature micro-delight. |
| **D6** | **Typography: geometric grotesque display** for hero/section headings; clean sans for body; monospace accents for code/labels/terminal flavor. |
| **D7** | **Hero signature moment: kinetic typography** — an engineered type reveal (staggered/scroll-scrubbed/magnetic), not WebGL. Must degrade gracefully under reduced-motion. |
| **D8** | **Blog is authored as MDX files in the repo** — versioned with the site, full code-block control, no CMS vendor in v1. |
| **D9** | **AI touches in v1: (a)** an "ask-me-anything" chat grounded in Sharjeel's CV, projects, and posts; **(b)** AI-generated TL;DR/key-takeaways blocks on blog posts. Semantic blog search and a generative visual are deferred (generative visual is a Playground-experiment candidate). |
| **D10** | **Selected Work draws from four sources:** professional work as outcome-focused case studies (anonymized as needed), refreshed best projects from portfolio-dd, side projects/OSS, and a meta case study of this portfolio's own build. |
| **D11** | **Playground section** exists on the landing page: small interactive experiments demonstrating engineering craft. |
| **D12** | **Voice: confident minimal** across all copy. |
| **D13** | **Conversion surface:** primary CTA "get in touch" (form + direct email/socials); understated "available for select projects" signal; **no rates published**; CV available. |

## Feature Scope

Language: **must** = non-negotiable for 1.0.0 · **should** = strongly recommended · **may** = nice-to-have.

### F-A. Hero / Landing

The first viewport: MS® mark, name (*Muhammad Sharjeel*) + role, the kinetic-typography signature moment, availability signal, primary CTA, scroll affordance.

- Must: kinetic type reveal on load and/or scroll; identity + role readable within 3 seconds regardless of animation state.
- Must: reduced-motion visitors get a composed static (or minimally animated) hero.
- Should: subtle accent-aware details (cursor, selection, mark).
- May: easter-egg interaction on the mark.

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| `prefers-reduced-motion` | No kinetic sequence; content immediately legible | Static composition fallback |
| JS disabled / failed | Name, role, CTA still render | Server-rendered content, CSS-only baseline |
| Slow connection | No layout shift while fonts/anim load | Font fallback metrics, reserved space |
| Tiny viewport (<360px) | Display type scales without overflow | Fluid type scale floor |

### F-B. Selected Work

Curated project showcase on the landing page (target 4–6 entries at launch, per D10).

- Must: each entry shows title, one-line outcome ("proof"), role/stack tags, and links out (live/GitHub) where they exist.
- Must: professional case studies respect confidentiality — anonymize client/employer specifics as needed.
- Should: hover/scroll micro-interactions per the design direction.
- May: featured entry treatment for the strongest project.

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| Project has no public link | Entry renders without a dead CTA | Link block omitted, "private engagement" label |
| Image/media missing | Layout holds | Typographic fallback card |
| NDA-sensitive detail | Outcome described without naming client | Anonymization rule in content guidelines |

### F-C. Playground

Grid of small interactive experiments (target ≥3 at launch), each runnable in place or on hover/press.

- Must: experiments never degrade page performance for visitors who don't engage them (lazy/idle mounting).
- Should: one experiment may be the deferred generative visual (D9).
- May: each experiment links to a blog post explaining it.

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| Experiment WebGL/canvas unsupported | Card shows poster state, no crash | Capability detection + fallback |
| Reduced motion | Experiments start paused with explicit play | Opt-in interaction |
| Low-end device | Main thread stays responsive | Idle mounting, frame budget |

### F-D. About / Experience

Story, experience timeline, skills — confident-minimal register; a human touch (photo or personal notes) balancing the SA® studio energy.

- Must: role history and core stack visible; CV accessible (download or link).
- Should: numbers over claims (years, scale, outcomes).
- May: "now" section (currently learning/building).

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| CV file missing/moved | No broken link ships | Build-time asset check |
| Very long history | Section stays scannable | Curate to highlights, full detail in CV |

### F-E. Blog

MDX-authored technical writing (D8). Routes: `/blog` (listing) and `/blog/<post>` (reading experience). Landing page teases the latest posts (target 3).

- Must: listing with title/date/description/tags; reading view with typographic rhythm, first-class code blocks (syntax highlighting), heading anchors.
- Must: each post carries correct metadata + social card; RSS feed exists; posts are individually indexable.
- Must: AI TL;DR block per post (D9b) — clearly labeled as AI-generated, gracefully absent if unavailable.
- Should: reading time, previous/next navigation.
- May: per-post accent override, table of contents on long posts.

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| Zero posts at launch | Blog surfaces don't look broken | Landing teaser hides; `/blog` shows a composed empty state (or launch ships with ≥1 post: the meta case study, D10) |
| Post has no cover image | Listing + social card still composed | Generated typographic OG card |
| Malformed MDX | Site build fails loudly, not silently | Build-time content validation |
| TL;DR generation fails | Post renders without the block | Optional block, no runtime dependency for reading |

### F-F. Ask-Me-Anything Chat (AI)

A chat surface grounded in Sharjeel's CV, project write-ups, and blog posts (D9a). Visitors interview the portfolio.

- Must: answers grounded in provided content; on unknown topics it says so and redirects to contact — it must not fabricate facts about Sharjeel.
- Must: clearly labeled as AI; abuse-resistant (rate limiting, prompt-injection resistance, topic guardrails); degrades gracefully when the AI service is unavailable.
- Should: suggested starter questions; conversation stays on-page (no account, no persistence beyond the session).
- May: recruiter-oriented quick actions ("summarize experience with X").

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| AI service down / quota hit | Chat shows friendly unavailable state; rest of site unaffected | Isolated feature boundary |
| Off-topic/abusive prompts | Polite refusal, stays in persona | Guardrail instructions + moderation |
| Question outside known content | "I don't have that — ask Sharjeel directly" + contact link | Grounding rule |
| Crawler/no-JS | Chat is progressive enhancement; no SEO dependency | Lazy-mounted island |

### F-G. Contact

Landing-page section + persistent nav affordance: form (name/email/message + optional intent: role · freelance · other), direct email, socials (GitHub, LinkedIn), availability signal (D13).

- Must: form delivers reliably to Sharjeel; success and failure states are explicit; spam-protected without visible CAPTCHA friction.
- Should: intent field routes/labels the message.
- May: calendar link for calls.

| Scenario | Expected Behavior | Resolution |
|---|---|---|
| Delivery provider fails | Visitor sees failure + direct email fallback | Error state with mailto |
| Spam/bot submissions | Filtered without punishing humans | Honeypot + timing + provider checks |
| Invalid input | Inline, accessible validation | Field-level errors |

## Cross-cutting Visitor Experience

- **Accent theming (D5) — must:** curated accent set, default terminal lime; switch applies live without reload; persists across visits; all interactive states re-theme coherently.
- **Performance — must:** the site *is* a work sample. Fast first load, no jank in scroll-driven motion, animations don't tax low-end devices. Concrete budgets set in the FSD.
- **Accessibility — must:** semantic structure, full keyboard navigation, visible focus, contrast within the dark palette, `prefers-reduced-motion` respected everywhere.
- **SEO / social — must:** correct metadata + Open Graph/Twitter cards on every page (MS®-branded, accent-aware), sitemap, RSS. Name-search must find the site for **both** "Muhammad Sharjeel" and "Sharjeel Afzaal" (structured-data `alternateName`, metadata keywords).
- **Resilience — should:** no third-party outage (AI, form delivery, analytics) may break core browsing.

## Out of Scope for v1

| Item | Why | Revisit |
|---|---|---|
| Per-project case-study pages (`/work/<slug>`) | Landing-page entries suffice at launch; deep case studies need dedicated content effort | v1.x / v2 |
| Semantic blog search | Pays off only at 10+ posts | v2 |
| Generative visual as a hero element | Hero is kinetic typography (D7); generative visual survives only as a Playground-experiment candidate | v2 |
| Light mode | Dark-only is the brand (D4) | v2, if reader feedback demands it for blog |
| Headless CMS | MDX-in-repo is sufficient for a solo author (D8) | v2 if authoring friction appears |
| Newsletter / subscriptions | Audience-building deferred; RSS covers early adopters | v2 |
| Blog comments | Moderation cost; socials fill the gap | not planned |
| i18n | English-only audience | not planned |
| Old-site content migration beyond selected projects | Fresh start; portfolio-dd stays archived on GitHub | — |

---

*On lock, this document is frozen. Scope changes go into `portfolio_product_discovery_v2.md`. Next artifact: `docs/fsd/portfolio_fsd_v1.md`.*
