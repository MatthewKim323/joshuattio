"use client";

import { useState } from "react";
import { NumberRoll } from "./number-roll";

// Hero call to action: "Join the team" scrolls to the open roles, and while it is
// hovered the team counter next to the avatars rolls up by one.

const AVATARS = [
  { src: "/img/img-cf8598817b.avif", size: 400 },
  { src: "/img/img-eaf29b90d0.avif", size: 160 },
  { src: "/img/img-32030ac103.avif", size: 160 },
];
const RING = ["#266DF0", "#9162F9", "#FD9038"];
const COUNT = 190;

const BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-primary";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function HeroCta() {
  const [hover, setHover] = useState(false);
  return (
    <div className="mt-7 flex w-auto items-center gap-x-3 gap-y-4 max-lg:flex-col">
      <button
        className={BUTTON}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => scrollToId("open-positions")}
      >
        {"Join the team"}
      </button>
      <div className="group flex">
        {AVATARS.map((a, i) => (
          <div
            key={a.src}
            className="relative -mr-2 size-[36px] rounded-full border lg:size-7 lg:group-hover:mr-0.5 transition-all duration-150 ease-out lg:hover:z-10 lg:hover:scale-[1.12]"
            style={{ borderColor: RING[i % RING.length], transitionDelay: `${25 * i}ms` }}
          >
            <div className="h-full w-full overflow-hidden rounded-full border border-white-100">
              <img
                alt=""
                width={a.size}
                height={a.size}
                decoding="async"
                data-nimg="1"
                className="h-full w-full object-cover"
                style={{ color: "transparent" }}
                src={a.src}
              />
            </div>
          </div>
        ))}
        <div className="relative size-[36px] rounded-full border border-subtle-stroke lg:size-7 transition-transform duration-150 ease-out hover:z-10 lg:hover:scale-[1.12]">
          <div className="h-full w-full rounded-full">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FBFBFB] text-[#75777C]">
              <NumberRoll
                value={hover ? COUNT + 1 : COUNT}
                prefix="+"
                className="lg:text-[10px] lg:leading-[14px] text-[12px] tabular-nums leading-[16px] tracking-tighter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
