import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor previews reach the dev server via the loopback IP; allow it so HMR and
  // dev assets load when the page is opened from a different host alias.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
