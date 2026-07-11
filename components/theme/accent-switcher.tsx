"use client";

import { useSyncExternalStore } from "react";
import {
  ACCENTS,
  ACCENT_LABELS,
  DEFAULT_ACCENT,
  resolveAccent,
  setAccent,
  type Accent,
} from "@/lib/accent";

const SWATCH_COLORS: Record<Accent, string> = {
  crimson: "#ff4438",
  lime: "#b6ff2e",
  blue: "#47a3ff",
  amber: "#ffb224",
};

/**
 * The `data-accent` attribute on <html> is the store: the boot script
 * (accent-script.tsx) writes it pre-paint, setAccent() mutates it, and this
 * subscription keeps the UI in sync — hydration-safe via the server snapshot.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-accent"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Accent {
  return resolveAccent(document.documentElement.dataset.accent);
}

function getServerSnapshot(): Accent {
  return DEFAULT_ACCENT;
}

/** Visitor-facing accent switcher (FR-THEME-2). */
export function AccentSwitcher() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label="Accent color" className="flex items-center gap-2">
      {ACCENTS.map((accent) => (
        <button
          key={accent}
          type="button"
          aria-pressed={active === accent}
          aria-label={`${ACCENT_LABELS[accent]} accent`}
          title={ACCENT_LABELS[accent]}
          onClick={() => setAccent(accent)}
          className="size-4 cursor-pointer rounded-full border-2 border-transparent transition-transform hover:scale-115 aria-pressed:border-ink"
          style={{ background: SWATCH_COLORS[accent] }}
        />
      ))}
    </div>
  );
}
