// F005 — SEO surface tests (FR-SEO-1/3/4/5, NFR-SEO-1)
import { describe, expect, it, vi } from "vitest";
import { FIXTURE_POSTS as MOCK_POSTS } from "./fixtures/posts";

const collection = { allPosts: MOCK_POSTS as unknown[] };
vi.mock("content-collections", () => ({
  get allPosts() {
    return collection.allPosts;
  },
}));

import { generateMetadata } from "@/app/blog/[slug]/page";
import robots from "@/app/robots";
import { personJsonLd, sitemapEntries } from "@/lib/seo";
import { site } from "@/lib/site";
import { FIXTURE_POSTS } from "./fixtures/posts";

describe("personJsonLd (FR-SEO-3, NFR-SEO-1)", () => {
  it("identifies both names, the role, and social profiles", () => {
    const person = personJsonLd();

    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Muhammad Sharjeel");
    expect(person.alternateName).toBe("Sharjeel Afzaal");
    expect(person.jobTitle).toBe(site.role);
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        site.socials.github,
        site.socials.linkedin,
        site.socials.upwork,
      ]),
    );
  });
});

describe("sitemapEntries (FR-SEO-4/5)", () => {
  it("lists home, blog, and every published post", () => {
    const urls = sitemapEntries(FIXTURE_POSTS).map((entry) => entry.url);

    expect(urls).toContain(site.url);
    expect(urls).toContain(`${site.url}/blog`);
    expect(urls).toContain(`${site.url}/blog/newest`);
    expect(urls).not.toContain(`${site.url}/blog/hidden`);
  });

  it("still lists core routes with zero posts (edge)", () => {
    const urls = sitemapEntries([]).map((entry) => entry.url);
    expect(urls).toEqual([site.url, `${site.url}/blog`]);
  });
});

describe("robots (FR-SEO-4)", () => {
  it("allows crawling and points at the sitemap", () => {
    const config = robots();
    expect(config.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(config.sitemap).toBe(`${site.url}/sitemap.xml`);
  });
});

describe("post generateMetadata (FR-SEO-1/5)", () => {
  it("derives title, description, canonical, and article OG from the post", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "middle" }),
    });

    expect(metadata.title).toBe("Middle post");
    expect(metadata.description).toBe("A test post.");
    expect(metadata.alternates?.canonical).toBe("/blog/middle");
    expect(metadata.openGraph).toMatchObject({ url: "/blog/middle" });
  });

  it("returns empty metadata for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(metadata).toEqual({});
  });
});
