import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitePath = new URL(site.url).pathname;

  return {
    rules: { userAgent: "*", allow: `${sitePath}/` },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
