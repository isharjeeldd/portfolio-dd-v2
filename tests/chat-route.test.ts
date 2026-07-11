// F011 — chat endpoint tests (FR-AI-4/5)
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("content-collections", () => ({ allPosts: [] }));

const streamTextMock = vi.fn();
vi.mock("ai", () => ({
  streamText: (options: unknown) => streamTextMock(options),
}));

import { MAX_INPUT_CHARS, POST } from "@/app/api/chat/route";

function makeRequest(body: unknown, ip = `192.0.2.${Math.floor(Math.random() * 200)}`) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const userMessage = (content: string) => ({ role: "user", content });

afterEach(() => {
  streamTextMock.mockReset();
  delete process.env.OPENROUTER_API_KEY;
});

describe("POST /api/chat", () => {
  it("returns 503 with zero configured providers (FR-AI-5)", async () => {
    const response = await POST(makeRequest({ messages: [userMessage("hi")] }));
    expect(response.status).toBe(503);
    expect(streamTextMock).not.toHaveBeenCalled();
  });

  it("rejects invalid bodies and empty message lists", async () => {
    expect(
      (
        await POST(
          new Request("http://localhost/api/chat", { method: "POST", body: "nope" }),
        )
      ).status,
    ).toBe(400);
    expect((await POST(makeRequest({ messages: [] }))).status).toBe(400);
  });

  it("rejects oversize input (FR-AI-4)", async () => {
    const response = await POST(
      makeRequest({ messages: [userMessage("x".repeat(MAX_INPUT_CHARS + 1))] }),
    );
    expect(response.status).toBe(422);
  });

  it("rejects over-long conversations", async () => {
    const messages = Array.from({ length: 21 }, (_, index) =>
      index % 2 === 0 ? userMessage(`q${index}`) : { role: "assistant", content: "a" },
    );
    expect((await POST(makeRequest({ messages }))).status).toBe(422);
  });

  it("streams with the grounded system prompt when a provider is configured", async () => {
    process.env.OPENROUTER_API_KEY = "sk-or-test";
    streamTextMock.mockReturnValue({
      toTextStreamResponse: () => new Response("streamed"),
    });

    const response = await POST(makeRequest({ messages: [userMessage("What has he built?")] }));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("streamed");
    const options = streamTextMock.mock.calls[0][0] as { system: string };
    expect(options.system).toContain("Muhammad Sharjeel");
    expect(options.system).toContain("ONLY from the facts");
  });

  it("rate limits repeated requests from one IP (FR-AI-4)", async () => {
    process.env.OPENROUTER_API_KEY = "sk-or-test";
    streamTextMock.mockReturnValue({
      toTextStreamResponse: () => new Response("ok"),
    });

    const ip = "192.0.2.250";
    let lastStatus = 200;
    for (let i = 0; i < 32; i += 1) {
      lastStatus = (await POST(makeRequest({ messages: [userMessage("q")] }, ip))).status;
    }
    expect(lastStatus).toBe(429);
  });

  it("returns 502 when the provider call throws (edge)", async () => {
    process.env.OPENROUTER_API_KEY = "sk-or-test";
    streamTextMock.mockImplementation(() => {
      throw new Error("provider exploded");
    });

    const response = await POST(makeRequest({ messages: [userMessage("hi")] }));
    expect(response.status).toBe(502);
  });
});
