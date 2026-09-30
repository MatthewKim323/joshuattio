"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

// Reading progress ring pinned beside the story body. The column spans the article
// row; progress runs from its top hitting the viewport center to its bottom
// reaching the viewport bottom. The ring follows a spring, the label the raw value.
export function StoryProgressTracker({ className }: { className: string }) {
  const [percent, setPercent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start center", "end end"], target: ref });
  const dash = useTransform(
    useSpring(scrollYProgress, { damping: 20, mass: 0.5, stiffness: 150 }),
    [0, 1],
    [0, 100],
    { clamp: true },
  );
  const dasharray = useMotionTemplate`${dash} 100`;
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPercent(Math.round(100 * v));
  });

  return (
    <div ref={ref} className={`flex justify-end py-[96px] ${className}`}>
      <div className="sticky top-[calc(var(--site-header-height)+96px)] -mr-px flex size-10 shrink-0 translate-x-1/2 -translate-y-1/4 items-center justify-center rounded-full bg-secondary-background">
        <svg className="absolute inset-0" viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="19.5" fill="none" stroke="#E4E7EC" strokeWidth="1" />
          <motion.circle
            cx="20"
            cy="20"
            r="19.5"
            fill="none"
            className={percent === 0 ? "transition-colors stroke-transparent" : "stroke-black-800 transition-colors"}
            strokeWidth="1"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={dasharray}
            strokeDashoffset={0}
            transform="rotate(-90 20 20)"
          />
        </svg>
        <p className="font-medium text-caption-foreground text-overline tracking-tight">{percent}</p>
      </div>
    </div>
  );
}
