import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/seo";
import { sortedPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(sortedPosts());
}
