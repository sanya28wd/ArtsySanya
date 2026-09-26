"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import type { Artwork, Category } from "@/lib/artworks";
import { ShaderGradientPanel } from "@/components/shader-gradient-panel";
import { categories } from "@/lib/artworks";
import { colourFamilies, hasColourFamily, type ColourFamily } from "@/lib/colour";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkLightbox } from "@/components/artwork-lightbox";
import Image from "next/image";
import { publicAsset } from "@/lib/site";

type Selection = "All" | Category;

const familyColours: Record<ColourFamily, string> = {
  Crimson: "#cc3041",
  Coral: "#f56f49",
  Gold: "#e6b72e",
  Green: "#48a86c",
  Turquoise: "#30b9bd",
  Blue: "#315fa7",
  Violet: "#8d58c8",
  Rose: "#db5c9a",
  Monochrome: "#b5b3ae",
};

export const GalleryClient = ({
  artworks,
  initialCategory,
}: {
  readonly artworks: readonly Artwork[];
  readonly initialCategory: Selection;
}) => {
  const [category, setCategory] = useState<Selection>(initialCategory);
  const [colour, setColour] = useState<ColourFamily | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLightboxArtwork, setActiveLightboxArtwork] = useState<Artwork | null>(null);

  const visible = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return artworks.filter((artwork) => {
      const matchCategory = category === "All" || artwork.category === category;
      const matchColour = colour === null || hasColourFamily(artwork.colors, colour);
      const matchSearch =
        q === "" ||
        artwork.title.toLowerCase().includes(q) ||
        artwork.description.toLowerCase().includes(q) ||
        (artwork.medium && artwork.medium.toLowerCase().includes(q)) ||
        artwork.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchCategory && matchColour && matchSearch;
    });
  }, [artworks, category, colour, searchQuery]);

  const resetFilters = (): void => {
    setCategory("All");
    setColour(null);
    setSearchQuery("");
  };

  const hasActiveFilters = category !== "All" || colour !== null || searchQuery !== "";

  return (
    <main
      className="page-shell gallery-page-shell"
      style={
        {
          "--ambient-filter-colour": colour ? familyColours[colour] : "transparent",
        } as CSSProperties
      }
    >
      {/* Ambient reactive backdrop glow */}
      {colour && <div className="ambient-filter-glow" aria-hidden="true" />}

      <section className="page-hero">
        <figure className="page-hero-visual">
          <ShaderGradientPanel palette="gallery" />
          <div className="hero-artwork-frame">
            <Image src={publicAsset("/artworks/peacock-nocturne.jpg")} alt="Blue hand-painted bottle with a peacock design" fill priority sizes="(max-width: 800px) 88vw, 42vw" />
            <figcaption>01 / A STUDIO ORIGINAL</figcaption>
          </div>
        </figure>
        <p className="eyebrow">The full collection</p>
        <h1>
          Find the piece
          <br />
          that feels <i>like you.</i>
        </h1>
        <p>
          Originals, prints, and custom recreations are available across every collection.
          Currently shipping within the UAE.
        </p>
      </section>

      {/* Filter & Search Bar */}
      <section className="filter-section">
        <div className="search-and-stats-row">
          <div className="gallery-search-wrap">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, medium, theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gallery-search-input"
              aria-label="Search artworks"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="filter-row" aria-label="Filter by category">
          <button
            className={category === "All" ? "selected" : ""}
            onClick={() => setCategory("All")}
          >
            All works ({artworks.length})
          </button>
          {categories.map((item) => {
            const count = artworks.filter((a) => a.category === item).length;
            return (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item} <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Colour spectrum filter */}
        <div className="colour-filter colour-family-filter" id="colour">
          <span>Explore by colour:</span>
          <div className="colour-chips-scroll">
            {colourFamilies.map((family) => (
              <button
                key={family}
                aria-label={`Filter artworks by ${family}`}
                className={colour === family ? "colour-selected" : ""}
                style={{ "--family-colour": familyColours[family] } as CSSProperties}
                onClick={() => setColour(colour === family ? null : family)}
              >
                <b>{family}</b>
              </button>
            ))}
          </div>
        </div>

        {/* Filter summary status */}
        <div className="filter-summary">
          <p className="result-count" aria-live="polite">
            Showing <strong>{visible.length}</strong> {visible.length === 1 ? "work" : "works"}
            {category !== "All" && ` in ${category}`}
            {colour && ` (${colour} palette)`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          {hasActiveFilters && (
            <button className="clear-filters" onClick={resetFilters}>
              Reset all filters ×
            </button>
          )}
        </div>
      </section>

      {/* Art Grid with Pop Layout Animation */}
      <section className="art-grid gallery-grid">
        {visible.length === 0 ? (
          <div className="no-results-view">
            <p className="no-results-title">No artworks matched your current filters.</p>
            <p className="no-results-hint">
              Try adjusting your search keywords or reset the palette selection.
            </p>
            <button className="button button-dark" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {visible.map((artwork, index) => (
              <motion.div
                className="artwork-card-motion"
                key={artwork.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, delay: Math.min(index * 0.035, 0.18) }}
              >
                <ArtworkCard
                  artwork={artwork}
                  priority={index < 4}
                  onQuickInspect={(art) => setActiveLightboxArtwork(art)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </section>

      {/* Interactive Lightbox Modal */}
      <ArtworkLightbox
        artwork={activeLightboxArtwork}
        allArtworks={visible}
        onClose={() => setActiveLightboxArtwork(null)}
        onSelectArtwork={(art) => setActiveLightboxArtwork(art)}
      />
    </main>
  );
};
