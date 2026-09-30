"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Team photo grid: when it first scrolls into view the photos un-blur and settle
// from a slight tilt, one after another (50ms apart).

// Tilt per tile, within the source's (-0.75deg, 0.75deg) spread. Fixed values so
// the server markup and the first client render agree.
const TILTS = [0.41, -0.63, 0.18, -0.29, 0.57, -0.12, 0.33, -0.48];

export function TeamPhotoGrid({ className, children }: { className: string; children: ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="inView" transition={{ staggerChildren: 0.05 }} viewport={{ once: true }} className={className}>
      {children}
    </motion.div>
  );
}

export function TeamPhoto({ index, className, children }: { index: number; className: string; children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { filter: "blur(2px)", opacity: 0, rotate: TILTS[index % TILTS.length], scale: 0.99 },
        inView: { filter: "blur(0px)", opacity: 1, rotate: 0, scale: 1 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
