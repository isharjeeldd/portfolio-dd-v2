/**
 * AI-generated takeaways block (FR-BLOG-6): clearly labeled, renders
 * nothing when no valid cache entry exists (EC-BLOG-4).
 */
export function TldrBlock({ takeaways }: { takeaways: string[] | null }) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <aside
      aria-label="AI-generated summary"
      className="mt-10 border border-line bg-surface p-6"
    >
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        TL;DR — AI-generated
      </p>
      <ul className="list-disc space-y-2 pl-5 text-muted">
        {takeaways.map((takeaway) => (
          <li key={takeaway}>{takeaway}</li>
        ))}
      </ul>
    </aside>
  );
}
