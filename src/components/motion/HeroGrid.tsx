"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ_FINE_POINTER, MQ_MOTION_OK } from "./gsap";

const GLOW_FOLLOW = 0.9;
const GRID_MASK = "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)";

/** Hero background: a faint grid and a soft gold glow that follows the pointer. */
export function HeroGrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const glow = glowRef.current;
      const hero = rootRef.current?.parentElement;
      if (!glow || !hero) return;

      const mm = gsap.matchMedia();
      mm.add(`${MQ_FINE_POINTER} and ${MQ_MOTION_OK}`, () => {
        // Glow sits at the hero centre (CSS); x/y are offsets from it.
        const xTo = gsap.quickTo(glow, "x", { duration: GLOW_FOLLOW, ease: "power3.out" });
        const yTo = gsap.quickTo(glow, "y", { duration: GLOW_FOLLOW, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          xTo(e.clientX - r.left - r.width / 2);
          yTo(e.clientY - r.top - r.height / 2);
        };

        hero.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          hero.removeEventListener("pointermove", onMove);
          gsap.set(glow, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bp-grid absolute inset-0 opacity-60" style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }} />
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        <div
          ref={glowRef}
          className="absolute -left-[360px] -top-[360px] h-[720px] w-[720px] rounded-full will-change-transform"
          style={{
            background: "radial-gradient(circle, rgb(199 168 88 / 0.16) 0%, rgb(199 168 88 / 0.06) 40%, transparent 68%)",
          }}
        />
      </div>
    </div>
  );
}
