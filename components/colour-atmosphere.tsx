"use client";

import { motion, useReducedMotion } from "motion/react";

export const ColourAtmosphere = () => {
  const reduceMotion = useReducedMotion();

  return <div className="colour-atmosphere" aria-hidden="true"><motion.span className="hue-ring hue-ring-main" animate={reduceMotion ? undefined : { rotate: [0, 7, 0], scale: [1, 1.045, 1], x: [0, 18, 0], y: [0, -13, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} /><motion.span className="hue-ring hue-ring-echo" animate={reduceMotion ? undefined : { rotate: [0, -8, 0], scale: [1, 1.07, 1], x: [0, -17, 0], y: [0, 14, 0] }} transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }} /></div>;
};
