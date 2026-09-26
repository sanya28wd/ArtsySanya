"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { BufferGeometry, Color, Float32BufferAttribute, Group, Line, LineBasicMaterial, MathUtils } from "three";

const order = 4;
const side = 2 ** order;
const pointCount = side * side;

const rotateCell = (size: number, x: number, y: number, rx: number, ry: number): [number, number] => {
  if (ry === 0) {
    if (rx === 1) {
      x = size - 1 - x;
      y = size - 1 - y;
    }
    return [y, x];
  }
  return [x, y];
};

const hilbertPoint = (distance: number): [number, number] => {
  let x = 0;
  let y = 0;
  let t = distance;
  for (let scale = 1; scale < side; scale *= 2) {
    const rx = 1 & Math.floor(t / 2);
    const ry = 1 & (t ^ rx);
    [x, y] = rotateCell(scale, x, y, rx, ry);
    x += scale * rx;
    y += scale * ry;
    t = Math.floor(t / 4);
  }
  return [x, y];
};

const makeHilbertGeometry = (lift: number, twist: number): BufferGeometry => {
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const start = new Color("#c1a5ff");
  const end = new Color("#63e3d1");
  for (let index = 0; index < pointCount; index += 1) {
    const [gridX, gridY] = hilbertPoint(index);
    const x = (gridX / (side - 1) - 0.5) * 4.7;
    const y = (gridY / (side - 1) - 0.5) * 2.6;
    const offset = index * 3;
    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = Math.sin(x * 1.35 + twist) * lift + Math.cos(y * 1.7) * 0.12;
    const color = start.clone().lerp(end, index / (pointCount - 1));
    colors[offset] = color.r;
    colors[offset + 1] = color.g;
    colors[offset + 2] = color.b;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
};

const Curve = ({ lift, twist, opacity }: { readonly lift: number; readonly twist: number; readonly opacity: number }) => {
  const geometry = useMemo(() => makeHilbertGeometry(lift, twist), [lift, twist]);
  const line = useMemo(
    () => new Line(geometry, new LineBasicMaterial({ vertexColors: true, transparent: true, opacity, depthWrite: false })),
    [geometry, opacity],
  );
  useEffect(() => () => {
    geometry.dispose();
    (line.material as LineBasicMaterial).dispose();
  }, [geometry, line]);
  return (
    <primitive object={line} />
  );
};

const MovingLines = ({ motionEnabled }: { readonly motionEnabled: boolean }) => {
  const group = useRef<Group>(null);
  const { pointer, size } = useThree();
  const scroll = useRef<number>(0);

  useEffect(() => {
    const updateScroll = (): void => {
      scroll.current = Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight, 1), 1);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!motionEnabled) return;
    group.current.scale.setScalar(Math.min(1, size.width / Math.max(size.height, 1) / 2.1));
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, pointer.x * 0.14 + Math.sin(state.clock.elapsedTime * 0.12) * 0.035, 3, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -pointer.y * 0.1 + scroll.current * 0.07, 3, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, pointer.y * 0.08, 3, delta);
  });

  return (
    <group ref={group}>
      <Curve lift={0.28} twist={0} opacity={0.84} />
      <group position={[0, 0, -0.18]} rotation={[0, 0, 0.045]}>
        <Curve lift={0.48} twist={0.85} opacity={0.42} />
      </group>
      <group position={[0, 0, -0.36]} rotation={[0, 0, -0.04]}>
        <Curve lift={0.62} twist={1.7} opacity={0.24} />
      </group>
    </group>
  );
};

export const CreativeLineStudy = () => (
  <CreativeLineStudyCanvas />
);

const CreativeLineStudyCanvas = () => {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  return (
    <figure className="creative-line-study" aria-label="A cursor-responsive three-dimensional Hilbert curve study">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        dpr={[1, 1.35]}
        frameloop={motionEnabled ? "always" : "demand"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        fallback={<div className="creative-line-fallback" aria-hidden="true" />}
      >
        <MovingLines motionEnabled={motionEnabled} />
      </Canvas>
      <figcaption><span>ART × ALGORITHM</span><span>{motionEnabled ? "Move to explore · Scroll to shift" : "A study in colour and geometry"}</span></figcaption>
    </figure>
  );
};
