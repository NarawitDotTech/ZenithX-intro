"use client";

import { useRef, type ReactElement } from "react";
import { gsap, useGSAP, MQ_FINE_POINTER, MQ_MOTION_OK } from "./gsap";

const FOLLOW_DURATION = 0.4;
const RETURN_EASE = "elastic.out(1, 0.4)";
const RETURN_DURATION = 1.1;

interface MagneticProps {
  children: ReactElement;
  /** Fraction of the pointer offset (from centre) the child moves. */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ_FINE_POINTER} and ${MQ_MOTION_OK}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: FOLLOW_DURATION, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: FOLLOW_DURATION, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          // Measured against the un-translated centre to avoid feedback jitter.
          const cx = r.left + r.width / 2 - (gsap.getProperty(el, "x") as number);
          const cy = r.top + r.height / 2 - (gsap.getProperty(el, "y") as number);
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: RETURN_DURATION, ease: RETURN_EASE, overwrite: "auto" });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
}
