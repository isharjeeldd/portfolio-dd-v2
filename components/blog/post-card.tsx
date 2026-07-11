import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";

/** Editorial listing row (FR-BLOG-1): display-face title, mono metadata. */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group border-b border-line py-8">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {" · "}
        {post.readingTime} min read
      </p>
      <h3 className="font-display text-2xl font-bold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-accent"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-2xl text-muted">{post.description}</p>
      {post.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-widest text-faint">
          {post.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
