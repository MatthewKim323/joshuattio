"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLoopSlider } from "./loop-slider";

// Full-width product tabs. lg and up: one framed screenshot, swapped by the
// sticky pill of tab buttons under it. Below lg: a scrollable tab strip over a
// looping phone-frame slider (spacing 24); the slider reports its slide back to
// the tabs 100ms debounced, and the active tab scrolls itself into view.

export type TabImage = { src: string; width: number; height: number; srcSet?: string };
export type ShowcaseTab = { title: string; desktop: TabImage; mobile?: TabImage };

const DESKTOP_TAB =
  "flex cursor-pointer items-center gap-x-1 rounded-[10px] border border-subtle-stroke px-[11px] py-[5px] text-sm text-tertiary-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-secondary-background focus-visible:outline-hidden focus-visible:ring-3 focus-visible:active:ring-2";
const MOBILE_TAB =
  "flex shrink-0 cursor-pointer items-center gap-x-1 whitespace-nowrap rounded-[10px] border border-subtle-stroke bg-primary-background py-[9px] pr-[11px] pl-[9px] text-sm text-tertiary-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-secondary-background focus-visible:outline-hidden focus-visible:ring-3 focus-visible:active:ring-2";

function Img({ image, className }: { image: TabImage; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      loading="lazy"
      width={image.width}
      height={image.height}
      decoding="async"
      data-nimg="1"
      className={className}
      style={{ color: "transparent" }}
      srcSet={image.srcSet ?? `${image.src} 1x`}
      src={image.src}
    />
  );
}

function PhoneFrame({ image }: { image: TabImage }) {
  return (
    <div className="px-8 pt-4 [mask-image:_linear-gradient(to_top,transparent,#00000024,#00000043,#00000065,#00000089,#000000af,#000000d6,#000_12px)]">
      <div className="rounded-t-[40px] border-[#E0E1E6] border-x border-t px-0.5 pt-0.5 shadow-[0px_6px_20px_0px_rgba(78,_83,_90,_0.05),_0px_20px_30px_0px_rgba(78,_83,_90,_0.03),_2px_4px_7px_0px_rgba(49,_55,_61,_0.05)]">
        <div className="relative overflow-hidden rounded-t-[37px] border-[#E4E5E9] border-x border-t px-[0.25px] pt-[0.25px]">
          <Img image={image} />
        </div>
      </div>
    </div>
  );
}

function useDebounced(fn: () => void, ms: number, deps: unknown[]) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    const t = window.setTimeout(() => ref.current(), ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function MobileSlider({
  current,
  onCurrentChange,
  children,
}: {
  current: number;
  onCurrentChange: (i: number) => void;
  children: ReactNode[];
}) {
  const [rel, setRel] = useState(0);
  const [created, setCreated] = useState(false);
  const slider = useLoopSlider(children.length, 24, setRel);

  useEffect(() => {
    setCreated(true);
  }, []);

  // (the settled slide equal to the current tab is a no-op, so load does not
  // scroll the page to the strip)
  useDebounced(() => {
    if (rel !== current) onCurrentChange(rel);
  }, 100, [rel]);

  const moveToIdx = slider.moveToIdx;
  useEffect(() => {
    moveToIdx(current);
  }, [current, moveToIdx]);

  const ready = created && slider.width > 0;

  return (
    <div className="w-full">
      <div ref={slider.ref} className="keen-slider" {...slider.handlers}>
        {children.map((child, i) => (
          <div
            key={i}
            className={`keen-slider__slide${i !== 0 && !created ? " hidden" : ""}`}
            style={ready ? { minWidth: `${slider.width}px`, maxWidth: `${slider.width}px`, transform: `translate3d(${slider.transforms[i]}px, 0px, 0px)` } : undefined}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-x-2">
        {created
          ? children.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => slider.moveToIdx(i)}
                className={`h-2 w-2 rounded-full ${current !== i ? "bg-surface" : "bg-muted-strong-background dark:bg-[#4B8BFF]"}`}
              />
            ))
          : null}
      </div>
    </div>
  );
}

function MobileTabs({ tabs }: { tabs: ShowcaseTab[] }) {
  const list = tabs.filter((t) => !!t.mobile);
  const strip = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const select = useCallback((i: number) => {
    setCurrent(i);
    const el = strip.current?.querySelector(`#tab-${i}`);
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  return (
    <div className="lg:hidden">
      <div ref={strip} className="flex justify-center">
        <ul className="scrollbar-none flex justify-start gap-x-2 overflow-scroll px-6">
          {list.map((tab, i) => (
            <li key={i} className="" style={{ maxWidth: "fit-content", minWidth: "fit-content" }}>
              <button type="button" id={`tab-${i}`} onClick={() => select(i)} className={`${MOBILE_TAB}${current === i ? " bg-surface-subtle" : ""}`}>
                <span>{tab.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-5 max-w-md [mask-image:_linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-12px),transparent)]">
        <MobileSlider current={current} onCurrentChange={select}>
          {list.map((tab) => (
            <PhoneFrame key={tab.title} image={tab.mobile!} />
          ))}
        </MobileSlider>
      </div>
    </div>
  );
}

export function TabsFullScreen({ tabs }: { tabs: ShowcaseTab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  // Warm the other screenshots so a tab switch paints at once.
  useEffect(() => {
    for (const t of tabs) {
      const img = new Image();
      img.src = t.desktop.src;
    }
  }, [tabs]);

  return (
    <div className="relative">
      <div className="hidden lg:grid">
        <div className="container grid grid-cols-12 gap-x-6">
          <div className="col-span-full xl:col-[2/-2]">
            <div className="rounded-[28px] border border-white-100/50 bg-[linear-gradient(199deg,_#EDEFF3_11.23%,_#E4E7EC_87.61%)] p-[9px] shadow-[0px_10px_30px_-4px_rgba(28,_40,_64,_0.10),_0px_8px_8px_-8px_rgba(28,_40,_64,_0.10),_0px_4px_4px_-6px_rgba(28,_40,_64,_0.14),_0px_0px_0px_1px_#EDEFF3]">
              <div className="overflow-hidden rounded-[20px] bg-white-100 shadow-[0px_2px_6px_0px_rgba(28,_40,_64,_0.04)]">
                <Img key={tab.desktop.src} image={tab.desktop} className="w-full" />
              </div>
            </div>
            <div className="sticky bottom-4 flex justify-center pt-8">
              <ul className="flex w-fit gap-x-2 rounded-[15px] bg-primary-background p-2.5 shadow-xl">
                {tabs.map((t, i) => (
                  <li key={t.title}>
                    <button type="button" className={`${DESKTOP_TAB}${active === i ? " bg-surface-subtle" : ""}`} onClick={() => setActive(i)}>
                      <span>{t.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <MobileTabs tabs={tabs} />
    </div>
  );
}
