import type { MetadataRoute } from "next";
import { artworks } from "@/lib/artworks";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap { const pages = ["", "/gallery", "/about", "/commissions"]; return [...pages.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() })), ...artworks.map((artwork) => ({ url: `${site.url}/artwork/${artwork.slug}`, lastModified: new Date() }))]; }
