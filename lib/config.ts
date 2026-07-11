/**
 * Central env configuration (NFR-OPS-2). All environment access flows
 * through here — never read process.env ad hoc elsewhere. `.env.example`
 * documents every variable.
 */

export const AI_PROVIDERS = ["openrouter", "openai", "anthropic"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

const PROVIDER_KEY_VARS: Record<AiProvider, string> = {
  openrouter: "OPENROUTER_API_KEY",
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
};

/**
 * Provider-agnostic AI detection (NFR-OPS-1, ADR-0004).
 * - `AI_PROVIDER` forces a provider, honored only when its key is present.
 * - Otherwise the first configured key wins (order: openrouter, openai, anthropic).
 * - Zero configured keys → null → AI features degrade gracefully (FR-AI-5).
 */
export function detectAiProvider(
  env: Record<string, string | undefined> = process.env,
): AiProvider | null {
  const hasKey = (p: AiProvider) => Boolean(env[PROVIDER_KEY_VARS[p]]?.trim());

  const override = env.AI_PROVIDER?.trim().toLowerCase();
  if (override && (AI_PROVIDERS as readonly string[]).includes(override)) {
    const forced = override as AiProvider;
    if (hasKey(forced)) return forced;
  }

  return AI_PROVIDERS.find(hasKey) ?? null;
}

export function getConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return {
    ai: {
      provider: detectAiProvider(env),
      openrouterKey: env.OPENROUTER_API_KEY,
      openaiKey: env.OPENAI_API_KEY,
      anthropicKey: env.ANTHROPIC_API_KEY,
    },
    resend: {
      apiKey: env.RESEND_API_KEY,
      emailTo: env.RESEND_EMAIL_TO,
      emailFrom: env.RESEND_EMAIL_FROM,
    },
  };
}
