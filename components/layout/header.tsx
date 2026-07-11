import Link from "next/link";
import { AccentSwitcher } from "@/components/theme/accent-switcher";
import { sections, site } from "@/lib/site";

/**
 * Persistent navigation (FR-SITE-2): MS® mark home affordance, landing
 * section anchors, /blog, and the accent switcher.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          aria-label={`${site.mark}® — ${site.name}, home`}
          className="font-display text-lg font-bold tracking-tighter"
        >
          {site.mark}
          <sup className="text-[0.55em] text-accent">®</sup>
        </Link>

        {/* Horizontal scroll on narrow viewports — the page never scrolls sideways (FR-SITE-2). */}
        <nav aria-label="Primary" className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex items-center gap-5 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`/#${section.id}`} className="transition-colors hover:text-ink">
                  {section.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/blog" className="transition-colors hover:text-ink">
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        <AccentSwitcher />
      </div>
    </header>
  );
}
