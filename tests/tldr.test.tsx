// F010 — TL;DR cache + block tests (FR-BLOG-6, EC-BLOG-4)
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TldrBlock } from "@/components/blog/tldr-block";
import { contentHash, getCachedTldr, type TldrCache } from "@/lib/tldr";

const CONTENT = "Some post body about engineering.";

function cacheFor(content: string): TldrCache {
  return {
    "my-post": {
      hash: contentHash(content),
      takeaways: ["First takeaway.", "Second takeaway."],
    },
  };
}

describe("contentHash", () => {
  it("is deterministic and content-sensitive", () => {
    expect(contentHash(CONTENT)).toBe(contentHash(CONTENT));
    expect(contentHash(CONTENT)).not.toBe(contentHash(`${CONTENT} edited`));
  });
});

describe("getCachedTldr", () => {
  it("returns takeaways on a hash match", () => {
    expect(getCachedTldr("my-post", CONTENT, cacheFor(CONTENT))).toEqual([
      "First takeaway.",
      "Second takeaway.",
    ]);
  });

  it("returns null when content changed since generation (stale)", () => {
    expect(getCachedTldr("my-post", `${CONTENT} edited`, cacheFor(CONTENT))).toBeNull();
  });

  it("returns null for unknown slugs and empty caches (EC-BLOG-4)", () => {
    expect(getCachedTldr("other-post", CONTENT, cacheFor(CONTENT))).toBeNull();
    expect(getCachedTldr("my-post", CONTENT, {})).toBeNull();
  });

  it("treats malformed cache entries as misses (edge)", () => {
    const malformed = {
      "my-post": { hash: contentHash(CONTENT), takeaways: "not-an-array" },
    } as unknown as TldrCache;
    expect(getCachedTldr("my-post", CONTENT, malformed)).toBeNull();
  });
});

describe("TldrBlock", () => {
  it("renders labeled takeaways", () => {
    render(<TldrBlock takeaways={["Ship the cache.", "Never fail the build."]} />);

    expect(screen.getByText(/TL;DR — AI-generated/i)).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: /ai-generated summary/i })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing without takeaways (EC-BLOG-4)", () => {
    const { container } = render(<TldrBlock takeaways={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
