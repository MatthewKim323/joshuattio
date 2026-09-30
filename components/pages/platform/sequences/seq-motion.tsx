"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion } from "motion/react";

// Signal card halo: breathes 0 to 0.5 and back every 1.5s.
export function SeqGlow({ className }: { className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0], transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity } }}
      className={className}
    />
  );
}

// Connector pulse: the gradient stroke draws down the path and fades.
export function SeqPulse({ d, strokeWidth, duration }: { d: string; strokeWidth: string; duration: number }) {
  return (
    <motion.path
      d={d}
      stroke="url(#pulse-gradient)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 1], transition: { duration, ease: "easeInOut", repeat: Infinity } }}
    />
  );
}

// Dashed orbit ring turning forever, linear.
export function SeqSpin({ from, to, duration, ...rest }: Omit<ComponentProps<"circle">, "from" | "to"> & { from: number; to: number; duration: number }) {
  const props = rest as ComponentProps<typeof motion.circle>;
  return <motion.circle {...props} animate={{ rotate: [from, to], transition: { duration, ease: "linear", repeat: Infinity } }} />;
}

// Sender badge + pointer bobbing between two offsets, back and forth
// (translate(0 a) to translate(0, b) in px, expressed as y).
export function SeqFloat({ y, duration, children }: { y: [number, number]; duration: number; children: ReactNode }) {
  return <motion.g animate={{ y, transition: { duration, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } }}>{children}</motion.g>;
}

// Scheduled list: the doubled column scrolls up by half its height every 25s.
export function SeqMarquee({ className, children }: { className: string; children: ReactNode }) {
  return (
    <motion.div animate={{ y: ["0%", "-50%"], transition: { duration: 25, ease: "linear", repeat: Infinity } }} className={className}>
      {children}
    </motion.div>
  );
}

const SEND_REPEAT = { duration: 1.2, repeat: Infinity, repeatDelay: 3.8999999999999995 };

// Smart sending: a blue stroke travels each route in turn (1.2s apart).
export function SeqDraw({ d, delay }: { d: string; delay: number }) {
  return (
    <motion.path
      d={d}
      stroke="var(--color-blue-500)"
      animate={{ pathLength: [0, 1, 1], pathOffset: [0, 0, 1] }}
      transition={delay ? { delay, ...SEND_REPEAT } : SEND_REPEAT}
    />
  );
}

// White veil over a recipient pill that lifts while its route is drawn.
export function SeqVeil({ delay, ...rest }: Omit<ComponentProps<"rect">, "opacity"> & { delay: number }) {
  const props = rest as ComponentProps<typeof motion.rect>;
  return <motion.rect {...props} animate={{ opacity: [0.6, 0, 0, 0.6] }} transition={delay ? { delay, ...SEND_REPEAT } : SEND_REPEAT} />;
}

// Conic ring around the mail icon, one turn every 30s.
export function SeqTurnG({ clipPath, mask, children }: { clipPath: string; mask: string; children: ReactNode }) {
  return (
    <motion.g animate={{ rotate: [0, 360], transition: { duration: 30, ease: "linear", repeat: Infinity } }} clipPath={clipPath} mask={mask}>
      {children}
    </motion.g>
  );
}
