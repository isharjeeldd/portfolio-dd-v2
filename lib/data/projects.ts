/**
 * Selected Work content (FR-WORK-1..3) — owner-curated 2026-07-11.
 * Outcome lines follow the voice rule: proof, not adjectives. Draft copy
 * pending owner-supplied numbers (release-gated review, see F007).
 */
export type Project = {
  slug: string;
  title: string;
  outcome: string;
  role: string;
  stack: string[];
  links: { live?: string; github?: string; post?: string };
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "polyx",
    title: "PolyX",
    outcome:
      "Tenant-aware microservices platform — one trust model across auth, logging, alerts, billing, and API tooling.",
    role: "Platform engineering",
    stack: ["Node.js", "Next.js", "TypeScript", "MongoDB", "Redis", "Docker"],
    links: {
      github: "https://github.com/issmai/poly-x",
      live: "https://poly-x-alpha.vercel.app/sign-in",
    },
    featured: true,
  },
  {
    slug: "alara",
    title: "Alara AI Agents",
    outcome:
      "RBAC, conversational flow builder, and omni-channel chat for an enterprise AI agent platform.",
    role: "Frontend engineering",
    stack: ["React", "TypeScript", "Zustand", "Chakra UI"],
    links: {
      github: "https://github.com/issmai/alara-ui",
      live: "https://alara-agents-dev.vercel.app/sign-in",
    },
    featured: true,
  },
  {
    slug: "digital-eye",
    title: "Digital Eye",
    outcome:
      "Frontend for AI-powered surveillance — real-time video feed monitoring behind a secure dashboard.",
    role: "Frontend engineering",
    stack: ["React", "Next.js", "TypeScript"],
    links: {
      github: "https://github.com/issmai/digital-eye-ui",
      live: "https://digital-eye-dashboard-ui.vercel.app/sign-in",
    },
    featured: true,
  },
  {
    slug: "hallocasa",
    title: "HalloCasa",
    outcome:
      "Multilingual, multi-currency property search and broker profiles for a cross-border real-estate platform.",
    role: "Full-stack engineering",
    stack: ["Next.js", "TypeScript", "Redux Toolkit", "Material UI"],
    links: {
      live: "https://hallocasa.com/brokers?lang=en-US&curr=USD",
    },
    featured: true,
  },
  {
    slug: "onit",
    title: "ONIT IoT",
    outcome:
      "ERP and control modules for real-time IoT monitoring, modeling complex device data across GraphDB and MongoDB.",
    role: "Frontend engineering",
    stack: ["React", "TypeScript", "GraphDB", "MongoDB"],
    links: {
      live: "https://app.onitnetwork.com/#ONIT",
    },
    featured: true,
  },
  {
    slug: "portfolio-dd-v2",
    title: "This portfolio",
    outcome:
      "Docs-first build in public: locked spec, seven ADRs, TDD, provider-agnostic AI — the process is the work sample.",
    role: "Everything",
    stack: ["Next.js", "TypeScript", "Tailwind", "GSAP", "AI SDK"],
    links: {
      github: "https://github.com/isharjeeldd/portfolio-dd-v2",
      post: "/blog/why-this-portfolio-has-a-docs-folder",
    },
    featured: true,
  },
  {
    slug: "wai-industries",
    title: "wAI Industries",
    outcome: "Official site for an AI consulting and product firm.",
    role: "Design + build",
    stack: ["Next.js", "Tailwind"],
    links: { live: "https://www.waiindustries.com" },
    featured: false,
  },
  {
    slug: "synerge",
    title: "Synerge",
    outcome: "Client-facing interfaces for a freelancer hiring platform.",
    role: "Frontend engineering",
    stack: ["React", "Material UI", "Redux"],
    links: { live: "https://app.synerge.io/auth/client-landing-page" },
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const secondaryProjects = projects.filter((project) => !project.featured);
