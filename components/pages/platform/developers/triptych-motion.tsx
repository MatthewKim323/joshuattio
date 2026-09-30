"use client";

import { motion, type TargetAndTransition } from "motion/react";
import type { SVGProps } from "react";

// Looping SVG motion for the three API cards (custom integrations, webhooks, OAuth).
// Each animated element in the static markup is swapped for <TriptychMotion anim="..."/>,
// keeping its tag and attributes; the preset holds the keyframes and timing.

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
const loop = (duration: number, ease: "linear" | "easeInOut" | typeof easeInOutCubic) => ({
  duration,
  ease,
  repeat: Infinity,
});

// Authorize card colors.
const A300 = "var(--color-black-300)";
const A400 = "var(--color-black-400)";
const A600 = "var(--color-black-600)";

// Record created card.
const spin = loop(90, "linear");
const pulse = loop(4, easeInOutCubic);
const rotCw = { rotate: [0, 360], transition: spin };
const rotCcw = { rotate: [360, 0], transition: spin };
const ringFlash = (opacity: number[]) => ({ opacity, rotate: [0, 360], transition: { opacity: pulse, rotate: spin } });
const flash = (opacity: number[]) => ({ opacity, transition: pulse });

const PRESETS = {
  // Custom integrations
  "ci-link": { strokeDashoffset: ["0%", "5%"], transition: loop(5, "easeInOut") },
  "ci-ring": { opacity: [0, 1, 0, 0], transition: loop(3, "easeInOut") },
  "ci-frame": { opacity: [0, 0, 1, 0], transition: loop(3, "easeInOut") },
  // Record created
  "rc-r96": rotCw,
  "rc-r96-flash": ringFlash([0, 0, 0, 0, 1, 0, 0]),
  "rc-r72": rotCcw,
  "rc-r72-flash": {
    opacity: [0, 0, 0, 1, 0, 0, 0],
    rotate: [360, 0],
    transition: { opacity: pulse, rotate: spin },
  },
  "rc-r48": rotCw,
  "rc-r48-flash": ringFlash([0, 0, 1, 0, 0, 0, 0]),
  "rc-core-flash": flash([0, 1, 0, 0, 0, 0, 0]),
  "rc-chip-flash": flash([0, 0, 0, 0, 1, 0, 0]),
  // Authorize
  "au-down": { strokeDashoffset: ["0%", "100%"], transition: loop(60, "linear") },
  "au-up": { strokeDashoffset: ["0%", "-100%"], transition: loop(60, "linear") },
  "au-rail": { strokeDashoffset: ["100%", "0%"], transition: loop(60, "linear") },
  "au-glow": { stroke: [A400, A400, A600, A400, A400, A400], transition: loop(3, "easeInOut") },
  "au-dot1": { stroke: [A600, A300, A300, A300, A300, A600], transition: loop(3, "easeInOut") },
  "au-dot2": { stroke: [A300, A600, A300, A300, A300, A300], transition: loop(3, "easeInOut") },
  "au-dot3": { stroke: [A300, A300, A600, A300, A300, A300], transition: loop(3, "easeInOut") },
  "au-dot4": { stroke: [A300, A300, A300, A600, A300, A300], transition: loop(3, "easeInOut") },
  "au-dot5": { stroke: [A300, A300, A300, A300, A600, A300], transition: loop(3, "easeInOut") },
} satisfies Record<string, TargetAndTransition>;

export type TriptychAnim = keyof typeof PRESETS;

type Tag = "circle" | "line" | "path" | "rect";
type Props = { as: Tag; anim: TriptychAnim } & Omit<
  SVGProps<SVGElement>,
  "ref" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

const TAGS = { circle: motion.circle, line: motion.line, path: motion.path, rect: motion.rect } as const;

export function TriptychMotion({ as, anim, ...rest }: Props) {
  const C = TAGS[as] as React.ComponentType<Record<string, unknown>>;
  return <C animate={PRESETS[anim]} {...rest} />;
}
