"use client";

import { useState, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInquiry } from "@/components/inquiry-provider";
import { triggerToast } from "@/components/toast-notification";
import type { Artwork } from "@/lib/artworks";

export const ArtworkCard = ({
  artwork,
  priority,
  onQuickInspect,
}: {
  readonly artwork: Artwork;
  readonly priority: boolean;
  readonly onQuickInspect?: (artwork: Artwork) => void;
}) => {
  const { add } = useInquiry();
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const cover = artwork.cover;
  if (cover.kind !== "image") return null;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const addToBag = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    add({
      artworkId: artwork.id,
      title: artwork.title,
      slug: artwork.slug,
      format: "original",
    });
    setIsAdded(true);
    triggerToast({
      title: "Added to Inquiry Bag",
      message: `${artwork.title} (Original artwork)`,
    });
  };

  const handleInspectClick = (e: MouseEvent) => {
    if (onQuickInspect) {
      e.preventDefault();
      e.stopPropagation();
      onQuickInspect(artwork);
    }
  };

  return (
    <article
      className="artwork-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          "--accent-color": artwork.colors[0] || "#d2e26b",
        } as React.CSSProperties
      }
    >
      <div className="artwork-image-container">
        <Link
          href={`/artwork/${artwork.slug}`}
          className="artwork-image"
          data-cursor-text="VIEW"
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            priority={priority}
          />

          {/* Interactive Specular Glare */}
          <div
            className="artwork-glare"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 60%)`,
            }}
            aria-hidden="true"
          />

          <span className="view-work">View piece ↗</span>
        </Link>

        {/* Quick Zoom / Inspect Button */}
        {onQuickInspect && (
          <button
            className="quick-inspect-badge"
            onClick={handleInspectClick}
            aria-label={`Quick inspect ${artwork.title}`}
            title="Inspect & Palette"
          >
            🔍
          </button>
        )}
      </div>

      <div className="artwork-meta">
        <div>
          <div className="artwork-tag-row">
            <p className="artwork-category">{artwork.category}</p>
            {artwork.colors.length > 0 && (
              <div className="artwork-palette-dots" aria-hidden="true">
                {artwork.colors.slice(0, 3).map((col) => (
                  <span
                    key={col}
                    className="palette-dot"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            )}
          </div>
          <h3>
            <Link href={`/artwork/${artwork.slug}`}>{artwork.title}</Link>
          </h3>
        </div>
        <button
          className={isAdded ? "bag-added" : ""}
          onClick={addToBag}
          aria-label={`${isAdded ? "Added" : "Add"} ${artwork.title} to inquiry bag`}
        >
          {isAdded ? "Added ✓" : "+ Bag"}
        </button>
      </div>
    </article>
  );
};

