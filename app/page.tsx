import { AboutSection } from "@/components/about/about-section";
import { BlogTeaser } from "@/components/blog/blog-teaser";
import { ContactForm } from "@/components/contact/contact-form";
import { Hero } from "@/components/hero/hero";
import { WorkSection } from "@/components/work/work-section";
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

      <WorkSection />

      <section id="playground" className="scroll-mt-20 border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Playground</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F009 — in the loop"}</p>
      </section>

      <AboutSection />

      <BlogTeaser />

      <section id="contact" className="scroll-mt-20 border-t border-line py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          {site.availability} <span className="text-accent">●</span>
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Contact<span className="text-accent">.</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          A role, a contract, or a question about something I wrote — all
          welcome. Direct email works too:{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline-offset-4 hover:underline">
            {site.email}
          </a>
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
