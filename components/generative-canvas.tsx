"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Palette = {
  name: string;
  colors: string[];
};

const PALETTES: Palette[] = [
  { name: "Jewel Studio", colors: ["#d2e26b", "#e65d46", "#30b9bd", "#8d58c8"] },
  { name: "Dubai Nocturne", colors: ["#545bc0", "#f1a824", "#0f9a99", "#d8ebdb"] },
  { name: "Sunset Gold", colors: ["#f23256", "#f6b021", "#f995c4", "#e7ab25"] },
  { name: "Turquoise Flow", colors: ["#00a5bc", "#48a86c", "#66c3da", "#eee1c5"] },
];

export const GenerativeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const studioRef = useRef<HTMLDivElement | null>(null);
  const [symmetry, setSymmetry] = useState<number>(8);
  const [paletteIndex, setPaletteIndex] = useState<number>(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const currentPalette = PALETTES[paletteIndex];

  useEffect(() => {
    const studio = studioRef.current;
    if (!studio) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "240px 0px" },
    );

    observer.observe(studio);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 480);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(520, Math.max(380, window.innerHeight * 0.45));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Particle system
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      life: number;
      maxLife: number;
      angle: number;
      speed: number;
    };

    const particles: Particle[] = [];
    let mouse = { x: width / 2, y: height / 2, active: false };

    const addParticles = (x: number, y: number, count: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const baseAngle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);

      for (let i = 0; i < count; i++) {
        const color = currentPalette.colors[Math.floor(Math.random() * currentPalette.colors.length)];
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          color,
          radius: Math.random() * 2.5 + 1.2,
          life: 0,
          maxLife: Math.random() * 60 + 50,
          angle: baseAngle,
          speed: dist * 0.005 + 0.5,
        });
      }

      if (particles.length > 90) {
        particles.splice(0, particles.length - 90);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
      setIsInteracting(true);
      addParticles(mouse.x, mouse.y, 4);
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      setIsInteracting(false);
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });
    canvas.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("touchend", handlePointerLeave);

    // Initial ambient seeds
    let autoAngle = 0;
    let lastParticleCountUpdate = 0;
    let lastRenderAt = 0;
    let renderCount = 0;
    const render = (timestamp: number) => {
      if (timestamp - lastRenderAt < 33) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      lastRenderAt = timestamp;
      renderCount += 1;
      // Atmospheric fade trail
      ctx.fillStyle = "rgba(6, 19, 49, 0.11)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Ambient autonomous orbit when user is not moving mouse
      if (!mouse.active && renderCount % 4 === 0) {
        autoAngle += 0.02;
        const radius = Math.min(width, height) * 0.28;
        const autoX = centerX + Math.cos(autoAngle * 0.7) * radius * Math.sin(autoAngle * 0.3);
        const autoY = centerY + Math.sin(autoAngle * 0.5) * radius * Math.cos(autoAngle * 0.2);
        addParticles(autoX, autoY, 2);
      }

      const now = performance.now();
      if (now - lastParticleCountUpdate > 250) {
        lastParticleCountUpdate = now;
        setParticleCount(particles.length);
      }

      // Render radial symmetry lines & particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - p.life / p.maxLife;
        const relX = p.x - centerX;
        const relY = p.y - centerY;
        const currentDist = Math.sqrt(relX * relX + relY * relY);
        const currentAngle = Math.atan2(relY, relX);

        ctx.save();
        ctx.translate(centerX, centerY);

        for (let s = 0; s < symmetry; s++) {
          ctx.rotate((Math.PI * 2) / symmetry);
          ctx.beginPath();
          ctx.arc(
            Math.cos(currentAngle) * currentDist,
            Math.sin(currentAngle) * currentDist,
            p.radius * (1 - p.life / p.maxLife),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.85;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("touchend", handlePointerLeave);
    };
  }, [isNearViewport, symmetry, paletteIndex, currentPalette]);

  return (
    <div className="generative-studio-card" ref={studioRef}>
      <div className="generative-header">
        <div>
          <span className="mono-tag">interactive_canvas.ts</span>
          <h3 className="generative-title">Creative Code Playground</h3>
          <p className="generative-subtitle">
            Move your cursor or finger across the canvas to generate radial algorithmic mandalas in real-time.
          </p>
        </div>

        {/* Controls */}
        <div className="generative-toolbar">
          <div className="tool-group">
            <span className="tool-label">Symmetry:</span>
            {[4, 6, 8, 12].map((n) => (
              <button
                key={n}
                className={`tool-btn ${symmetry === n ? "is-active" : ""}`}
                onClick={() => setSymmetry(n)}
              >
                {n}x
              </button>
            ))}
          </div>

          <div className="tool-group">
            <span className="tool-label">Palette:</span>
            {PALETTES.map((pal, idx) => (
              <button
                key={pal.name}
                className={`tool-palette-btn ${paletteIndex === idx ? "is-active" : ""}`}
                onClick={() => setPaletteIndex(idx)}
                title={pal.name}
              >
                <span
                  className="palette-preview-dot"
                  style={{
                    background: `linear-gradient(135deg, ${pal.colors[0]}, ${pal.colors[1]})`,
                  }}
                />
                <span className="palette-preview-name">{pal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="generative-canvas-element" />
        <div className="canvas-hint" aria-hidden="true">
          <span>{isInteracting ? "✨ Rendering Geometry..." : "✦ Hover or Drag to Draw"}</span>
        </div>
      </div>

      <div className="generative-footer">
        <div className="tech-specs">
          <span>Algorithm: Polar Coordinate Symmetrical Raycasting</span>
          <span className="active-particles-badge">{particleCount} active nodes</span>
        </div>
        <span className="engineer-credit">Designed & programmed by Sanya · CS & AI</span>
      </div>
    </div>
  );
};
