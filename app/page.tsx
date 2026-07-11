import { BlogTeaser } from "@/components/blog/blog-teaser";
import { Hero } from "@/components/hero/hero";
import { site } from "@/lib/site";

/**
 * Landing page — narrative order per FR-SITE-1. Server-rendered baseline
 * (FR-SITE-6); remaining placeholder sections are replaced by their
 * features (F007 work, F009 playground, F008 about, F004 blog teaser,
 * F006 contact).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero />

      <section id="work" className="scroll-mt-20 border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Selected work</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F007 — in the loop"}</p>
      </section>

      <section id="playground" className="scroll-mt-20 border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Playground</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F009 — in the loop"}</p>
      </section>

      <section id="about" className="scroll-mt-20 border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">About</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F008 — in the loop"}</p>
      </section>

      <BlogTeaser />

      <section id="contact" className="scroll-mt-20 border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Contact</h2>
        <p className="mt-4 max-w-xl text-muted">
          Until the form ships (F006):{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline-offset-4 hover:underline">
            {site.email}
          </a>
        </p>
      </section>
    </div>
  );
}
