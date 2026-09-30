"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useAnimate, useInView } from "motion/react";

// Shared motion tokens.
const DUR_REVEAL = 0.6;
const DUR_EXIT = 0.3;
const BLUR_REVEAL = 1.5;
const EASE_SWITCH = [0.33, 1, 0.68, 1] as const;
const EASE_LAYOUT = [0.645, 0.045, 0.355, 1] as const;
const HIDDEN_FILTER = `blur(${BLUR_REVEAL}px) drop-shadow(0 0 7px rgba(38,109,240,0.55))`;
const SHOWN_FILTER = "blur(0px) drop-shadow(0 0 0px rgba(38,109,240,0))";
// Per-element order used to stagger the build (delay = 0.18 + 0.04 * order).
export const ORDER = {
  profileAvatar: 0,
  profileName: 1,
  profileTitle: 2,
  profileControls: 3,
  details: 8,
  detailsName: 9,
  detailsDescription: 10,
  detailsEmail: 11,
  detailsLocation: 12,
  detailsCompany: 13,
  detailsInteraction: 14,
  bodySummary: 17,
  bodyLinkedIn: 18,
  bodyUpcoming: 19,
  bodyCompany: 20,
  bodyOutreach: 21,
  bodyActivityTitle: 23,
  bodyActivityCard: 24,
} as const;

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export { usePrefersReducedMotion };

const StepContext = createContext(0);
const useStep = () => useContext(StepContext);

/** The board wrapper: builds the record once it scrolls into view. */
export function SelfBuildingBoard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -80px 0px", once: true });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(4);
      return;
    }
    setStep(1);
    const timers = [2, 3, 4].map((s, i) => setTimeout(() => setStep(s), (i + 1) * 820));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  return (
    <StepContext.Provider value={step}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StepContext.Provider>
  );
}

/** Horizontal scroller with edge fades toggled by scroll position. */
export function EnrichmentScroll({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atEnd: true, atStart: true });
  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= max - 1;
    const atStart = el.scrollLeft <= 1;
    setEdges((prev) => (prev.atEnd === atEnd && prev.atStart === atStart ? prev : { atEnd, atStart }));
  }, []);
  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);
  return (
    <div
      ref={ref}
      onScroll={sync}
      data-at-start={edges.atStart ? "true" : "false"}
      data-at-end={edges.atEnd ? "true" : "false"}
      className={className}
    >
      {children}
    </div>
  );
}

/** Blur + glow fade in, staggered by order. `always` ignores the build step. */
export function Reveal({
  className,
  delay = 0,
  always = false,
  children,
}: {
  className?: string;
  delay?: number;
  always?: boolean;
  children?: ReactNode;
}) {
  const step = useStep();
  const active = always || step >= 1;
  return (
    <motion.div
      className={cx("will-change-[filter,opacity]", className)}
      initial={{ filter: HIDDEN_FILTER, opacity: 0 }}
      animate={{
        filter: active ? SHOWN_FILTER : HIDDEN_FILTER,
        opacity: active ? 1 : 0,
        transition: {
          delay: active ? 0.18 + 0.04 * delay : 0,
          duration: active ? DUR_REVEAL : DUR_EXIT,
          ease: EASE_SWITCH,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** A row of the details list: enters after the panel settles. */
export function DetailRow({ className, delay = 0, children }: { className?: string; delay?: number; children?: ReactNode }) {
  const step = useStep();
  const active = step >= 1;
  return (
    <motion.div
      className={cx(
        "grid origin-left auto-rows-[32px] grid-cols-[100px_1fr] items-baseline will-change-[filter,opacity]",
        className,
      )}
      initial={{ filter: HIDDEN_FILTER, opacity: 0 }}
      animate={
        active
          ? {
              filter: SHOWN_FILTER,
              opacity: 1,
              transition: { delay: 0.18 + 0.66 * DUR_REVEAL + 0.04 * delay, duration: DUR_REVEAL, ease: EASE_SWITCH },
            }
          : { filter: HIDDEN_FILTER, opacity: 0, transition: { duration: DUR_EXIT, ease: EASE_SWITCH } }
      }
      transition={{ delay: 0.18, duration: DUR_REVEAL, ease: EASE_LAYOUT }}
    >
      {children}
    </motion.div>
  );
}

/** Profile action chip: squish, pop back with a shadow, then show its content. */
export function ActionChip({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children?: ReactNode;
}) {
  const step = useStep();
  const active = step >= 1;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    if (!scope.current) return;
    if (active) {
      animate([
        [
          scope.current,
          { filter: "blur(2px)", scale: 0.95 },
          { delay: 0.18 + 0.04 * ORDER.profileControls + 0.05 * delay, duration: 0.18, ease: EASE_SWITCH },
        ],
        [
          scope.current,
          {
            boxShadow:
              "0px 0px 2px 0px #E0E0E0, 0px 2px 4px -2px rgba(24, 39, 75, 0.02), 0px 4px 4px -2px rgba(24, 39, 75, 0.06)",
            filter: "blur(0)",
            scale: 1,
          },
          { duration: 0.18, ease: EASE_SWITCH, filter: { duration: 0.108 } },
        ],
        ["div", { opacity: 1 }, { at: 0.36 + 0.05 * delay, duration: 0.18, ease: EASE_SWITCH }],
      ]);
    } else {
      animate("div", { opacity: 0 });
    }
  }, [active, delay, scope, animate]);
  return (
    <div ref={scope} className="rounded-lg bg-primary-background ring-1 ring-[#EEEFF1] ring-inset">
      <div className={cx("flex h-[28px] items-center gap-x-1.5 px-[7px] opacity-0", className)}>{children}</div>
    </div>
  );
}

/** A div whose classes switch once the record is built. */
export function StepClass({
  className,
  activeClassName,
  inactiveClassName,
  children,
}: {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  children?: ReactNode;
}) {
  const active = useStep() >= 1;
  return <div className={cx(className, active ? activeClassName : inactiveClassName)}>{children}</div>;
}
