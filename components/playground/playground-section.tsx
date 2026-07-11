"use client";

import { useState } from "react";
import { experiments } from "@/components/playground/experiments";

/**
 * Playground (FR-PLAY-1..3): poster cards; experiments mount only on an
 * explicit Run — one opt-in mechanism covers lazy loading, low-end
 * devices, and reduced-motion preferences.
 */
export function PlaygroundSection() {
  const [running, setRunning] = useState<Record<string, boolean>>({});

  return (
    <section id="playground" className="scroll-mt-20 border-t border-line py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight">
        Playground<span className="text-accent">.</span>
      </h2>
      <p className="mt-4 max-w-xl text-muted">
        Small experiments, mounted only when you ask. Engineering craft, no
        page-weight tax.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {experiments.map((experiment) => (
          <article
            key={experiment.slug}
            className="flex h-64 flex-col border border-line bg-surface p-6"
          >
            <h3 className="font-display text-lg font-bold tracking-tight">
              {experiment.title}
            </h3>

            {running[experiment.slug] ? (
              <div className="mt-4 min-h-0 flex-1" data-testid={`stage-${experiment.slug}`}>
                <experiment.Component />
              </div>
            ) : (
              <div className="mt-4 flex min-h-0 flex-1 flex-col justify-between">
                <p className="text-sm text-muted">{experiment.description}</p>
                <button
                  type="button"
                  onClick={() =>
                    setRunning((state) => ({ ...state, [experiment.slug]: true }))
                  }
                  className="self-start cursor-pointer border border-accent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                >
                  Run →
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
