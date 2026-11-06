# Zenith X — FTC 2026 site

Website for FIRST Tech Challenge team **Zenith X (#33634)**, built from our engineering notebook.

Next.js (App Router) + Tailwind CSS + GSAP. Custom cursor, scroll reveals, magnetic buttons, scroll-velocity marquee and a pointer-tracking hero. All motion turns off under `prefers-reduced-motion`, and the custom cursor only runs on mouse/trackpad devices.

```bash
npm install
npm run dev   # http://localhost:3000
```

- Content: `src/content/notebook.ts` — edit this to add new log entries.
- Photos: `public/notebook/`
- Sections: `src/components/sections/`
- Cursor & motion: `src/components/Cursor.tsx`, `src/components/motion/`
