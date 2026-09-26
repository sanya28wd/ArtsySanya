"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useReducedMotion } from "motion/react";
import type { ShaderPalette } from "@/components/shader-gradient-panel";

const paletteProps = {
  gallery: { color1: "#123f58", color2: "#157d8b", color3: "#b6c878" },
  about: { color1: "#142947", color2: "#286b78", color3: "#c6a6d9" },
  commissions: { color1: "#442a3f", color2: "#c25b69", color3: "#e0a55b" },
} as const;

export const ShaderGradientScene = ({ palette }: { readonly palette: ShaderPalette }) => (
  <ShaderGradientCanvas
    className="shader-gradient-canvas"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    pixelDensity={1}
    fov={45}
    pointerEvents="none"
    lazyLoad
    threshold={0.12}
    rootMargin="120px"
    powerPreference="low-power"
  >
    <ShaderGradient
      {...paletteProps[palette]}
      type="plane"
      animate={useReducedMotion() ? "off" : "on"}
      uSpeed={0.16}
      uStrength={1.35}
      uDensity={1.1}
      uFrequency={3.2}
      uAmplitude={1.2}
      color1={paletteProps[palette].color1}
      color2={paletteProps[palette].color2}
      color3={paletteProps[palette].color3}
      brightness={1.12}
      cDistance={3.6}
      cPolarAngle={90}
      cAzimuthAngle={180}
      grain="on"
      grainBlending={0.025}
      lightType="3d"
      envPreset="dawn"
    />
  </ShaderGradientCanvas>
);
