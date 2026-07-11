import { z } from "zod";

/**
 * Contact boundary (FR-CONTACT-1/3/6, ADR-0005).
 * Spam gates: the hidden `company` honeypot must stay empty, and the form
 * must have been open ≥ MIN_FILL_MS before submitting. Bots receive a
 * generic success so they learn nothing (EC-CONTACT-2).
 */
export const MIN_FILL_MS = 3_000;
export const MAX_MESSAGE_LENGTH = 4_000;

export const INTENTS = ["role", "freelance", "other"] as const;
export type Intent = (typeof INTENTS)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Your name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(1, "A message is required.")
    .max(MAX_MESSAGE_LENGTH, "Message is too long."),
  intent: z.enum(INTENTS).default("other"),
  // Spam signals
  company: z.string().optional().default(""),
  startedAt: z.number().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactEvaluation =
  | { status: "delivered-candidate"; data: ContactPayload }
  | { status: "spam" }
  | { status: "invalid"; errors: Record<string, string> };

export function evaluateContactRequest(
  payload: unknown,
  now: number = Date.now(),
): ContactEvaluation {
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return { status: "invalid", errors };
  }

  const data = parsed.data;

  // Honeypot: humans never see the field; anything in it is a bot.
  if (data.company !== "") return { status: "spam" };

  // Timing: instant submissions are bots.
  if (typeof data.startedAt !== "number" || now - data.startedAt < MIN_FILL_MS) {
    return { status: "spam" };
  }

  return { status: "delivered-candidate", data };
}
