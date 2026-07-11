// F006 — contact endpoint tests (FR-CONTACT-1/2, EC-CONTACT-1)
import { afterEach, describe, expect, it, vi } from "vitest";
import { MIN_FILL_MS } from "@/lib/contact";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from "@/app/api/contact/route";

const RESEND_ENV = {
  RESEND_API_KEY: "re_test",
  RESEND_EMAIL_TO: "inbox@example.com",
  RESEND_EMAIL_FROM: "Portfolio <contact@example.com>",
};

function makeRequest(body: unknown, ip = `203.0.113.${Math.floor(Math.random() * 200)}`) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

function validBody() {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Let's build something.",
    intent: "freelance",
    company: "",
    startedAt: Date.now() - MIN_FILL_MS - 1_000,
  };
}

afterEach(() => {
  sendMock.mockReset();
  for (const key of Object.keys(RESEND_ENV)) delete process.env[key];
});

describe("POST /api/contact", () => {
  it("delivers a valid submission via Resend (FR-CONTACT-1)", async () => {
    Object.assign(process.env, RESEND_ENV);
    sendMock.mockResolvedValue({ error: null });

    const response = await POST(makeRequest(validBody()));

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "inbox@example.com",
        replyTo: "ada@example.com",
        subject: expect.stringContaining("freelance"),
      }),
    );
  });

  it("returns generic success for spam without sending", async () => {
    Object.assign(process.env, RESEND_ENV);

    const response = await POST(makeRequest({ ...validBody(), company: "Acme" }));

    expect(response.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 503 with the direct-email fallback when unconfigured (EC-CONTACT-1)", async () => {
    const response = await POST(makeRequest(validBody()));
    const body = (await response.json()) as { fallback?: string };

    expect(response.status).toBe(503);
    expect(body.fallback).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 502 with fallback when the provider fails", async () => {
    Object.assign(process.env, RESEND_ENV);
    sendMock.mockRejectedValue(new Error("provider down"));

    const response = await POST(makeRequest(validBody()));

    expect(response.status).toBe(502);
  });

  it("returns 422 with field errors for invalid input", async () => {
    Object.assign(process.env, RESEND_ENV);

    const response = await POST(makeRequest({ ...validBody(), email: "nope" }));
    const body = (await response.json()) as { errors?: Record<string, string> };

    expect(response.status).toBe(422);
    expect(body.errors?.email).toBeTruthy();
  });

  it("returns 400 for a non-JSON body (edge)", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "not json",
    });
    expect((await POST(request)).status).toBe(400);
  });

  it("rate limits repeated submissions from one IP", async () => {
    Object.assign(process.env, RESEND_ENV);
    sendMock.mockResolvedValue({ error: null });

    const ip = "198.51.100.7";
    let lastStatus = 200;
    for (let i = 0; i < 7; i += 1) {
      const response = await POST(makeRequest(validBody(), ip));
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});
