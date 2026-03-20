/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
