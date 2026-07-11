// F002 — kinetic hero tests (FR-HERO-1..4, EC-HERO-1)
import { render, screen, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// GSAP animates in a real browser; in jsdom we assert the rendered
// contract and motion gating, not tween output.
vi.mock("@gsap/react", () => ({ useGSAP: () => {} }));
vi.mock("gsap", () => ({ default: { registerPlugin: () => {}, matchMedia: () => ({ add: () => {}, revert: () => {} }) } }));
vi.mock("gsap/SplitText", () => ({ SplitText: class {} }));

import { Hero } from "@/components/hero/hero";
import { usePrefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

type MediaListener = (event: { matches: boolean }) => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<MediaListener>();
  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, listener: MediaListener) => listeners.add(listener),
    removeEventListener: (_: string, listener: MediaListener) => listeners.delete(listener),
  };
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));
  return {
    setMatches(next: boolean) {
      mql.matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("Hero content (FR-HERO-1, FR-SITE-6)", () => {
  it("renders identity, role, availability, and the contact CTA", () => {
    mockMatchMedia(false);
    render(<Hero />);

    expect(
      screen.getByRole("heading", { level: 1, name: new RegExp(site.name) }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(site.role))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(site.availability))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("renders a scroll affordance (FR-HERO-4)", () => {
    mockMatchMedia(false);
    render(<Hero />);
    expect(screen.getByText(/scroll/i)).toBeInTheDocument();
  });
});

describe("Motion gating (FR-HERO-2/3, EC-HERO-1)", () => {
  it("marks the hero data-motion='full' when motion is allowed", () => {
    mockMatchMedia(false);
    render(<Hero />);
    expect(screen.getByTestId("hero")).toHaveAttribute("data-motion", "full");
  });

  it("marks the hero data-motion='reduced' under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    render(<Hero />);
    expect(screen.getByTestId("hero")).toHaveAttribute("data-motion", "reduced");
  });
});

describe("usePrefersReducedMotion", () => {
  function Probe() {
    const reduced = usePrefersReducedMotion();
    return <span data-testid="probe">{reduced ? "reduced" : "full"}</span>;
  }

  it("tracks media query changes live", () => {
    const media = mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("full");

    act(() => media.setMatches(true));
    expect(screen.getByTestId("probe")).toHaveTextContent("reduced");
  });

  it("defaults to full motion when matchMedia is unavailable (edge)", () => {
    vi.stubGlobal("matchMedia", undefined);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("full");
  });
});
