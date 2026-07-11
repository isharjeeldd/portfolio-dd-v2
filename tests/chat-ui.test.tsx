// F011 — chat island tests (FR-AI-3/5/6)
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { site } from "@/lib/site";

afterEach(() => {
  vi.unstubAllGlobals();
});

function streamOf(...chunks: string[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

describe("ChatLauncher", () => {
  it("is clearly labeled AI and opens with starter questions (FR-AI-3/6)", async () => {
    const user = userEvent.setup();
    render(<ChatLauncher />);

    const launcher = screen.getByRole("button", { name: /ask ms® — ai/i });
    await user.click(launcher);

    expect(screen.getByText(/AI assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/What has he built with AI\?/)).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(4); // 3 starters + close/send
  });

  it("streams a reply into the transcript", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(streamOf("He built ", "PolyX."), { status: 200 })),
    );
    const user = userEvent.setup();
    render(<ChatLauncher />);

    await user.click(screen.getByRole("button", { name: /ask ms® — ai/i }));
    await user.click(screen.getByRole("button", { name: /summarize his polyx work/i }));

    expect(await screen.findByText(/He built PolyX\./)).toBeInTheDocument();
  });

  it("shows the unavailable state with the email fallback on 503 (FR-AI-5)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "off" }), { status: 503 })),
    );
    const user = userEvent.setup();
    render(<ChatLauncher />);

    await user.click(screen.getByRole("button", { name: /ask ms® — ai/i }));
    await user.click(screen.getByRole("button", { name: /is he available for freelance/i }));

    expect(await screen.findByText(/assistant is offline/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
  });

  it("shows a retry message on network failure (edge)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const user = userEvent.setup();
    render(<ChatLauncher />);

    await user.click(screen.getByRole("button", { name: /ask ms® — ai/i }));
    await user.click(screen.getByRole("button", { name: /what has he built with ai/i }));

    expect(await screen.findByText(/didn't go through/i)).toBeInTheDocument();
  });
});
