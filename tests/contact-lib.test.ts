// F006 — contact boundary tests (FR-CONTACT-3/6, EC-CONTACT-2)
import { describe, expect, it } from "vitest";
import { evaluateContactRequest, MIN_FILL_MS } from "@/lib/contact";

const NOW = 1_800_000_000_000;

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Let's build something.",
    intent: "role",
    company: "",
    startedAt: NOW - MIN_FILL_MS - 1_000,
    ...overrides,
  };
}

describe("evaluateContactRequest", () => {
  it("accepts a clean payload", () => {
    const result = evaluateContactRequest(validPayload(), NOW);
    expect(result.status).toBe("delivered-candidate");
    if (result.status === "delivered-candidate") {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("flags a filled honeypot as spam (EC-CONTACT-2)", () => {
    expect(evaluateContactRequest(validPayload({ company: "Acme" }), NOW).status).toBe("spam");
  });

  it("flags instant submissions as spam", () => {
    expect(
      evaluateContactRequest(validPayload({ startedAt: NOW - 500 }), NOW).status,
    ).toBe("spam");
    expect(
      evaluateContactRequest(validPayload({ startedAt: undefined }), NOW).status,
    ).toBe("spam");
  });

  it("returns field errors for invalid input (FR-CONTACT-6)", () => {
    const result = evaluateContactRequest(
      validPayload({ email: "not-an-email", message: "" }),
      NOW,
    );
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.email).toMatch(/valid email/i);
      expect(result.errors.message).toMatch(/required/i);
    }
  });

  it("rejects oversize messages", () => {
    const result = evaluateContactRequest(
      validPayload({ message: "x".repeat(5_000) }),
      NOW,
    );
    expect(result.status).toBe("invalid");
  });
});
