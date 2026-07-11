// F001 — accent theming unit tests (FR-THEME-2/3, EC-THEME-1/2)
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  readStoredAccent,
  resolveAccent,
  setAccent,
} from "@/lib/accent";

describe("resolveAccent", () => {
  it("returns a valid accent unchanged", () => {
    expect(resolveAccent("lime")).toBe("lime");
    expect(resolveAccent("amber")).toBe("amber");
  });

  it("falls back to crimson for invalid stored values (EC-THEME-1)", () => {
    expect(resolveAccent("neon-pink")).toBe("crimson");
    expect(resolveAccent("")).toBe("crimson");
  });

  it("falls back to crimson for null/undefined (EC-THEME-2, FSD v1.1 default)", () => {
    expect(resolveAccent(null)).toBe(DEFAULT_ACCENT);
    expect(resolveAccent(undefined)).toBe(DEFAULT_ACCENT);
    expect(DEFAULT_ACCENT).toBe("crimson");
  });
});

describe("setAccent", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.accent;
  });

  it("applies data-accent to <html> and persists (FR-THEME-2/3)", () => {
    setAccent("blue");
    expect(document.documentElement.dataset.accent).toBe("blue");
    expect(window.localStorage.getItem(ACCENT_STORAGE_KEY)).toBe("blue");
  });

  it("still applies the accent when storage throws (edge: private mode)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    expect(() => setAccent("amber")).not.toThrow();
    expect(document.documentElement.dataset.accent).toBe("amber");

    spy.mockRestore();
  });
});

describe("readStoredAccent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the persisted accent", () => {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, "lime");
    expect(readStoredAccent()).toBe("lime");
  });

  it("returns the default when nothing is stored", () => {
    expect(readStoredAccent()).toBe("crimson");
  });

  it("returns the default when storage throws", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    expect(readStoredAccent()).toBe("crimson");

    spy.mockRestore();
  });
});
