"use client";

import { useEffect, useState } from "react";

const LINES = [
  "npm run tldr — 1 generated",
  "47 requirements. 7 ADRs. 0 vibes.",
  "tests first. always.",
  "git push origin develop",
  "proof, not adjectives.",
];

/** Playground: terminal typewriter cycling confident-minimal lines. */
export default function Terminal() {
  const [text, setText] = useState("");

  useEffect(() => {
    let line = 0;
    let char = 0;
    let deleting = false;

    const interval = setInterval(() => {
      const current = LINES[line];
      if (!deleting) {
        char += 1;
        if (char >= current.length) {
          deleting = true;
          char = current.length + 14; // pause before deleting
        }
      } else {
        char -= 2;
        if (char <= 0) {
          deleting = false;
          char = 0;
          line = (line + 1) % LINES.length;
        }
      }
      setText(current.slice(0, Math.max(0, Math.min(char, current.length))));
    }, 55);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="font-mono text-sm text-ink">
      <span className="text-faint">~/ms $ </span>
      {text}
      <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
    </p>
  );
}
