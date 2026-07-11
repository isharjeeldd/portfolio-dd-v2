import { Resend } from "resend";
import { evaluateContactRequest } from "@/lib/contact";
import { getConfig } from "@/lib/config";
import { site } from "@/lib/site";

/**
 * Contact delivery endpoint (FR-CONTACT-1/2, ADR-0005).
 * Spam → generic success (bots learn nothing, nothing is sent).
 * Unconfigured/provider failure → explicit error; the client falls back
 * to the direct email address (EC-CONTACT-1).
 */

// Best-effort per-instance limiter (NFR-SEC-2). Serverless instances don't
// share memory, so this is a soft gate — honeypot + timing are the primary
// spam defense; durable limiting via Upstash is the ADR-0005 escalation.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
  }

  const result = evaluateContactRequest(body);

  if (result.status === "invalid") {
    return Response.json({ errors: result.errors }, { status: 422 });
  }

  if (result.status === "spam") {
    // Deliberate generic success — see module docblock.
    return Response.json({ ok: true });
  }

  const { resend: resendConfig } = getConfig();
  if (!resendConfig.apiKey || !resendConfig.emailTo || !resendConfig.emailFrom) {
    return Response.json(
      { error: "Contact delivery is not configured.", fallback: site.email },
      { status: 503 },
    );
  }

  const { name, email, message, intent } = result.data;

  try {
    const resend = new Resend(resendConfig.apiKey);
    const { error } = await resend.emails.send({
      from: resendConfig.emailFrom,
      to: resendConfig.emailTo,
      replyTo: email,
      subject: `[portfolio · ${intent}] ${name}`,
      text: `From: ${name} <${email}>\nIntent: ${intent}\n\n${message}`,
    });
    if (error) throw new Error(error.message);
  } catch {
    return Response.json(
      { error: "Delivery failed.", fallback: site.email },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
