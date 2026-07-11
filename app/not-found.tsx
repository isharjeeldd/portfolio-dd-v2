import Link from "next/link";

/** Branded 404 (FR-SITE-4). */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-6 py-24">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        404 — not found
      </p>
      <h1 className="font-display text-5xl font-bold tracking-tighter sm:text-7xl">
        Nothing at this path<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">
        The page moved, never existed, or is waiting for a future release.
      </p>
      <ul className="mt-10 flex gap-6 font-mono text-xs uppercase tracking-widest">
        <li>
          <Link href="/" className="text-accent hover:underline underline-offset-4">
            ← Home
          </Link>
        </li>
        <li>
          <Link href="/blog" className="text-accent hover:underline underline-offset-4">
            Blog
          </Link>
        </li>
      </ul>
    </div>
  );
}
