/**
 * Experience content (FR-ABOUT-1..3) — grill-confirmed 2026-07-11.
 * Title: Senior Software Engineer (owner decision). Highlight metrics are
 * draft pending owner numbers (release-gated, see F008).
 */
export type Role = {
  company: string;
  role: string;
  period: string;
  start: string; // ISO, for ordering
  location: string;
  highlights: string[];
};

export const roles: Role[] = [
  {
    company: "ISSM.AI",
    role: "Senior Software Engineer",
    period: "Mar 2024 — Present",
    start: "2024-03-01",
    location: "Islamabad · hybrid",
    highlights: [
      "Alara — enterprise AI agent platform: RBAC, conversational flow builder, journeys, omni-channel chat, analytics.",
      "PolyX — five-engineer microservices platform: auth/RBAC, centralized logging, notifications, subscriptions.",
      "PolyApi — Postman-style API workbench: collections, tabbed requests, real-time responses.",
    ],
  },
  {
    company: "CodeFrenetics",
    role: "MERN Stack Developer",
    period: "Aug 2021 — Mar 2024",
    start: "2021-08-01",
    location: "Islamabad · on-site",
    highlights: [
      "HalloCasa — cross-border real-estate platform: multilingual, multi-currency search and broker profiles.",
      "ONIT — IoT control and monitoring: ERP modules over GraphDB and MongoDB.",
      "Synerge — freelancer platform client interfaces with Stripe integration.",
    ],
  },
];

export const education = {
  institution: "National University of Modern Languages",
  degree: "BS Computer Science",
  period: "2017 — 2021",
  note: "Final-year project: neural style transfer on Android.",
};

export const skillGroups: { label: string; items: string[] }[] = [
  {
    label: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "MongoDB", "Redis", "REST APIs"],
  },
  {
    label: "Platform",
    items: ["Docker", "NGINX", "Vercel", "CI/CD", "Microservices"],
  },
  {
    label: "AI",
    items: ["LLM integration", "AI SDK", "Agent platforms", "RAG basics"],
  },
];

/** Most-recent-first regardless of array order. */
export function orderedRoles(list: readonly Role[] = roles): Role[] {
  return [...list].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
  );
}
