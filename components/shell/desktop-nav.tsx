"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { HeaderLink, HeaderSections } from "@/components/shell/header-link";
import { NAVIGATION, isMenu, type NavLink, type NavMenu } from "@/components/shell/nav-data";

// Hover intent: open immediately, close 50ms after the pointer leaves trigger + popup.
const OPEN_DELAY = 0;
const CLOSE_DELAY = 50;
// Popup sits 6px under the list, kept 5px inside the viewport.
const SIDE_OFFSET = 6;
const COLLISION_PADDING = 5;
// Popup fade/translate is 150ms (100ms reduced); panel slides are 200ms.
const POPUP_EXIT_MS = 150;
const PANEL_EXIT_MS = 200;

const TRIGGER_CLASS =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-ghost select-none text-[15px] before:absolute before:-top-px before:-right-1 before:-bottom-px before:-left-1";
const PLAIN_LINK_CLASS =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-ghost text-[15px] before:absolute before:-top-px before:-right-1 before:-bottom-px before:-left-1";
const POPUP_CLASS =
  "h-(--popup-height) max-h-(--available-height) w-(--popup-width) origin-[var(--transform-origin)] overflow-hidden rounded-2xl bg-primary-background/95 backdrop-blur-xl transition-[translate,opacity,width,height] duration-150 ease-in-out-cubic data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0 motion-reduce:bg-primary-background motion-reduce:backdrop-blur-none motion-reduce:transition-[opacity,width,height] motion-reduce:duration-100 motion-reduce:ease-out motion-reduce:data-[ending-style]:translate-y-0 motion-reduce:data-[starting-style]:translate-y-0 data-[instant]:transition-none shadow-joshuattio-5 ring ring-black-100/8 dark:bg-secondary-background dark:ring-white-100/20";
const PANEL_CLASS =
  "col-start-1 row-start-1 w-auto data-[activation-direction=right]:data-[open]:animate-navigation-enter-from-right data-[activation-direction=left]:data-[open]:animate-navigation-enter-from-left data-[activation-direction=right]:data-[closed]:animate-navigation-exit-to-left data-[activation-direction=left]:data-[closed]:animate-navigation-exit-to-right not-data-[activation-direction]:transition-opacity not-data-[activation-direction]:duration-150 not-data-[activation-direction]:ease-in-out-cubic not-data-[activation-direction]:data-[ending-style]:opacity-0 motion-reduce:not-data-[activation-direction]:duration-100 motion-reduce:not-data-[activation-direction]:ease-out";
const FOCUS_GUARD: CSSProperties = { clipPath: "inset(50%)", overflow: "hidden", whiteSpace: "nowrap", border: "0px", padding: "0px", width: "1px", height: "1px", margin: "-1px", position: "fixed", top: "0px", left: "0px" };

const MENUS = NAVIGATION.filter(isMenu);
const menuIndex = (id: string) => MENUS.findIndex((m) => m.id === id);

type Dir = "left" | "right";
type Panel = { open: boolean; hidden: boolean; dir: Dir | null; ending: boolean };
type Phase = "closed" | "starting" | "open" | "ending";
type Size = { w: number; h: number };
type Place = { top: number; left: number; availW: number; availH: number };
type State = { value: string | null; phase: Phase; panels: Record<string, Panel>; size: Size | null; place: Place | null };

const CLOSED_PANEL: Panel = { open: false, hidden: true, dir: null, ending: false };
const INITIAL: State = {
  value: null,
  phase: "closed",
  panels: Object.fromEntries(MENUS.map((m) => [m.id, CLOSED_PANEL])),
  size: null,
  place: null,
};

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
    </svg>
  );
}

