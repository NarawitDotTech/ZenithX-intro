"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ_FINE_POINTER, MQ_MOTION_OK } from "./gsap";

const GLOW_FOLLOW = 0.9;
const GRID_MASK = "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)";

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export function HeroGrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const glow = glowRef.current;
      const readout = readoutRef.current;
      const cross = crossRef.current;
      const hero = root?.parentElement;
      if (!root || !glow || !readout || !cross || !hero) return;

      const mm = gsap.matchMedia();
      mm.add(`${MQ_FINE_POINTER} and ${MQ_MOTION_OK}`, () => {
        // Glow sits at the hero centre (CSS); x/y are offsets from it.
        const xTo = gsap.quickTo(glow, "x", { duration: GLOW_FOLLOW, ease: "power3.out" });
        const yTo = gsap.quickTo(glow, "y", { duration: GLOW_FOLLOW, ease: "power3.out" });
        const cxTo = gsap.quickTo(cross, "x", { duration: GLOW_FOLLOW, ease: "power3.out" });
        const cyTo = gsap.quickTo(cross, "y", { duration: GLOW_FOLLOW, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          const px = e.clientX - r.left;
          const py = e.clientY - r.top;
          const dx = px - r.width / 2;
          const dy = py - r.height / 2;
          xTo(dx);
          yTo(dy);
          cxTo(dx);
          cyTo(dy);
          readout.textContent = `X ${pad(px)}  Y ${pad(py)}`;
        };
        const onEnter = () => gsap.to(cross, { opacity: 1, duration: 0.4, overwrite: "auto" });
        const onLeave = () => gsap.to(cross, { opacity: 0, duration: 0.4, overwrite: "auto" });

        hero.addEventListener("pointermove", onMove, { passive: true });
        hero.addEventListener("pointerenter", onEnter);
        hero.addEventListener("pointerleave", onLeave);
        return () => {
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerenter", onEnter);
          hero.removeEventListener("pointerleave", onLeave);
          gsap.set([glow, cross], { x: 0, y: 0 });
          gsap.set(cross, { opacity: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bp-grid absolute inset-0" style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }} />
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        <div
          ref={glowRef}
          className="absolute -left-[360px] -top-[360px] h-[720px] w-[720px] rounded-full will-change-transform"
          style={{
            background: "radial-gradient(circle, rgb(199 168 88 / 0.28) 0%, rgb(199 168 88 / 0.1) 38%, transparent 68%)",
          }}
        />
        <div ref={crossRef} className="absolute left-0 top-0 opacity-0 will-change-transform">
          <span className="absolute -left-4 top-0 h-px w-8 bg-text/20" />
          <span className="absolute -top-4 left-0 h-8 w-px bg-text/20" />
          <span
            ref={readoutRef}
            className="absolute left-4 top-3 whitespace-nowrap font-mono text-[10px] tracking-widest text-muted/70"
          >
            X 0000  Y 0000
          </span>
        </div>
      </div>
    </div>
  );
}
