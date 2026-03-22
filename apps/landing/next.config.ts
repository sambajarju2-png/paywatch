import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paywatch/ui", "@paywatch/config"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
