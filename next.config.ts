import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor previews use the loopback IP while Next binds to all interfaces.
  // Allowing it keeps development assets and hydration available in Preview.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
