"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Header app list: the two rails draw in, each tile pops in from the middle out
// and its dashed guides drop down from above.
const SPRING = { type: "spring", bounce: 0, duration: 0.52 } as const;

export function HeroRail({ className, delay = 0, children }: { className: string; delay?: number; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger for tile `index` of `count`: 0.4s per step away from the center tile.
function stagger(index: number, count: number) {
  return 0.4 * Math.abs(index - Math.floor(count / 2));
}

export function HeroGuide({
  className,
  index,
  count,
  children,
}: {
  className: string;
  index: number;
  count: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ ...SPRING, delay: stagger(index, count) + 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroTile({ index, count, children }: { index: number; count: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING, delay: stagger(index, count) }}
    >
      {children}
    </motion.div>
  );
}
