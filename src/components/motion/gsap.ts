"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, on the client only. Module scope guarantees a single registration.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const EASE_OUT = "power3.out";
export const MQ_MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MQ_FINE_POINTER = "(pointer: fine)";

export { gsap, ScrollTrigger, useGSAP };
