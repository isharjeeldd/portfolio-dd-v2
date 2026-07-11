// F001 — central config unit tests (NFR-OPS-1/2, feeds FR-AI-5)
import { describe, expect, it } from "vitest";
import { detectAiProvider, getConfig } from "@/lib/config";

describe("detectAiProvider", () => {
  it("detects openrouter when only its key is set", () => {
    expect(detectAiProvider({ OPENROUTER_API_KEY: "sk-or-x" })).toBe("openrouter");
  });

  it("detects openai / anthropic from their keys", () => {
    expect(detectAiProvider({ OPENAI_API_KEY: "sk-x" })).toBe("openai");
    expect(detectAiProvider({ ANTHROPIC_API_KEY: "sk-ant-x" })).toBe("anthropic");
  });

  it("returns null with zero configured keys (FR-AI-5 degradation)", () => {
    expect(detectAiProvider({})).toBeNull();
    expect(detectAiProvider({ OPENROUTER_API_KEY: "  " })).toBeNull();
  });

  it("honors AI_PROVIDER override when its key is present", () => {
    expect(
      detectAiProvider({
        AI_PROVIDER: "anthropic",
        OPENROUTER_API_KEY: "sk-or-x",
        ANTHROPIC_API_KEY: "sk-ant-x",
      }),
    ).toBe("anthropic");
  });

  it("ignores AI_PROVIDER override when its key is missing", () => {
    expect(
      detectAiProvider({
        AI_PROVIDER: "anthropic",
        OPENROUTER_API_KEY: "sk-or-x",
      }),
    ).toBe("openrouter");
  });

  it("ignores unknown AI_PROVIDER values", () => {
    expect(
      detectAiProvider({ AI_PROVIDER: "gemini", OPENAI_API_KEY: "sk-x" }),
    ).toBe("openai");
  });
});

describe("getConfig", () => {
  it("exposes resend settings from env", () => {
    const config = getConfig({
      RESEND_API_KEY: "re_x",
      RESEND_EMAIL_TO: "to@example.com",
      RESEND_EMAIL_FROM: "From <from@example.com>",
    });
    expect(config.resend.apiKey).toBe("re_x");
    expect(config.resend.emailTo).toBe("to@example.com");
    expect(config.ai.provider).toBeNull();
  });
});
