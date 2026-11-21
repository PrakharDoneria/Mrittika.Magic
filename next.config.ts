import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress assets using gzip / brotli for faster payload delivery
  compress: true,
  // Power routing prefetching & optimize bundle size
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // Enable Next.js AVIF and WebP image optimization algorithms
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days in cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
