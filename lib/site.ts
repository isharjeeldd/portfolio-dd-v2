/**
 * Site-wide constants — the single source for identity facts and links.
 * Display name policy per ADR-0007 / discovery D3: "Muhammad Sharjeel" is
 * primary everywhere; "Sharjeel Afzaal" is the alternate name kept for
 * SEO/domain continuity (structured data `alternateName`, metadata keywords).
 */
export const site = {
  /** Canonical origin — swapped to the custom domain at cutover (post-launch). */
  url: "https://portfolio-dd-v2-sharjeels-projects-22ea7cbd.vercel.app",
  name: "Muhammad Sharjeel",
  alternateName: "Sharjeel Afzaal",
  role: "Senior Software Engineer",
  mark: "MS",
  availability: "Available for select projects",
  email: "sharjeelafzaal123@gmail.com",
  repo: "https://github.com/isharjeeldd/portfolio-dd-v2",
  socials: {
    github: "https://github.com/isharjeeldd",
    linkedin: "https://www.linkedin.com/in/muhammad-sharjeel-254a48108/",
    upwork: "https://www.upwork.com/freelancers/~010ece6ddbb7345ea6",
  },
} as const;

/** Landing-page section anchors in narrative order (FR-SITE-1). */
export const sections = [
  { id: "work", label: "Work" },
  { id: "playground", label: "Playground" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
