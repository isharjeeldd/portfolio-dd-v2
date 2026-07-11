import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { formatDate } from "@/lib/format";
import { adjacentPosts, getPost, sortedPosts } from "@/lib/posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return sortedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
      tags: post.tags,
    },
  };
}

/** Reading experience (FR-BLOG-2/7). */
export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { previous, next } = adjacentPosts(slug);

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <header>
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {" · "}
          {post.readingTime} min read
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tighter sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{post.description}</p>
      </header>

      <div className="post-prose mt-12">
        <MDXContent code={post.mdx} />
      </div>

      <nav
        aria-label="Adjacent posts"
        className="mt-16 flex justify-between gap-6 border-t border-line pt-8 font-mono text-xs uppercase tracking-widest"
      >
        <span>
          {previous && (
            <Link href={`/blog/${previous.slug}`} className="text-accent hover:underline underline-offset-4">
              ← {previous.title}
            </Link>
          )}
        </span>
        <span>
          {next && (
            <Link href={`/blog/${next.slug}`} className="text-accent hover:underline underline-offset-4">
              {next.title} →
            </Link>
          )}
        </span>
      </nav>
    </article>
  );
}
