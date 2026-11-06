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

## Deploying (Cloudflare Workers)

The site is a static export (`output: "export"` in `next.config.ts`): `npm run build` writes plain files to `out/`, and `wrangler.jsonc` tells Cloudflare to serve that folder as static assets. There is no server code to crash.

In Cloudflare → Workers → this project → Settings → Build:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Preview locally the same way Cloudflare runs it: `npm run build && npx wrangler dev`.
