import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @decha/content TypeScript kaynağı olarak paylaşılıyor
  transpilePackages: ["@decha/content"],
  images: {
    // İçerik görselleri admin panelinden yükleniyor ve /uploads altından servis ediliyor
    unoptimized: true,
  },
};

export default nextConfig;
