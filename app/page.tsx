import { site } from "@/lib/site";

/**
 * Landing page — narrative order per FR-SITE-1. This is the server-rendered
 * baseline (FR-SITE-6): identity, role, availability, and contact are real
 * from day one. Each placeholder section is replaced by its feature
 * (F002 hero, F007 work, F009 playground, F008 about, F004 blog teaser,
 * F006 contact).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* F002 replaces this static baseline with the kinetic hero. */}
      <section id="hero" className="flex min-h-[70vh] flex-col justify-center py-24">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          {site.availability} <span className="text-accent">●</span>
        </p>
        <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tighter sm:text-8xl">
          {site.name}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          {site.role}. Proof, not adjectives.
        </p>
        <p className="mt-10">
          <a
            href="#contact"
            className="border border-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            Get in touch →
          </a>
        </p>
      </section>

      <section id="work" className="border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Selected work</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F007 — in the loop"}</p>
      </section>

      <section id="playground" className="border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">Playground</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F009 — in the loop"}</p>
      </section>

      <section id="about" className="border-t border-line py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight">About</h2>
        <p className="mt-4 font-mono text-sm text-faint">{"// F008 — in the loop"}</p>
      </section>

      <section id="contact" className="border-t border-line py-24">
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
