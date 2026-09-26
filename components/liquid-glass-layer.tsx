"use client";

import { useEffect, useRef } from "react";
import { publicAsset } from "@/lib/site";

type LiquidGlassOptions = {
  readonly borderRadius: number;
  readonly type: "pill";
  readonly tintOpacity: number;
};

type LiquidGlassSurface = {
  readonly element: HTMLDivElement;
  updateSizeFromDOM: () => void;
  destroy: () => void;
};

type LiquidGlassLibrary = {
  readonly Container: new (options: LiquidGlassOptions) => LiquidGlassSurface;
};

type GlassWindow = Window & {
  html2canvas?: typeof import("html2canvas").default;
  LiquidGlassLibrary?: LiquidGlassLibrary;
};

const scriptLoads = new Map<string, Promise<void>>();
let libraryLoad: Promise<LiquidGlassLibrary> | null = null;

const loadScript = (source: string): Promise<void> => {
  const existingLoad = scriptLoads.get(source);
  if (existingLoad) return existingLoad;

  const load = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load liquid glass script: ${source}`));
    document.head.appendChild(script);
  });

  scriptLoads.set(source, load);
  return load;
};

const loadLiquidGlass = (): Promise<LiquidGlassLibrary> => {
  if (libraryLoad) return libraryLoad;

  libraryLoad = (async () => {
    const glassWindow = window as GlassWindow;
    const html2canvas = (await import("html2canvas")).default;
    glassWindow.html2canvas = html2canvas;
    await loadScript(publicAsset("/vendor/liquid-glass/container.js"));
    await loadScript(publicAsset("/vendor/liquid-glass/button.js"));
    await loadScript(publicAsset("/vendor/liquid-glass/bridge.js"));

    const library = glassWindow.LiquidGlassLibrary;
    if (!library) throw new Error("Liquid glass library loaded without its browser bridge.");
    return library;
  })();

  return libraryLoad;
};

export const LiquidGlassLayer = () => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let surface: LiquidGlassSurface | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      void loadLiquidGlass().then((library) => {
        if (disposed) return;

        const nextSurface = new library.Container({
          borderRadius: 24,
          type: "pill",
          tintOpacity: 0.045,
        });
        nextSurface.element.classList.add("liquid-glass-library-surface");
        nextSurface.element.setAttribute("aria-hidden", "true");
        host.appendChild(nextSurface.element);
        nextSurface.updateSizeFromDOM();
        surface = nextSurface;
      }).catch((error: unknown) => {
        console.error("Liquid glass could not initialize the navigation surface.", error);
      });
    }, { threshold: 0.5 });

    observer.observe(host);

    return () => {
      disposed = true;
      observer.disconnect();
      surface?.destroy();
      surface?.element.remove();
    };
  }, []);

  return <div className="liquid-glass-library-host" ref={hostRef} aria-hidden="true" />;
};
