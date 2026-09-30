"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MENTIONS, type Mention } from "./mentions-data";

// Avatar wall shapes per breakpoint. X = avatar, O = faded tile, _ = gap.
const GRID_XL = [
  "___XXXXXXXXXXXXXXXXXX_XXXXXXX_XXXXXXXXXXXXXXXX____",
  "__XXXXXXXXXXXXXXXXXXXXXX_XXXXXXXXXXXXXX_XXXXXXX___",
  "___XXXXXX_XXXXXXXXXXXXXXXXXXXXXXXX_X_XXXXXXXXXX___",
  "__XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX__XX__",
  "___XXXXXXXXXXXXXXXXX_XXXXXXX_XXXXXXX_XXXXXXXXXX___",
  "_XXX_XXX_X_XX_____X__X_________X_______XXXXX_X_OX_",
  "__XXXX_X_______________________________X_XX_OX____",
  "__XOXX_____________________________________XX_X___",
  "_X_X_X________________________________________XOX_",
  "___O______________________________________________",
];
const GRID_LG = [
  "___XXXXXXXXXXXXXXXX_XXXXXXXXXXXXXX____",
  "__XXXXXXXXXXXX_XXXXXXXXXXXX_XXXXXXX___",
  "___XXXXXX_XXXXXXXXXXXX_X_XXXXXXXXXX___",
  "__XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX__XX__",
  "___XXXXXXXXXXXXXXX_XXXXXXX_XXXXXXXX___",
  "_XXX_XXX_X_XX___X____X_____XXXXX_X_XX_",
  "__XXXX_X___________________X_XX_OX____",
  "__XOXX_________________________XX_X___",
  "_X_X_X____________________________XOX_",
  "___O__________________________________",
];
const GRID_MD = [
  "_X_X_______X__X",
  "X_OXX____XX_XOX",
  "_XXX_XXXX_XOX_X",
  "XX_XXXXXXXXXXXX",
  "_XXXXXXXXXXXX_X",
  "XX_XXXXXXXX_X_X",
  "X_XXXXXXXXXXXX_",
  "XX_XXXXXXXXXX_X",
  "XXXXXXXXXXXXXX_",
  "X_XXXXXXXXXXX_X",
  "X_XXXXXXXXXXX_X",
  "XXXXXXXXXXXX_X_",
  "XX_XXXXXXXXXXXX",
  "X_XO_XXXXXX_X_X",
  "XXXXOX_X_XX_OXX",
  "_XOXXX_XX__XOX_",
];
const GRID_SM = [
  "_X_X___X__X",
  "X_OXX_X_XOX",
  "_XXXXXXOX_X",
  "XXXXXXXXXXX",
  "_XXXXXXXX_X",
  "XXXXXXXXX_X",
  "X_XXXXXXXX_",
  "XXXXXXXXX_X",
  "XXXXXXXXXX_",
  "X_XXXXXXX_X",
  "X_XXXXXXX_X",
  "XXXXXXXXXX_",
  "XX_XXXXX_XX",
  "X_XO_XXXX_X",
  "XXXXOX_X_OX",
  "_XOXX_XXOX_",
];

const img = (hash: string) => `/img/img-${hash}.avif`;
const EASE_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1];
const EASE_IN: [number, number, number, number] = [0.12, 0, 0.39, 0];

type Ctx = { inView: boolean; offset: number };
const MentionsContext = createContext<Ctx>({ inView: false, offset: 0 });

