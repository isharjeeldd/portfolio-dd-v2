import type { Post } from "content-collections";

/** Deterministic post fixtures for unit tests. */
export function makePost(overrides: Partial<Post> & { slug: string }): Post {
  return {
    title: `Post ${overrides.slug}`,
    date: "2026-01-01T00:00:00.000Z",
    description: "A test post.",
    tags: [],
    draft: false,
    readingTime: 3,
    tldr: null,
    mdx: "",
    cover: undefined,
    content: "",
    _meta: {
      filePath: `${overrides.slug}.mdx`,
      fileName: `${overrides.slug}.mdx`,
      directory: ".",
      path: overrides.slug,
      extension: "mdx",
    },
    ...overrides,
  } as Post;
}

export const FIXTURE_POSTS: Post[] = [
  makePost({ slug: "oldest", title: "Oldest post", date: "2026-01-01T00:00:00.000Z" }),
  makePost({ slug: "middle", title: "Middle post", date: "2026-03-15T00:00:00.000Z", tags: ["process", "meta"] }),
  makePost({ slug: "newest", title: "Newest post", date: "2026-07-01T00:00:00.000Z" }),
  makePost({ slug: "hidden", title: "Draft post", date: "2026-08-01T00:00:00.000Z", draft: true }),
];
