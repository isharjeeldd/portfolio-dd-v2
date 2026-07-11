// F003 — navigation & deep-link tests (FR-SITE-2/3)
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@gsap/react", () => ({ useGSAP: () => {} }));
vi.mock("gsap", () => ({ default: { registerPlugin: () => {}, matchMedia: () => ({ add: () => {}, revert: () => {} }) } }));
vi.mock("gsap/SplitText", () => ({ SplitText: class {} }));

import Home from "@/app/page";
import { Header } from "@/components/layout/header";
import { sections } from "@/lib/site";

describe("Header navigation (FR-SITE-2)", () => {
  it("renders every section link on all viewports (no responsive hiding)", () => {
    render(<Header />);
    for (const section of sections) {
      const link = screen.getByRole("link", { name: section.label });
      expect(link).toHaveAttribute("href", `/#${section.id}`);
      expect(link.closest("li")?.className ?? "").not.toMatch(/hidden/);
    }
  });

  it("scrolls inside its own container instead of the page (EC: 320px)", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.className).toMatch(/overflow-x-auto/);
  });
});

describe("Section deep-links (FR-SITE-3)", () => {
  it("gives every anchored landing section a sticky-header scroll offset", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

    const { container } = render(<Home />);

    for (const id of ["hero", ...sections.map((s) => s.id)]) {
      const section = container.querySelector(`#${id}`);
      expect(section, `section #${id} exists`).not.toBeNull();
      expect(section!.className, `section #${id} has scroll offset`).toMatch(/scroll-mt-/);
    }

    vi.unstubAllGlobals();
  });
});
