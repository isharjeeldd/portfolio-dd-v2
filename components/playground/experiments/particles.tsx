"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Playground: pointer-reactive particle field drawn in the LIVE accent
 * color (FR-THEME-4). Falls back to a poster line when canvas is
 * unavailable (EC-PLAY-1).
 */
export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      setUnsupported(true);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);

    const dots = Array.from({ length: 48 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
    const pointer = { x: -1000, y: -1000 };

    function onPointerMove(event: PointerEvent) {
      const bounds = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    }
    canvas.addEventListener("pointermove", onPointerMove);

    let frame = 0;
    function tick() {
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue("--accent") ||
        "#ff4438";
      context!.clearRect(0, 0, rect.width, rect.height);

      for (const dot of dots) {
        const dx = pointer.x - dot.x;
        const dy = pointer.y - dot.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 90 && distance > 0.01) {
          dot.vx += (dx / distance) * 0.06;
          dot.vy += (dy / distance) * 0.06;
        }
        dot.vx *= 0.98;
        dot.vy *= 0.98;
        dot.x = (dot.x + dot.vx + rect.width) % rect.width;
        dot.y = (dot.y + dot.vy + rect.height) % rect.height;

        context!.fillStyle = accent;
        context!.beginPath();
        context!.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2);
        context!.fill();
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  if (unsupported) {
    return (
      <p className="font-mono text-xs text-faint">
        canvas unavailable — imagine 48 very obedient dots.
      </p>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label="Pointer-reactive particle field"
      className="h-full w-full cursor-crosshair"
    />
  );
}
