// F006 — contact form component tests (FR-CONTACT-2/4/6)
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/lib/site";

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
  await user.type(screen.getByLabelText(/^message$/i), "Hello there.");
}

describe("ContactForm", () => {
  it("renders the visible fields and hides the honeypot from users", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name$/i)).toBeVisible();
    expect(screen.getByLabelText(/^email$/i)).toBeVisible();
    expect(screen.getByLabelText(/^message$/i)).toBeVisible();
    expect(screen.getByLabelText(/what is this about/i)).toBeVisible();

    const honeypot = document.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  it("shows inline errors instead of submitting an empty form (FR-CONTACT-6)", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("announces success after a delivered submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/sent\./i)).toBeInTheDocument();
  });

  it("shows the mailto fallback when delivery fails (FR-CONTACT-2, EC-CONTACT-1)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "x" }), { status: 502 })),
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const fallback = await screen.findByRole("link", { name: site.email });
    expect(fallback).toHaveAttribute("href", `mailto:${site.email}`);
  });

  it("shows the failure state on a network error (edge)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/delivery failed/i)).toBeInTheDocument();
  });

  it("surfaces the Upwork link for freelance intent (FR-CONTACT-4)", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.selectOptions(
      screen.getByLabelText(/what is this about/i),
      "freelance",
    );

    const upwork = screen.getByRole("link", { name: /hire me on upwork/i });
    expect(upwork).toHaveAttribute("href", site.socials.upwork);
  });
});
