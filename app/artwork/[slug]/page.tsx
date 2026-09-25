import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artwork-detail";
import { artworks, getArtwork, getRelated } from "@/lib/artworks";

export const generateStaticParams = () => artworks.map((artwork) => ({ slug: artwork.slug }));
export const generateMetadata = async ({ params }: { readonly params: Promise<{ readonly slug: string }> }): Promise<Metadata> => { const { slug } = await params; const artwork = getArtwork(slug); return artwork === undefined ? {} : { title: artwork.title, description: artwork.description, openGraph: { images: artwork.cover.kind === "image" ? [artwork.cover.src] : [] } }; };
export default async function ArtworkPage({ params }: { readonly params: Promise<{ readonly slug: string }> }) { const { slug } = await params; const artwork = getArtwork(slug); if (artwork === undefined) notFound(); return <ArtworkDetail artwork={artwork} related={getRelated(artwork)}/>; }
