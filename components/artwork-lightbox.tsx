"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Artwork, Format } from "@/lib/artworks";
import { useInquiry } from "@/components/inquiry-provider";
import { triggerToast } from "@/components/toast-notification";

type LightboxProps = {
  readonly artwork: Artwork | null;
  readonly allArtworks?: readonly Artwork[];
  readonly onClose: () => void;
  readonly onSelectArtwork?: (artwork: Artwork) => void;
};

const formatLabel: Record<Format, string> = {
  original: "Original Artwork",
  print: "Fine-art Print",
  commission: "Similar Commission",
};

export const ArtworkLightbox = ({
  artwork,
  allArtworks = [],
  onClose,
  onSelectArtwork,
}: LightboxProps) => {
  const { add } = useInquiry();
  const [selectedFormat, setSelectedFormat] = useState<Format>("original");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!artwork) return;
    setSelectedFormat(artwork.formats[0] || "original");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && allArtworks.length > 0 && onSelectArtwork) {
        const currentIndex = allArtworks.findIndex((a) => a.id === artwork.id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % allArtworks.length;
          onSelectArtwork(allArtworks[nextIndex]);
        }
      } else if (e.key === "ArrowLeft" && allArtworks.length > 0 && onSelectArtwork) {
        const currentIndex = allArtworks.findIndex((a) => a.id === artwork.id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + allArtworks.length) % allArtworks.length;
          onSelectArtwork(allArtworks[prevIndex]);
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [artwork, allArtworks, onClose, onSelectArtwork]);

  if (!artwork) return null;

  const cover = artwork.cover;
  if (cover.kind !== "image") return null;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    triggerToast({
      title: "Color Code Copied",
      message: `${hex} copied to clipboard`,
    });
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleAddToBag = () => {
    add({
      artworkId: artwork.id,
      title: artwork.title,
      slug: artwork.slug,
      format: selectedFormat,
    });
    triggerToast({
      title: "Added to Inquiry Bag",
      message: `${artwork.title} (${formatLabel[selectedFormat]})`,
    });
  };

  const currentIndex = allArtworks.findIndex((a) => a.id === artwork.id);
  const hasMultiple = allArtworks.length > 1;

  return (
    <AnimatePresence>
      <div className="lightbox-overlay" role="dialog" aria-modal="true">
        {/* Backdrop Scrim */}
        <motion.div
          className="lightbox-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="lightbox-container"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ "--accent-glow": artwork.colors[0] || "#d2e26b" } as React.CSSProperties}
        >
          {/* Header Bar */}
          <div className="lightbox-header">
            <div className="lightbox-meta-top">
              <span className="mono-badge">{artwork.category}</span>
              {hasMultiple && (
                <span className="lightbox-counter">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(allArtworks.length).padStart(2, "0")}
                </span>
              )}
            </div>

            <div className="lightbox-controls">
              {hasMultiple && onSelectArtwork && (
                <div className="lightbox-nav-buttons">
                  <button
                    onClick={() => {
                      const prevIndex = (currentIndex - 1 + allArtworks.length) % allArtworks.length;
                      onSelectArtwork(allArtworks[prevIndex]);
                    }}
                    aria-label="Previous artwork"
                    className="lightbox-icon-btn"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      const nextIndex = (currentIndex + 1) % allArtworks.length;
                      onSelectArtwork(allArtworks[nextIndex]);
                    }}
                    aria-label="Next artwork"
                    className="lightbox-icon-btn"
                  >
                    →
                  </button>
                </div>
              )}
              <button onClick={onClose} aria-label="Close preview" className="lightbox-close-btn">
                ✕
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="lightbox-body">
            {/* High-res Image Stage */}
            <div className="lightbox-stage">
              <div className="lightbox-image-wrap">
                <Image
                  src={cover.src}
                  alt={cover.alt || artwork.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 65vw"
                  priority
                  className="lightbox-img"
                />
              </div>
            </div>

            {/* Sidebar Details & Palette Extractor */}
            <div className="lightbox-sidebar">
              <div className="lightbox-info">
                <h2>{artwork.title}</h2>
                <p className="lightbox-description">{artwork.description}</p>

                {/* Color Palette Sampler (Creative Tech flair!) */}
                <div className="palette-studio">
                  <span className="palette-title">Color Extraction (Hex)</span>
                  <div className="palette-swatches">
                    {artwork.colors.map((hex) => (
                      <button
                        key={hex}
                        className="palette-swatch"
                        style={{ backgroundColor: hex }}
                        onClick={() => handleCopyHex(hex)}
                        title={`Click to copy ${hex}`}
                      >
                        <span className="swatch-tooltip">{copiedHex === hex ? "Copied!" : hex}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs */}
                <div className="lightbox-specs">
                  {artwork.medium && (
                    <div className="spec-row">
                      <span>Medium</span>
                      <strong>{artwork.medium}</strong>
                    </div>
                  )}
                  <div className="spec-row">
                    <span>Region</span>
                    <strong>Dubai, UAE</strong>
                  </div>
                  <div className="spec-row">
                    <span>Status</span>
                    <strong className="status-available">● Available for Inquiry</strong>
                  </div>
                </div>

                {/* Format selection */}
                <div className="format-picker">
                  <span className="format-title">Choose Format:</span>
                  <div className="format-options">
                    {artwork.formats.map((fmt) => (
                      <button
                        key={fmt}
                        className={`format-chip ${selectedFormat === fmt ? "is-selected" : ""}`}
                        onClick={() => setSelectedFormat(fmt)}
                      >
                        {formatLabel[fmt]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lightbox-actions">
                <button className="button button-dark full-width" onClick={handleAddToBag}>
                  Add {formatLabel[selectedFormat]} to Bag +
                </button>
                <Link
                  href={`/artwork/${artwork.slug}`}
                  className="view-full-detail-link"
                  onClick={onClose}
                >
                  Open Dedicated Artwork Page ↗
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
