"use client";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useHeaderContext } from "@/components/shell/header-shell";
import { HeaderLink, HeaderSections } from "@/components/shell/header-link";
import { NAVIGATION, isMenu, type NavMenu, type NavSection } from "@/components/shell/nav-data";
import "@/components/shell/shell.css";

// Drawer slide / overlay fade length (cubic-bezier(.32,.72,0,1)).
const DRAWER_MS = 500;
const ITEM_CLASS = "border-subtle-stroke border-b pt-2.5 pb-[9px]";

function Hamburger18({ className }: { className?: string }) {
  return (
    <svg className={`text-black-500 dark:text-white-500 ${className ?? ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 6H3M15 12H3" />
    </svg>
  );
}

function Cross18({ className }: { className?: string }) {
  return (
    <svg className={`text-black-500 dark:text-white-500 ${className ?? ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
    </svg>
  );
}

/** The below-lg hamburger. */
export function MenuButton() {
  const { isMenuOpen, setIsMenuOpen } = useHeaderContext();
  return (
    <button
      className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default size-9 rounded-[10px] button-ghost lg:hidden"
      data-site-header-mobile-menu-trigger="true"
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      aria-controls="site-header-mobile-menu"
      aria-expanded={isMenuOpen}
      aria-haspopup="dialog"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? <Cross18 className="h-6 w-6" /> : <Hamburger18 className="h-6 w-6" />}
    </button>
  );
}

/** Accordion item: height animates between 0 and the measured content height. */
function AccordionItem({ item }: { item: NavMenu }) {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const state = open ? "open" : "closed";

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      // Measure with the animation off, then let slideDown run to that height.
      const prevAnim = el.style.animationName;
      el.style.animationName = "none";
      el.style.setProperty("--radix-accordion-content-height", `${el.getBoundingClientRect().height}px`);
      el.style.animationName = prevAnim;
    }
  }, [open, present]);

  const toggle = () => {
    if (!open) setPresent(true);
    else {
      const el = contentRef.current;
      if (el) el.style.setProperty("--radix-accordion-content-height", `${el.getBoundingClientRect().height}px`);
    }
    setOpen(!open);
  };

  const groups: NavSection[][] = [...item.columns.map((c) => [c]), ...(item.cardSections.length ? [item.cardSections] : [])];
  return (
    <div data-state={state} className={ITEM_CLASS}>
      <h3 data-state={state} className="flex">
        <button type="button" aria-expanded={open} data-state={state} onClick={toggle} className="group flex min-h-11 flex-1 cursor-pointer items-center justify-between rounded-xl px-2 py-2 outline-hidden">
          <span className="text-base text-primary-foreground">{item.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="h-5 w-5 text-black-500 transition-transform duration-300 ease-in-out group-data-open:rotate-180 motion-reduce:transition-none dark:text-white-500" aria-hidden>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
          </svg>
        </button>
      </h3>
      <div
        ref={contentRef}
        role="region"
        data-state={state}
        hidden={!open && !present}
        onAnimationEnd={() => { if (!open) setPresent(false); }}
        className="overflow-hidden data-closed:animate-slideUp data-open:animate-slideDown motion-reduce:data-closed:animate-none motion-reduce:data-open:animate-none"
      >
        <div className="flex flex-col gap-y-1.5">
          {groups.map((sections, i) => (
            <div key={sections[0]?.heading ?? i} className="flex flex-col pb-2.5">
              {i !== 0 && <hr className="mb-2 border-weak-stroke" />}
              <HeaderSections
                sections={sections}
                headingClassName="mt-3.5 mb-2 px-2 font-medium text-accent-foreground text-xs"
                renderLink={(link) => <HeaderLink link={link} compact />}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full-screen drawer under the header that drops from the top below lg. */
export function MobileMenu() {
  const { isMenuOpen, setIsMenuOpen } = useHeaderContext();
  const [present, setPresent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mount on open; unmount after the exit animation.
  useEffect(() => {
    if (isMenuOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPresent(true);
      return;
    }
    const t = window.setTimeout(() => setPresent(false), DRAWER_MS);
    return () => window.clearTimeout(t);
  }, [isMenuOpen]);

  // Close when the viewport grows to the desktop nav.
  useEffect(() => {
    if (!isMenuOpen) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const check = () => { if (mq.matches) setIsMenuOpen(false); };
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, [isMenuOpen, setIsMenuOpen]);

  // Modal: lock page scroll, escape closes, focus moves in and back to the trigger.
  useEffect(() => {
    if (!isMenuOpen) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    contentRef.current?.focus({ preventScroll: true });
    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      document.querySelector<HTMLElement>("[data-site-header-mobile-menu-trigger]")?.focus({ preventScroll: true });
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const onKeyDownCapture = (e: ReactKeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const els = Array.from(scrollRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []).filter((el) => el.offsetParent !== null);
    if (els.length === 0) return;
    const i = els.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    e.stopPropagation();
    let n = i;
    if (e.key === "ArrowDown") n = (i + 1) % els.length;
    else if (e.key === "ArrowUp") n = (i - 1 + els.length) % els.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = els.length - 1;
    els[n]?.focus();
  };

  if (!present) return null;
  const state = isMenuOpen ? "open" : "closed";
  return createPortal(
    <>
      <div
        data-vaul-overlay=""
        data-vaul-snap-points="false"
        data-state={state}
        className="fixed inset-0 z-(--mobile-nav-drawer-overlay-z-index) bg-primary-background"
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        ref={contentRef}
        id="site-header-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        data-vaul-drawer=""
        data-vaul-drawer-direction="top"
        data-vaul-snap-points="false"
        data-state={state}
        className="fixed inset-0 top-(--site-header-height) flex flex-col overflow-hidden border-subtle-stroke border-b bg-primary-background z-(--mobile-nav-drawer-content-z-index) outline-hidden"
      >
        <div ref={scrollRef} onKeyDownCapture={onKeyDownCapture} className="absolute inset-0 overflow-y-scroll pb-20">
          <div className="container">
            {NAVIGATION.map((item) =>
              isMenu(item) ? (
                <AccordionItem key={item.id} item={item} />
              ) : (
                <div key={item.id} className={ITEM_CLASS}>
                  <a className="flex min-h-11 w-full items-center rounded-xl px-2 py-2 text-secondary-foreground outline-hidden" href={item.href} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </a>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
