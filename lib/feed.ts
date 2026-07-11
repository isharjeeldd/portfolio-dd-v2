import { Feed } from "feed";
import { site } from "@/lib/site";
import type { Post } from "@/lib/posts";

export const SITE_URL = site.url;

/**
 * RSS feed builder (FR-BLOG-4). Pure — the /feed.xml route feeds it the
 * published collection; tests feed it fixtures. An empty collection still
 * yields a valid channel (edge case).
 */
export function buildFeed(posts: readonly Post[]): string {
  const feed = new Feed({
    title: `${site.name} — Blog`,
    description: `Writing by ${site.name} (${site.alternateName}) on software engineering.`,
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    feedLinks: { rss: `${SITE_URL}/feed.xml` },
    author: { name: site.name, email: site.email },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return feed.rss2();
}
