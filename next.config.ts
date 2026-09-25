import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All artwork is shipped from /public. Serving these files directly avoids
    // intermittent local optimizer responses that were leaving artwork tiles blank.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
