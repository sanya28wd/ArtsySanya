"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInquiry } from "@/components/inquiry-provider";
import { triggerToast } from "@/components/toast-notification";
import type { Artwork, Format } from "@/lib/artworks";
import { ArtworkCard } from "@/components/artwork-card";

const formatLabel: Record<Format, string> = {
  original: "Original artwork",
  print: "Fine-art print",
  commission: "Similar commission",
};

export const ArtworkDetail = ({
  artwork,
  related,
}: {
  readonly artwork: Artwork;
  readonly related: readonly Artwork[];
}) => {
  const { add } = useInquiry();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    triggerToast({
      title: "Color Extracted",
      message: `${hex} copied to clipboard`,
    });
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleAddFormat = (format: Format) => {
    add({
      artworkId: artwork.id,
      title: artwork.title,
      slug: artwork.slug,
      format,
    });
    triggerToast({
      title: "Added to Inquiry Bag",
      message: `${artwork.title} (${formatLabel[format]})`,
    });
  };

  return (
    <main className="detail-shell">
      <Link href="/gallery" className="back-link">
        ← Back to the collection
      </Link>

      <section className="detail-grid">
        <div className="detail-media">
          {artwork.media.map((media, index) =>
            media.kind === "image" ? (
              <div className="detail-image" key={`${media.src}-${index}`}>
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(max-width: 850px) 100vw, 58vw"
                  priority={index === 0}
                />
              </div>
            ) : (
              <figure className="detail-video" key={media.src}>
                <video controls preload="metadata" poster={media.poster}>
                  <source src={media.src} type="video/webm" />
                  Your browser does not support this video.
                </video>
                <figcaption>{media.alt}</figcaption>
              </figure>
            )
          )}
        </div>

        <aside className="detail-copy">
          <p className="eyebrow">{artwork.category}</p>
          <h1>{artwork.title}</h1>
          <p className="detail-description">{artwork.description}</p>

          {/* Color Palette Sampling */}
          {artwork.colors.length > 0 && (
            <div className="detail-palette-section">
              <span className="detail-palette-label">Artwork Palette</span>
              <div className="detail-swatches">
                {artwork.colors.map((hex) => (
                  <button
                    key={hex}
                    className="detail-swatch"
                    style={{ backgroundColor: hex }}
                    onClick={() => handleCopyHex(hex)}
                    title={`Click to copy ${hex}`}
                  >
                    <span className="swatch-hover-tag">
                      {copiedHex === hex ? "Copied!" : hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="artwork-specs">
            <div>
              <span>Availability</span>
              <strong className="status-available">● Available for Inquiry</strong>
            </div>
            <div>
              <span>Price & dimensions</span>
              <strong>Enquire for details</strong>
            </div>
            {artwork.medium !== null && (
              <div>
                <span>Medium</span>
                <strong>{artwork.medium}</strong>
              </div>
            )}
            <div>
              <span>Studio Origin</span>
              <strong>Dubai, UAE</strong>
            </div>
          </div>

          <div className="format-actions">
            <p>How would you like to acquire this piece?</p>
            {artwork.formats.map((format) => (
              <button
                key={format}
                onClick={() => handleAddFormat(format)}
                className="format-action-row"
              >
                <span>Add {formatLabel[format]} to bag</span>
                <span className="format-plus">+</span>
              </button>
            ))}
          </div>

          <p className="detail-note">
            Ships safely within the UAE. Every purchase is confirmed personally over WhatsApp
            before payment.
          </p>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="related">
          <div className="section-head">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2>More from this collection</h2>
            </div>
            <Link className="text-link" href="/gallery">
              All works ↗
            </Link>
          </div>
          <div className="art-grid">
            {related.map((item) => (
              <ArtworkCard artwork={item} priority={false} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

