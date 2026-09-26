import { GalleryClient } from "@/components/gallery-client";
import { artworks } from "@/lib/artworks";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <GalleryClient artworks={artworks} />;
}
