// F011 — grounding pack tests (FR-AI-1/2)
import { describe, expect, it, vi } from "vitest";

vi.mock("content-collections", () => ({ allPosts: [] }));

import { buildGroundingPack, buildSystemPrompt } from "@/lib/ai/grounding";
import { CHAT_MODEL_IDS } from "@/lib/ai/provider";
import { detectAiProvider } from "@/lib/config";
import { FIXTURE_POSTS } from "./fixtures/posts";

describe("buildGroundingPack (FR-AI-1)", () => {
  it("contains identity, experience, work, and writing facts", () => {
    const pack = buildGroundingPack(FIXTURE_POSTS.filter((post) => !post.draft));

    expect(pack).toContain("Muhammad Sharjeel");
    expect(pack).toContain("Senior Software Engineer at ISSM.AI");
    expect(pack).toContain("PolyX");
    expect(pack).toContain("Newest post");
    expect(pack).toContain("Upwork");
  });

  it("handles zero posts (edge)", () => {
    expect(buildGroundingPack([])).toContain("No posts published yet.");
  });
});

describe("buildSystemPrompt (FR-AI-2/4)", () => {
  it("mandates grounding-only answers and the contact redirect", () => {
    const prompt = buildSystemPrompt("FACTS-SENTINEL");

    expect(prompt).toContain("ONLY from the facts");
    expect(prompt).toContain("contact");
    expect(prompt).toContain("FACTS-SENTINEL");
    expect(prompt).toMatch(/decline/i);
  });
});

describe("chat model map (ADR-0004)", () => {
  it("pins the chat tier per provider", () => {
    expect(CHAT_MODEL_IDS.openrouter).toBe("anthropic/claude-haiku-4.5");
    expect(CHAT_MODEL_IDS.openai).toBe("gpt-5.4-mini");
    expect(CHAT_MODEL_IDS.anthropic).toBe("claude-haiku-4-5");
    // Detection reuses the config module (already covered) — sanity check:
    expect(detectAiProvider({})).toBeNull();
  });
});
