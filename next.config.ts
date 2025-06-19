import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.208.176.127:8000/:path*", // Backend server
      },
    ];
  },
  images: {
    domains: ["images.unsplash.com"],
    // Or use remotePatterns for more control (recommended):
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-*",
      },
    ],
  },
};

export default nextConfig;
