"use client";

import { useScramble } from "@/components/pages/platform/developers/use-scramble";

/** Page title that scrambles in on load and again on hover. */
export function BlogIndexTitle() {
  const { ref, replay } = useScramble<HTMLHeadingElement>({ text: "Joshuattio Engineering Blog" });
  return (
    <h1 ref={ref} onMouseEnter={() => replay()} className="cursor-default font-mono text-sm uppercase">
      {" "}
    </h1>
  );
}