// Outer block of the closing call to action. Tracks when 40% of it is in view
// (once) and its left offset, which keeps tooltips inside the container.
export function MentionsSection({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const measure = () => {
      if (ref.current) setOffset(ref.current.getBoundingClientRect().left);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const value = useMemo(() => ({ inView, offset }), [inView, offset]);
  return (
    <MentionsContext.Provider value={value}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </MentionsContext.Provider>
  );
}

// Swaps between two class sets once the section is in view.
export function InViewSwap({
  as: Tag = "span",
  className,
  hidden,
  shown = "",
  children,
}: {
  as?: "span" | "div";
  className: string;
  hidden: string;
  shown?: string;
  children: ReactNode;
}) {
  const { inView } = useContext(MentionsContext);
  const state = inView ? shown : hidden;
  return <Tag className={state ? `${className} ${state}` : className}>{children}</Tag>;
}

function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

// Snippet tooltip shown above a hovered avatar.
function MentionTooltip({ entry, shouldFlip }: { entry: Mention; shouldFlip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const { offset } = useContext(MentionsContext);
  const [zIndex] = useState(() => {
    const now = new Date();
    return now.getMilliseconds() + 1e3 * now.getSeconds();
  });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    let s = 0;
    if (r.left < 16 + offset) s = 16 - r.left + offset;
    if (r.right > vw - 16 - offset) s = vw - r.right - 16 - offset;
    setShift(s);
  }, [offset]);
  const [, fullName, username, body, avatar] = entry;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: -4 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          opacity: { duration: 0.16, ease: EASE_OUT },
          y: { duration: 0.24, ease: EASE_OUT },
        },
        y: -8,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        transition: {
          opacity: { duration: 0.04, ease: EASE_IN },
          scale: { duration: 0.04, ease: EASE_IN },
          y: { duration: 0.04, ease: EASE_IN },
        },
        y: -4,
      }}
      style={{ transformOrigin: "center center", zIndex }}
      className="pointer-events-none absolute top-0 left-0 w-[280px]"
    >
      <div
        ref={ref}
        style={{ "--tooltip-translate-x": `calc(-50% + ${shift}px)` } as React.CSSProperties}
        className={`relative h-full w-full translate-x-(--tooltip-translate-x) ${
          shouldFlip ? "translate-y-[40px] lg:translate-y-[-100%]" : "translate-y-[-100%] lg:translate-y-[-100%]"
        }`}
      >
        <div
          className="relative border border-black-100/5 backdrop-blur-xs dark:border-white-100/5 w-full"
          style={{ borderRadius: "16px" }}
        >
          <div
            className="overflow-hidden bg-primary-background shadow-joshuattio-5 dark:bg-secondary-background"
            style={{ borderRadius: "calc(16px - 1px)", padding: "10px" }}
          >
            <div className="grid h-full w-full grid-cols-[24px_auto] grid-rows-[16px_auto] gap-x-2 gap-y-0.5">
              <img
                className="row-span-2 h-6 w-6 rounded-full border border-weak-stroke"
                src={img(avatar)}
                width={24}
                height={24}
                alt={fullName}
                decoding="async"
              />
              <p className="flex gap-1 overflow-hidden text-ellipsis text-nowrap font-display font-medium text-secondary-foreground text-xs">
                <span className="font-bold">{fullName}</span>
                {username && <span className="overflow-hidden text-ellipsis text-caption-foreground">{username}</span>}
              </p>
              <p className="col-start-2 overflow-hidden text-ellipsis font-display font-medium text-secondary-foreground text-xs">
                {body.split(/(@[a-zA-Z0-9_]+)/g).map((part, i) =>
                  part.toLowerCase().startsWith("@joshuattio") ? (
                    <span key={i} className="text-blue-500">
                      {part}
                    </span>
                  ) : part.startsWith("@") ? (
                    <span key={i} className="text-tertiary-foreground">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AvatarCell({ entry, inView, delay, rowIndex }: { entry: Mention; inView: boolean; delay: number; rowIndex: number }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  return (
    <div
      className={`relative h-7 flex-[0_0_28px] lg:h-6 lg:flex-[0_0_24px] transition-opacity duration-300 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        onFocus={show}
        onBlur={hide}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="group relative h-full w-full overflow-hidden rounded-[7px] p-px after:pointer-events-none after:absolute after:inset-px after:z-1 after:rounded-[7px] after:border after:border-[#2E3238]/8"
      >
        <img
          alt={entry[1]}
          loading="lazy"
          width={22}
          height={22}
          decoding="async"
          data-nimg="1"
          className="relative h-full w-full rounded-[7px] transition-all duration-300 ease-out group-hover:opacity-80"
          srcSet={`${img(entry[4])} 1x, ${img(entry[4])} 2x`}
          src={img(entry[4])}
          style={{ color: "transparent" }}
        />
      </div>
      <AnimatePresence>{open && <MentionTooltip shouldFlip={rowIndex < 3} entry={entry} />}</AnimatePresence>
    </div>
  );
}

const Cell = memo(function Cell({
  cell,
  inView,
  rowLength,
  rowIndex,
  columnIndex,
  isSmall,
  entry,
}: {
  cell: string;
  inView: boolean;
  rowLength: number;
  rowIndex: number;
  columnIndex: number;
  isSmall: boolean;
  entry: Mention | undefined;
}) {
  const delay = useMemo(
    () =>
      isSmall
        ? Math.round((0.04 * rowIndex + 0.02 * columnIndex) * 1e3)
        : Math.round((0.02 * Math.abs(rowLength / 2 - columnIndex) + Math.random() / 4 + 0.2) * 1e3),
    [rowLength, rowIndex, columnIndex, isSmall],
  );
  if (cell === "X" && entry) return <AvatarCell entry={entry} delay={delay} inView={inView} rowIndex={rowIndex} />;
  if (cell === "O")
    return (
      <div
        className={`h-7 flex-[0_0_28px] rounded-[7px] lg:h-6 lg:flex-[0_0_24px] bg-linear-to-tl from-[#a4adba] to-[#e4e7ec] transition-all duration-150 ease-out ${inView ? "opacity-20" : "opacity-0"}`}
        style={{ transitionDelay: `${delay}ms` }}
      />
    );
  return <div className="h-7 flex-[0_0_28px] lg:h-6 lg:flex-[0_0_24px]" />;
});

// The avatar wall. Rendered on the client only (its shape depends on the window
// width); the min-height wrapper in the markup reserves its space until then.
export function MentionsGrid() {
  const { inView } = useContext(MentionsContext);
  const width = useWindowWidth();
  if (width === null) return null;
  let grid = GRID_SM;
  if (width >= 768) grid = GRID_MD;
  if (width >= 992) grid = GRID_LG;
  if (width >= 1280) grid = GRID_XL;
  const isSmall = width < 768;
  let filled = 0;
  return (
    <>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-px pb-px last-of-type:pb-0">
          {row.split("").map((cell, columnIndex) => {
            const entry = cell === "X" ? MENTIONS[filled++] : undefined;
            return (
              <Cell
                key={columnIndex}
                cell={cell}
                inView={inView}
                rowLength={row.length}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                isSmall={isSmall}
                entry={entry}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
