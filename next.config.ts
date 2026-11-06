import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to ./out,
  // which Cloudflare serves as static assets (see wrangler.jsonc). No server runtime.
  output: "export",
  // Image optimisation needs a server; photos in public/ are pre-compressed instead.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
