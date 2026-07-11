import { buildFeed } from "@/lib/feed";
import { sortedPosts } from "@/lib/posts";

/** RSS (FR-BLOG-4). Statically generated at build time. */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeed(sortedPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
