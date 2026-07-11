/**
 * Accent theming (FR-THEME-2..4, ADR-0007).
 * Crimson is the default (FSD v1.1 amendment); visitors switch between four
 * curated accents. The choice lives in `data-accent` on <html> and persists
 * in localStorage. Keep ACCENT_STORAGE_KEY / DEFAULT_ACCENT in sync with the
 * inline no-flash boot script in components/theme/accent-script.tsx.
 */
export const ACCENTS = ["crimson", "lime", "blue", "amber"] as const;
export type Accent = (typeof ACCENTS)[number];

export const DEFAULT_ACCENT: Accent = "crimson";
export const ACCENT_STORAGE_KEY = "ms-accent";

export const ACCENT_LABELS: Record<Accent, string> = {
  crimson: "Crimson",
  lime: "Terminal lime",
  blue: "Electric blue",
  amber: "Signal amber",
};

/** Coerce any stored/unknown value to a valid accent (EC-THEME-1). */
export function resolveAccent(value: string | null | undefined): Accent {
  return (ACCENTS as readonly string[]).includes(value ?? "")
    ? (value as Accent)
    : DEFAULT_ACCENT;
}

/** Read the persisted accent; storage failures fall back to the default. */
export function readStoredAccent(): Accent {
  try {
    return resolveAccent(window.localStorage.getItem(ACCENT_STORAGE_KEY));
  } catch {
    return DEFAULT_ACCENT;
  }
}

/**
 * Apply an accent to the document and persist it. Persistence failures
 * (private mode, blocked storage) never prevent the visual switch.
 */
export function setAccent(accent: Accent): void {
  document.documentElement.dataset.accent = accent;
  try {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, accent);
  } catch {
    // Storage unavailable — the switch still applies for this page view.
  }
}
