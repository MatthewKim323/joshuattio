"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ImageDithering } from "./dither-shader";
import { useDevEasterEgg } from "./dev-easter-egg";
import { useScramble } from "./use-scramble";

const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;
const SCRAMBLE = { overflow: true, scramble: 8, speed: 0.5, step: 1 };
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Dithered portrait: sized to its cell, drawn by the WebGL dithering mount. */
export function QuotePortrait({ image, className }: { image: string; className?: string }) {
  const { isEasterEggEnabled } = useDevEasterEgg();
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const measure = () => {
      if (!ref.current) return;
      setW(ref.current.clientWidth);
      setH(ref.current.clientHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      <motion.div className="absolute inset-0 mix-blend-lighten">
        <ImageDithering
          width={w}
          height={h}
          image={image}
          colorBack={isEasterEggEnabled ? "#000000" : "#101113"}
          colorFront="#8f99a8"
          colorHighlight="#a4adba"
          originalColors={false}
          type="2x2"
          size={1.5}
          colorSteps={1}
          fit="cover"
        />
      </motion.div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  startColor = "var(--color-black-700)",
  endColor = "var(--color-secondary-foreground)",
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  startColor?: string;
  endColor?: string;
}) {
  const [start] = range;
  const [on, setOn] = useState(false);
  useEffect(() => progress.on("change", (v) => setOn(v > start)), [progress, start]);
  return (
    <motion.span
      className="relative inline-flex"
      initial={{ color: startColor }}
      animate={{ color: on ? endColor : startColor }}
      transition={{ damping: 30, mass: 2, stiffness: 100, type: "spring" }}
    >
      {children}
    </motion.span>
  );
}

/** Quote whose words light up one by one as it scrolls from the bottom edge to the middle. `className` is the full wrapper class. */
export function QuoteWords({ quote, className }: { quote: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "start center"], target: ref });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const words = quote.split(" ");
  return (
    <div ref={ref} className={className}>
      <p className="relative text-pretty font-medium text-heading-xs text-secondary-foreground">
        <span className="absolute top-0 -left-[0.05em] -translate-x-full">{"“"}</span>
        <span className="quote-words">
          {words.map((word, i) => (
            <Word key={i} progress={progress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
              {i === words.length - 1 ? "”" : "\u00a0"}
            </Word>
          ))}
        </span>
      </p>
    </div>
  );
}

/** Author caption: name and title scramble in, underline draws when it enters the viewport. */
export function QuoteAuthor({ name, title, className }: { name: string; title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { ref: nameRef, replay: replayName } = useScramble<HTMLSpanElement>({ text: name, ...SCRAMBLE });
  const { ref: titleRef, replay: replayTitle } = useScramble<HTMLSpanElement>({ text: `// ${title}`, ...SCRAMBLE });
  useEffect(() => {
    if (inView) {
      replayName();
      replayTitle();
    }
  }, [inView, replayName, replayTitle]);
  return (
    <div ref={ref} className={className}>
      <p className="font-mono text-accent-foreground text-xs uppercase">
        <span ref={nameRef} />
        <br />
        <span ref={titleRef} />
      </p>
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : { width: 0 }}
        transition={{ duration: 0.7, ease: easeOutCubic }}
      >
        <svg width="100%" height="1" className="text-accent-foreground max-xl:hidden">
          <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
