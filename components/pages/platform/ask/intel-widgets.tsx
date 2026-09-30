"use client";
// Behavior for the three cards under the Ask window: staggered spring reveals once the widget
// is in view, and the slow counter-rotating dashed rings around the lock.
import { createContext, use, useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

const SPRING = { damping: 30, mass: 1, stiffness: 300 };
const InViewContext = createContext(false);

/** Widget root: flips its reveal children on the first time it is 100px inside the viewport. */
export function IntelInView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null),
    active = useInView(ref, { margin: "-100px", once: true });
  return (
    <div ref={ref} className={className}>
      <InViewContext value={active}>{children}</InViewContext>
    </div>
  );
}

/** Blur-rise item: hidden (blur 1px, opacity 0, down `y`) until the widget is in view. */
export function IntelRise({
  className,
  y,
  delay,
  children,
}: {
  className?: string;
  y: number;
  delay: number;
  children: ReactNode;
}) {
  const active = use(InViewContext),
    hidden = { filter: "blur(1px)", opacity: 0, y };
  return (
    <motion.div
      initial={hidden}
      animate={active ? { filter: "blur(0px)", opacity: 1, y: 0 } : hidden}
      transition={{ type: "spring", ...SPRING, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SPIN = { duration: 90, ease: "linear", repeat: Infinity } as const;
const CW = { rotate: [0, 360], transition: SPIN };
const CCW = { rotate: [360, 0], transition: SPIN };

/** Dashed ring around the lock, rotating once every 90s (`reverse` spins the other way). */
export function IntelOrbit({ r, opacity, reverse }: { r: string; opacity?: string; reverse?: boolean }) {
  return (
    <motion.circle
      animate={reverse ? CCW : CW}
      style={{ transformOrigin: "208px 189px" }}
      opacity={opacity}
      cx="208"
      cy="189"
      r={r}
      stroke="#A4ADBA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4 8"
    />
  );
}
