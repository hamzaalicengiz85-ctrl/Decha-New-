import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@decha/content"],
  images: { unoptimized: true },
};

export default nextConfig;
