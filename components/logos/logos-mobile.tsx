"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { LogoMark, type Logo } from "./logo-mark";

const LOGOS: Logo[] = [
  { key: "granola", name: "Granola", src: "/img/img-575b6bfbe8.svg", width: 108, height: 23 },
  { key: "turbopuffer", name: "Turbopuffer", src: "/img/img-ae372624d5.svg", width: 123, height: 17 },
  { key: "parallel", name: "Parallel", src: "/img/img-ea6c4cdc8b.svg", width: 123, height: 19 },
  { key: "modal", name: "Modal", src: "/img/img-af7a948e15.svg", width: 123, height: 27 },
  { key: "wispr-flow", name: "Wispr Flow", src: "/img/img-1025cf377c.png", width: 132, height: 22 },
  { key: "railway", name: "Railway", src: "/img/img-1006c9d57c.svg", width: 118, height: 27 },
  { key: "listen", name: "Listen", src: "/img/img-51b1e2b0a5.svg", width: 95, height: 21 },
  { key: "taskrabbit", name: "Taskrabbit", src: "/img/img-c27b7e101c.svg", width: 133, height: 17 },
  { key: "aiuc", name: "AIUC", src: "/img/img-63c321b3d4.svg", width: 75, height: 24 },
  { key: "wordsmith", name: "Wordsmith", src: "/img/img-6acaa786b5.svg", width: 127, height: 15 },
];

const EASE = [0, 0, 0.58, 1] as const;
const CELLS = Math.min(6, LOGOS.length);

// 2x3 grid below md: every 4.5s the six cells swap to the next page of logos,
// old mark exits up, new one enters from below, staggered diagonally.
export function LogosMobile() {
  const reduce = useReducedMotion() ?? false;
  const [page, setPage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (reduce || !inView || LOGOS.length <= CELLS) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setPage((p) => p + 1);
    }, 4500);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-px border-subtle-stroke bg-subtle-stroke">
      {Array.from({ length: CELLS }, (_, l) => {
        const logo = LOGOS[(CELLS * page + l) % LOGOS.length];
        const d = (Math.floor(l / 2) + (l % 2)) * 0.12;
        return (
          <div key={l} className="relative flex h-24 items-center justify-center overflow-hidden bg-(--customer-logos-background)">
            <AnimatePresence initial={false}>
              <motion.div
                key={logo.key}
                className="absolute inset-0 flex items-center justify-center px-6"
                style={{ willChange: "transform, opacity, filter" }}
                initial={reduce ? false : { filter: "blur(2px)", opacity: 0, y: 18 }}
                animate={{
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 0,
                  transition: reduce ? { duration: 0 } : { delay: d + 0.05, duration: 0.42, ease: EASE },
                }}
                exit={
                  reduce
                    ? undefined
                    : { filter: "blur(2px)", opacity: 0, y: -18, transition: { delay: d, duration: 0.34, ease: EASE } }
                }
              >
                <LogoMark src={logo.src} name={logo.name} width={logo.width} height={logo.height} />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
