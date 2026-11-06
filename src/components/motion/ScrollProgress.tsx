"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" });
    const setScale = gsap.quickSetter(el, "scaleX");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScale(self.progress),
      onRefresh: (self) => setScale(self.progress),
    });
    return () => st.kill();
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-accent will-change-transform"
    />
  );
}
