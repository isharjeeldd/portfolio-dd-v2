import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/ai/grounding";
import { resolveChatModel } from "@/lib/ai/provider";

/**
 * AMA chat endpoint (FR-AI-1..5, ADR-0004). Streams plain text. Zero
 * configured providers → 503 and the UI shows its unavailable state; the
 * rest of the site never depends on this route.
 */
export const MAX_INPUT_CHARS = 1_000;
export const MAX_MESSAGES = 20;

// Best-effort per-instance limiter (same caveat as the contact route;
// durable limiting via Upstash is the ADR-0004 escalation).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isChatMessage)) {
    return Response.json({ error: "messages[] is required." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversation too long — start fresh." }, { status: 422 });
  }
  const last = messages[messages.length - 1];
  if (last.role !== "user" || last.content.length === 0) {
    return Response.json({ error: "Last message must be from you." }, { status: 400 });
  }
  if (last.content.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `Keep questions under ${MAX_INPUT_CHARS} characters.` },
      { status: 422 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests — slow down." }, { status: 429 });
  }

  const model = await resolveChatModel();
  if (!model) {
    return Response.json({ error: "Chat is not available right now." }, { status: 503 });
  }

  try {
    const result = streamText({
      model,
      system: buildSystemPrompt(),
      messages,
      maxOutputTokens: 500,
    });
    return result.toTextStreamResponse();
  } catch {
    return Response.json({ error: "Chat failed — try again." }, { status: 502 });
  }
}
