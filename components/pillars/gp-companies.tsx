"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import {
  BLUR_CARD,
  BLUR_ENTRANCE,
  DUR_ENTRANCE,
  EASE_UI,
  STREAM_MS_PER_CHAR,
  useReducedMotionSafe,
  withTempo,
} from "./gp-tempo";

const ROWS = 9;
const SUBJECT = "Filling your 14 AE roles";
const BODY =
  "Hi Maya,\n\nCongrats on the new VP Sales role. With the\nSeries C closed and 14 AE roles already open,\nyou've got a big team to build fast. We help\nrevenue leaders source and close senior AEs\nin weeks, not months. Quick call?\n\nBest,\nDaniel Fraser";

const MASK = "linear-gradient(to right, #000 38%, transparent 100%)";

function maskStyle(animate: boolean, masked: boolean): CSSProperties {
  const size = masked ? "100% 100%" : "263.2% 100%";
  return {
    maskImage: MASK,
    maskRepeat: "no-repeat",
    maskSize: size,
    transition: animate ? "mask-size 0.5s ease-out" : undefined,
    WebkitMaskImage: MASK,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: size,
  };
}

function rowStyle(animate: boolean, revealed: boolean): CSSProperties | undefined {
  if (!animate) return undefined;
  return {
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(3px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  };
}

function Check({ checked }: { checked: boolean }) {
  return checked ? (
    <div className="flex size-[8px] shrink-0 items-center justify-center rounded-[2.5px] border border-[rgba(0,0,0,0.1)] bg-[#266df0] lg:size-[16px] lg:rounded-[5px]">
      <svg viewBox="0 0 10 8" fill="none" aria-hidden="true" className="h-[4px] w-[5px] lg:h-[8px] lg:w-[10px]">
        <path d="M1 4.2 3.5 6.7 9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
  );
}

// "Companies to work" table: rows stagger in, Granola gets picked, the table
// masks down and the follow-up composer pops in and streams its email.
export function GpCompanies() {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const inView = useInView(root, { amount: 0.4, once: true });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const r = root.current;
    const i = inner.current;
    if (!r || !i) return;
    const fit = () => {
      const avail = r.clientWidth - 48;
      const w = i.offsetWidth;
      if (w > 0) setScale(Math.min(1, avail / w));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(r);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  const [revealed, setRevealed] = useState(0);
  const [selected, setSelected] = useState(false);
  const [masked, setMasked] = useState(false);
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setRevealed(ROWS);
      setSelected(true);
      setMasked(true);
      setSubject(SUBJECT);
      setBodyText(BODY);
      return;
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, withTempo(ms)));
    };
    const stream = (
      text: string,
      start: number,
      perChar: number,
      step: number,
      set: (v: string) => void,
    ) => {
      for (let n = step; n < text.length; n += step) at(start + n * perChar, () => set(text.slice(0, n)));
      at(start + text.length * perChar, () => set(text));
    };
    for (let r = 0; r < ROWS; r++) at(160 + 55 * r, () => setRevealed(r + 1));
    const pick = 160 + 55 * ROWS + 120;
    at(pick, () => setSelected(true));
    const mask = pick + 140;
    at(mask, () => setMasked(true));
    const typeAt = mask + 220;
    const subjectMs = 2 * STREAM_MS_PER_CHAR;
    stream(SUBJECT, typeAt, subjectMs, 1, setSubject);
    stream(BODY, typeAt + SUBJECT.length * subjectMs + 120, STREAM_MS_PER_CHAR, 2, setBodyText);
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [inView, reduce]);

  const entrance = {
    initial: { filter: `blur(${BLUR_ENTRANCE}px)`, opacity: 0, y: 16 },
    animate: inView || reduce ? { filter: "blur(0px)", opacity: 1, y: 0 } : undefined,
    transition: reduce ? { duration: 0 } : { duration: withTempo(DUR_ENTRANCE), ease: EASE_UI },
  };
  const card = {
    initial: { filter: `blur(${BLUR_CARD}px)`, opacity: 0, scale: 0.9 },
    animate: masked
      ? { filter: "blur(0px)", opacity: 1, scale: 1 }
      : { filter: `blur(${BLUR_CARD}px)`, opacity: 0, scale: 0.9 },
    transition: reduce ? { duration: 0 } : { duration: withTempo(0.4), ease: EASE_UI },
  };

  return (
    <div ref={root} aria-hidden="true" className="relative h-[327px] w-full overflow-hidden bg-surface-subtle lg:h-[654px]">
      <div aria-hidden="true" className="absolute inset-0 bg-surface-subtle" />
      <div className="absolute top-1/2 left-1/2 h-[254px] w-[450px] lg:h-[508px] lg:w-[900px]" ref={inner} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <motion.div className="absolute top-0 left-0" {...entrance}>
          <div className="w-[378px] overflow-hidden rounded-[6px] bg-white-100 lg:w-[756px] lg:rounded-[12px]" style={maskStyle(!reduce, masked)}>
            <div className="flex h-[24px] items-center gap-[4px] border-[#eeeff1] border-b bg-white-100 px-[6px] lg:h-[48px] lg:gap-[8px] lg:px-[12px]">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex items-center gap-[2px] rounded-[3px] px-[2px] py-px lg:gap-[4px] lg:rounded-[6px] lg:px-[4px]">
                  <div className="flex size-[7px] items-center justify-center rounded-[2.1px] border border-[rgba(0,0,0,0.05)] bg-[#266df0] lg:size-[14px] lg:rounded-[4.2px]">
                    <svg viewBox="0 0 7 9" fill="currentColor" className="block shrink-0 h-[4.5px] w-[3.5px] text-white-100 lg:h-[9px] lg:w-[7px]" aria-hidden="true">
                      <path d="M4.59961 0C5.43932 0 5.85985 -0.000187675 6.18066 0.163086C6.46291 0.306897 6.6931 0.537092 6.83691 0.819336C7.0002 1.14015 7 1.56067 7 2.40039V6.59961C7 7.43932 7.00019 7.85985 6.83691 8.18066C6.6931 8.46291 6.46291 8.6931 6.18066 8.83691C5.85985 9.0002 5.43933 9 4.59961 9H2.40039C1.56066 9 1.14015 9.0002 0.819336 8.83691C0.537092 8.6931 0.306897 8.46291 0.163086 8.18066C-0.00018486 7.85985 0 7.439 0 6.59863V2.40137C0 1.56102 -0.00018956 1.14015 0.163086 0.819336C0.306896 0.537092 0.537092 0.306896 0.819336 0.163086C1.14015 -0.000192342 1.56067 0 2.40039 0H4.59961ZM3.2998 5.5C3.02014 5.5 2.88033 5.50034 2.77344 5.55469C2.67936 5.60262 2.60262 5.67936 2.55469 5.77344C2.50034 5.88033 2.5 6.02014 2.5 6.2998V7.2002C2.5 7.47986 2.50034 7.61967 2.55469 7.72656C2.60262 7.82064 2.67936 7.89738 2.77344 7.94531C2.88033 7.99967 3.02014 8 3.2998 8H3.7002C3.97986 8 4.11966 7.99966 4.22656 7.94531C4.32064 7.89738 4.39738 7.82064 4.44531 7.72656C4.49966 7.61966 4.5 7.47986 4.5 7.2002V6.2998C4.5 6.02014 4.49966 5.88034 4.44531 5.77344C4.39738 5.67936 4.32064 5.60262 4.22656 5.55469C4.11967 5.50034 3.97986 5.5 3.7002 5.5H3.2998ZM2 3.5C1.72386 3.5 1.5 3.72386 1.5 4C1.5 4.27614 1.72386 4.5 2 4.5H5C5.27614 4.5 5.5 4.27614 5.5 4C5.5 3.72386 5.27614 3.5 5 3.5H2ZM2 1.5C1.72386 1.5 1.5 1.72386 1.5 2C1.5 2.27614 1.72386 2.5 2 2.5H5C5.27614 2.5 5.5 2.27614 5.5 2C5.5 1.72386 5.27614 1.5 5 1.5H2Z" />
                    </svg>
                  </div>
                  <div className="flex items-center px-px">
                    <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] whitespace-nowrap">
                      {"Companies to work"}
                    </span>
                  </div>
                  <svg viewBox="0 0 13 13" fill="currentColor" className="block shrink-0 size-[6.5px] text-[rgba(0,0,0,0.4)] lg:size-[13px]" aria-hidden="true">
                    <path d="M6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5C0 2.91015 2.91015 0 6.5 0ZM6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1ZM6.5 6C6.77614 6 7 6.22386 7 6.5V9C7 9.27614 6.77614 9.5 6.5 9.5C6.22386 9.5 6 9.27614 6 9V6.5C6 6.22386 6.22386 6 6.5 6ZM6.5 3.5C6.91421 3.5 7.25 3.83579 7.25 4.25V4.25977C7.25 4.67398 6.91421 5.00977 6.5 5.00977C6.08579 5.00977 5.75 4.67398 5.75 4.25977V4.25C5.75 3.83579 6.08579 3.5 6.5 3.5Z" />
                  </svg>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[4px] lg:gap-[8px]">
                <div className="flex shrink-0 items-center gap-[2px] lg:gap-[4px]">
                  <div className="flex items-center">
                    <div className="mr-[-3px] flex shrink-0 rounded-full border bg-white-100 p-px lg:mr-[-6px] border-[#266df0]">
                      <div className="flex size-[10px] items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] lg:size-[20px] bg-[#266df0]">
                        <span className="font-medium text-[5px] text-white-100 uppercase leading-[10px] lg:text-[10px] lg:leading-[20px]">
                          {"A"}
                        </span>
                      </div>
                    </div>
                    <div className="mr-[-3px] flex shrink-0 rounded-full border bg-white-100 p-px lg:mr-[-6px] border-[#9b69ff]">
                      <div className="flex size-[10px] items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] lg:size-[20px] bg-[#f5a300]">
                        <span className="font-medium text-[5px] text-white-100 uppercase leading-[10px] lg:text-[10px] lg:leading-[20px]">
                          {"L"}
                        </span>
                      </div>
                    </div>
                    <div className="mr-[-3px] flex shrink-0 rounded-full border bg-white-100 p-px lg:mr-[-6px] border-[#f97514]">
                      <div className="flex size-[10px] items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] lg:size-[20px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-cbd60d5ff5.avif 1x, /img/img-cbd60d5ff5.avif 2x" src="/img/img-cbd60d5ff5.avif" />
                      </div>
                    </div>
                    <div className="flex size-[11px] shrink-0 items-center justify-center rounded-full border border-[#e6e7ea] bg-[#f8f9fa] lg:size-[22px]">
                      <span className="font-medium text-[5px] text-[rgba(0,0,0,0.55)] leading-[7px] lg:text-[10px] lg:leading-[14px]">
                        {"+1"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[14px] items-center justify-center rounded-[4px] pr-[3px] pl-[4px] lg:h-[28px] lg:rounded-[8px] lg:pr-[6px] lg:pl-[8px]">
                    <span className="font-medium text-[#505155] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                      {"Share"}
                    </span>
                  </div>
                </div>
                <div className="h-[7px] w-px shrink-0 bg-[#eeeff1] lg:h-[14px]" />
                <div className="flex shrink-0 items-center">
                  <div className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] lg:size-[28px] lg:rounded-[8px]">
                    <svg viewBox="0 0 13 13" fill="currentColor" className="block shrink-0 size-[6.5px] text-[rgba(0,0,0,0.55)] lg:size-[13px]" aria-hidden="true">
                      <path d="M6.75 0C7.32562 0.0000153 7.78272 0.000161979 8.15235 0.0253919C8.52631 0.0509378 8.84773 0.103946 9.14844 0.228517C9.88334 0.533021 10.467 1.11761 10.7715 1.85254C10.896 2.15323 10.9491 2.47468 10.9746 2.84863C10.9899 3.07272 10.9946 3.32885 10.9971 3.62402C12.1525 4.03115 12.9518 5.10432 12.998 6.33985C13.0002 6.39787 13 6.46176 13 6.56152V10.0107C13 10.4859 13.0005 10.8773 12.9727 11.1816C12.9452 11.4809 12.8846 11.787 12.6963 12.0361C12.4318 12.3858 12.0275 12.6026 11.5898 12.6289C11.278 12.6475 10.9899 12.528 10.7256 12.3848C10.4568 12.2391 10.131 12.0216 9.73535 11.7578L9.62598 11.6846C9.46232 11.5755 9.4286 11.5556 9.39746 11.542C9.36158 11.5263 9.3237 11.5147 9.28516 11.5078C9.25165 11.5018 9.21276 11.5 9.01563 11.5H5.5C4.08445 11.5 2.90052 10.5191 2.58496 9.2002C2.47343 9.26966 2.37074 9.33257 2.27442 9.38477C2.01009 9.528 1.72203 9.64753 1.41016 9.62891C0.972626 9.60265 0.568231 9.38662 0.303713 9.03711C0.115269 8.78799 0.0547967 8.48195 0.0273454 8.18262C-0.000548325 7.87815 0.0000015131 7.48631 0.0000016013 7.01074V4.5C0.0000015657 3.80824 0.0000258666 3.25933 0.0361344 2.81738C0.0727235 2.36959 0.149008 1.98731 0.32715 1.6377C0.614731 1.0735 1.07349 0.61471 1.6377 0.32715C1.98732 0.149016 2.36958 0.072711 2.81738 0.0361341C3.25933 0.0000359539 3.80823 -0.0000156449 4.5 0H6.75ZM10.998 4.71875C10.9965 5.08175 10.9926 5.38919 10.9746 5.65235C10.9491 6.02643 10.8961 6.34766 10.7715 6.64844C10.467 7.38341 9.8834 7.96797 9.14844 8.27246C8.84762 8.39707 8.52551 8.45007 8.15137 8.47559C7.78186 8.50076 7.32529 8.50002 6.75 8.5H3.98438C3.78717 8.5 3.74836 8.50184 3.71485 8.50781C3.67626 8.5147 3.63846 8.52631 3.60254 8.54199C3.58242 8.55079 3.56142 8.5623 3.50488 8.59863C3.55625 9.65741 4.4285 10.5 5.5 10.5H9.01563C9.17844 10.5 9.32038 10.4984 9.46094 10.5234C9.57646 10.5441 9.68931 10.5781 9.79688 10.625C9.92771 10.6821 10.0452 10.7623 10.1807 10.8525L10.29 10.9258C10.7022 11.2005 10.9832 11.3872 11.2022 11.5059C11.4252 11.6267 11.5072 11.6322 11.5303 11.6309C11.6759 11.622 11.8103 11.5498 11.8984 11.4336C11.9125 11.4149 11.9534 11.3432 11.9766 11.0908C11.9993 10.8429 12 10.5059 12 10.0107V6.56152C12 6.45391 12.0003 6.41274 11.999 6.37793C11.9729 5.67895 11.5855 5.0569 10.998 4.71875ZM4.5 1C3.79172 0.999984 3.29023 1.00023 2.89844 1.03223C2.51266 1.06376 2.27691 1.12346 2.0918 1.21777C1.71556 1.4095 1.40952 1.71557 1.21778 2.0918C1.12346 2.2769 1.06377 2.51269 1.03223 2.89844C1.00022 3.29022 1 3.79174 1 4.5V7.01074C1 7.50605 1.00074 7.84286 1.02344 8.09082C1.04661 8.34374 1.08759 8.4151 1.10156 8.4336C1.18967 8.54989 1.32409 8.62203 1.46973 8.63086C1.49282 8.63224 1.57542 8.62693 1.79883 8.50586C2.01771 8.3872 2.29796 8.20045 2.70996 7.92578L2.81934 7.85254C2.95482 7.76222 3.07225 7.68311 3.20313 7.62598C3.31097 7.57893 3.42421 7.54408 3.54004 7.52344C3.68045 7.49847 3.82175 7.5 3.98438 7.5H6.75C7.33922 7.50002 7.75631 7.49989 8.08399 7.47754C8.40708 7.45549 8.60701 7.41434 8.76563 7.34863C9.25563 7.14565 9.64467 6.75563 9.84766 6.26563C9.91333 6.10701 9.95549 5.90708 9.97754 5.58399C9.99988 5.25632 10 4.83914 10 4.25C10 3.66085 9.9999 3.24366 9.97754 2.91602C9.95548 2.59301 9.91335 2.39297 9.84766 2.23438C9.64465 1.7446 9.25544 1.35529 8.76563 1.15235C8.607 1.08663 8.40715 1.04452 8.08399 1.02246C7.7563 1.0001 7.33929 1.00002 6.75 1H4.5Z" />
                    </svg>
                  </div>
                  <div className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] lg:size-[28px] lg:rounded-[8px]">
                    <svg viewBox="0 0 13 13" fill="currentColor" className="block shrink-0 size-[6.5px] text-[rgba(0,0,0,0.55)] lg:size-[13px]" aria-hidden="true">
                      <path d="M6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5C0 2.91015 2.91015 0 6.5 0ZM6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1ZM6.5 8.5C6.8727 8.50003 7.1747 8.80212 7.1748 9.1748C7.1748 9.54758 6.87277 9.84958 6.5 9.84961C6.12721 9.84961 5.8252 9.5476 5.8252 9.1748C5.8253 8.8021 6.12727 8.5 6.5 8.5ZM4.62988 4.2998C4.98605 3.08942 6.27234 2.71652 7.26562 3.07812C8.76098 3.62307 8.94688 5.63293 7.55469 6.42188C7.39276 6.51359 7.29375 6.56574 7.19629 6.62402C7.106 6.67803 7.06696 6.70876 7.04785 6.72852C7.04401 6.7319 7.00102 6.75486 7.00098 7C7.00078 7.27565 6.77655 7.49947 6.50098 7.5C6.22496 7.5 6.00117 7.27597 6.00098 7C6.00102 6.62297 6.07206 6.29911 6.3291 6.0332C6.43995 5.91859 6.56776 5.83433 6.68262 5.76562C6.79033 5.7012 6.93621 5.62273 7.06152 5.55176C7.70014 5.18984 7.62963 4.27513 6.92383 4.01758C6.32994 3.80134 5.74218 4.06102 5.58887 4.58203C5.51074 4.84642 5.23234 4.99745 4.96777 4.91992C4.70335 4.84182 4.55233 4.56439 4.62988 4.2998Z" />
                    </svg>
                  </div>
                  <div className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] lg:size-[28px] lg:rounded-[8px]">
                    <svg viewBox="0 0 2 10" fill="currentColor" className="block shrink-0 h-[5px] w-[1px] text-[rgba(0,0,0,0.55)] lg:h-[10px] lg:w-[2px]" aria-hidden="true">
                      <path d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" />
                    </svg>
                  </div>
                </div>
                <div className="flex h-[14px] items-center justify-center gap-[2px] rounded-[4px] bg-white-100 px-[3.5px] lg:h-[28px] lg:gap-[4px] lg:rounded-[8px] lg:px-[7px] shadow-joshuattio-product-e1">
                  <svg viewBox="0 0 13 13" fill="currentColor" className="block shrink-0 size-[6.5px] text-[#242629] lg:size-[13px]" aria-hidden="true">
                    <path d="M6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13H1.27051C0.182768 13 -0.344072 11.6689 0.449219 10.9248L1.18262 10.2363C0.438544 9.17916 0 7.89058 0 6.5C0 2.91015 2.91015 0 6.5 0ZM6.5 1C3.46243 1 1 3.46243 1 6.5C1 7.82011 1.46437 9.03058 2.23926 9.97852L2.53516 10.3398L2.19434 10.6592L1.13379 11.6543C1.00152 11.7783 1.0892 12 1.27051 12H6.5C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1Z" />
                  </svg>
                  <div className="flex items-center px-px">
                    <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] whitespace-nowrap">
                      {"Ask Joshuattio"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-[24px] items-center justify-between gap-[4px] border-[#eeeff1] border-b bg-white-100 px-[6px] lg:h-[48px] lg:gap-[8px] lg:px-[12px]">
              <div className="flex min-w-0 flex-1 items-center gap-[4px] lg:gap-[8px]">
                <div className="flex h-[14px] items-center justify-between gap-[4px] rounded-[4px] border border-[#eeeff1] pr-[4px] pl-[1px] lg:h-[28px] lg:rounded-[8px] lg:pr-[8px] lg:pl-[2px] w-[73px] lg:w-[146px]">
                  <div className="flex h-[12px] items-center gap-[2px] px-[2px] lg:h-[24px] lg:gap-[4px] lg:px-[4px]">
                    <svg viewBox="0 0 12 12" fill="currentColor" className="block shrink-0 size-[6px] text-[#00d17e] lg:size-[12px]" aria-hidden="true">
                      <path d="M0 4.8C0 3.11984 0 2.27976 0.32698 1.63803C0.614601 1.07354 1.07354 0.614601 1.63803 0.32698C2.27976 0 3.11984 0 4.8 0H6H7.2C8.88016 0 9.72024 0 10.362 0.32698C10.9265 0.614601 11.3854 1.07354 11.673 1.63803C12 2.27976 12 3.11984 12 4.8V6V7.2C12 8.88016 12 9.72024 11.673 10.362C11.3854 10.9265 10.9265 11.3854 10.362 11.673C9.72024 12 8.88016 12 7.2 12H6H4.8C3.11984 12 2.27976 12 1.63803 11.673C1.07354 11.3854 0.614601 10.9265 0.32698 10.362C0 9.72024 0 8.88016 0 7.2V6V4.8ZM2 3.5C2 3.03406 2 2.80109 2.07612 2.61732C2.17761 2.37229 2.37229 2.17761 2.61732 2.07612C2.80109 2 3.03406 2 3.5 2C3.96594 2 4.19891 2 4.38268 2.07612C4.62771 2.17761 4.82239 2.37229 4.92388 2.61732C5 2.80109 5 3.03406 5 3.5C5 3.96594 5 4.19891 4.92388 4.38268C4.82239 4.62771 4.62771 4.82239 4.38268 4.92388C4.19891 5 3.96594 5 3.5 5C3.03406 5 2.80109 5 2.61732 4.92388C2.37229 4.82239 2.17761 4.62771 2.07612 4.38268C2 4.19891 2 3.96594 2 3.5ZM7.07612 2.61732C7 2.80109 7 3.03406 7 3.5C7 3.96594 7 4.19891 7.07612 4.38268C7.17761 4.62771 7.37229 4.82239 7.61732 4.92388C7.80109 5 8.03406 5 8.5 5C8.96594 5 9.19891 5 9.38268 4.92388C9.62771 4.82239 9.82239 4.62771 9.92388 4.38268C10 4.19891 10 3.96594 10 3.5C10 3.03406 10 2.80109 9.92388 2.61732C9.82239 2.37229 9.62771 2.17761 9.38268 2.07612C9.19891 2 8.96594 2 8.5 2C8.03406 2 7.80109 2 7.61732 2.07612C7.37229 2.17761 7.17761 2.37229 7.07612 2.61732ZM2 8.5C2 8.03406 2 7.80109 2.07612 7.61732C2.17761 7.37229 2.37229 7.17761 2.61732 7.07612C2.80109 7 3.03406 7 3.5 7C3.96594 7 4.19891 7 4.38268 7.07612C4.62771 7.17761 4.82239 7.37229 4.92388 7.61732C5 7.80109 5 8.03406 5 8.5C5 8.96594 5 9.19891 4.92388 9.38268C4.82239 9.62771 4.62771 9.82239 4.38268 9.92388C4.19891 10 3.96594 10 3.5 10C3.03406 10 2.80109 10 2.61732 9.92388C2.37229 9.82239 2.17761 9.62771 2.07612 9.38268C2 9.19891 2 8.96594 2 8.5ZM7.07612 7.61732C7 7.80109 7 8.03406 7 8.5C7 8.96594 7 9.19891 7.07612 9.38268C7.17761 9.62771 7.37229 9.82239 7.61732 9.92388C7.80109 10 8.03406 10 8.5 10C8.96594 10 9.19891 10 9.38268 9.92388C9.62771 9.82239 9.82239 9.62771 9.92388 9.38268C10 9.19891 10 8.96594 10 8.5C10 8.03406 10 7.80109 9.92388 7.61732C9.82239 7.37229 9.62771 7.17761 9.38268 7.07612C9.19891 7 8.96594 7 8.5 7C8.03406 7 7.80109 7 7.61732 7.07612C7.37229 7.17761 7.17761 7.37229 7.07612 7.61732Z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                    <div className="flex items-center px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate">
                        {"All Companies"}
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 8 4.854" fill="currentColor" className="block shrink-0 h-[2.5px] w-[4px] text-[rgba(0,0,0,0.55)] lg:h-[5px] lg:w-[8px]" aria-hidden="true">
                    <path d="M7.14645 0.146447C7.34171 -0.0488155 7.65822 -0.0488155 7.85348 0.146447C8.04859 0.341721 8.04869 0.658266 7.85348 0.853478L4.35348 4.35348C4.15827 4.54869 3.84172 4.54859 3.64645 4.35348L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L3.99996 3.29293L7.14645 0.146447Z" />
                  </svg>
                </div>
                <div className="flex h-[14px] items-center justify-between gap-[4px] rounded-[4px] border border-[#eeeff1] pr-[4px] pl-[1px] lg:h-[28px] lg:rounded-[8px] lg:pr-[8px] lg:pl-[2px]">
                  <div className="flex h-[12px] items-center gap-[2px] px-[2px] lg:h-[24px] lg:gap-[4px] lg:px-[4px]">
                    <svg viewBox="0 0 13 11" fill="currentColor" className="block shrink-0 h-[5.5px] w-[6.5px] text-[#505155] lg:h-[11px] lg:w-[13px]" aria-hidden="true">
                      <path d="M8.5 0C9.19178 0 9.74067 0.0000282 10.1826 0.0361328C10.6304 0.0727201 11.0127 0.149009 11.3623 0.327148C11.9265 0.614723 12.3853 1.07348 12.6729 1.6377C12.851 1.98732 12.9273 2.36959 12.9639 2.81738C13 3.25934 13 3.80822 13 4.5V6.5C13 7.19178 13 7.74066 12.9639 8.18262C12.9273 8.63041 12.851 9.01268 12.6729 9.3623C12.3853 9.92652 11.9265 10.3853 11.3623 10.6729C11.0127 10.851 10.6304 10.9273 10.1826 10.9639C9.74067 11 9.19178 11 8.5 11H4.5C3.80822 11 3.25933 11 2.81738 10.9639C2.36959 10.9273 1.98732 10.851 1.6377 10.6729C1.07348 10.3853 0.614721 9.92652 0.327149 9.3623C0.149007 9.01268 0.0727179 8.63042 0.0361329 8.18262C0.0000290948 7.74066 0 7.19178 0 6.5V4.5C0 3.80823 0.0000275085 3.25933 0.0361329 2.81738C0.0727216 2.36958 0.149006 1.98732 0.327149 1.6377C0.614718 1.07348 1.07348 0.614725 1.6377 0.327148C1.98731 0.149012 2.36959 0.0727189 2.81738 0.0361328C3.25933 0.0000271648 3.80822 0 4.5 0H8.5ZM5 10H8V1H5V10ZM9 9.99707C9.4553 9.99548 9.80901 9.99168 10.1016 9.96777C10.4874 9.93623 10.7231 9.87654 10.9082 9.78223C11.2845 9.59049 11.5905 9.28445 11.7822 8.9082C11.8765 8.72309 11.9362 8.48736 11.9678 8.10156C11.9998 7.70977 12 7.20831 12 6.5V4.5C12 3.79168 11.9998 3.29023 11.9678 2.89844C11.9362 2.51264 11.8765 2.27691 11.7822 2.0918C11.5905 1.71555 11.2845 1.40951 10.9082 1.21777C10.7231 1.12346 10.4874 1.06377 10.1016 1.03223C9.80901 1.00832 9.4553 1.00355 9 1.00195V9.99707ZM4 1.00195C3.5447 1.00355 3.19099 1.00833 2.89844 1.03223C2.51267 1.06377 2.2769 1.12346 2.0918 1.21777C1.71555 1.40951 1.4095 1.71555 1.21777 2.0918C1.12345 2.27691 1.06377 2.51263 1.03223 2.89844C1.00021 3.29023 1 3.79169 1 4.5V6.5C0.999997 7.20831 1.00022 7.70977 1.03223 8.10156C1.06377 8.48736 1.12345 8.72309 1.21777 8.9082C1.40951 9.28445 1.71555 9.59049 2.0918 9.78223C2.27691 9.87654 2.51265 9.93623 2.89844 9.96777C3.19099 9.99168 3.5447 9.99548 4 9.99707V1.00195Z" />
                    </svg>
                    <div className="flex items-center px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate">
                        {"View settings"}
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 8 4.854" fill="currentColor" className="block shrink-0 h-[2.5px] w-[4px] text-[rgba(0,0,0,0.55)] lg:h-[5px] lg:w-[8px]" aria-hidden="true">
                    <path d="M7.14645 0.146447C7.34171 -0.0488155 7.65822 -0.0488155 7.85348 0.146447C8.04859 0.341721 8.04869 0.658266 7.85348 0.853478L4.35348 4.35348C4.15827 4.54869 3.84172 4.54859 3.64645 4.35348L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L3.99996 3.29293L7.14645 0.146447Z" />
                  </svg>
                </div>
              </div>
              <div className="flex h-[14px] shrink-0 items-center justify-center gap-[2px] rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-[#266df0] px-[3.5px] lg:h-[28px] lg:gap-[4px] lg:rounded-[8px] lg:px-[7px] shadow-[0px_2px_4px_-2px_rgba(15,107,233,0.12),0px_3px_6px_-2px_rgba(15,107,233,0.08)]">
                <svg viewBox="0 0 10 10" fill="currentColor" className="block shrink-0 size-[5px] text-white-100 lg:size-[10px]" aria-hidden="true">
                  <path d="M5 0C5.27612 0 5.49996 0.223889 5.5 0.5V4.5H9.5C9.77614 4.5 10 4.72386 10 5C10 5.27614 9.77614 5.5 9.5 5.5H5.5V9.5C5.5 9.77614 5.27614 10 5 10C4.72386 10 4.5 9.77614 4.5 9.5V5.5H0.5C0.223858 5.5 0 5.27614 0 5C0 4.72386 0.223858 4.5 0.5 4.5H4.5V0.5C4.50004 0.223889 4.72388 0 5 0Z" />
                </svg>
                <div className="flex items-center px-px">
                  <span className="whitespace-nowrap font-medium text-[7px] text-white-100 leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                    {"New person"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="relative shrink-0 border-[#eeeff1] border-r w-[88px] lg:w-[176px]">
                <div className="absolute top-0 right-0 left-0 flex h-[18px] items-center border-[#eeeff1] border-b bg-white-100 lg:h-[36px] gap-[6px] pr-[2px] pl-[8px] lg:gap-[12px] lg:pr-[4px] lg:pl-[16px]">
                  <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                  <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate">
                    {"Company"}
                  </span>
                  <div className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] lg:size-[28px] lg:rounded-[8px]">
                    <svg viewBox="0 0 10 10" fill="currentColor" className="block shrink-0 size-[5px] text-[rgba(0,0,0,0.55)] lg:size-[10px]" aria-hidden="true">
                      <path d="M5 0C5.27612 0 5.49996 0.223889 5.5 0.5V4.5H9.5C9.77614 4.5 10 4.72386 10 5C10 5.27614 9.77614 5.5 9.5 5.5H5.5V9.5C5.5 9.77614 5.27614 10 5 10C4.72386 10 4.5 9.77614 4.5 9.5V5.5H0.5C0.223858 5.5 0 5.27614 0 5C0 4.72386 0.223858 4.5 0.5 4.5H4.5V0.5C4.50004 0.223889 4.72388 0 5 0Z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden pt-[18.5px] lg:pt-[37px]">
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 0 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="400" height="400" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-805af2e95e.avif 1x, /img/img-805af2e95e.avif 2x" src="/img/img-805af2e95e.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"OpenAI"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 1 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="400" height="400" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-ca217a4589.avif 1x, /img/img-ca217a4589.avif 2x" src="/img/img-ca217a4589.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Harvey"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 2 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="376" height="380" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-64f9909b38.avif 1x, /img/img-64f9909b38.avif 2x" src="/img/img-64f9909b38.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Browserbase"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 3 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="430" height="454" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-f3c087f326.avif 1x, /img/img-f3c087f326.avif 2x" src="/img/img-f3c087f326.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Cursor"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 4 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="400" height="400" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-3f15547f28.avif 1x, /img/img-3f15547f28.avif 2x" src="/img/img-3f15547f28.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Notion"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 5 < revealed)}>
                    <Check checked={selected} />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="400" height="400" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-14301bfec9.avif 1x, /img/img-14301bfec9.avif 2x" src="/img/img-14301bfec9.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Granola"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 6 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="438" height="442" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-e565108fc5.avif 1x, /img/img-e565108fc5.avif 2x" src="/img/img-e565108fc5.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Ramp"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 7 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="376" height="406" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-9dc119ddb2.avif 1x, /img/img-9dc119ddb2.avif 2x" src="/img/img-9dc119ddb2.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Elevenlabs"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] gap-[4px] pr-[2px] pl-[8px] lg:gap-[8px] lg:pr-[4px] lg:pl-[16px]" style={rowStyle(!reduce, 8 < revealed)}>
                    <div className="size-[8px] shrink-0 rounded-[2.5px] border border-[#e6e7ea] bg-white-100 lg:size-[16px] lg:rounded-[5px]" />
                    <div className="flex min-w-0 flex-1 items-center gap-[2.5px] lg:gap-[5px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] lg:size-[16px] lg:rounded-[4.8px]">
                        <img alt="" loading="lazy" width="400" height="400" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-dc79872b60.avif 1x, /img/img-dc79872b60.avif 2x" src="/img/img-dc79872b60.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate whitespace-nowrap underline decoration-black/10 [text-underline-position:from-font]">
                        {"Linear"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 border-[#eeeff1] border-r w-[70px] lg:w-[140px]">
                <div className="absolute top-0 right-0 left-0 flex h-[18px] items-center border-[#eeeff1] border-b bg-white-100 lg:h-[36px] gap-[4px] pr-[5px] pl-[6px] lg:gap-[8px] lg:pr-[10px] lg:pl-[12px]">
                  <svg viewBox="0 0 13.4644 13" fill="currentColor" className="block shrink-0 h-[6.5px] w-[6.75px] text-[#505155] lg:h-[13px] lg:w-[13.5px]" aria-hidden="true">
                    <path d="M9.96442 6C10.127 6.00006 10.2551 6.06749 10.3228 6.10938C10.402 6.15837 10.4736 6.22049 10.5367 6.2832C10.664 6.40976 10.7925 6.57879 10.9107 6.77832C11.1049 7.10605 11.2863 7.54254 11.3961 8.06738C11.9214 8.17708 12.3582 8.35944 12.6861 8.55371C12.8854 8.67179 13.0547 8.79964 13.1812 8.92676C13.2439 8.98986 13.3061 9.06238 13.355 9.1416C13.3969 9.20937 13.4644 9.33745 13.4644 9.5C13.4644 9.6625 13.397 9.79059 13.355 9.8584C13.3061 9.93757 13.2439 10.0092 13.1812 10.0723C13.0547 10.1995 12.8856 10.3281 12.6861 10.4463C12.3582 10.6405 11.9213 10.8219 11.3961 10.9316C11.2864 11.4568 11.1049 11.8938 10.9107 12.2217C10.7925 12.4212 10.6639 12.5903 10.5367 12.7168C10.4736 12.7795 10.402 12.8416 10.3228 12.8906C10.2551 12.9325 10.127 12.9999 9.96442 13C9.80188 13 9.67383 12.9325 9.60603 12.8906C9.52682 12.8416 9.45525 12.7795 9.39216 12.7168C9.26486 12.5902 9.13637 12.4212 9.01814 12.2217C8.82384 11.8937 8.6415 11.457 8.53181 10.9316C8.00699 10.8219 7.57047 10.6404 7.24274 10.4463C7.04321 10.3281 6.87418 10.1995 6.74763 10.0723C6.68489 10.0092 6.6228 9.93763 6.5738 9.8584C6.5424 9.80762 6.49716 9.72287 6.47614 9.61523L6.46442 9.5L6.47614 9.38477C6.49716 9.2772 6.54241 9.19238 6.5738 9.1416C6.62279 9.06243 6.68493 8.98982 6.74763 8.92676C6.87412 8.79966 7.04351 8.67175 7.24274 8.55371C7.5705 8.35958 8.00695 8.17707 8.53181 8.06738C8.64153 7.54248 8.82397 7.10607 9.01814 6.77832C9.13634 6.57884 9.2649 6.40973 9.39216 6.2832C9.45522 6.22052 9.52687 6.15833 9.60603 6.10938C9.67385 6.06746 9.80195 6 9.96442 6ZM9.46442 0C11.1211 0.000187124 12.4644 1.3433 12.4644 3V5C12.4644 5.27604 12.2404 5.49985 11.9644 5.5C11.6883 5.49994 11.4644 5.2761 11.4644 5V3C11.4644 1.89557 10.5688 1.00018 9.46442 1H6.58552C6.32046 1.00007 6.06595 1.10558 5.87849 1.29297L1.58552 5.58594C0.804692 6.36692 0.804762 7.63304 1.58552 8.41406L4.31794 11.1465C4.83468 11.6631 5.61542 11.7589 6.22907 11.4307C6.47236 11.301 6.77464 11.3927 6.90485 11.6357C7.03495 11.8791 6.94307 12.1822 6.69978 12.3125C5.70859 12.8425 4.44775 12.6902 3.61091 11.8535L0.878487 9.12109C-0.292793 7.94955 -0.292864 6.05041 0.878487 4.87891L5.17146 0.585938C5.54645 0.211008 6.05524 0.0000720311 6.58552 0H9.46442ZM9.87849 7.28809C9.70854 7.57498 9.53279 8.01023 9.46052 8.56445C9.43122 8.78927 9.25366 8.9667 9.02888 8.99609C8.47471 9.06833 8.03943 9.24414 7.75251 9.41406C7.70353 9.44308 7.66089 9.47329 7.62263 9.5C7.66092 9.52673 7.70348 9.55689 7.75251 9.58594C8.03943 9.75589 8.47466 9.93166 9.02888 10.0039C9.25365 10.0333 9.43119 10.2108 9.46052 10.4355C9.53277 10.9898 9.70852 11.425 9.87849 11.7119C9.90739 11.7607 9.93782 11.8027 9.96442 11.8408C9.991 11.8027 10.0215 11.7606 10.0504 11.7119C10.2203 11.425 10.3961 10.9897 10.4683 10.4355L10.4859 10.3535C10.5425 10.1686 10.7032 10.0295 10.9 10.0039C11.4541 9.93163 11.8895 9.75588 12.1763 9.58594C12.225 9.55707 12.2671 9.52657 12.3052 9.5C12.2671 9.47341 12.2251 9.44295 12.1763 9.41406C11.8895 9.24413 11.4542 9.06837 10.9 8.99609C10.6751 8.96679 10.4976 8.78934 10.4683 8.56445C10.3961 8.01021 10.2203 7.57499 10.0504 7.28809C10.0213 7.23903 9.99116 7.19651 9.96442 7.1582C9.93771 7.19648 9.90753 7.23909 9.87849 7.28809Z" />
                  </svg>
                  <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate">
                    {"ICP Score"}
                  </span>
                  <svg viewBox="0 0 13.0996 13.0996" fill="currentColor" className="block shrink-0 size-[6.5px] text-[rgba(0,0,0,0.4)] lg:size-[13px]" aria-hidden="true">
                    <path d="M6.5498 0.0498047C6.77497 0.0498047 6.94795 0.166175 7.0459 0.24707C7.15598 0.33805 7.25589 0.455603 7.3457 0.579102C7.52704 0.828513 7.71286 1.17002 7.88672 1.57324C8.20163 2.3038 8.5005 3.28813 8.67969 4.41895C9.81094 4.59809 10.7956 4.8979 11.5264 5.21289C11.9294 5.38665 12.2711 5.57168 12.5205 5.75293C12.6441 5.84275 12.7615 5.94361 12.8525 6.05371C12.9334 6.1516 13.0497 6.3246 13.0498 6.5498C13.0498 6.77511 12.9334 6.948 12.8525 7.0459C12.7615 7.15605 12.6441 7.25584 12.5205 7.3457C12.271 7.52707 11.9297 7.71187 11.5264 7.88574C10.7955 8.2008 9.81112 8.50051 8.67969 8.67969C8.50053 9.81094 8.20172 10.7956 7.88672 11.5264C7.71284 11.9297 7.52707 12.271 7.3457 12.5205C7.25585 12.6441 7.15604 12.7615 7.0459 12.8525C6.94798 12.9334 6.77511 13.0498 6.5498 13.0498C6.32458 13.0497 6.15159 12.9334 6.05371 12.8525C5.94365 12.7615 5.84371 12.644 5.75391 12.5205C5.57258 12.2711 5.38672 11.9296 5.21289 11.5264C4.8979 10.7956 4.59808 9.81094 4.41895 8.67969C3.28796 8.50048 2.30383 8.2007 1.57324 7.88574C1.17001 7.71189 0.828516 7.52704 0.579102 7.3457C0.455593 7.25588 0.338056 7.15599 0.24707 7.0459C0.1763 6.96022 0.078122 6.817 0.0546875 6.63184L0.0498047 6.5498L0.0546875 6.46777C0.0781452 6.28253 0.176297 6.13937 0.24707 6.05371C0.338124 5.94354 0.455496 5.8428 0.579102 5.75293C0.82852 5.57164 1.17011 5.38669 1.57324 5.21289C2.30384 4.89796 3.28804 4.59812 4.41895 4.41895C4.59815 3.28786 4.89889 2.30388 5.21387 1.57324C5.38774 1.16996 5.57255 0.828543 5.75391 0.579102C5.84375 0.455543 5.94358 0.338093 6.05371 0.24707C6.15159 0.166191 6.32457 0.0498718 6.5498 0.0498047ZM6.5498 1.18555C6.42905 1.35583 6.28279 1.61864 6.13184 1.96875C5.82069 2.69046 5.51307 3.72317 5.35645 4.9248C5.32714 5.1497 5.1497 5.32714 4.9248 5.35645C3.72319 5.51306 2.69046 5.82069 1.96875 6.13184C1.61863 6.2828 1.35583 6.42905 1.18555 6.5498C1.35582 6.67054 1.61872 6.81684 1.96875 6.96777C2.69046 7.27891 3.7232 7.58654 4.9248 7.74316C5.14963 7.77246 5.32705 7.95001 5.35645 8.1748C5.51304 9.37636 5.82072 10.4091 6.13184 11.1309C6.28255 11.4804 6.42916 11.7428 6.5498 11.9131C6.67048 11.7428 6.81701 11.4805 6.96777 11.1309C7.27892 10.4091 7.58656 9.37644 7.74316 8.1748L7.76074 8.09277C7.81729 7.90784 7.97807 7.76887 8.1748 7.74316C9.37645 7.58656 10.4091 7.27892 11.1309 6.96777C11.4805 6.81701 11.7428 6.67048 11.9131 6.5498C11.7428 6.42916 11.4804 6.28255 11.1309 6.13184C10.4091 5.82071 9.37637 5.51304 8.1748 5.35645C7.95002 5.32705 7.77246 5.14962 7.74316 4.9248C7.58654 3.72319 7.27892 2.69045 6.96777 1.96875C6.81684 1.61871 6.67054 1.35581 6.5498 1.18555Z" />
                  </svg>
                </div>
                <div className="flex flex-col overflow-hidden pt-[18.5px] lg:pt-[37px]">
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 0 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"98"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 1 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"98"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 2 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"97"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 3 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"96"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 4 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"96"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 5 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"92"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 6 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"91"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 7 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"91"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 8 < revealed)}>
                    <div className="px-px">
                      <span className="flex h-[11px] min-w-[11px] items-center justify-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] text-center font-medium text-[#007d53] text-[7px] tabular-nums leading-[10px] tracking-[-0.07px] lg:h-[22px] lg:min-w-[22px] lg:rounded-[7px] lg:px-[4px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"88"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 border-[#eeeff1] border-r w-[80px] lg:w-[160px]">
                <div className="absolute top-0 right-0 left-0 flex h-[18px] items-center border-[#eeeff1] border-b bg-white-100 lg:h-[36px] gap-[4px] pr-[5px] pl-[6px] lg:gap-[8px] lg:pr-[10px] lg:pl-[12px]">
                  <svg viewBox="0 0 10 12" fill="currentColor" className="block shrink-0 h-[6px] w-[5px] text-[#505155] lg:h-[12px] lg:w-[10px]" aria-hidden="true">
                    <path d="M6.38867 7C8.38295 7 9.99987 8.61708 10 10.6113C9.99988 11.3782 9.37822 11.9999 8.61133 12H1.38867C0.621782 11.9999 0.00011723 11.3782 0 10.6113C0.000131955 8.61708 1.61705 7 3.61133 7H6.38867ZM3.61133 8C2.16933 8 1.00013 9.16936 1 10.6113C1.00012 10.8259 1.17407 10.9999 1.38867 11H8.61133C8.82593 10.9999 8.99988 10.8259 9 10.6113C8.99987 9.16936 7.83067 8 6.38867 8H3.61133ZM5.10059 0C6.61931 0.0000659696 7.85059 1.23126 7.85059 2.75C7.85059 4.26874 6.61931 5.49993 5.10059 5.5C3.5818 5.5 2.35059 4.26878 2.35059 2.75C2.35059 1.23122 3.5818 0 5.10059 0ZM5.10059 1C4.13409 1 3.35059 1.7835 3.35059 2.75C3.35059 3.7165 4.13409 4.5 5.10059 4.5C6.06703 4.49993 6.85059 3.71646 6.85059 2.75C6.85059 1.78354 6.06703 1.00007 5.10059 1Z" />
                  </svg>
                  <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate">
                    {"Owner"}
                  </span>
                </div>
                <div className="flex flex-col overflow-hidden pt-[18.5px] lg:pt-[37px]">
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 0 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-7bdbabd7f7.avif 1x, /img/img-7bdbabd7f7.avif 2x" src="/img/img-7bdbabd7f7.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Isla Harrington"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 1 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-b2a56bf0ac.avif 1x, /img/img-b2a56bf0ac.avif 2x" src="/img/img-b2a56bf0ac.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"George Wilkes"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 2 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-573dfa204e.avif 1x, /img/img-573dfa204e.avif 2x" src="/img/img-573dfa204e.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Theo Marshall"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 3 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-39604c3ccc.avif 1x, /img/img-39604c3ccc.avif 2x" src="/img/img-39604c3ccc.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Amelia Carter"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 4 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-046c5b6f11.avif 1x, /img/img-046c5b6f11.avif 2x" src="/img/img-046c5b6f11.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Nathan Cole"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 5 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-84690a33a4.avif 1x, /img/img-84690a33a4.avif 2x" src="/img/img-84690a33a4.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Daniel Fraser"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 6 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-d664861b06.avif 1x, /img/img-d664861b06.avif 2x" src="/img/img-d664861b06.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Maxwell Turner"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 7 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-573dfa204e.avif 1x, /img/img-573dfa204e.avif 2x" src="/img/img-573dfa204e.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Theo Marshall"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 8 < revealed)}>
                    <div className="flex min-w-0 flex-1 items-center gap-[2px] px-[2px] lg:gap-[4px] lg:px-[4px]">
                      <span className="block size-[8px] shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] lg:size-[16px]">
                        <img alt="" loading="lazy" width="64" height="64" decoding="async" data-nimg="1" className="size-full object-cover" style={{"color":"transparent"}} srcSet="/img/img-41ee097a9c.avif 1x, /img/img-41ee097a9c.avif 2x" src="/img/img-41ee097a9c.avif" />
                      </span>
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate px-px">
                        {"Samuel Clarke"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 border-[#eeeff1] border-r w-[140px] lg:w-[280px]">
                <div className="absolute top-0 right-0 left-0 flex h-[18px] items-center border-[#eeeff1] border-b bg-white-100 lg:h-[36px] gap-[4px] pr-[5px] pl-[6px] lg:gap-[8px] lg:pr-[10px] lg:pl-[12px]">
                  <svg viewBox="0 0 13.4998 13.5" fill="currentColor" className="block shrink-0 size-[6.75px] text-[#505155] lg:size-[13.5px]" aria-hidden="true">
                    <path d="M9.99982 6.5C10.1623 6.5 10.2904 6.56746 10.3582 6.60938C10.4374 6.65834 10.509 6.72051 10.5721 6.7832C10.6994 6.90974 10.8279 7.07881 10.9461 7.27832C11.1403 7.60605 11.3217 8.04253 11.4315 8.56738C11.9567 8.67705 12.3935 8.85946 12.7215 9.05371C12.9207 9.17176 13.0901 9.29966 13.2166 9.42676C13.2793 9.48984 13.3414 9.56241 13.3904 9.6416C13.4324 9.70938 13.4998 9.83738 13.4998 10C13.4998 10.1626 13.4323 10.2906 13.3904 10.3584C13.3414 10.4376 13.2793 10.5092 13.2166 10.5723C13.0901 10.6995 12.921 10.8281 12.7215 10.9463C12.3936 11.1405 11.9566 11.322 11.4315 11.4316C11.3218 11.9569 11.1404 12.3938 10.9461 12.7217C10.8279 12.9212 10.6994 13.0903 10.5721 13.2168C10.509 13.2795 10.4374 13.3417 10.3582 13.3906C10.2904 13.4325 10.1623 13.5 9.99982 13.5C9.83732 13.4999 9.70915 13.4325 9.64142 13.3906C9.56227 13.3416 9.49061 13.2795 9.42755 13.2168C9.3003 13.0903 9.17172 12.9212 9.05353 12.7217C8.85926 12.3937 8.67688 11.957 8.5672 11.4316C8.04245 11.3219 7.60582 11.1404 7.27814 10.9463C7.07867 10.8281 6.90954 10.6995 6.78302 10.5723C6.72032 10.5092 6.65816 10.4376 6.60919 10.3584C6.5778 10.3076 6.53254 10.2228 6.51154 10.1152L6.49982 10L6.51154 9.88477C6.53252 9.77723 6.57779 9.69241 6.60919 9.6416C6.65817 9.56242 6.72032 9.48984 6.78302 9.42676C6.90949 9.29966 7.0789 9.17177 7.27814 9.05371C7.60586 8.85957 8.04235 8.67711 8.5672 8.56738C8.67691 8.04248 8.85937 7.60609 9.05353 7.27832C9.17172 7.07883 9.3003 6.90975 9.42755 6.7832C9.4906 6.72052 9.56227 6.65836 9.64142 6.60938C9.70915 6.56749 9.83732 6.50008 9.99982 6.5ZM6.99982 0C10.0374 0 12.4998 2.46243 12.4998 5.5C12.4998 5.77614 12.276 6 11.9998 6C11.7238 5.99984 11.4998 5.77605 11.4998 5.5C11.4998 3.01472 9.4851 1 6.99982 1C4.51467 1.00016 2.49982 3.01481 2.49982 5.5C2.49982 7.34442 3.60978 8.93106 5.20001 9.62598C5.453 9.73656 5.56837 10.0312 5.45783 10.2842C5.3472 10.5371 5.0526 10.6525 4.79962 10.542C4.32031 10.3325 3.87685 10.0562 3.48029 9.72559L0.853334 12.3535C0.65806 12.5486 0.341516 12.5487 0.146302 12.3535C-0.0487674 12.1583 -0.0487674 11.8417 0.146302 11.6465L2.77521 9.0166C1.9807 8.06323 1.49982 6.83866 1.49982 5.5C1.49982 2.46253 3.96238 0.000155646 6.99982 0ZM9.91388 7.78809C9.74394 8.07501 9.56816 8.51025 9.49591 9.06445C9.46659 9.28933 9.28915 9.46679 9.06427 9.49609C8.51011 9.56837 8.07477 9.74413 7.7879 9.91406C7.73892 9.9431 7.69628 9.9733 7.65802 10C7.69628 10.0267 7.73893 10.0569 7.7879 10.0859C8.07477 10.2559 8.51012 10.4316 9.06427 10.5039C9.28915 10.5332 9.46659 10.7107 9.49591 10.9355C9.56816 11.4898 9.74394 11.925 9.91388 12.2119C9.94275 12.2606 9.97323 12.3027 9.99982 12.3408C10.0264 12.3027 10.0569 12.2606 10.0858 12.2119C10.2557 11.925 10.4315 11.4898 10.5037 10.9355L10.5213 10.8535C10.5778 10.6686 10.7387 10.5297 10.9354 10.5039C11.4895 10.4317 11.9248 10.2559 12.2117 10.0859C12.2604 10.0571 12.3025 10.0266 12.3406 10C12.3025 9.97342 12.2604 9.94292 12.2117 9.91406C11.9248 9.74414 11.4895 9.56833 10.9354 9.49609C10.7106 9.46668 10.533 9.28925 10.5037 9.06445C10.4315 8.51018 10.2557 8.075 10.0858 7.78809C10.0567 7.73907 10.0265 7.69649 9.99982 7.6582C9.9731 7.69649 9.94292 7.73907 9.91388 7.78809Z" />
                  </svg>
                  <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] min-w-0 flex-1 truncate">
                    {"Research agent"}
                  </span>
                  <svg viewBox="0 0 13.0996 13.0996" fill="currentColor" className="block shrink-0 size-[6.5px] text-[rgba(0,0,0,0.4)] lg:size-[13px]" aria-hidden="true">
                    <path d="M6.5498 0.0498047C6.77497 0.0498047 6.94795 0.166175 7.0459 0.24707C7.15598 0.33805 7.25589 0.455603 7.3457 0.579102C7.52704 0.828513 7.71286 1.17002 7.88672 1.57324C8.20163 2.3038 8.5005 3.28813 8.67969 4.41895C9.81094 4.59809 10.7956 4.8979 11.5264 5.21289C11.9294 5.38665 12.2711 5.57168 12.5205 5.75293C12.6441 5.84275 12.7615 5.94361 12.8525 6.05371C12.9334 6.1516 13.0497 6.3246 13.0498 6.5498C13.0498 6.77511 12.9334 6.948 12.8525 7.0459C12.7615 7.15605 12.6441 7.25584 12.5205 7.3457C12.271 7.52707 11.9297 7.71187 11.5264 7.88574C10.7955 8.2008 9.81112 8.50051 8.67969 8.67969C8.50053 9.81094 8.20172 10.7956 7.88672 11.5264C7.71284 11.9297 7.52707 12.271 7.3457 12.5205C7.25585 12.6441 7.15604 12.7615 7.0459 12.8525C6.94798 12.9334 6.77511 13.0498 6.5498 13.0498C6.32458 13.0497 6.15159 12.9334 6.05371 12.8525C5.94365 12.7615 5.84371 12.644 5.75391 12.5205C5.57258 12.2711 5.38672 11.9296 5.21289 11.5264C4.8979 10.7956 4.59808 9.81094 4.41895 8.67969C3.28796 8.50048 2.30383 8.2007 1.57324 7.88574C1.17001 7.71189 0.828516 7.52704 0.579102 7.3457C0.455593 7.25588 0.338056 7.15599 0.24707 7.0459C0.1763 6.96022 0.078122 6.817 0.0546875 6.63184L0.0498047 6.5498L0.0546875 6.46777C0.0781452 6.28253 0.176297 6.13937 0.24707 6.05371C0.338124 5.94354 0.455496 5.8428 0.579102 5.75293C0.82852 5.57164 1.17011 5.38669 1.57324 5.21289C2.30384 4.89796 3.28804 4.59812 4.41895 4.41895C4.59815 3.28786 4.89889 2.30388 5.21387 1.57324C5.38774 1.16996 5.57255 0.828543 5.75391 0.579102C5.84375 0.455543 5.94358 0.338093 6.05371 0.24707C6.15159 0.166191 6.32457 0.0498718 6.5498 0.0498047ZM6.5498 1.18555C6.42905 1.35583 6.28279 1.61864 6.13184 1.96875C5.82069 2.69046 5.51307 3.72317 5.35645 4.9248C5.32714 5.1497 5.1497 5.32714 4.9248 5.35645C3.72319 5.51306 2.69046 5.82069 1.96875 6.13184C1.61863 6.2828 1.35583 6.42905 1.18555 6.5498C1.35582 6.67054 1.61872 6.81684 1.96875 6.96777C2.69046 7.27891 3.7232 7.58654 4.9248 7.74316C5.14963 7.77246 5.32705 7.95001 5.35645 8.1748C5.51304 9.37636 5.82072 10.4091 6.13184 11.1309C6.28255 11.4804 6.42916 11.7428 6.5498 11.9131C6.67048 11.7428 6.81701 11.4805 6.96777 11.1309C7.27892 10.4091 7.58656 9.37644 7.74316 8.1748L7.76074 8.09277C7.81729 7.90784 7.97807 7.76887 8.1748 7.74316C9.37645 7.58656 10.4091 7.27892 11.1309 6.96777C11.4805 6.81701 11.7428 6.67048 11.9131 6.5498C11.7428 6.42916 11.4804 6.28255 11.1309 6.13184C10.4091 5.82071 9.37637 5.51304 8.1748 5.35645C7.95002 5.32705 7.77246 5.14962 7.74316 4.9248C7.58654 3.72319 7.27892 2.69045 6.96777 1.96875C6.81684 1.61871 6.67054 1.35581 6.5498 1.18555Z" />
                  </svg>
                </div>
                <div className="flex flex-col overflow-hidden pt-[18.5px] lg:pt-[37px]">
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 0 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Opened 40+ GTM roles"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 1 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Hired a new CRO"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 2 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Building its first GTM team"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 3 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Opened 14 AE roles this quarter"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 4 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Opening a new sales hub"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 5 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Raised $125M Series C"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 6 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Doubling its sales org this year"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 7 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"New VP Sales from enterprise SaaS"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-[18px] w-full items-center overflow-hidden border-[#eeeff1] border-b last:border-b-0 lg:h-[36px] px-[4px] lg:px-[8px]" style={rowStyle(!reduce, 8 < revealed)}>
                    <div className="min-w-0 flex-1 px-px">
                      <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] block truncate">
                        {"Made its first sales hires"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div className="absolute top-[18.5px] left-[276px] z-10 origin-left lg:top-[37px] lg:left-[552px]" {...card}>
          <div className="w-[170px] overflow-hidden rounded-[6px] bg-white-100 shadow-[0_0_1px_1px_rgba(0,22,62,0.01),0_4px_12px_-1px_rgba(0,22,62,0.04),0_1px_3px_-1px_rgba(0,22,62,0.18)] lg:w-[340px] lg:rounded-[12px]">
            <div className="flex flex-col items-center gap-[4px] px-[6px] pt-[6px] pb-[8px] lg:gap-[8px] lg:px-[12px] lg:pt-[12px] lg:pb-[16px]">
              <p className="w-full truncate font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                {"Send email"}
              </p>
              <div className="flex w-full flex-col items-start gap-[3px] lg:gap-[6px]">
                <p className="w-full truncate font-semibold text-[#242629] text-[8px] leading-[10px] tracking-[-0.08px] lg:text-[16px] lg:leading-[20px] lg:tracking-[-0.16px]">
                  {"Send follow up email to Maya White"}
                </p>
                <p className="w-full font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                  {"The intro email ties Maya's new VP role, the Series C, and 14 open AE roles to faster hiring."}
                </p>
              </div>
            </div>
            <div className="px-[5px] lg:px-[10px]">
              <div className="flex flex-col overflow-hidden rounded-[7px] border border-[#eeeff1] lg:rounded-[14px]">
                <div className="flex flex-col border-[#eeeff1] border-b py-[4.5px] pr-[5px] pl-[6px] lg:py-[9px] lg:pr-[10px] lg:pl-[12px]">
                  <div className="flex w-full items-start gap-[6px] lg:gap-[12px]">
                    <div className="flex h-[11px] w-[16px] items-start py-px lg:h-[22px] lg:w-[32px]">
                      <span className="font-medium text-[7px] text-[rgba(0,0,0,0.4)] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                        {"To"}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-wrap content-center items-center gap-y-[3px] lg:gap-y-[6px]">
                      <div className="flex h-[11px] items-center gap-[2.5px] px-[1.5px] lg:h-[22px] lg:gap-[5px] lg:px-[3px]">
                        <span className="flex size-[8px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] font-semibold text-[5px] text-white-100 uppercase leading-none lg:size-[16px] lg:text-[9px]" style={{"backgroundColor":"#e0529c"}}>
                          {"M"}
                        </span>
                        <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] whitespace-nowrap px-px">
                          {"Maya White"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[32px] flex-col items-end py-px lg:w-[64px]">
                      <div className="flex h-[10px] items-center justify-center rounded-[3px] px-[2px] lg:h-[20px] lg:rounded-[6px] lg:px-[4px]">
                        <span className="whitespace-nowrap px-px font-medium text-[#505155] text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                          {"CC / BCC"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-[20px] items-center border-[#eeeff1] border-b pr-[5px] pl-[6px] lg:h-[40px] lg:pr-[10px] lg:pl-[12px]">
                  <span className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] truncate">
                    {subject}
                  </span>
                </div>
                <div className="px-[6px] py-[5px] lg:px-[12px] lg:py-[10px]">
                  <p className="font-medium text-[7px] tracking-[-0.07px] text-[#242629] lg:text-[14px] lg:tracking-[-0.14px] min-h-[100px] whitespace-pre leading-[10px] lg:min-h-[200px] lg:leading-[20px]">
                    {bodyText}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-[6px] lg:p-[12px]">
              <div className="flex items-center gap-[4px] lg:gap-[8px]">
                <div className="flex h-[14px] items-center justify-center rounded-[4px] px-[3.5px] lg:h-[28px] lg:rounded-[8px] lg:px-[7px] border border-[rgba(0,0,0,0.1)] bg-[#266df0] text-white-100 shadow-[0px_2px_4px_-2px_rgba(15,107,233,0.12),0px_3px_6px_-2px_rgba(15,107,233,0.08)]">
                  <span className="whitespace-nowrap px-px font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                    {"Send email"}
                  </span>
                </div>
                <div className="flex h-[14px] items-center justify-center rounded-[4px] px-[3.5px] lg:h-[28px] lg:rounded-[8px] lg:px-[7px] text-[rgba(0,0,0,0.55)]">
                  <span className="whitespace-nowrap px-px font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                    {"Discard"}
                  </span>
                </div>
              </div>
              <div className="flex h-[14px] items-center justify-center rounded-[4px] px-[3.5px] lg:h-[28px] lg:rounded-[8px] lg:px-[7px] bg-white-100 text-[#242629] shadow-joshuattio-product-e1">
                <span className="whitespace-nowrap px-px font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                  {"Save draft"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>  );
}
