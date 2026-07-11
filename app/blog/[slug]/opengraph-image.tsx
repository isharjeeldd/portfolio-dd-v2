import { ImageResponse } from "next/og";
import { formatDate } from "@/lib/format";
import { getPost, sortedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * Per-post typographic OG card (FR-SEO-2, EC-BLOG-2) — every post gets a
 * composed card even without a cover image.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4438";

export function generateStaticParams() {
  return sortedPosts().map((post) => ({ slug: post.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ededed",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700, letterSpacing: -2 }}>
            {site.mark}
            <span style={{ color: ACCENT, fontSize: 20, marginTop: 2 }}>®</span>
          </div>
          {post && (
            <span style={{ fontSize: 22, color: "#4a4a4a" }}>
              {formatDate(post.date)} · {post.readingTime} min read
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 44 ? 58 : 72,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#4a4a4a" }}>
          <span>{site.name} — blog</span>
          <span style={{ color: ACCENT }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    size,
  );
}
