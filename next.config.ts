import type { NextConfig } from "next";

const githubPagesBuild = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = githubPagesBuild ? "/ArtsySanya" : "";

const nextConfig: NextConfig = {
  output: githubPagesBuild ? "export" : undefined,
  basePath: githubPagesBuild ? githubPagesBasePath : undefined,
  trailingSlash: githubPagesBuild,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
    NEXT_PUBLIC_SITE_URL: githubPagesBuild
      ? `https://sanya28wd.github.io${githubPagesBasePath}`
      : "https://artsysanya.vercel.app",
  },
  images: {
    // All artwork is shipped from /public. Serving these files directly avoids
    // intermittent local optimizer responses that were leaving artwork tiles blank.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
