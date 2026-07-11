import { allPosts, type Post } from "content-collections";

export type { Post };

/** Published posts, newest first (FR-BLOG-1). Drafts never ship. */
export function sortedPosts(posts: readonly Post[] = allPosts): Post[] {
  return posts
    .filter((post) => !post.draft)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Latest n posts for the landing teaser (FR-BLOG-5). */
export function latestPosts(count: number, posts: readonly Post[] = allPosts): Post[] {
  return sortedPosts(posts).slice(0, count);
}

export function getPost(slug: string, posts: readonly Post[] = allPosts): Post | undefined {
  return sortedPosts(posts).find((post) => post.slug === slug);
}

/** Previous/next in chronological reading order (FR-BLOG-7). */
export function adjacentPosts(
  slug: string,
  posts: readonly Post[] = allPosts,
): { previous: Post | null; next: Post | null } {
  const ordered = sortedPosts(posts);
  const index = ordered.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    // "previous" = older post (further down the newest-first list)
    previous: ordered[index + 1] ?? null,
    next: ordered[index - 1] ?? null,
  };
}
