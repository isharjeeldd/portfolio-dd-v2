// F009 — playground tests (FR-PLAY-1..3, EC-PLAY-1)
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/playground/experiments", () => ({
  experiments: [
    {
      slug: "one",
      title: "One",
      description: "First experiment.",
      Component: () => <span data-testid="mounted-one">mounted one</span>,
    },
    {
      slug: "two",
      title: "Two",
      description: "Second experiment.",
      Component: () => <span data-testid="mounted-two">mounted two</span>,
    },
    {
      slug: "three",
      title: "Three",
      description: "Third experiment.",
      Component: () => <span data-testid="mounted-three">mounted three</span>,
    },
  ],
}));

import { PlaygroundSection } from "@/components/playground/playground-section";

describe("PlaygroundSection (FR-PLAY-1/2)", () => {
  it("renders three poster cards and mounts nothing initially", () => {
    render(<PlaygroundSection />);

    expect(screen.getAllByRole("button", { name: /run/i })).toHaveLength(3);
    expect(screen.queryByTestId(/mounted-/)).not.toBeInTheDocument();
  });

  it("mounts only the experiment that was run (FR-PLAY-3 opt-in)", async () => {
    const user = userEvent.setup();
    render(<PlaygroundSection />);

    const card = screen.getByRole("heading", { name: "Two" }).closest("article")!;
    await user.click(within(card).getByRole("button", { name: /run/i }));

    expect(screen.getByTestId("mounted-two")).toBeInTheDocument();
    expect(screen.queryByTestId("mounted-one")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mounted-three")).not.toBeInTheDocument();
  });
});

describe("experiment registry (content guard)", () => {
  it("has unique slugs and non-empty copy", async () => {
    const { experiments } = await vi.importActual<
      typeof import("@/components/playground/experiments")
    >("@/components/playground/experiments");

    expect(experiments).toHaveLength(3);
    const slugs = experiments.map((experiment) => experiment.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const experiment of experiments) {
      expect(experiment.title.trim()).not.toBe("");
      expect(experiment.description.trim()).not.toBe("");
    }
  });
});

describe("Particles fallback (EC-PLAY-1)", () => {
  it("renders the poster line when canvas is unavailable", async () => {
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null);

    const { default: Particles } = await import(
      "@/components/playground/experiments/particles"
    );
    render(<Particles />);

    expect(await screen.findByText(/canvas unavailable/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
