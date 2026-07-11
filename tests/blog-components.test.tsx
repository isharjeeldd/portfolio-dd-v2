// F004 — blog component tests (FR-BLOG-1/5, EC-BLOG-1)
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FIXTURE_POSTS, makePost } from "./fixtures/posts";

// The generated collection is swapped per-describe below.
const collection = { allPosts: [] as unknown[] };
vi.mock("content-collections", () => ({
  get allPosts() {
    return collection.allPosts;
  },
}));

import { BlogTeaser } from "@/components/blog/blog-teaser";
import { PostCard } from "@/components/blog/post-card";

describe("PostCard (FR-BLOG-1)", () => {
  it("renders title link, date, description, reading time, and tags", () => {
    render(<PostCard post={FIXTURE_POSTS[1]} />);

    expect(screen.getByRole("link", { name: "Middle post" })).toHaveAttribute(
      "href",
      "/blog/middle",
    );
    expect(screen.getByText(/Mar 15, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/3 min read/)).toBeInTheDocument();
    expect(screen.getByText("#process")).toBeInTheDocument();
  });

  it("renders without a tag list when the post has no tags (edge)", () => {
    render(<PostCard post={makePost({ slug: "untagged", tags: [] })} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("BlogTeaser (FR-BLOG-5)", () => {
  it("renders nothing with zero published posts (EC-BLOG-1)", () => {
    collection.allPosts = [];
    const { container } = render(<BlogTeaser />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders at most 3 newest posts and an all-posts link", () => {
    collection.allPosts = FIXTURE_POSTS;
    render(<BlogTeaser />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByText("Draft post")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /all posts/i })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});
