"use client";

import { useEffect, useRef, useState } from "react";
import { INTENTS, type Intent } from "@/lib/contact";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const INTENT_LABELS: Record<Intent, string> = {
  role: "A role / opportunity",
  freelance: "Freelance / contract work",
  other: "Something else",
};

const inputClasses =
  "w-full border border-line bg-surface px-4 py-3 text-ink placeholder:text-faint focus:border-accent focus:outline-none";

/**
 * Contact form (FR-CONTACT-1/2/4/6): inline accessible validation,
 * explicit success/failure with mailto fallback, honeypot + fill-time
 * spam signals, Upwork surfaced on freelance intent.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [intent, setIntent] = useState<Intent>("other");
  const startedAt = useRef<number | null>(null);

  // Fill-time spam signal starts when the visitor actually sees the form.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      intent,
      company: String(data.get("company") ?? ""),
      startedAt: startedAt.current ?? undefined,
    };

    const clientErrors: Record<string, string> = {};
    if (!payload.name.trim()) clientErrors.name = "Your name is required.";
    if (!/.+@.+\..+/.test(payload.email)) clientErrors.email = "Enter a valid email address.";
    if (!payload.message.trim()) clientErrors.message = "A message is required.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        const body = (await response.json()) as { errors?: Record<string, string> };
        setErrors(body.errors ?? {});
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-6">
      {/* Honeypot — humans never see or reach this field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          aria-invalid={Boolean(errors.name)}
          className={inputClasses}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-2 text-sm text-amber-200">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          className={inputClasses}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-2 text-sm text-amber-200">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-intent" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          What is this about?
        </label>
        <select
          id="contact-intent"
          name="intent"
          value={intent}
          onChange={(event) => setIntent(event.target.value as Intent)}
          className={inputClasses}
        >
          {INTENTS.map((value) => (
            <option key={value} value={value}>
              {INTENT_LABELS[value]}
            </option>
          ))}
        </select>
        {intent === "freelance" && (
          <p className="mt-2 text-sm text-muted">
            Prefer contracting through a platform?{" "}
            <a
              href={site.socials.upwork}
              target="_blank"
              rel="noopener"
              className="text-accent underline-offset-4 hover:underline"
            >
              Hire me on Upwork
            </a>
            .
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What are you building?"
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
          className={inputClasses}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-2 text-sm text-amber-200">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message →"}
      </button>

      <p role="status" aria-live="polite" className="min-h-6 text-sm">
        {status === "success" && (
          <span className="text-ink">
            Sent. I read everything — expect a reply within a couple of days.
          </span>
        )}
        {status === "error" && (
          <span className="text-muted">
            Delivery failed — email me directly at{" "}
            <a href={`mailto:${site.email}`} className="text-accent underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </span>
        )}
      </p>
    </form>
  );
}
