import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { sortedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on software engineering — platforms, frontend craft, and building in the open.",
};

/** Post listing (FR-BLOG-1) with a composed empty state (EC-BLOG-1). */
export default function BlogPage() {
  const posts = sortedPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Writing
      </p>
      <h1 className="font-display text-5xl font-bold tracking-tighter">
        Blog<span className="text-accent">.</span>
      </h1>

      {posts.length === 0 ? (
        <p className="mt-12 max-w-md text-muted">
          Nothing published yet — the first post is on its way.{" "}
          <a href="/feed.xml" className="text-accent hover:underline underline-offset-4">
            Subscribe via RSS
          </a>{" "}
          to catch it.
        </p>
      ) : (
        <div className="mt-10">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
