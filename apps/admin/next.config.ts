import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paywatch/ui", "@paywatch/database", "@paywatch/config"],
};

export default nextConfig;
