"use client";

import Image from "next/image";
import { type AnimationEvent, useEffect, useState } from "react";
import { publicAsset } from "@/lib/site";

const loadingArtworks = [
  { src: publicAsset("/artworks/ganesha-glow.jpg"), alt: "" },
  { src: publicAsset("/artworks/turquoise-metamorphosis.jpg"), alt: "" },
  { src: publicAsset("/artworks/sunset-promise.jpg"), alt: "" },
  { src: publicAsset("/artworks/radha-krishna-reverie.jpg"), alt: "" },
  { src: publicAsset("/artworks/festival-garden.jpg"), alt: "" },
  { src: publicAsset("/artworks/peacock-nocturne.jpg"), alt: "" },
] as const;

export const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);

  const handleExit = (event: AnimationEvent<HTMLElement>): void => {
    if (event.target === event.currentTarget && event.animationName === "loading-exit") {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (window.sessionStorage.getItem("artsy-sanya-intro-seen") === "true") {
      setVisible(false);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      window.sessionStorage.setItem("artsy-sanya-intro-seen", "true");
      setVisible(false);
    }, 1800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!visible) return null;

  return <section className="loading-screen" aria-label="Loading ArtsySanya" onAnimationEnd={handleExit}><div className="loading-title"><span>ARTSYSANYA</span><span>LOADING THE STUDIO</span></div><div className="loading-rail" aria-hidden="true">{loadingArtworks.map((artwork, index) => <div className="loading-artwork" key={artwork.src}><Image src={artwork.src} alt={artwork.alt} fill sizes="180px" priority={index < 2}/></div>)}</div><div className="loading-footer"><span>HANDMADE WORLDS / 01—06</span><span className="loading-progress"/></div></section>;
};
