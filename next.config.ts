import type { NextConfig } from "next";

// GitHub project Pages serves this repo at /lingoquest.
// `npm run build` sets GITHUB_PAGES=1. `next dev` leaves the prefix off so
// local preview stays at http://127.0.0.1:4871/.
const forPages = process.env.GITHUB_PAGES === "1";
const basePath = forPages ? "/lingoquest" : "";

const nextConfig: NextConfig = {
  // basePath already prefixes routes and /_next assets. Do not also set
  // assetPrefix to /lingoquest — Next would request /lingoquest/lingoquest/_next.
  ...(forPages
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Cursor previews reach the dev server via the loopback IP; allow it so HMR and
  // dev assets load when the page is opened from a different host alias.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
