"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

type Mode = "default" | "hover" | "view" | "text";

const RING = 36;
const VIEW_SIZE = 88;
const DOT_FOLLOW = 0;
const RING_FOLLOW = 0.45;
const SCALE_DUR = 0.35;
const INTERACTIVE = '[data-cursor="view"], [data-cursor="text"], [data-cursor="hover"], a, button';

interface RingTarget {
  scaleX: number;
  scaleY: number;
  bg: string;
  border: string;
  dot: number;
  label: number;
  blend: string;
}

function targetFor(mode: Mode, pressed: boolean): RingTarget {
  const press = pressed ? 0.85 : 1;
  switch (mode) {
    case "hover":
      return { scaleX: 2 * press, scaleY: 2 * press, bg: "rgba(199,168,88,0.18)", border: "rgba(199,168,88,0.6)", dot: 0.4, label: 0, blend: "difference" };
    case "view": {
      const s = (VIEW_SIZE / RING) * press;
      return { scaleX: s, scaleY: s, bg: "#c7a858", border: "rgba(199,168,88,1)", dot: 0, label: 1, blend: "normal" };
    }
    case "text":
      return { scaleX: 0.07 * press, scaleY: 1.4, bg: "#f2f0ea", border: "rgba(242,240,234,0)", dot: 0, label: 0, blend: "difference" };
    default:
      return { scaleX: press, scaleY: press, bg: "rgba(199,168,88,0)", border: "rgba(242,240,234,0.35)", dot: 1, label: 0, blend: "difference" };
  }
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  // The admin panel is a form-heavy tool: keep the normal cursor there.
  const onAdmin = usePathname()?.startsWith("/admin") ?? false;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Capability detection: fine pointer + motion allowed.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const sync = () => {
      const on = !onAdmin && fine.matches && !reduced.matches;
      setEnabled(on);
      root.classList.toggle("has-custom-cursor", on);
    };
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      root.classList.remove("has-custom-cursor");
    };
  }, [onAdmin]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ringWrap || !ring || !label) return;

    gsap.set([dot, ringWrap], { opacity: 0 });
    const dotX = gsap.quickTo(dot, "x", { duration: DOT_FOLLOW || 0.01, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: DOT_FOLLOW || 0.01, ease: "none" });
    const ringX = gsap.quickTo(ringWrap, "x", { duration: RING_FOLLOW, ease: "power3.out" });
    const ringY = gsap.quickTo(ringWrap, "y", { duration: RING_FOLLOW, ease: "power3.out" });

    let mode: Mode = "default";
    let pressed = false;
    let visible = false;

    const apply = () => {
      const t = targetFor(mode, pressed);
      gsap.to(ring, {
        scaleX: t.scaleX,
        scaleY: t.scaleY,
        backgroundColor: t.bg,
        borderColor: t.border,
        duration: SCALE_DUR,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, { scale: t.dot, duration: 0.25, ease: "power3.out", overwrite: "auto" });
      gsap.to(label, { opacity: t.label, duration: 0.2, overwrite: "auto" });
      ringWrap.style.mixBlendMode = t.blend;
    };

    const show = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      gsap.to([dot, ringWrap], { opacity: v ? 1 : 0, duration: 0.25, overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        // Snap to the pointer on first appearance so the ring doesn't fly in from the corner.
        gsap.set(ringWrap, { x: e.clientX, y: e.clientY });
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        show(true);
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest(INTERACTIVE) ?? null;
      let next: Mode = "default";
      if (el) {
        const kind = el.getAttribute("data-cursor");
        next = kind === "view" ? "view" : kind === "text" ? "text" : "hover";
        if (next === "view") label.textContent = el.getAttribute("data-cursor-label") ?? "VIEW";
      }
      if (next !== mode) {
        mode = next;
        apply();
      }
    };

    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        show(false);
        mode = "default";
        apply();
      }
    };
    const onDown = () => {
      pressed = true;
      apply();
    };
    const onUp = () => {
      pressed = false;
      apply();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    apply();

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ringWrap, ring, label]);
    };
  }, [enabled]);

  if (!enabled) return null;

  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform, opacity",
  };

  return (
    <div aria-hidden="true">
      <div
        ref={ringWrapRef}
        style={{ ...base, width: 0, height: 0, zIndex: 2147483646, mixBlendMode: "difference" }}
      >
        <div
          ref={ringRef}
          style={{
            position: "absolute",
            left: -RING / 2,
            top: -RING / 2,
            width: RING,
            height: RING,
            borderRadius: "50%",
            border: "1px solid rgba(242,240,234,0.35)",
            boxSizing: "border-box",
          }}
        />
        <span
          ref={labelRef}
          className="font-mono"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            opacity: 0,
            color: "var(--accent-ink)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
          }}
        >
          VIEW
        </span>
      </div>
      <div
        ref={dotRef}
        style={{ ...base, width: 0, height: 0, zIndex: 2147483647 }}
      >
        <div
          style={{
            position: "absolute",
            left: -3,
            top: -3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}
