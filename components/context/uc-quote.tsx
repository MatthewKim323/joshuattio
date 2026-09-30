"use client";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";

const WORDS =
  "“When I first opened Joshuattio, I instantly got the feeling this was the next generation of CRM.”".split(" ");

function Decoration() {
  return (
    <div aria-hidden="true" className="grid h-40 w-full grid-cols-12 overflow-hidden max-xl:h-30 max-lg:h-25">
      <div className="col-[2/-2] flex justify-between" />
    </div>
  );
}

/**
 * Pinned quote under the dark block: while the 250svh track scrolls past, the
 * words light up one by one between 10% and 80% of the track.
 */
export function UcQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start start", "end end"], target: ref });
  const lit = useTransform(scrollYProgress, [0.1, 0.8], [0, 1], { clamp: true });
  const [last, setLast] = useState(-1);
  useMotionValueEvent(lit, "change", (e) => {
    setLast(Math.floor(e * WORDS.length) - 1);
  });
  return (
    <div ref={ref} className="h-[250svh]">
      <div
        className="sticky top-(--site-header-height) flex h-[calc(100svh-var(--site-header-height))] flex-col justify-center overflow-hidden"
        data-visual-test="blackout"
      >
        <svg width="100%" height="100%" className="text-muted-strong-background absolute inset-0">
          <defs>
            <pattern id="_R_345fiv9f9k7ivb_" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#_R_345fiv9f9k7ivb_)" />
        </svg>
        <Decoration />
        <div className="relative grid flex-1 grid-cols-12 items-center">
          <div className="col-[2/-2] flex flex-col items-center">
            <p className="max-w-[18em] text-balance text-center text-heading-sm-serif text-primary-foreground leading-9 lg:text-[3rem] lg:leading-13">
              {WORDS.map((w, i) => (
                <span
                  key={i}
                  className={
                    i > last
                      ? "transition-colors duration-500 ease-out text-caption-foreground"
                      : "transition-colors duration-500 ease-out"
                  }
                >
                  {w}
                  {" "}
                </span>
              ))}
            </p>
            <p className="mt-[2.25rem] text-center font-semibold text-secondary-foreground text-sm lg:mt-[3.25rem]">
              {"Margaret Shen"}
            </p>
            <p className="mt-0.5 text-center text-secondary-foreground text-sm">{"Head of Business Operations · Modal"}</p>
          </div>
        </div>
        <Decoration />
      </div>
    </div>
  );
}
