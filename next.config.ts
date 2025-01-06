import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com", "lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds
  },
};

export default nextConfig;
