"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

gsap.registerPlugin(SplitText);

/**
 * The signature moment (FR-HERO-1..5, D7 "kinetic rise").
 * Client component, but all content server-renders — nothing is hidden
 * before JS (FR-SITE-6): the timeline animates FROM offset states, so the
 * no-JS baseline is the finished composition.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-name", {
          type: "lines,chars",
          mask: "lines",
        });

        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(split.chars, {
            yPercent: 115,
            rotate: 4,
            duration: 0.7,
            stagger: 0.038,
          })
          .from(
            ".hero-rise",
            { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.09 },
            "-=0.25",
          );
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      id="hero"
      ref={scope}
      data-testid="hero"
      data-motion={reduced ? "reduced" : "full"}
      className="relative flex min-h-[80vh] scroll-mt-20 flex-col justify-center py-24"
    >
      <p className="hero-rise mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {site.availability} <span className="text-accent">●</span>
      </p>

      <h1
        aria-label={`${site.name}.`}
        className="hero-name font-display text-6xl font-bold leading-[0.95] tracking-tighter sm:text-8xl"
      >
        {site.name}
        <span className="text-accent">.</span>
      </h1>

      <p className="hero-rise mt-6 max-w-xl text-lg text-muted">
        {site.role}. Proof, not adjectives.
      </p>

      <p className="hero-rise mt-10">
        <a
          href="#contact"
          className="inline-block border border-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-ink"
        >
          Get in touch →
        </a>
      </p>

      <p
        aria-hidden="true"
        className="hero-rise absolute bottom-8 left-0 font-mono text-[11px] uppercase tracking-[0.2em] text-faint"
      >
        Scroll ↓
      </p>
    </section>
  );
}
