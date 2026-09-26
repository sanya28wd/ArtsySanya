import type { MetadataRoute } from "next";
import { artworks } from "@/lib/artworks";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/gallery", "/about", "/commissions"];
  const lastModified = new Date();

  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, lastModified })),
    ...artworks.map((artwork) => ({
      url: `${site.url}/artwork/${artwork.slug}`,
      lastModified,
    })),
  ];
}
