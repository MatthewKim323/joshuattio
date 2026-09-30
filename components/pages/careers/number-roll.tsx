"use client";

import { createElement, type CSSProperties } from "react";

// Rolling number: each digit is a clipped column of 0-9 that slides to the
// current digit, so a change spins only the places that differ (upward when the
// value grows, downward when it shrinks). Keeps the static box: the outer span
// carries the same mask padding as the server rendition.

const STYLE =
  ":where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0}";

const MASK = "calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2)";

const COLUMN: CSSProperties = {
  display: "inline-block",
  position: "relative",
  overflow: "hidden",
  verticalAlign: "top",
  margin: `calc(${MASK} * -1) 0`,
  padding: `${MASK} 0`,
  maskImage: `linear-gradient(to bottom, transparent 0, #000 ${MASK}, #000 calc(100% - ${MASK}), transparent 100%)`,
};

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Digit({ value, durationMs }: { value: number; durationMs: number }) {
  return (
    <span style={COLUMN}>
      <span style={{ visibility: "hidden" }}>{value}</span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: MASK,
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${-value * 10}%)`,
          transition: `transform ${durationMs}ms linear`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function NumberRoll({
  value,
  prefix = "",
  className,
  durationMs = 150,
}: {
  value: number;
  prefix?: string;
  className?: string;
  durationMs?: number;
}) {
  const digits = String(value).split("");
  return createElement(
    "number-flow-react",
    { className, role: "img", "aria-label": `${prefix}${value}` },
    <style dangerouslySetInnerHTML={{ __html: STYLE }} />,
    <span>
      {prefix}
      {digits.map((d, i) => (
        // Keyed by place value so the ones column stays the ones column.
        <Digit key={digits.length - i} value={Number(d)} durationMs={durationMs} />
      ))}
    </span>,
  );
}
