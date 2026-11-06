"use client";

import { useRef } from "react";
import { Logo } from "@/components/Logo";
import { gsap, useGSAP, MQ_FINE_POINTER, MQ_MOTION_OK } from "./gsap";

type HeroLogoProps = {
  className?: string;
};

/**
 * The hornet mark for the hero: flies in on load, hovers gently, and tilts
 * toward the pointer. Static under reduced motion.
 */
export const HeroLogo = ({ className = "" }: HeroLogoProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const tilt = tiltRef.current;
      const float = floatRef.current;
      if (!wrap || !tilt || !float) return;

      const mm = gsap.matchMedia();

      mm.add(MQ_MOTION_OK, () => {
        gsap.from(wrap, {
          opacity: 0,
          scale: 0.82,
          rotate: -8,
          x: 60,
          y: -30,
          duration: 1.4,
          delay: 0.25,
          ease: "expo.out",
        });
        gsap.to(float, {
          y: -14,
          rotate: 1.5,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      mm.add(`${MQ_MOTION_OK} and ${MQ_FINE_POINTER}`, () => {
        const section = wrap.closest("section") ?? document.body;
        const rxTo = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ryTo = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ryTo(px * 18);
          rxTo(-py * 14);
        };
        const onLeave = () => {
          rxTo(0);
          ryTo(0);
        };
        section.addEventListener("pointermove", onMove as EventListener);
        section.addEventListener("pointerleave", onLeave);
        return () => {
          section.removeEventListener("pointermove", onMove as EventListener);
          section.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className={`[perspective:900px] ${className}`}>
      <div ref={tiltRef} className="[transform-style:preserve-3d]">
        <div ref={floatRef} className="relative">
          <span
            aria-hidden
            className="absolute inset-[12%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(199_168_88/0.35),transparent_65%)] blur-2xl"
          />
          <Logo title="Zenith X hornet logo" className="h-auto w-full text-accent drop-shadow-[0_10px_40px_rgb(199_168_88/0.25)]" />
        </div>
      </div>
    </div>
  );
};
