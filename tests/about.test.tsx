// F008 — about/experience tests (FR-ABOUT-1..3)
import { existsSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/about/about-section";
import { orderedRoles, type Role } from "@/lib/data/experience";

describe("AboutSection", () => {
  it("renders both roles with the confirmed title and periods", () => {
    render(<AboutSection />);

    expect(
      screen.getByRole("heading", { name: /Senior Software Engineer · ISSM\.AI/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Mar 2024 — Present/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /MERN Stack Developer · CodeFrenetics/ }),
    ).toBeInTheDocument();
  });

  it("renders the education entry", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("heading", { name: /BS Computer Science/ }),
    ).toBeInTheDocument();
  });

  it("links the downloadable CV (FR-ABOUT-2)", () => {
    render(<AboutSection />);
    const cv = screen.getByRole("link", { name: /download cv/i });
    expect(cv).toHaveAttribute("href", "/cv.pdf");
    expect(cv).toHaveAttribute("download");
  });

  it("shows only the primary name (FR-ABOUT-3)", () => {
    render(<AboutSection />);
    expect(screen.getByText(/Muhammad Sharjeel/)).toBeInTheDocument();
    expect(screen.queryByText(/Sharjeel Afzaal/)).not.toBeInTheDocument();
  });

  it("renders all skill groups", () => {
    render(<AboutSection />);
    for (const label of ["Frontend", "Backend", "Platform", "AI"]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }
  });
});

describe("experience data", () => {
  it("orders roles most-recent-first regardless of input order (edge)", () => {
    const shuffled: Role[] = [
      { company: "Old", role: "r", period: "p", start: "2019-01-01", location: "l", highlights: [] },
      { company: "New", role: "r", period: "p", start: "2025-01-01", location: "l", highlights: [] },
    ];
    expect(orderedRoles(shuffled)[0].company).toBe("New");
  });
});

describe("CV asset (FR-ABOUT-2 build guard)", () => {
  it("exists at public/cv.pdf", () => {
    expect(existsSync("public/cv.pdf")).toBe(true);
  });
});
