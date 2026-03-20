/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paywatch/ui", "@paywatch/database", "@paywatch/config", "@paywatch/email"],
};

module.exports = nextConfig;
