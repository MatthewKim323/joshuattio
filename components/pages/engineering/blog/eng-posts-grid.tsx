"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ENG_POSTS, type EngPost } from "./posts";

// Category tabs + post list. Picking a category floats its posts to the top
// (stable order otherwise) with a 0.4s easeInOut layout move; rows that change
// index blur 1px while it runs. The choice is mirrored into `?category=`
// (defaulting to "All"), and read back from it on load.

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

const CATEGORIES = Array.from(new Set(ENG_POSTS.map((p) => p.category)))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ name, count: ENG_POSTS.filter((p) => p.category === name).length }));

const ORIGINAL_INDEX = new Map(ENG_POSTS.map((p, i) => [p.href, i]));

function Tab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      className={cx(
        "relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-10 rounded-xl px-3.25 has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost justify-start gap-1 text-xl max-lg:text-lg max-xl:w-full",
        active && "pointer-events-none",
      )}
      onClick={onClick}
    >
      <span className={active ? "shrink truncate text-primary-foreground" : "text-accent-foreground"}>{label}</span>
      <span className="align-super text-overline">
        {"["}
        {count}
        {"]"}
      </span>
    </button>
  );
}

function Row({
  post,
  index,
  selected,
  lastOfSelected,
  moved,
  animating,
  onStart,
  onDone,
}: {
  post: EngPost;
  index: number;
  selected: string | null;
  lastOfSelected: boolean;
  moved: boolean;
  animating: boolean;
  onStart: () => void;
  onDone: () => void;
}) {
  const inCategory = !!selected && selected === post.category;
  return (
    <motion.div
      layout
      layoutId={`post-${post.href}`}
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      onLayoutAnimationStart={onStart}
      onLayoutAnimationComplete={onDone}
      className="relative z-10 bg-primary-background"
    >
      <a
        className={cx(
          "group relative grid grid-cols-16 items-baseline py-7 max-lg:grid-cols-12 transition-[opacity,filter,background-color] duration-500 ease-in-out",
          inCategory && "bg-secondary-background",
          animating && moved && "blur-[1px]",
        )}
        href={post.href}
      >
        <div
          className={cx(
            "pointer-events-none absolute inset-0 bg-secondary-background opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-80 group-hover:duration-50 group-active:opacity-100 group-active:duration-50",
            inCategory && "dark:bg-primary-background dark:mix-blend-screen",
          )}
        />
        <h3 className="relative col-[2/10] text-balance text-lg max-lg:pt-6">
          {post.shortTitle ? (
            <>
              <span className="max-lg:hidden">{post.title}</span>
              <span className="lg:hidden">{post.shortTitle}</span>
            </>
          ) : (
            post.title
          )}
        </h3>
        {post.date && <p className="relative col-[11/13] text-overline max-lg:col-[-6/-2] max-lg:row-1 max-lg:justify-self-end">{post.date}</p>}
        <p className="relative col-[13/15] truncate text-overline max-lg:col-[2/6] max-lg:row-1">
          {"["}
          {post.category}
          {"]"}
        </p>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="relative top-0.5 col-[-3/-2] justify-self-end text-caption-foreground max-lg:hidden transition-[translate,color] duration-400 ease-in-out group-hover:translate-x-0.5 group-hover:duration-150 group-active:translate-x-0.5 group-active:duration-50"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
        </svg>
        <p className="relative col-[2/-2] line-clamp-2 max-w-[28em] text-pretty pt-2 text-accent-foreground text-sm max-xl:text-sm">{post.summary}</p>
      </a>
      <svg
        width="100%"
        height="1"
        className={cx(
          "text-subtle-stroke",
          inCategory && "bg-secondary-background",
          selected && selected !== "All" && !inCategory && "blur-[1px]",
          index === ENG_POSTS.length - 1 && "hidden",
        )}
      >
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray={lastOfSelected ? undefined : "4 6"} strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function EngPostsGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setSelected(new URLSearchParams(window.location.search).get("category") ?? "All");
  }, []);

  const pick = (name: string) => {
    setSelected(name);
    const params = new URLSearchParams(window.location.search);
    params.set("category", name);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
  };

  const ordered = selected
    ? ENG_POSTS.toSorted((a, b) => {
        const ia = a.category === selected;
        const ib = b.category === selected;
        return ia && !ib ? -1 : !ia && ib ? 1 : 0;
      })
    : ENG_POSTS;
  const lastSelected = ordered.findLastIndex((p) => p.category === selected);

  return (
    <div className="relative grid grid-cols-24 max-lg:grid-cols-12">
      <div className="scrollbar-none relative py-12 max-lg:col-[1/-1] max-lg:overflow-x-scroll max-lg:px-[8.3333333333%] max-lg:py-6 col-[2/9] max-xl:col-[2/7]">
        <ul className="-mx-3.25 flex w-full flex-col gap-0.5 max-lg:flex-row">
          <li>
            <Tab label="All articles" count={ENG_POSTS.length} active={selected === "All"} onClick={() => pick("All")} />
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.name}>
              <Tab label={c.name} count={c.count} active={selected === c.name} onClick={() => pick(c.name)} />
            </li>
          ))}
        </ul>
        <svg width="1" height="100%" className="text-subtle-stroke absolute inset-y-0 right-0 max-lg:hidden">
          <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </div>
      <svg width="100%" height="1" className="text-subtle-stroke col-[1/-1] lg:hidden">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <div className="relative isolate max-lg:col-[1/-1] col-[9/-1] max-xl:col-[7/-1]">
        <AnimatePresence>
          {ordered.map((post, i) => (
            <Row
              key={post.href}
              post={post}
              index={i}
              selected={selected}
              lastOfSelected={i === lastSelected}
              moved={ORIGINAL_INDEX.get(post.href) !== i}
              animating={animating}
              onStart={() => setAnimating(true)}
              onDone={() => setAnimating(false)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
