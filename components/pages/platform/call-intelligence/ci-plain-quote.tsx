"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

// Scroll-linked quote: words darken one by one as the paragraph travels from
// the bottom of the viewport to its center.
export function PlainQuote({ quote, className }: { quote: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "center center"], target: ref });
  const [lit, setLit] = useState(0);
  const words = `“${quote}”`.split(" ");
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setLit(Math.floor(p * words.length) - 1);
  });
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className={i > lit ? "transition-colors duration-600 ease-in-out text-caption-foreground" : "transition-colors duration-600 ease-in-out"}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
