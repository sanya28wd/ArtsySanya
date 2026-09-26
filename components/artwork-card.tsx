"use client";

import { useState, useRef, type MouseEvent } from "react";
import { useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();

  const cover = artwork.cover;
  if (cover.kind !== "image") return null;

  const handleMouseMove = (e: MouseEvent<HTMLElement>): void => {
    const element = cardRef.current;
    if (!element || reduceMotion) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    element.style.setProperty("--glare-x", `${(x / rect.width) * 100}%`);
    element.style.setProperty("--glare-y", `${(y / rect.height) * 100}%`);
    element.style.setProperty("--glare-opacity", "0.2");
  };

  const handleMouseLeave = (): void => {
    const element = cardRef.current;
    if (!element) return;
    element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    element.style.setProperty("--glare-opacity", "0");
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
      style={{ "--accent-color": artwork.colors[0] || "#d2e26b" } as React.CSSProperties}
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
          <div className="artwork-glare" aria-hidden="true" />

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

