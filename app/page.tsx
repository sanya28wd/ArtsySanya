import { HomeClient } from "@/components/home-client";
import { artworks } from "@/lib/artworks";

const selectArtworks = (slugs: readonly string[]) => slugs.map((slug) => artworks.find((artwork) => artwork.slug === slug)).filter((artwork): artwork is (typeof artworks)[number] => artwork !== undefined);

export default function HomePage() {
  const featured = selectArtworks(["burj-after-dark", "wings-in-gold", "violet-minarets", "sunset-promise", "peacock-nocturne", "tidal-blue"]);
  const hero = selectArtworks(["violet-minarets", "folk-wedding", "radha-krishna-reverie", "turquoise-metamorphosis", "electric-feather", "sunset-promise", "tidal-blue", "moonlit-betta"]);
  return <HomeClient featured={featured} hero={hero}/>;
}
