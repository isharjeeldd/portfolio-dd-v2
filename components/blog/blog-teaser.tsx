import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import { latestPosts } from "@/lib/posts";

/**
 * Landing Blog teaser (FR-BLOG-5): latest 3 posts. With zero published
 * posts it renders nothing at all (EC-BLOG-1).
 */
export function BlogTeaser() {
  const posts = latestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="scroll-mt-20 border-t border-line py-24">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">Writing</h2>
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline underline-offset-4"
        >
          All posts →
        </Link>
      </div>
      <div className="mt-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
