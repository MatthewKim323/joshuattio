"use client";

import { motion } from "motion/react";

type CircleProps = {
  cx: string;
  cy: string;
  r: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeDasharray?: string;
  duration: number;
  linear?: boolean;
};

// Dashed orbit ring that turns forever: rotate 0 to 360 over `duration`s.
export function SpinCircle({ duration, linear, ...rest }: CircleProps) {
  return (
    <motion.circle
      {...rest}
      animate={{ rotate: [0, 360] }}
      transition={linear ? { duration, ease: "linear", repeat: Infinity } : { duration, repeat: Infinity, repeatType: "loop" }}
    />
  );
}

// Connector pulse: the gradient stroke draws down the path and fades, every 2.4s.
export function PulsePath({ d }: { d: string }) {
  return (
    <motion.path
      d={d}
      stroke="url(#pulse-gradient)"
      strokeWidth="1.3"
      strokeLinecap="round"
      animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 1], transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity } }}
    />
  );
}
