import { readFileSync } from "node:fs";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { z } from "zod";
import { getCachedTldr, type TldrCache } from "./lib/tldr";

// Committed pre-build cache (FR-BLOG-6) — see scripts/generate-tldr.mjs.
function readTldrCache(): TldrCache {
  try {
    return JSON.parse(readFileSync("content/tldr-cache.json", "utf8")) as TldrCache;
  } catch {
    return {};
  }
}

/**
 * The content contract (FR-BLOG-3, ADR-0003): typed frontmatter — malformed
 * posts fail the build loudly. Schema changes are documented in
 * docs/architecture/content_model.md.
 */
const WORDS_PER_MINUTE = 238;

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    description: z.string().min(1),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [rehypePrettyCode, { theme: "vesper", keepBackground: false }],
      ],
    });

    const words = document.content.split(/\s+/).filter(Boolean).length;
    const slug = document._meta.path;

    return {
      ...document,
      date: document.date.toISOString(),
      slug,
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      tldr: getCachedTldr(slug, document.content, readTldrCache()),
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