function MenuContent({ menu, onLink }: { menu: NavMenu; onLink: () => void }) {
  const renderLink = (link: NavLink) => <HeaderLink link={link} onClick={onLink} />;
  return (
    <div className="flex items-stretch gap-x-2">
      <div className="flex">
        {menu.columns.map((col) => (
          <div key={col.heading} className="flex w-66 flex-col px-3 py-3">
            <HeaderSections sections={[col]} headingClassName="mt-4 mb-1.5 px-2 font-medium text-accent-foreground text-xs first:mt-1.5" renderLink={renderLink} />
          </div>
        ))}
      </div>
      {menu.cardSections.length > 0 && (
        <div className="my-2 mr-2 flex w-64 flex-col rounded-xl px-2.5 py-2 bg-secondary-background dark:bg-white-500/5">
          <HeaderSections sections={menu.cardSections} headingClassName="mt-4 mb-1.5 px-2.5 font-medium text-accent-foreground text-xs first:mt-0.5" renderLink={renderLink} />
        </div>
      )}
    </div>
  );
}

const dataAttr = (on: boolean) => (on ? "" : undefined);

/** Desktop nav list with hover/click dropdowns that resize and slide between panels. */
export function DesktopNav() {
  const [s, setS] = useState<State>(INITIAL);
  const stateRef = useRef(s);
  useLayoutEffect(() => { stateRef.current = s; }, [s]);
  const reason = useRef<"hover" | "click" | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const positionerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sizes = useRef<Record<string, Size>>({});
  const closeTimer = useRef<number | undefined>(undefined);
  const openTimer = useRef<number | undefined>(undefined);
  const exitTimer = useRef<number | undefined>(undefined);
  const panelTimers = useRef<Record<string, number>>({});

  // Natural size of every panel, measured with the popup at max-content.
  const measure = useCallback(() => {
    const positioner = positionerRef.current;
    const popup = popupRef.current;
    if (!positioner || !popup) return;
    const prevHidden = positioner.hidden;
    const panelHidden = MENUS.map((m) => panelRefs.current[m.id]?.hidden ?? true);
    positioner.hidden = false;
    popup.style.width = "max-content";
    popup.style.height = "auto";
    popup.style.maxHeight = "none";
    for (const m of MENUS) {
      MENUS.forEach((o) => { const el = panelRefs.current[o.id]; if (el) el.hidden = o.id !== m.id; });
      const r = popup.getBoundingClientRect();
      sizes.current[m.id] = { w: r.width, h: r.height };
    }
    MENUS.forEach((o, i) => { const el = panelRefs.current[o.id]; if (el) el.hidden = panelHidden[i]; });
    popup.style.width = "";
    popup.style.height = "";
    popup.style.maxHeight = "";
    positioner.hidden = prevHidden;
  }, []);

  const place = useCallback((w: number): Place | null => {
    const list = listRef.current;
    if (!list) return null;
    const r = list.getBoundingClientRect();
    const top = r.bottom + SIDE_OFFSET;
    let left = r.left;
    const maxLeft = window.innerWidth - COLLISION_PADDING - w;
    if (left > maxLeft) left = Math.max(COLLISION_PADDING, maxLeft);
    return { top, left, availW: window.innerWidth - left - COLLISION_PADDING, availH: window.innerHeight - top - COLLISION_PADDING };
  }, []);

  const finishClose = useCallback(() => {
    setS((prev) => (prev.phase === "ending" ? { ...INITIAL, size: prev.size } : prev));
  }, []);

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    const cur = stateRef.current;
    if (cur.value === null) return;
    reason.current = null;
    setS((prev) => {
      if (prev.value === null) return prev;
      const panels = { ...prev.panels };
      panels[prev.value] = { open: false, hidden: false, dir: null, ending: true };
      return { ...prev, value: null, phase: "ending", panels };
    });
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(finishClose, POPUP_EXIT_MS + 20);
  }, [finishClose]);

  const open = useCallback((id: string, why: "hover" | "click") => {
    window.clearTimeout(closeTimer.current);
    const cur = stateRef.current;
    reason.current = why;
    if (cur.value === id) return;
    const menuSize = () => {
      if (!sizes.current[id]) measure();
      return sizes.current[id] ?? null;
    };
    if (cur.value === null) {
      window.clearTimeout(exitTimer.current);
      const size = menuSize();
      const reopening = cur.phase === "ending";
      setS({
        value: id,
        phase: reopening ? "open" : "starting",
        panels: Object.fromEntries(MENUS.map((m) => [m.id, m.id === id ? { open: true, hidden: false, dir: null, ending: false } : CLOSED_PANEL])),
        size,
        place: place(size?.w ?? 0),
      });
      return;
    }
    // Switch panels: the new one slides in from the side of its trigger, the old one out the other way.
    const prevId = cur.value;
    const dir: Dir = menuIndex(id) > menuIndex(prevId) ? "right" : "left";
    const size = menuSize();
    setS((prev) => ({
      ...prev,
      value: id,
      phase: "open",
      panels: { ...prev.panels, [prevId]: { open: false, hidden: false, dir, ending: true }, [id]: { open: true, hidden: false, dir, ending: false } },
      size,
      place: place(size?.w ?? 0),
    }));
    window.clearTimeout(panelTimers.current[prevId]);
    panelTimers.current[prevId] = window.setTimeout(() => {
      setS((prev) => (prev.value !== prevId && prev.panels[prevId] && !prev.panels[prevId].open
        ? { ...prev, panels: { ...prev.panels, [prevId]: CLOSED_PANEL } }
        : prev));
    }, PANEL_EXIT_MS + 20);
  }, [measure, place]);

  // starting -> open on the frame after the popup first paints, so the enter transition runs.
  useEffect(() => {
    if (s.phase !== "starting") return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setS((prev) => (prev.phase === "starting" ? { ...prev, phase: "open" } : prev)));
    });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [s.phase]);

  // Keep the popup anchored while open.
  const mounted = s.phase !== "closed";
  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const w = stateRef.current.size?.w ?? 0;
      const p = place(w);
      if (p) setS((prev) => ({ ...prev, place: p }));
    };
    const onResize = () => { sizes.current = {}; update(); };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted, place]);

  // Hover intent + outside press + escape.
  useEffect(() => {
    if (!mounted) return;
    const inRect = (r: DOMRect, x: number, y: number) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    const inside = (x: number, y: number) => {
      const popup = popupRef.current?.getBoundingClientRect();
      const triggers = MENUS.map((m) => triggerRefs.current[m.id]?.getBoundingClientRect()).filter(Boolean) as DOMRect[];
      if (popup && inRect(popup, x, y)) return true;
      if (triggers.some((r) => inRect(r, x, y))) return true;
      // The gap between the trigger row and the popup is a safe corridor.
      if (popup && triggers.length) {
        const top = Math.min(...triggers.map((r) => r.bottom));
        const left = Math.min(popup.left, ...triggers.map((r) => r.left));
        const right = Math.max(popup.right, ...triggers.map((r) => r.right));
        if (x >= left && x <= right && y >= top - 1 && y <= popup.top + 1) return true;
      }
      return false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reason.current !== "hover" || stateRef.current.value === null) return;
      if (inside(e.clientX, e.clientY)) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = undefined;
      } else if (closeTimer.current === undefined) {
        closeTimer.current = window.setTimeout(() => { closeTimer.current = undefined; close(); }, CLOSE_DELAY);
      }
    };
    const onLeaveDoc = (e: MouseEvent) => {
      if (!e.relatedTarget && reason.current === "hover") {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => { closeTimer.current = undefined; close(); }, CLOSE_DELAY);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popupRef.current?.contains(t)) return;
      if (MENUS.some((m) => triggerRefs.current[m.id]?.contains(t))) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const id = stateRef.current.value;
      close();
      if (id) triggerRefs.current[id]?.focus();
    };
    document.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mounted, close]);

  useEffect(() => () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    window.clearTimeout(exitTimer.current);
    Object.values(panelTimers.current).forEach((t) => window.clearTimeout(t));
  }, []);

  // Size vars go straight onto the popup so the width/height transition runs between panels.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (!popup || !s.size) return;
    popup.style.setProperty("--popup-width", `${s.size.w}px`);
    popup.style.setProperty("--popup-height", `${s.size.h}px`);
  }, [s.size]);

  const onTriggerEnter = (id: string) => (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
    window.clearTimeout(openTimer.current);
    const why = stateRef.current.value !== null && reason.current === "click" ? "click" : "hover";
    if (OPEN_DELAY === 0) open(id, why);
    else openTimer.current = window.setTimeout(() => open(id, why), OPEN_DELAY);
  };
  const onTriggerClick = (id: string) => () => {
    const cur = stateRef.current;
    if (cur.value === id && reason.current === "click") close();
    else open(id, "click");
  };

  const isOpen = s.value !== null;
  const positionerStyle = {
    position: "fixed",
    top: `${s.place?.top ?? 0}px`,
    left: `${s.place?.left ?? 0}px`,
    "--available-width": s.place ? `${s.place.availW}px` : "100vw",
    "--available-height": s.place ? `${s.place.availH}px` : "100vh",
    "--transform-origin": `0px ${-SIDE_OFFSET}px`,
    ...(mounted ? {} : { opacity: "0", pointerEvents: "none" }),
  } as CSSProperties;

  return (
    <nav className="relative z-1">
      <ul ref={listRef} className="hidden items-center gap-x-1.5 lg:flex">
        {NAVIGATION.map((item) => (
          <li key={item.id}>
            {isMenu(item) ? (
              <button
                ref={(el) => { triggerRefs.current[item.id] = el; }}
                className={TRIGGER_CLASS}
                type="button"
                aria-disabled="false"
                tabIndex={0}
                aria-expanded={s.value === item.id}
                data-popup-open={dataAttr(s.value === item.id)}
                data-base-ui-navigation-menu-trigger=""
                onPointerEnter={onTriggerEnter(item.id)}
                onClick={onTriggerClick(item.id)}
              >
                <span>{item.label}</span>
                <ChevronDown />
              </button>
            ) : (
              <a className={PLAIN_LINK_CLASS} href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ul>
      <div>
        <div data-base-ui-portal="">
          <div
            ref={positionerRef}
            data-open={dataAttr(isOpen)}
            data-closed={dataAttr(!isOpen)}
            data-side="bottom"
            data-align="start"
            role="presentation"
            hidden={!mounted}
            className="hidden lg:block"
            style={positionerStyle}
          >
            <nav
              ref={popupRef}
              data-open={dataAttr(isOpen)}
              data-closed={dataAttr(!isOpen)}
              data-starting-style={dataAttr(s.phase === "starting")}
              data-ending-style={dataAttr(s.phase === "ending")}
              data-side="bottom"
              data-align="start"
              tabIndex={-1}
              className={POPUP_CLASS}
              onTransitionEnd={(e) => { if (e.target === e.currentTarget && e.propertyName === "opacity" && stateRef.current.phase === "ending") finishClose(); }}
            >
              <span aria-hidden="true" tabIndex={0} data-base-ui-focus-guard="" style={FOCUS_GUARD} />
              <div className="grid max-h-(--available-height) overflow-y-auto overflow-x-hidden overscroll-none">
                {MENUS.map((menu) => {
                  const p = s.panels[menu.id];
                  return (
                    <div
                      key={menu.id}
                      ref={(el) => { panelRefs.current[menu.id] = el; }}
                      data-open={dataAttr(p.open)}
                      data-closed={dataAttr(!p.open)}
                      data-activation-direction={p.dir ?? undefined}
                      data-ending-style={dataAttr(p.ending && !p.hidden)}
                      hidden={p.hidden}
                      className={PANEL_CLASS}
                    >
                      <MenuContent menu={menu} onLink={close} />
                    </div>
                  );
                })}
              </div>
              <span aria-hidden="true" tabIndex={0} data-base-ui-focus-guard="" style={FOCUS_GUARD} />
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
