import Link from "next/link";
import { featuredProjects, secondaryProjects, type Project } from "@/lib/data/projects";

function ProjectLinks({ links }: { links: Project["links"] }) {
  // No dead CTAs — absent URLs render nothing (EC-WORK-1).
  return (
    <span className="flex gap-4 font-mono text-[11px] uppercase tracking-widest">
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noopener"
          className="text-accent underline-offset-4 hover:underline"
        >
          Live ↗
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener"
          className="text-accent underline-offset-4 hover:underline"
        >
          GitHub ↗
        </a>
      )}
      {links.post && (
        <Link href={links.post} className="text-accent underline-offset-4 hover:underline">
          Case study →
        </Link>
      )}
    </span>
  );
}

/** Selected Work (FR-WORK-1..4): six curated rows + compact secondary line. */
export function WorkSection() {
  return (
    <section id="work" className="scroll-mt-20 border-t border-line py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight">
        Selected work<span className="text-accent">.</span>
      </h2>

      <div className="mt-6">
        {featuredProjects.map((project) => (
          <article key={project.slug} className="group border-b border-line py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <ProjectLinks links={project.links} />
            </div>
            <p className="mt-2 max-w-2xl text-muted">{project.outcome}</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-faint">
              {project.role} · {project.stack.join(" · ")}
            </p>
          </article>
        ))}
      </div>

      {secondaryProjects.length > 0 && (
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-faint">
          Also:{" "}
          {secondaryProjects.map((project, index) => (
            <span key={project.slug}>
              {index > 0 && " · "}
              {project.links.live ? (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener"
                  className="text-muted transition-colors hover:text-accent"
                >
                  {project.title} ↗
                </a>
              ) : (
                <span className="text-muted">{project.title}</span>
              )}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
