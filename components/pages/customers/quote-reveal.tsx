"use client";

import { motion } from "motion/react";

// Word-by-word quote reveal: each word slides up out of its own clipped box once
// 60% of the paragraph is in view.
const VARIANTS = {
  animate: { opacity: 1, transform: "translateY(0px)" },
  initial: { opacity: 0, transform: "translateY(36px)" },
};

// Word indices dropped between the md and lg breakpoints, where the longer brand
// name would otherwise push the quote onto an extra line.
const MD_HIDE_CSS =
  "@media (min-width:768px) and (max-width:991.98px){.quote-md-hide{display:none!important}}";

export function QuoteWordReveal({ quote, mdHide = [] }: { quote: string; mdHide?: number[] }) {
  const words = ["“", ...`${quote}”`.split(" ")];
  return (
    <motion.p
      className="relative text-pretty text-quote-responsive"
      initial="initial"
      whileInView="animate"
      transition={{ staggerChildren: 0.01 }}
      viewport={{ amount: 0.6, once: true }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-flex overflow-clip first:absolute first:top-0 first:left-0 first:-translate-x-full${
            mdHide.includes(i) ? " quote-md-hide" : ""
          }`}
        >
          <motion.span variants={VARIANTS} transition={{ duration: 0.5, ease: "easeOut" }} className="will-change-transform">
            {word}
          </motion.span>
          {i !== 0 ? "\u00A0" : null}
        </span>
      ))}
      {mdHide.length > 0 && <style>{MD_HIDE_CSS}</style>}
    </motion.p>
  );
}
