"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type MouseEvent } from "react";
import type { Artwork } from "@/lib/artworks";

type SelectedWorksProps = {
  readonly artworks: readonly Artwork[];
  readonly onQuickInspect?: (artwork: Artwork) => void;
};

const sequenceLabel = (index: number): string => String(index + 1).padStart(2, "0");

export const SelectedWorks = ({ artworks, onQuickInspect }: SelectedWorksProps) => (
  <div className="selected-works" aria-label="Selected artworks">
    {artworks.map((artwork, index) => {
      const cover = artwork.cover;
      if (cover.kind !== "image") return null;

      return (
        <SelectedWork
          artwork={artwork}
          index={index}
          key={artwork.id}
          onQuickInspect={onQuickInspect}
        />
      );
    })}
  </div>
);

const SelectedWork = ({
  artwork,
  index,
  onQuickInspect,
}: {
  readonly artwork: Artwork;
  readonly index: number;
  readonly onQuickInspect?: (artwork: Artwork) => void;
}) => {
  const reduceMotion = useReducedMotion();
  const workRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: workRef, offset: ["start end", "end start"] });
  const backdropY = useTransform(scrollYProgress, [0, 1], [-36, 36]);
  const cover = artwork.cover;
  if (cover.kind !== "image") return null;

  const handleInspect = (e: MouseEvent) => {
    if (onQuickInspect) {
      e.preventDefault();
      e.stopPropagation();
      onQuickInspect(artwork);
    }
  };

  return (
    <motion.article
      className="selected-work"
      ref={workRef}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--work-colour": artwork.colors[0] || "#d2e26b" } as React.CSSProperties}
    >
      <Link
        href={`/artwork/${artwork.slug}`}
        className="selected-work-link"
        aria-label={`View ${artwork.title}`}
        data-cursor-text="EXPLORE"
      >
        <motion.div
          className="selected-work-backdrop"
          style={{ y: reduceMotion ? 0 : backdropY }}
          aria-hidden="true"
        >
          <Image src={cover.src} alt="" fill sizes="100vw" />
        </motion.div>
        <div className="selected-work-topline">
          <span>{sequenceLabel(index)}.</span>
          <span className="selected-work-cat-badge">{artwork.category}</span>
          <div className="selected-work-palette-mini" aria-hidden="true">
            {artwork.colors.map((c) => (
              <span key={c} style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>Dubai / UAE</span>
        </div>
        <div className="selected-work-art">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(max-width: 800px) 90vw, 78vw"
            priority={index < 2}
          />
          {onQuickInspect && (
            <button
              className="selected-work-inspect-btn"
              onClick={handleInspect}
              aria-label={`Inspect ${artwork.title}`}
              title="Quick inspect & palette"
            >
              🔍 Inspect
            </button>
          )}
        </div>
        <div className="selected-work-bottom">
          <h3>{artwork.title}</h3>
          <span>Original · Print · View ↗</span>
        </div>
      </Link>
    </motion.article>
  );
};

