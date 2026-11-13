# Zenith X FTC 2026 site

Website for FIRST Tech Challenge team **Zenith X (#33634)**, built from our engineering notebook.

Next.js (App Router) + Tailwind CSS + GSAP. Custom cursor, scroll reveals, magnetic buttons and a hero glow that follows the pointer. All motion turns off under `prefers-reduced-motion`, and the custom cursor only runs on mouse/trackpad devices.

```bash
npm install
npm run dev   # http://localhost:3000
```

- Editable content (season log, robot, team, drive team): `src/content/site.json`. Edit it through `/admin`.
- Fixed copy (process, goals): `src/content/notebook.ts`
- Photos: `public/notebook/`
- Sections: `src/components/sections/`
- Cursor & motion: `src/components/Cursor.tsx`, `src/components/motion/`

## Deploying (Cloudflare Workers)

The site is a static export (`output: "export"` in `next.config.ts`): `npm run build` writes plain files to `out/`, and `wrangler.jsonc` tells Cloudflare to serve that folder as static assets. There is no server code to crash.

In Cloudflare → Workers → this project → Settings → Build:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Preview locally the same way Cloudflare runs it: `npm run build && npx wrangler dev`.

## Admin panel (`/admin`)

Open `https://<your-site>/admin` to edit the season log, robot, team and drive team, and upload photos.

- **Sign in** with a GitHub fine-grained token: *Only select repositories* → this repo, *Contents: Read and write*. The sign-in page links straight to GitHub's token form. The token stays in that browser and is only sent to GitHub.
- **Publish** saves everything as one commit to the branch Cloudflare builds (`src/content/site.json` plus new photos in `public/notebook/uploads/`). Cloudflare rebuilds and the live site updates in about 1–2 minutes.
- Photos are resized to 1600px in the browser before upload.
- If two people edit at once, the second publish is stopped instead of overwriting the first; reload and redo the edit.
- If Cloudflare builds from a different branch (e.g. `main`), change it under *Repository settings* on the sign-in page, or `DEFAULT_REPO` in `src/admin/AdminApp.tsx`.

Anyone can open `/admin`, but nobody can change anything without a token that has write access to the repo.
