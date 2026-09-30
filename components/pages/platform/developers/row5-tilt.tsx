"use client";

import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { createContext, use, useRef, useState, type ReactNode } from "react";

const SPRING = { damping: 20, mass: 0.1, stiffness: 80 };

type Tilt = { rotateX: MotionValue<number>; rotateY: MotionValue<number>; scale: MotionValue<number> };
const TiltContext = createContext<Tilt | null>(null);

/** App tile: tilts toward the cursor (max 18deg) and scales up slightly on hover. */
export function Row5Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);
  const hover = useSpring(0);
  const drift = useSpring(0, { damping: 30, mass: 1, stiffness: 350 });
  const [lastY, setLastY] = useState(0);

  return (
    <div
      ref={ref}
      className="relative flex size-full flex-col items-center justify-center p-7 [perspective:800px]"
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        rotateX.set(-((y / (r.height / 2)) * 18));
        rotateY.set((x / (r.width / 2)) * 18);
        px.set(e.clientX - r.left);
        py.set(e.clientY - r.top);
        drift.set(-(0.6 * (y - lastY)));
        setLastY(y);
      }}
      onMouseEnter={() => {
        scale.set(1.02);
        hover.set(1);
      }}
      onMouseLeave={() => {
        hover.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        drift.set(0);
      }}
    >
      <TiltContext.Provider value={{ rotateX, rotateY, scale }}>{children}</TiltContext.Provider>
    </div>
  );
}

export function Row5TiltFace({ children }: { children: ReactNode }) {
  const t = use(TiltContext);
  return (
    <motion.div
      className="relative flex size-full items-center justify-center [transform-style:preserve-3d]"
      style={t ? { rotateX: t.rotateX, rotateY: t.rotateY, scale: t.scale } : undefined}
    >
      {children}
    </motion.div>
  );
}
