// F004 — RSS feed tests (FR-BLOG-4)
import { describe, expect, it, vi } from "vitest";

vi.mock("content-collections", () => ({ allPosts: [] }));

import { buildFeed, SITE_URL } from "@/lib/feed";
import { FIXTURE_POSTS, makePost } from "./fixtures/posts";

describe("buildFeed (FR-BLOG-4)", () => {
  it("emits RSS containing each published post with its canonical URL", () => {
    const xml = buildFeed(FIXTURE_POSTS.filter((post) => !post.draft));

    expect(xml).toContain("<rss");
    expect(xml).toContain("Newest post");
    expect(xml).toContain("Middle post");
    expect(xml).toContain(`${SITE_URL}/blog/newest`);
  });

  it("includes tags as categories", () => {
    const xml = buildFeed([makePost({ slug: "tagged", tags: ["process"] })]);
    expect(xml).toContain("process");
  });

  it("stays a valid channel with zero posts (edge)", () => {
    const xml = buildFeed([]);
    expect(xml).toContain("<rss");
    expect(xml).toContain("</channel>");
  });
});
