"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { Artwork, Category } from "@/lib/artworks";
import { StudioVideo } from "@/components/studio-video";
import { SelectedWorks } from "@/components/selected-works";
import { ColourAtmosphere } from "@/components/colour-atmosphere";
import { GenerativeCanvas } from "@/components/generative-canvas";
import { ArtworkLightbox } from "@/components/artwork-lightbox";

const services: readonly { readonly label: string; readonly category: Category }[] = [
  { label: "Custom paintings", category: "Canvas Paintings" },
  { label: "Digital illustrations", category: "Digital Art" },
  { label: "Mandala art", category: "Mandalas & Line Art" },
  { label: "Rangoli & event décor", category: "Rangoli" },
  { label: "Resin & craft", category: "Resin & Craft" },
  { label: "Gifting & collaborations", category: "Painted Bottles" },
];

export const HomeClient = ({
  featured,
  hero,
}: {
  readonly featured: readonly Artwork[];
  readonly hero: readonly Artwork[];
}) => {
  const reduceMotion = useReducedMotion();
  const practiceRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: practiceRef, offset: ["start end", "end start"] });
  const practiceBackdropY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const practiceBackdropScale = useTransform(scrollYProgress, [0, 0.55, 1], [1.08, 1, 1.08]);

  const [activeLightboxArtwork, setActiveLightboxArtwork] = useState<Artwork | null>(null);

  return (
    <main className="dark-home">
      {/* Editorial Opening */}
      <section className="startup" id="top">
        <div className="startup-grid" aria-label="A selection of ArtsySanya artworks">
          {hero.map((artwork, index) => {
            const cover = artwork.cover;
            if (cover.kind !== "image") return null;
            return (
              <motion.div
                className={`startup-tile startup-tile-${index + 1}`}
                key={artwork.id}
                animate={reduceMotion ? undefined : { y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }}
                transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => setActiveLightboxArtwork(artwork)}
                style={{ cursor: "pointer" }}
                title={`Click to inspect ${artwork.title}`}
              >
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 52vw, 42vw"
                  priority
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="startup-title">
          <p className="startup-kicker">ArtsySanya / artist studio</p>
          <h1>ArtsySanya</h1>
          <p className="startup-intro">
            A colourful collection of originals, objects, and ideas made by hand in Dubai.
          </p>
        </div>
        <Link className="startup-enter" href="#collection">
          <span>Step inside</span>
          <b aria-hidden="true">↓</b>
        </Link>
        <div className="startup-bottom">
          <span>Originals · Prints · Commissions</span>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Inside Studio Reel */}
      <section className="hero" id="collection">
        <div className="hero-copy">
          <p className="eyebrow">Inside the studio</p>
          <h2>
            Made by hand.
            <br />
            <i>Imagined</i> without limits.
          </h2>
          <p className="hero-intro">
            Hi, I’m Sanya—an independent Dubai artist and AI engineering student. I make
            colour-rich originals, prints, and custom artwork for spaces, stories, and
            celebrations.
          </p>
          <p className="hero-process-note">
            Every piece starts as a small idea, then grows through colour, detail, and patient
            making.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/gallery">
              Explore the collection
            </Link>
            <Link className="text-link" href="/commissions">
              Start a commission ↗
            </Link>
          </div>
        </div>
        <figure className="hero-video">
          <StudioVideo />
          <figcaption>Made slowly, with colour.</figcaption>
        </figure>
      </section>

      {/* Practice Glass Band */}
      <section className="intro-band practice-band" ref={practiceRef}>
        <motion.div
          className="practice-backdrop"
          style={{
            y: reduceMotion ? 0 : practiceBackdropY,
            scale: reduceMotion ? 1 : practiceBackdropScale,
          }}
          aria-hidden="true"
        >
          {hero.slice(0, 3).map((artwork, index) => {
            const cover = artwork.cover;
            if (cover.kind !== "image") return null;
            return (
              <div className={`practice-art practice-art-${index + 1}`} key={artwork.id}>
                <Image src={cover.src} alt="" fill sizes="50vw" />
              </div>
            );
          })}
        </motion.div>
        <div className="practice-marquee" aria-hidden="true">
          <span>COLOUR · CRAFT · STORY · CODE · COLOUR · CRAFT · STORY · CODE · </span>
          <span>COLOUR · CRAFT · STORY · CODE · COLOUR · CRAFT · STORY · CODE · </span>
        </div>
        <motion.div
          className="practice-glass"
          initial={reduceMotion ? false : { opacity: 0, y: 38 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">The practice</p>
          <h2>
            Small details, bold colour, and objects made to <i>live with.</i>
          </h2>
          <p>
            From painted bottles and canvas work to rangoli, resin, and digital pieces, each
            collection begins with a simple question: how can art make a space feel more personal?
          </p>
          <span className="practice-card-note">Made slowly / Dubai, UAE</span>
        </motion.div>
      </section>

      {/* Selected Works with Quick Lightbox Inspect */}
      <section className="feature-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Selected works</p>
            <h2>Pieces with a point of view.</h2>
          </div>
          <Link className="text-link" href="/gallery">
            See every artwork ↗
          </Link>
        </div>
        <SelectedWorks
          artworks={featured}
          onQuickInspect={(art) => setActiveLightboxArtwork(art)}
        />
      </section>

      {/* Art × AI Section */}
      <section className="colour-section">
        <ColourAtmosphere />
        <figure className="colour-side-art">
          <Image
            src="/artworks/artxai-bg.png"
            alt="Turquoise butterfly artwork with a text-safe blue backdrop"
            fill
            sizes="100vw"
          />
        </figure>
        <div className="glow-circles" aria-hidden="true">
          <span className="glow-circle glow-circle-1" />
          <span className="glow-circle glow-circle-2" />
          <span className="glow-circle glow-circle-3" />
          <span className="glow-circle glow-circle-4" />
          <span className="glow-circle glow-circle-5" />
          <span className="glow-circle glow-circle-6" />
        </div>
        <div className="colour-copy">
          <p className="eyebrow">Art × AI</p>
          <h2>
            Explore a collection by its <i>feeling.</i>
          </h2>
          <p>
            Artwork palettes are organised into intuitive colour families, turning the gallery
            into a tactile visual explorer. Designed and built by Sanya—artist, AI engineering
            student, and incurable maker.
          </p>
          <Link className="button button-light" href="/gallery#colour">
            Explore by colour <span>↗</span>
          </Link>
        </div>
        <div className="colour-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      {/* Interactive Creative Tech Playground (Art × Code) */}
      <section className="creative-code-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Creative Engineering Lab</p>
            <h2>Where code paints with <i>light.</i></h2>
          </div>
          <span className="tech-badge">CS + AI Exploration</span>
        </div>
        <GenerativeCanvas />
      </section>

      {/* Categories */}
      <section className="category-section">
        <p className="eyebrow">Made for your walls, events & ideas</p>
        <div className="service-list">
          {services.map((service, index) => (
            <Link
              href={`/gallery?category=${encodeURIComponent(service.category)}`}
              key={service.label}
              data-cursor-text="DISCOVER"
            >
              <span>0{index + 1}</span>
              {service.label}
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      {/* Commission CTA */}
      <section className="commission-cta">
        <div className="commission-glow" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="commission-content">
          <p className="eyebrow">Custom work is open</p>
          <h2>
            Have an idea you want to <i>make real?</i>
          </h2>
          <p>
            Share a moodboard, a story, or just the beginning of an idea. I’ll shape it with
            you—from first sketch to UAE delivery.
          </p>
          <div className="commission-actions">
            <Link className="button button-dark" href="/commissions">
              Tell me about it <span>↗</span>
            </Link>
            <span>Paintings · rangoli · gifts · events</span>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      <ArtworkLightbox
        artwork={activeLightboxArtwork}
        allArtworks={[...hero, ...featured]}
        onClose={() => setActiveLightboxArtwork(null)}
        onSelectArtwork={(art) => setActiveLightboxArtwork(art)}
      />
    </main>
  );
};
