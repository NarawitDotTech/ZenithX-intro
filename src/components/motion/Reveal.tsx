"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MQ_MOTION_OK, EASE_OUT } from "./gsap";

const DURATION = 0.9;
const START = "top 88%";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds before the reveal starts once in view. */
  delay?: number;
  /** Initial downward offset in px. */
  y?: number;
}

export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 32 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ_MOTION_OK, () => {
        // Hidden state is applied here (JS), never in CSS, so no-JS users still see content.
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: DURATION,
            delay,
            ease: EASE_OUT,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: START, once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [delay, y] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
