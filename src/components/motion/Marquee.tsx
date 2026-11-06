"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ_MOTION_OK } from "./gsap";

const COPIES = 4;
const MAX_DT = 0.05;
const VELOCITY_GAIN = 1 / 600; // extra speed multiple per px/s of scroll
const MAX_BOOST = 5;
const VEL_SMOOTH = 6; // 1/s, how fast measured scroll velocity follows
const DIR_SMOOTH = 4; // 1/s, how fast direction flips/eases
const DIR_THRESHOLD = 40; // px/s before direction is considered changed

interface MarqueeProps {
  items: string[];
  /** Base speed in px/second. */
  speed?: number;
  className?: string;
}

interface MarqueeGroupProps {
  items: string[];
  hidden: boolean;
  groupRef?: React.Ref<HTMLDivElement>;
}

function MarqueeGroup({ items, hidden, groupRef }: MarqueeGroupProps) {
  return (
    <div ref={groupRef} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span
            className="px-8 font-sans text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-none tracking-tight whitespace-nowrap text-transparent"
            style={{ WebkitTextStroke: "1px rgb(237 235 245 / 0.45)" }}
          >
            {item}
          </span>
          <span className="text-accent text-[clamp(1rem,2.5vw,2rem)] leading-none">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee({ items, speed = 70, className }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const group = groupRef.current;
      if (!root || !track || !group) return;

      const mm = gsap.matchMedia();
      mm.add(MQ_MOTION_OK, () => {
        let width = group.offsetWidth;
        let x = 0;
        let vel = 0;
        let dir = 1;
        let dirTarget = 1;
        let lastY = window.scrollY;
        let inView = true;
        const setX = gsap.quickSetter(track, "x", "px");

        const ro = new ResizeObserver(() => {
          width = group.offsetWidth;
        });
        ro.observe(group);
        const io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          lastY = window.scrollY;
        });
        io.observe(root);

        const tick = (_t: number, deltaMs: number) => {
          if (!inView || width === 0) return;
          const dt = Math.min(deltaMs / 1000, MAX_DT);
          if (dt <= 0) return;
          const y = window.scrollY;
          const v = (y - lastY) / dt;
          lastY = y;
          vel += (v - vel) * Math.min(1, dt * VEL_SMOOTH);
          if (Math.abs(vel) > DIR_THRESHOLD) dirTarget = vel > 0 ? 1 : -1;
          dir += (dirTarget - dir) * Math.min(1, dt * DIR_SMOOTH);
          const boost = 1 + Math.min(Math.abs(vel) * VELOCITY_GAIN, MAX_BOOST);
          x -= speed * dir * boost * dt;
          x = gsap.utils.wrap(-width, 0, x);
          setX(x);
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          ro.disconnect();
          io.disconnect();
          gsap.set(track, { x: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [speed, items] },
  );

  return (
    <div ref={rootRef} className={`overflow-hidden ${className ?? ""}`.trim()}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {Array.from({ length: COPIES }, (_, i) => (
          <MarqueeGroup key={i} items={items} hidden={i > 0} groupRef={i === 0 ? groupRef : undefined} />
        ))}
      </div>
    </div>
  );
}
