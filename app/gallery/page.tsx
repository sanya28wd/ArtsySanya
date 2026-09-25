import { GalleryClient } from "@/components/gallery-client";
import { artworks, categories, type Category } from "@/lib/artworks";

export const metadata = { title: "Gallery" };
type GalleryPageProps = { readonly searchParams: Promise<{ readonly category?: string | readonly string[] }> };

const isCategory = (value: string): value is Category => categories.some((category) => category === value);

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && isCategory(category) ? category : "All";
  return <GalleryClient artworks={artworks} initialCategory={initialCategory}/>;
}
