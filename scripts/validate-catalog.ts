import { existsSync } from "node:fs";
import { join } from "node:path";
import { artworks, categories, type Media } from "../lib/artworks";

const checkMedia = (media: Media, artworkTitle: string): void => {
  const sourcePath = join(process.cwd(), "public", media.src);
  if (!existsSync(sourcePath)) throw new Error(`Missing media for ${artworkTitle}: ${media.src}`);
  if (media.alt.trim().length < 12) throw new Error(`Alt text is too short for ${artworkTitle}: ${media.src}`);
  if (media.kind === "video" && !existsSync(join(process.cwd(), "public", media.poster))) throw new Error(`Missing video poster for ${artworkTitle}: ${media.poster}`);
};

const slugs = new Set<string>();
for (const artwork of artworks) {
  if (slugs.has(artwork.slug)) throw new Error(`Duplicate artwork slug: ${artwork.slug}`);
  if (!categories.includes(artwork.category)) throw new Error(`Invalid category for ${artwork.title}: ${artwork.category}`);
  if (artwork.title.trim().length === 0) throw new Error(`Artwork has no title: ${artwork.id}`);
  slugs.add(artwork.slug);
  checkMedia(artwork.cover, artwork.title);
  artwork.media.forEach((media) => checkMedia(media, artwork.title));
}

console.log(`Validated ${artworks.length} artwork records.`);
