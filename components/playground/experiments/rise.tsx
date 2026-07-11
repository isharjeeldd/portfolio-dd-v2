"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

/** Playground: replayable kinetic rise — the hero's move, exposed. */
export default function Rise() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".pg-rise-word", { type: "chars" });
      const play = () =>
        gsap.fromTo(
          split.chars,
          { yPercent: 115, rotate: 6, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "expo.out",
          },
        );

      play();
      const button = scope.current?.querySelector(".pg-rise-replay");
      button?.addEventListener("click", play);
      return () => button?.removeEventListener("click", play);
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex h-full flex-col items-start justify-between gap-4">
      <p className="pg-rise-word overflow-hidden font-display text-4xl font-bold tracking-tighter">
        kinetic<span className="text-accent">.</span>
      </p>
      <button
        type="button"
        className="pg-rise-replay cursor-pointer font-mono text-[11px] uppercase tracking-widest text-accent hover:underline underline-offset-4"
      >
        Replay ↻
      </button>
    </div>
  );
}
