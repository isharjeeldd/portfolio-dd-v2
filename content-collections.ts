import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { z } from "zod";

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

    return {
      ...document,
      date: document.date.toISOString(),
      slug: document._meta.path,
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
