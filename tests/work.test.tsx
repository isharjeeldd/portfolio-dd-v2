// F007 — selected work tests (FR-WORK-1..3, EC-WORK-1)
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkSection } from "@/components/work/work-section";
import { featuredProjects, projects, secondaryProjects } from "@/lib/data/projects";

describe("projects data (content guard)", () => {
  it("has six featured entries and unique slugs", () => {
    expect(featuredProjects).toHaveLength(6);
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry carries a non-empty title, outcome, role, and stack", () => {
    for (const project of projects) {
      expect(project.title.trim()).not.toBe("");
      expect(project.outcome.trim()).not.toBe("");
      expect(project.role.trim()).not.toBe("");
      expect(project.stack.length).toBeGreaterThan(0);
    }
  });
});

describe("WorkSection (FR-WORK-1/2)", () => {
  it("renders all six featured entries", () => {
    render(<WorkSection />);
    for (const project of featuredProjects) {
      expect(
        screen.getByRole("heading", { level: 3, name: project.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders PolyX with outcome, stack tags, and both links", () => {
    render(<WorkSection />);
    const article = screen
      .getByRole("heading", { level: 3, name: "PolyX" })
      .closest("article")!;

    expect(within(article).getByText(/one trust model/i)).toBeInTheDocument();
    expect(within(article).getByText(/Node\.js · Next\.js/)).toBeInTheDocument();
    expect(within(article).getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/issmai/poly-x",
    );
    expect(within(article).getByRole("link", { name: /live/i })).toBeInTheDocument();
  });

  it("renders no GitHub CTA for entries without one (EC-WORK-1)", () => {
    render(<WorkSection />);
    const article = screen
      .getByRole("heading", { level: 3, name: "HalloCasa" })
      .closest("article")!;

    expect(within(article).queryByRole("link", { name: /github/i })).toBeNull();
    expect(within(article).getByRole("link", { name: /live/i })).toBeInTheDocument();
  });

  it("links the meta entry to the repo and the case-study post", () => {
    render(<WorkSection />);
    const article = screen
      .getByRole("heading", { level: 3, name: "This portfolio" })
      .closest("article")!;

    expect(within(article).getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/isharjeeldd/portfolio-dd-v2",
    );
    expect(within(article).getByRole("link", { name: /case study/i })).toHaveAttribute(
      "href",
      "/blog/why-this-portfolio-has-a-docs-folder",
    );
  });

  it("renders the secondary row with live links", () => {
    render(<WorkSection />);
    for (const project of secondaryProjects) {
      expect(screen.getByText(new RegExp(project.title))).toBeInTheDocument();
    }
  });
});
