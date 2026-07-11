import { education, orderedRoles, skillGroups } from "@/lib/data/experience";
import { site } from "@/lib/site";

/** About / Experience (FR-ABOUT-1..3): story, timeline, skills, CV. */
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-line py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight">
        About<span className="text-accent">.</span>
      </h2>

      <p className="mt-6 max-w-2xl text-lg text-muted">
        {site.name} — {site.role.toLowerCase()} with five years across
        platforms, products, and AI systems: microservice trust models,
        enterprise agent platforms, and the frontends that make them usable.
        This site is built the way I work — spec first, tests first,{" "}
        <span className="text-ink">proof, not adjectives</span>.
      </p>

      <div className="mt-12">
        {orderedRoles().map((role) => (
          <article key={role.company} className="border-b border-line py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-bold tracking-tight">
                {role.role} · {role.company}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                {role.period}
              </p>
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-faint">
              {role.location}
            </p>
            <ul className="mt-4 max-w-2xl space-y-2 text-muted">
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}

        <article className="border-b border-line py-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-display text-xl font-bold tracking-tight">
              {education.degree} · {education.institution}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              {education.period}
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-muted">{education.note}</p>
        </article>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {group.label}
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12">
        <a
          href="/cv.pdf"
          download
          className="inline-block border border-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink"
        >
          Download CV ↓
        </a>
      </p>
    </section>
  );
}
