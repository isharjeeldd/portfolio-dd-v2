import type { LanguageModel } from "ai";
import { detectAiProvider, getConfig } from "@/lib/config";

/**
 * Chat-tier model resolution (ADR-0004 model map). Returns null with zero
 * configured providers — callers degrade gracefully (FR-AI-5).
 */
export const CHAT_MODEL_IDS = {
  openrouter: "anthropic/claude-haiku-4.5",
  openai: "gpt-5.4-mini",
  anthropic: "claude-haiku-4-5",
} as const;

export async function resolveChatModel(
  env: Record<string, string | undefined> = process.env,
): Promise<LanguageModel | null> {
  const provider = detectAiProvider(env);
  if (!provider) return null;

  const { ai } = getConfig(env);

  switch (provider) {
    case "openrouter": {
      const { createOpenRouter } = await import("@openrouter/ai-sdk-provider");
      return createOpenRouter({ apiKey: ai.openrouterKey })(
        CHAT_MODEL_IDS.openrouter,
      );
    }
    case "openai": {
      const { createOpenAI } = await import("@ai-sdk/openai");
      return createOpenAI({ apiKey: ai.openaiKey })(CHAT_MODEL_IDS.openai);
    }
    case "anthropic": {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      return createAnthropic({ apiKey: ai.anthropicKey })(
        CHAT_MODEL_IDS.anthropic,
      );
    }
  }
}
