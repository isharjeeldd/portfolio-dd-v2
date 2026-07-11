// F001 — layout shell component tests (FR-SITE-2/4/5, FR-THEME-2)
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AccentSwitcher } from "@/components/theme/accent-switcher";
import { site } from "@/lib/site";

describe("Header (FR-SITE-2)", () => {
  it("renders the MS® mark as a link home with an accessible name", () => {
    render(<Header />);
    const mark = screen.getByRole("link", {
      name: `${site.mark}® — ${site.name}, home`,
    });
    expect(mark).toHaveAttribute("href", "/");
  });

  it("links to the blog from primary navigation", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });
});

describe("Footer (FR-SITE-5)", () => {
  it("renders GitHub, LinkedIn, and Upwork with correct hrefs (FR-CONTACT-4)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      site.socials.github,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      site.socials.linkedin,
    );
    expect(screen.getByRole("link", { name: "Upwork" })).toHaveAttribute(
      "href",
      site.socials.upwork,
    );
  });

  it("links the RSS feed (FR-BLOG-4 affordance)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "RSS" })).toHaveAttribute("href", "/feed.xml");
  });
});

describe("NotFound (FR-SITE-4)", () => {
  it("offers routes back to home and blog", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  });
});

describe("AccentSwitcher (FR-THEME-2)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.accent = "crimson";
  });

  it("renders all four accents with pressed state on the default", () => {
    render(<AccentSwitcher />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    expect(
      screen.getByRole("button", { name: "Crimson accent" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches the accent live and persists it", async () => {
    const user = userEvent.setup();
    render(<AccentSwitcher />);

    await user.click(screen.getByRole("button", { name: "Terminal lime accent" }));

    expect(document.documentElement.dataset.accent).toBe("lime");
    expect(window.localStorage.getItem("ms-accent")).toBe("lime");
    expect(
      screen.getByRole("button", { name: "Terminal lime accent" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Crimson accent" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
