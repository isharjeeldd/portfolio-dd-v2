// F004 — content layer tests (FR-BLOG-1/5/7)
import { describe, expect, it, vi } from "vitest";

vi.mock("content-collections", () => ({ allPosts: [] }));

import { adjacentPosts, latestPosts, sortedPosts } from "@/lib/posts";
import { FIXTURE_POSTS } from "./fixtures/posts";

describe("sortedPosts (FR-BLOG-1)", () => {
  it("orders newest first", () => {
    const slugs = sortedPosts(FIXTURE_POSTS).map((post) => post.slug);
    expect(slugs).toEqual(["newest", "middle", "oldest"]);
  });

  it("excludes drafts", () => {
    expect(sortedPosts(FIXTURE_POSTS).some((post) => post.slug === "hidden")).toBe(false);
  });
});

describe("latestPosts (FR-BLOG-5)", () => {
  it("caps at the requested count", () => {
    expect(latestPosts(2, FIXTURE_POSTS)).toHaveLength(2);
    expect(latestPosts(2, FIXTURE_POSTS)[0].slug).toBe("newest");
  });

  it("returns empty for an empty collection (EC-BLOG-1)", () => {
    expect(latestPosts(3, [])).toEqual([]);
  });
});

describe("adjacentPosts (FR-BLOG-7)", () => {
  it("returns older as previous and newer as next", () => {
    const { previous, next } = adjacentPosts("middle", FIXTURE_POSTS);
    expect(previous?.slug).toBe("oldest");
    expect(next?.slug).toBe("newest");
  });

  it("returns null sides at the endpoints", () => {
    expect(adjacentPosts("newest", FIXTURE_POSTS).next).toBeNull();
    expect(adjacentPosts("oldest", FIXTURE_POSTS).previous).toBeNull();
  });

  it("returns null/null for an unknown slug", () => {
    expect(adjacentPosts("nope", FIXTURE_POSTS)).toEqual({ previous: null, next: null });
  });
});
