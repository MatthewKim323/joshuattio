"use client";

import { createElement, useEffect, useState, type CSSProperties } from "react";

// Record counter: renders the plain formatted number on the server (and the
// first client pass), then swaps each digit for a clipped 0-9 column that
// slides to its value, so an increment spins only the places that changed.

const STYLE =
  ":where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0}";

const MASK = "calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2)";

// Spin timing of the digit columns (900ms, spring-shaped linear() curve).
const EASE =
  "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)";

const COLUMN: CSSProperties = {
  display: "inline-block",
  position: "relative",
  overflow: "hidden",
  verticalAlign: "top",
  margin: `calc(${MASK} * -1) 0`,
  padding: `${MASK} 0`,
  maskImage: `linear-gradient(to bottom, transparent 0, #000 ${MASK}, #000 calc(100% - ${MASK}), transparent 100%)`,
  WebkitMaskImage: `linear-gradient(to bottom, transparent 0, #000 ${MASK}, #000 calc(100% - ${MASK}), transparent 100%)`,
};

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Digit({ value }: { value: number }) {
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
          transition: `transform 900ms ${EASE}`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function RollingCount({ value, suffix = " ", className }: { value: number; suffix?: string; className?: string }) {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const text = value.toLocaleString("en");
  const chars = text.split("");
  const digitCount = chars.filter((c) => c >= "0" && c <= "9").length;
  let place = digitCount;
  return createElement(
    "number-flow-react",
    { "data-will-change": "", className },
    <style dangerouslySetInnerHTML={{ __html: STYLE }} />,
    live ? (
      <span role="img" aria-label={`${text}${suffix}`}>
        {chars.map((c, i) => {
          if (c < "0" || c > "9") return <span key={`s${i}`}>{c}</span>;
          const key = place--;
          return <Digit key={`d${key}`} value={Number(c)} />;
        })}
        <span style={{ whiteSpace: "pre" }}>{suffix}</span>
      </span>
    ) : (
      <span>
        {text}
        <span style={{ whiteSpace: "pre" }}>{suffix}</span>
      </span>
    ),
  );
}
