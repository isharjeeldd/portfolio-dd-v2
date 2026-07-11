import { site } from "@/lib/site";

/**
 * Global footer (FR-SITE-5): mark, name, socials, RSS, work-sample pointer.
 * The meta case-study link activates when the post ships (F012).
 */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-sm font-bold tracking-tighter">
          {site.mark}
          <sup className="text-[0.55em] text-accent">®</sup>
          <span className="ml-3 font-body text-xs font-normal text-muted">
            {site.name} · {site.role}
          </span>
        </p>

        <ul className="flex items-center gap-5 font-mono text-xs uppercase tracking-widest">
          <li>
            <a href={site.socials.github} rel="me noopener" target="_blank" className="text-muted transition-colors hover:text-ink">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.socials.linkedin} rel="me noopener" target="_blank" className="text-muted transition-colors hover:text-ink">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.socials.upwork} rel="me noopener" target="_blank" className="text-muted transition-colors hover:text-ink">
              Upwork
            </a>
          </li>
          <li>
            <a href="/feed.xml" className="text-muted transition-colors hover:text-ink">
              RSS
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
