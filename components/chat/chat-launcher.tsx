"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };
type ChatState = "ready" | "streaming" | "unavailable" | "failed";

const STARTERS = [
  "What has he built with AI?",
  "Summarize his PolyX work.",
  "Is he available for freelance?",
];

/**
 * AMA chat island (FR-AI-1..7): session-only, streaming, clearly labeled
 * AI, unavailable state when the endpoint reports no provider.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ChatState>("ready");
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || state === "streaming") return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setState("streaming");
    if (inputRef.current) inputRef.current.value = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (response.status === 503) {
        setState("unavailable");
        setMessages(nextMessages);
        return;
      }
      if (!response.ok || !response.body) {
        setState("failed");
        setMessages(nextMessages);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const current = reply;
        setMessages([...nextMessages, { role: "assistant", content: current }]);
      }
      setState("ready");
    } catch {
      setState("failed");
      setMessages(nextMessages);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 cursor-pointer border border-accent bg-canvas px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink"
      >
        {open ? "Close ×" : `Ask ${site.mark}® — AI`}
      </button>

      {open && (
        <section
          aria-label="Ask about Muhammad Sharjeel — AI assistant"
          className="fixed bottom-20 right-6 z-40 flex h-[28rem] w-[min(24rem,calc(100vw-3rem))] flex-col border border-line bg-canvas shadow-2xl"
        >
          <header className="border-b border-line px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              AI assistant · answers from his CV, work &amp; writing only
            </p>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && state !== "unavailable" && (
              <div className="space-y-2">
                <p className="text-sm text-muted">
                  Interview the portfolio. Try:
                </p>
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="block cursor-pointer border border-line px-3 py-2 text-left font-mono text-xs text-muted transition-colors hover:border-accent hover:text-ink"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "text-sm text-ink"
                    : "whitespace-pre-wrap text-sm text-muted"
                }
              >
                <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                  {message.role === "user" ? "you" : "ai"}
                </span>
                {message.content || "…"}
              </p>
            ))}

            {state === "unavailable" && (
              <p className="text-sm text-muted">
                The assistant is offline right now. Email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{" "}
                instead — a human answers.
              </p>
            )}
            {state === "failed" && (
              <p className="text-sm text-muted">That didn&apos;t go through — try again.</p>
            )}
          </div>

          {state !== "unavailable" && (
            <form
              className="flex border-t border-line"
              onSubmit={(event) => {
                event.preventDefault();
                send(inputRef.current?.value ?? "");
              }}
            >
              <input
                ref={inputRef}
                type="text"
                maxLength={1000}
                placeholder="Ask about his work…"
                aria-label="Your question"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === "streaming"}
                className="cursor-pointer px-4 font-mono text-xs uppercase tracking-widest text-accent disabled:opacity-50"
              >
                {state === "streaming" ? "…" : "Send"}
              </button>
            </form>
          )}
        </section>
      )}
    </>
  );
}
