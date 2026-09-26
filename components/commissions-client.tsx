"use client";

import { useState } from "react";
import { ShaderGradientPanel } from "@/components/shader-gradient-panel";
import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";

const offerings = [
  {
    name: "Custom paintings",
    desc: "Acrylic on canvas, textured brushwork, and statement focal points tailored to your interior palette.",
  },
  {
    name: "Digital illustrations",
    desc: "Intricate digital artworks, portraits, architectural studies, and high-res print files.",
  },
  {
    name: "Mandala & line art",
    desc: "Meditative radial symmetry, devotional ink drawings, and fine geometric compositions.",
  },
  {
    name: "Painted bottle art",
    desc: "Upcycled hand-painted glass bottles with characters, folk art rhythms, and personalized typography.",
  },
  {
    name: "Rangoli & event décor",
    desc: "Immersive ceremonial powder arrangements and flower art for Diwali, weddings, and festive gatherings.",
  },
  {
    name: "Resin, crafts & gifting",
    desc: "Translucent quartz resin coasters, handcrafted trays, keepsake ornaments, and custom gift sets.",
  },
  {
    name: "Murals & interiors",
    desc: "Custom wall art and spatial interventions for modern residences, boutique offices, and studios.",
  },
  {
    name: "Workshops, live art & brand collaborations",
    desc: "Interactive live painting sessions, mandala workshops, and creative brand storytelling.",
  },
] as const;

const steps = [
  { step: "01", title: "Share your idea", desc: "Send a rough idea, moodboard reference, room photo, or color palette." },
  { step: "02", title: "Align on details", desc: "We discuss size, medium, timeline, and exact pricing with no surprises." },
  { step: "03", title: "Watch it take shape", desc: "Receive progress photos and updates as your piece comes to life." },
  { step: "04", title: "UAE delivery", desc: "Safely packaged and delivered directly to your door across Dubai & UAE." },
] as const;

export const CommissionsClient = () => {
  const [selectedOffering, setSelectedOffering] = useState<string>("Custom paintings");

  const buildMessage = (offering: string) =>
    `Hello Sanya! I would like to discuss a custom project.\n\nType of project: ${offering}\nSize or venue:\nReference / mood:\nTarget date:\n\nLooking forward to collaborating!`;

  return (
    <main className="page-shell commissions-page-shell">
      <section className="page-hero commission-hero">
        <figure className="commission-hero-art" aria-label="Colourful rangoli artwork">
          <ShaderGradientPanel palette="commissions" />
          <div className="hero-artwork-frame">
            <Image src="/artworks/festival-garden.jpg" alt="Colourful handmade rangoli arranged in a flower pattern" fill priority sizes="(max-width: 800px) 88vw, 38vw" />
            <figcaption>MADE TO BRING A ROOM TO LIFE</figcaption>
          </div>
        </figure>
        <p className="eyebrow">Custom work is open</p>
        <h1>
          Bring me the beginning
          <br />
          of an <i>idea.</i>
        </h1>
        <p>
          From one special piece for your home to rangoli for an event, a thoughtful gift, a
          mural, or a creative brand collaboration—let&apos;s make something memorable together.
        </p>
        <a
          className="button button-dark"
          href={whatsappLink(buildMessage(selectedOffering))}
          target="_blank"
          rel="noreferrer"
          data-cursor-text="WHATSAPP"
        >
          Start on WhatsApp ↗
        </a>
      </section>

      {/* Interactive Offerings Grid */}
      <section className="offerings">
        <div className="section-head">
          <div>
            <p className="eyebrow">Ways we can work together</p>
            <h2>Choose a creative medium</h2>
          </div>
          <span className="mono-badge">Select to customize message</span>
        </div>
        <div className="offerings-interactive-grid">
          {offerings.map((offering, index) => {
            const isSelected = selectedOffering === offering.name;
            return (
              <article
                key={offering.name}
                className={`offering-card ${isSelected ? "is-selected" : ""}`}
              >
                <div className="offering-top">
                  <span className="offering-num">0{index + 1}</span>
                  <button
                    className="offering-select"
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedOffering(offering.name)}
                  >
                    {isSelected ? "Selected ✓" : "Choose this"}
                  </button>
                </div>
                <h2>{offering.name}</h2>
                <p>{offering.desc}</p>
                <a
                  className="offering-direct-link"
                  href={whatsappLink(buildMessage(offering.name))}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Inquire about this ↗
                </a>
              </article>
            );
          })}
        </div>
      </section>

      {/* Steps process */}
      <section className="process">
        <p className="eyebrow">A simple, personal process</p>
        <div>
          {steps.map((step) => (
            <article key={step.title}>
              <span>{step.step}</span>
              <h2>{step.title}</h2>
              <p className="process-desc">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact card */}
      <section className="contact-card">
        <div>
          <p className="eyebrow">Let’s make something</p>
          <h2>Send a reference, a rough idea, or a voice note.</h2>
          <p>
            Currently preparing for: <strong>{selectedOffering}</strong>
          </p>
          <p>
            I will come back with the right questions around dimensions, budget, timing, and UAE
            delivery.
          </p>
        </div>
        <div className="contact-actions">
          <a
            className="button button-dark"
            href={whatsappLink(buildMessage(selectedOffering))}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Sanya ↗
          </a>
          <a className="text-link" href={site.instagram} target="_blank" rel="noreferrer">
            Send an Instagram DM ↗
          </a>
          <a className="text-link" href={`mailto:${site.email}`}>
            Email Sanya ↗
          </a>
        </div>
      </section>
    </main>
  );
};
