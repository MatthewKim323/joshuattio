"use client";

import { motion } from "motion/react";

// Word-by-word quote reveal (each word slides up out of its own clipped box once
// 60% of the paragraph is in view), with optional words dropped below 640px
// where the longer brand name would otherwise add a line.
const VARIANTS = {
  animate: { opacity: 1, transform: "translateY(0px)" },
  initial: { opacity: 0, transform: "translateY(36px)" },
};

export function QuoteWordRevealSm({ quote, smHide = [] }: { quote: string; smHide?: number[] }) {
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
            smHide.includes(i) ? " max-sm:hidden" : ""
          }`}
        >
          <motion.span variants={VARIANTS} transition={{ duration: 0.5, ease: "easeOut" }} className="will-change-transform">
            {word}
          </motion.span>
          {i !== 0 ? " " : null}
        </span>
      ))}
    </motion.p>
  );
}
