import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Completely disable image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP domains
      },
    ],
  },
};

export default nextConfig;
