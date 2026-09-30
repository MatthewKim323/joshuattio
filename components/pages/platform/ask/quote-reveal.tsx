"use client";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

// Words light up one by one as the quote travels from the viewport bottom to its center.
export function QuoteReveal({ words, className }: { words: string[]; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "center center"], target: ref });
  const [last, setLast] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (e) => {
    setLast(Math.floor(e * words.length) - 1);
  });
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className={
            i > last
              ? "transition-colors duration-600 ease-in-out text-caption-foreground"
              : "transition-colors duration-600 ease-in-out"
          }
        >
          {w}
          {" "}
        </span>
      ))}
    </p>
  );
}
