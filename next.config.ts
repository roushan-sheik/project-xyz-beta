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
    remotePatterns: [
      {
        protocol: "http",
        hostname: "15.206.185.80",
        port: "",
        pathname: "/media/gallery/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript build errors
  },
};

export default nextConfig;
