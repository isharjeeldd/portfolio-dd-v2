"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Experiment registry (FR-PLAY-1/2): each component loads only when the
 * visitor hits Run — landing JS carries none of this code.
 */
export type Experiment = {
  slug: string;
  title: string;
  description: string;
  Component: ComponentType;
};

export const experiments: Experiment[] = [
  {
    slug: "kinetic-rise",
    title: "Kinetic rise",
    description: "The hero's signature move, replayable. GSAP SplitText, 40ms stagger.",
    Component: dynamic(() => import("./experiments/rise"), { ssr: false }),
  },
  {
    slug: "accent-field",
    title: "Accent field",
    description: "48 particles chasing your pointer — drawn in whatever accent you picked.",
    Component: dynamic(() => import("./experiments/particles"), { ssr: false }),
  },
  {
    slug: "terminal",
    title: "~/ms",
    description: "A terminal that only speaks in shipping updates.",
    Component: dynamic(() => import("./experiments/terminal"), { ssr: false }),
  },
];
