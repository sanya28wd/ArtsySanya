"use client";

import dynamic from "next/dynamic";

export type ShaderPalette = "gallery" | "about" | "commissions";

const GradientCanvas = dynamic(
  () => import("@/components/shader-gradient-scene").then((module) => module.ShaderGradientScene),
  { ssr: false },
);

export const ShaderGradientPanel = ({ palette }: { readonly palette: ShaderPalette }) => (
  <div className={`shader-gradient-panel shader-gradient-${palette}`} aria-hidden="true">
    <GradientCanvas palette={palette} />
  </div>
);
