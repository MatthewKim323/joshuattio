"use client";
import { createContext, use, useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

// Scroll-linked drift of the two prompt rows: row one slides left, row two slides right,
// each by 128.5px across the section's pass through the viewport.
const SPRING = { damping: 30, mass: 0.1, stiffness: 50 };

const RowsContext = createContext<{ x1: MotionValue<number>; x2: MotionValue<number> } | null>(null);

export function PromptsScroll({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"], target: ref });
  const x1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -128.5]), SPRING);
  const x2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 128.5]), SPRING);
  return (
    <RowsContext value={{ x1, x2 }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </RowsContext>
  );
}

export function PromptsRow({ row, children }: { row: 1 | 2; children: ReactNode }) {
  const ctx = use(RowsContext);
  const x = ctx ? (row === 1 ? ctx.x1 : ctx.x2) : undefined;
  return (
    <motion.div className="flex" style={{ gap: 24, x }}>
      {children}
    </motion.div>
  );
}
