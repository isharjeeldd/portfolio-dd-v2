import { createHash } from "node:crypto";

/**
 * TL;DR cache contract (FR-BLOG-6, ADR-0003): takeaways are generated
 * pre-build by scripts/generate-tldr.mjs and committed in
 * content/tldr-cache.json keyed by content hash. Stale or missing entries
 * simply mean "no block" (EC-BLOG-4) — never a failure.
 */
export type TldrCache = Record<
  string,
  { hash: string; takeaways: string[] } | undefined
>;

export function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function getCachedTldr(
  slug: string,
  content: string,
  cache: TldrCache,
): string[] | null {
  const entry = cache[slug];
  if (!entry || !Array.isArray(entry.takeaways) || entry.takeaways.length === 0) {
    return null;
  }
  return entry.hash === contentHash(content) ? entry.takeaways : null;
}
