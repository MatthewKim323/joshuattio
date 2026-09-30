"use client";

import {
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type Ctx = { value: string[]; toggle: (id: string, open: boolean) => void };
const FaqContext = createContext<Ctx>({ value: [], toggle: () => {} });

// Multiple-open accordion. `?faq=<item id>` opens that item on load, scrolls to it
// smoothly and strips the param. A hidden "Expand all" button opens everything.
export function FaqRoot({ questions, children }: { questions: string[]; children: ReactNode }) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("faq");
    if (!id || !questions.includes(id)) return;
    setValue((v) => (v.includes(id) ? v : [...v, id]));
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else console.warn(`Element with ID "${id}" not found`);
    params.delete("faq");
    const rest = params.toString();
    window.history.replaceState({}, "", rest ? `${window.location.pathname}?${rest}` : window.location.pathname);
  }, [questions]);

  const toggle = (id: string, open: boolean) =>
    setValue((v) => (open ? (v.includes(id) ? v : [...v, id]) : v.filter((x) => x !== id)));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("faq-accordion-trigger")) return;
    const triggers = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(".faq-accordion-trigger"));
    const i = triggers.indexOf(target as HTMLButtonElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % triggers.length;
    else if (e.key === "ArrowUp") next = (i - 1 + triggers.length) % triggers.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = triggers.length - 1;
    if (next < 0) return;
    e.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <FaqContext value={{ value, toggle }}>
      <div data-orientation="vertical" onKeyDown={onKeyDown}>
        {children}
      </div>
      <button type="button" className="faq-expand-all-button" hidden onClick={() => setValue(questions)}>
        {"Expand all"}
      </button>
    </FaqContext>
  );
}

const TRIGGER =
  "group -mx-2 -my-1.5 flex w-[calc(100%+12px)] cursor-pointer items-start justify-between gap-x-6 rounded-xl px-2 py-1.5 text-left outline-hidden focus-visible:ring-3 faq-accordion-trigger";
const PANEL =
  "h-[var(--accordion-panel-height)] overflow-hidden pr-2 lg:pr-16 transition-[height] duration-300 ease-in-out-cubic data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none faq-accordion-content";

type Phase = "closed" | "opening" | "open" | "closing";

// One question. Opening: unhide, measure into --accordion-panel-height and let the
// 300ms ease-in-out-cubic height transition run from the h-0 starting style.
// Closing: pin the measured height, switch to the h-0 ending style, re-hide
// (hidden="until-found", so find-in-page can still reveal it) when it ends.
export function FaqItem({
  id,
  index,
  triggerId,
  panelId,
  question,
  children,
}: {
  id: string;
  index: number;
  triggerId: string;
  panelId: string;
  question: string;
  children: ReactNode;
}) {
  const { value, toggle } = use(FaqContext);
  const open = value.includes(id);
  const [phase, setPhase] = useState<Phase>("closed");
  const [height, setHeight] = useState<string>("auto");
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      if (!open) return;
    }
    const el = panel.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      el.removeAttribute("hidden");
      setHeight(`${el.scrollHeight}px`);
      if (reduced) {
        setPhase("open");
        return;
      }
      setPhase("opening");
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
      return () => cancelAnimationFrame(raf);
    }
    setHeight(`${el.scrollHeight}px`);
    if (reduced) {
      setPhase("closed");
      setHeight("auto");
      return;
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("closing")));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // hidden="until-found" reveal (find in page) opens the item.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const onMatch = () => toggle(id, true);
    el.addEventListener("beforematch", onMatch);
    return () => el.removeEventListener("beforematch", onMatch);
  }, [id, toggle]);

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "height") return;
    if (phase === "closing") {
      setPhase("closed");
      setHeight("auto");
    } else if (phase === "open") {
      setHeight("auto");
    }
  };

  const shown = phase !== "closed" || open;

  // React serializes `hidden` as a boolean; upgrade it so find-in-page can match.
  useLayoutEffect(() => {
    if (!shown) panel.current?.setAttribute("hidden", "until-found");
  }, [shown]);
  const stateAttrs = open ? { "data-open": "" } : { "data-closed": "" };
  const hiddenAttr = shown ? {} : { "data-hidden": "" };
  const panelStyle = {
    "--accordion-panel-height": height,
    "--accordion-panel-width": "auto",
  } as React.CSSProperties;

  return (
    <div
      data-orientation="vertical"
      {...hiddenAttr}
      data-index={index}
      {...stateAttrs}
      id={id}
      className="relative border-weak-stroke border-b py-7 text-base"
    >
      <h3 data-orientation="vertical" {...hiddenAttr} data-index={index} {...stateAttrs}>
        <button
          type="button"
          data-value=""
          data-orientation="vertical"
          {...hiddenAttr}
          {...(index > 0 ? { "data-index": index } : {})}
          {...(open ? { "data-panel-open": "" } : {})}
          tabIndex={0}
          aria-disabled="false"
          aria-expanded={open ? "true" : "false"}
          aria-controls={open ? panelId : undefined}
          id={triggerId}
          className={TRIGGER}
          onClick={() => toggle(id, !open)}
        >
          <span className="font-semibold text-secondary-foreground">{question}</span>
          <svg
            width="19.200000000000003"
            height="12"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mt-1.25 shrink-0 text-white-900 transition-colors duration-400 ease-in-out group-hover:text-black-800 group-hover:duration-150 group-active:text-black-800 group-active:duration-50 group-data-panel-open:text-black-800"
          >
            <line x1="0" y1="0.75" x2="20%" y2="0.75" />
            <line x1="0.75" y1="0" x2="0.75" y2="100%" />
            <line x1="0" y1="11.25" x2="20%" y2="11.25" />
            <line x1="6.000000000000002" y1="50%" x2="13.200000000000001" y2="50%" />
            <line
              x1="50%"
              y1="2.4000000000000004"
              x2="50%"
              y2="9.6"
              className="origin-center transition-scale ease-in-out group-data-panel-open:scale-y-0"
              style={{ transitionDuration: "0.4s" }}
            />
            <line x1="80%" y1="0.75" x2="100%" y2="0.75" />
            <line x1="18.450000000000003" y1="0" x2="18.450000000000003" y2="100%" />
            <line x1="80%" y1="11.25" x2="100%" y2="11.25" />
          </svg>
        </button>
      </h3>
      <div
        ref={panel}
        data-orientation="vertical"
        {...hiddenAttr}
        data-index={index}
        {...stateAttrs}
        {...(phase === "closed" || phase === "opening" ? { "data-starting-style": "" } : {})}
        {...(phase === "closing" ? { "data-ending-style": "" } : {})}
        id={panelId}
        aria-labelledby={triggerId}
        role="region"
        style={panelStyle}
        className={PANEL}
        onTransitionEnd={onTransitionEnd}
        {...(shown ? {} : ({ hidden: "until-found" } as object))}
      >
        {children}
      </div>
    </div>
  );
}
