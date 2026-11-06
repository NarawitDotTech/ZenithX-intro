"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, MQ_MOTION_OK } from "./gsap";

const CHAR_DURATION = 0.9;
const CHAR_STAGGER = 0.025;
const CHAR_EASE = "expo.out";
const SCROLL_START = "top 85%";

interface SplitHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  trigger?: "scroll" | "load";
}

export function SplitHeading({ text, as: Tag = "h2", className, trigger = "scroll" }: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const chars = el.querySelectorAll<HTMLElement>("[data-char]");
      if (!chars.length) return;
      const mm = gsap.matchMedia();
      mm.add(MQ_MOTION_OK, () => {
        gsap.fromTo(
          chars,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: CHAR_DURATION,
            ease: CHAR_EASE,
            stagger: CHAR_STAGGER,
            scrollTrigger:
              trigger === "scroll" ? { trigger: el, start: SCROLL_START, once: true } : undefined,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, trigger] },
  );

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} aria-hidden="true">
          <span className="inline-block whitespace-nowrap align-bottom">
            {Array.from(word).map((ch, ci) => (
              // Mask has vertical padding/negative margin so descenders aren't clipped.
              <span key={ci} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                <span data-char className="inline-block will-change-transform">
                  {ch}
                </span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
