import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 blocks cross-origin access to /_next/* in `next dev`.
  // Without this, client hydration fails when previewing via tunnel / LAN / phone,
  // so buttons like the burger menu appear dead.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.trycloudflare.com",
    "*.local",
  ],
};

export default nextConfig;
