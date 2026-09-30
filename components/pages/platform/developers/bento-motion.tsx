"use client";

import { motion, type TargetAndTransition, type Transition } from "motion/react";
import type { ReactNode, SVGProps } from "react";

// Looping ambient motion for the App SDK bento cards (authenticate, server
// functions, webhooks, UI components). Timings and keyframes are the cards' own.

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);

// Authenticate card: 5s ease-in-out loop that walks the highlight down the chain.
const AUTH: Transition = { duration: 5, ease: "easeInOut", repeat: Infinity };
// Webhooks card: slow 90s spin plus a 4s pulse that ripples outward.
const SPIN: Transition = { duration: 90, ease: "linear", repeat: Infinity };
const PULSE: Transition = { duration: 4, ease: easeInOutCubic, repeat: Infinity };

const cw: TargetAndTransition = { rotate: [0, 360], transition: SPIN };
const ccw: TargetAndTransition = { rotate: [360, 0], transition: SPIN };
const glow = (opacity: number[]): TargetAndTransition => ({
  opacity,
  rotate: [0, 360],
  transition: { opacity: PULSE, rotate: SPIN },
});

const VARIANTS = {
  "auth-top": { opacity: [0, 1, 0, 0, 0, 0, 0, 1, 0], transition: AUTH },
  "auth-dash": { strokeDashoffset: ["5%", "0%", "5%"], transition: AUTH },
  "auth-mid": { opacity: [0, 0, 1, 0, 0, 0, 1, 0, 0], transition: AUTH },
  "auth-bottom": { opacity: [0, 0, 0, 1, 0, 1, 0, 0, 0], transition: AUTH },
  "fn-dash": {
    strokeDashoffset: ["0%", "-100%"],
    transition: { duration: 90, ease: "linear", repeat: Infinity },
  },
  "wh-cw": cw,
  "wh-ccw": ccw,
  "wh-glow-outer": glow([0, 0, 0, 0, 1, 0, 0]),
  "wh-glow-mid": {
    opacity: [0, 0, 0, 1, 0, 0, 0],
    rotate: [360, 0],
    transition: { opacity: PULSE, rotate: SPIN },
  },
  "wh-glow-inner": glow([0, 0, 1, 0, 0, 0, 0]),
  "wh-core": { opacity: [0, 1, 0, 0, 0, 0, 0], transition: PULSE },
} satisfies Record<string, TargetAndTransition>;

export type BentoVariant = keyof typeof VARIANTS;

type SvgAttrs = Omit<
  SVGProps<SVGElement>,
  "ref" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd" | "style"
>;

export function BentoAnim({ el, v, ...rest }: { el: "circle" | "rect" | "line" | "path"; v: BentoVariant } & SvgAttrs) {
  const animate = VARIANTS[v];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = rest as any;
  switch (el) {
    case "circle":
      return <motion.circle animate={animate} {...props} />;
    case "rect":
      return <motion.rect animate={animate} {...props} />;
    case "line":
      return <motion.line animate={animate} {...props} />;
    default:
      return <motion.path animate={animate} {...props} />;
  }
}

// UI components card: four rows of components drifting sideways, alternating direction.
const ROW_DURATIONS = [90, 75, 60, 105];

export function BentoMarquee({ index, children }: { index: number; children: ReactNode }) {
  const reverse = index % 2 !== 0;
  return (
    <motion.div
      className="flex w-fit items-center will-change-[transform,translate] *:shrink-0"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration: ROW_DURATIONS[index], ease: "linear", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}
