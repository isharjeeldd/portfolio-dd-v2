import type { Person, WithContext } from "schema-dts";
import type { MetadataRoute } from "next";
import type { Post } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * JSON-LD identity (FR-SEO-3, NFR-SEO-1): both names are machine-readable
 * so searches for "Muhammad Sharjeel" AND "Sharjeel Afzaal" resolve here.
 */
export function personJsonLd(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.alternateName,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.upwork],
  };
}

/** Sitemap entries for all public routes (FR-SEO-4). Pure for testability. */
export function sitemapEntries(posts: readonly Post[]): MetadataRoute.Sitemap {
  const published = posts.filter((post) => !post.draft);

  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...published.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
