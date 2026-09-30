"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { APPS, APP_CATEGORIES, DEFAULT_RESULTS, type AppEntry } from "@/components/pages/apps/detail/apps-data";
import { useSearchModal } from "@/components/pages/apps/detail/search-modal";
import { OfficialBadgeIcon } from "@/components/pages/apps/detail/official-badge";

const DESKTOP = "(min-width: 992px)";
const subscribeDesktop = (cb: () => void) => {
  const mql = window.matchMedia(DESKTOP);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const useIsDesktop = () =>
  useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );

const HIGHLIGHT = "bg-blue-500/10 text-link-foreground";
const BY_HREF = new Map(APPS.map((a) => [a.href, a]));
const DEFAULTS = DEFAULT_RESULTS.map((h) => BY_HREF.get(h)).filter((a): a is AppEntry => !!a);
const DEFAULT_RANK = new Map(DEFAULT_RESULTS.map((h, i) => [h, i]));

// ---------- matching ----------

type Hit = { app: AppEntry; words: string[] };

function tokens(q: string) {
  return q
    .toLowerCase()
    .replace(/[\s-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function wordStarts(text: string, word: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9À-ɏ]+/)
    .some((w) => w.startsWith(word));
}

function search(query: string): Hit[] {
  const words = tokens(query);
  if (!words.length) return [];
  const scored: { app: AppEntry; score: number; index: number }[] = [];
  APPS.forEach((app, index) => {
    const cats = app.categories.map((c) => APP_CATEGORIES[c]).join(" ");
    const fields = [app.title, app.description, app.developer, cats];
    if (!words.every((w) => fields.some((f) => wordStarts(f, w)))) return;
    const inTitle = words.filter((w) => wordStarts(app.title, w)).length;
    const titleStarts = app.title.toLowerCase().startsWith(words[0]) ? 1 : 0;
    scored.push({ app, score: titleStarts * 100 + inTitle * 10, index });
  });
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (DEFAULT_RANK.get(a.app.href) ?? 999) - (DEFAULT_RANK.get(b.app.href) ?? 999) ||
      a.index - b.index,
  );
  return scored.slice(0, 20).map((s) => ({ app: s.app, words }));
}

/** Marks every word prefix that matches a query word, the way the hosted search highlights hits. */
function Highlighted({ text, words, kind }: { text: string; words: string[]; kind: "Highlight" | "Snippet" }) {
  const parts: { t: string; hit: boolean }[] = [];
  const re = /[a-z0-9À-ɏ]+/gi;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const w = m[0].toLowerCase();
    const match = words.filter((q) => w.startsWith(q)).sort((a, b) => b.length - a.length)[0];
    if (!match) continue;
    if (m.index > last) parts.push({ t: text.slice(last, m.index), hit: false });
    parts.push({ t: text.slice(m.index, m.index + match.length), hit: true });
    last = m.index + match.length;
  }
  if (last < text.length) parts.push({ t: text.slice(last), hit: false });
  return (
    <span className={`ais-${kind}`}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className={`ais-${kind}-highlighted ${HIGHLIGHT}`}>
            {p.t}
          </mark>
        ) : (
          <span key={i} className={`ais-${kind}-nonHighlighted`}>
            {p.t}
          </span>
        ),
      )}
    </span>
  );
}

// ---------- search state (debounced like the hosted index) ----------

function useAppsSearch(initialQuery: string | null, isOpen: boolean, syncQueryToUrl: (q: string) => void) {
  const [query, setQuery] = useState("");
  const [settled, setSettled] = useState("");
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Last value seeded from the address bar or typed; a different incoming query reseeds the box.
  const [lastSeed, setLastSeed] = useState<string | null>(null);
  if (initialQuery !== null && initialQuery !== lastSeed && initialQuery !== query) {
    setLastSeed(initialQuery);
    setQuery(initialQuery);
    setSettled(initialQuery);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  const onQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setLastSeed(value);
      if (isOpen) syncQueryToUrl(value);
      clearTimeout(timer.current);
      if (value.length > 0) {
        setPending(true);
        timer.current = setTimeout(() => {
          setPending(false);
          setSettled(value);
        }, 200);
      } else {
        setPending(false);
        setSettled(value);
      }
    },
    [isOpen, syncQueryToUrl],
  );

  const hits = useMemo(() => search(settled), [settled]);
  const results: Hit[] = query.length === 0 && hits.length === 0 ? DEFAULTS.map((app) => ({ app, words: [] })) : hits;
  return { query, settled, results, onQueryChange, isSearching: query.length > 0 && (pending || settled !== query) };
}

// ---------- pieces ----------

function ArrowRight12({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2 6h8m0 0L7.1 3M10 6 7.1 9" />
    </svg>
  );
}

function EnterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.5 7.16667h6c.55229 0 1-.44772 1-1V2.5m-7 4.66667L4.83333 9.5M2.5 7.16667l2.33333-2.33334" />
    </svg>
  );
}

function KeyButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button className="flex size-5 items-center justify-center rounded-md border border-weak-stroke text-accent-foreground outline-hidden" onClick={onClick}>
      {children}
    </button>
  );
}

function ShineBar({ isSearching }: { isSearching: boolean }) {
  return (
    <div className="relative h-px w-full shrink-0 overflow-hidden bg-weak-stroke">
      <div
        className={`absolute inset-y-0 left-0 w-2/3 animate-search-shine bg-linear-to-r from-transparent via-35% via-65% via-white-900 via-white-900 to-transparent transition-opacity duration-150 ${isSearching ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function SearchInput({ query, onQueryChange, placeholder, onKeyDown, inputRef }: {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="flex items-center rounded-t-xl bg-primary-background py-3 pt-3.5 pr-2.5 pl-4">
      <div className="flex flex-1 items-center self-stretch text-accent-foreground text-base sm:text-sm">
        <input
          ref={inputRef}
          cmdk-input=""
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          className="focus-disable flex-1 self-stretch border-none bg-transparent p-0 text-base text-primary-foreground outline-hidden sm:text-sm placeholder:text-accent-foreground focus:ring-0"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      <button
        type="button"
        tabIndex={query.length > 0 ? 0 : -1}
        aria-label="Clear search"
        aria-hidden={query.length === 0}
        disabled={query.length === 0}
        className={`cursor-pointer rounded-xs px-2 py-0.5 text-accent-foreground text-xs opacity-0 transition-[box-shadow,opacity] duration-150 ease-in-out${query.length > 0 ? " opacity-100" : ""}`}
        onClick={() => {
          onQueryChange("");
          inputRef.current?.focus();
        }}
      >
        {"Clear"}
      </button>
    </div>
  );
}

function ResultCard({ hit, selected, onHover, onChoose }: {
  hit: Hit;
  selected: boolean;
  onHover: () => void;
  onChoose: (app: AppEntry) => void;
}) {
  const { app, words } = hit;
  const [chosen, setChosen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cats = app.categories.slice(0, 2);
  return (
    <a
      href={app.href}
      cmdk-item=""
      role="option"
      aria-selected={selected}
      data-selected={selected}
      data-value={app.href}
      className="group relative cursor-pointer overflow-hidden rounded-[18px] before:absolute before:inset-x-0 before:-inset-y-0.5"
      onPointerMove={onHover}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        setChosen(true);
        onChoose(app);
      }}
      onKeyDown={(e) => e.key === "Enter" && setPressed(true)}
      onKeyUp={(e) => e.key === "Enter" && setPressed(false)}
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-surface-subtle opacity-0 transition-opacity duration-150 ease-in-out group-data-[selected=true]:opacity-80 group-data-[selected=true]:duration-0 group-active:opacity-100 group-active:duration-0${chosen ? " opacity-80" : ""}${pressed ? " opacity-100" : ""}`}
      />
      <div className="relative flex w-full items-start gap-x-3.5 overflow-hidden p-3 pb-2.5">
        <div className="shrink-0">
          <div className="relative size-9.25 overflow-hidden rounded-[30%] bg-primary-background">
            <img src={app.logo} alt={app.title} width="37" height="37" loading="eager" decoding="async" className="size-full object-cover" style={{ color: "transparent" }} />
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px] shadow-black-100/10" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-w-0 items-center gap-1">
            <div className="min-w-0 truncate text-primary-foreground text-sm">
              <Highlighted text={app.title} words={words} kind="Highlight" />
            </div>
            {app.official ? (
              <>
                <OfficialBadgeIcon aria-hidden="true" className="shrink-0 text-green-600 opacity-80 size-3" />
                <span className="sr-only">{"Official app"}</span>
              </>
            ) : null}
          </div>
          {app.description ? (
            <div className="mt-0.5 line-clamp-2 text-tertiary-foreground text-xs">
              <Highlighted text={app.description} words={words} kind="Snippet" />
            </div>
          ) : null}
          {app.developer || cats.length > 0 ? (
            <div className="mt-0.5">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {app.developer ? <span className="text-tertiary-foreground">{`Built by ${app.developer}`}</span> : null}
                {app.developer && cats.length > 0 ? <span className="text-accent-foreground">{"·"}</span> : null}
                {cats.map((c) => (
                  <span key={c} className="text-accent-foreground">
                    {APP_CATEGORIES[c]}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}

// ---------- dialog ----------

const DRAWER_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/** App search: centered command dialog on desktop, bottom drawer below 992px. Cmd/Ctrl+K toggles it. */
export function AppsSearch() {
  const { isOpen, closeSearchModal, openSearchModal, query: initialQuery, syncQueryToUrl } = useSearchModal();
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const { query, settled, results, onQueryChange, isSearching } = useAppsSearch(initialQuery, isOpen, syncQueryToUrl);
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(false);
  const [closing, setClosing] = useState(false);
  const [drawerIn, setDrawerIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portals need the document
    setMounted(true);
  }, []);

  // Cmd/Ctrl+K toggles the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        requestAnimationFrame(() => (isOpen ? closeSearchModal() : openSearchModal()));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, openSearchModal, closeSearchModal]);

  // Mount on open, keep mounted through the exit animation.
  const [wasOpen, setWasOpen] = useState(false);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setPresent(true);
      setClosing(false);
    } else if (present) {
      setClosing(true);
      setDrawerIn(false);
    }
  }
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => {
      setPresent(false);
      setClosing(false);
    }, isDesktop ? 200 : 500);
    return () => clearTimeout(t);
  }, [closing, isDesktop]);
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      setDrawerIn(true);
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, isDesktop]);

  // Escape closes; lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSearchModal();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [isOpen, closeSearchModal]);

  // First result is selected whenever the list changes.
  const firstHref = results[0]?.app.href ?? null;
  const [lastFirst, setLastFirst] = useState<string | null>(null);
  const [lastSettled, setLastSettled] = useState("");
  if (firstHref !== lastFirst || settled !== lastSettled) {
    setLastFirst(firstHref);
    setLastSettled(settled);
    setSelected(firstHref);
  }

  const scrollSelectedIntoView = useCallback((href: string) => {
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector<HTMLElement>(`[cmdk-item][data-value="${CSS.escape(href)}"]`);
      el?.scrollIntoView({ block: "nearest" });
    });
  }, []);

  const move = useCallback(
    (delta: number) => {
      if (!results.length) return;
      const i = results.findIndex((r) => r.app.href === selected);
      const next = Math.min(results.length - 1, Math.max(0, (i === -1 ? -1 : i) + delta));
      const href = results[next].app.href;
      setSelected(href);
      scrollSelectedIntoView(href);
    },
    [results, selected, scrollSelectedIntoView],
  );

  const choose = useCallback(
    (app: AppEntry) => {
      const target = new URL(app.href, window.location.origin);
      const go = () => {
        if (target.pathname === window.location.pathname) {
          window.setTimeout(() => window.scrollTo({ behavior: "smooth", top: 0 }), 250);
        } else {
          router.push(app.href);
        }
      };
      const onPop = () => {
        window.removeEventListener("popstate", onPop);
        clearTimeout(fallback);
        go();
      };
      window.addEventListener("popstate", onPop);
      const fallback = setTimeout(() => {
        window.removeEventListener("popstate", onPop);
        go();
      }, 300);
      closeSearchModal();
    },
    [router, closeSearchModal],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(-results.length);
    } else if (e.key === "End") {
      e.preventDefault();
      move(results.length);
    } else if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      listRef.current?.querySelector<HTMLElement>("[cmdk-item][data-selected=true]")?.click();
    }
  };

  const noResults = query.length > 0 && results.length === 0;
  const resultsNode = (
    <div className="flex-1 scroll-py-2 overflow-auto py-2">
      {results.length > 0 ? (
        <div ref={listRef} cmdk-list="" role="listbox" aria-label="Suggestions" className="relative flex w-full flex-col items-stretch overflow-visible px-2 overflow-hidden">
          {results.map((hit) => (
            <ResultCard
              key={hit.app.href}
              hit={hit}
              selected={hit.app.href === selected}
              onHover={() => setSelected(hit.app.href)}
              onChoose={choose}
            />
          ))}
        </div>
      ) : noResults ? (
        <div className={`flex h-full items-center justify-center px-4 transition-opacity duration-100 ease-in-out ${isSearching ? "opacity-0" : "opacity-100"}`}>
          <div className="flex flex-col items-center text-center text-sm">
            <span className="text-tertiary-foreground">{["No apps matching", " “", settled, "”"]}</span>
          </div>
        </div>
      ) : null}
    </div>
  );

  const input = (
    <SearchInput query={query} onQueryChange={onQueryChange} placeholder="Search apps..." onKeyDown={onKeyDown} inputRef={inputRef} />
  );

  const dialog =
    mounted && present
      ? createPortal(
          isDesktop ? (
            <div
              className="fixed inset-0 z-(--dialog-content-z-index) flex items-start justify-center pt-[20dvh]"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) closeSearchModal();
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Search Apps"
                data-open={closing ? undefined : ""}
                data-closed={closing ? "" : undefined}
                className="animate-dialog-scale-in data-[closed]:animate-dialog-scale-out"
              >
                <div>
                  <div className="rounded-2xl bg-white-100/60 p-0.75 backdrop-blur-xs">
                    <div className="overflow-hidden rounded-[13px] border border-subtle-stroke bg-primary-background shadow-joshuattio-5">
                      <div cmdk-root="" aria-label="Search Apps">
                        <div className="flex h-[62dvh] max-h-144 min-h-64 w-screen max-w-148 flex-col">
                          {input}
                          <ShineBar isSearching={isSearching} />
                          {resultsNode}
                          <div className="flex justify-between gap-x-4 rounded-b-[13px] border-weak-stroke border-t bg-secondary-background px-4 pt-[11px] pb-[10px]">
                            <div className="flex gap-x-4">
                              <div className="flex items-center gap-x-1.5 text-accent-foreground">
                                <div className="flex gap-x-1">
                                  <KeyButton onClick={() => move(-1)}>
                                    <ArrowRight12 className="-rotate-90" />
                                  </KeyButton>
                                  <KeyButton onClick={() => move(1)}>
                                    <ArrowRight12 className="rotate-90" />
                                  </KeyButton>
                                </div>
                                <span className="text-xs">{"Navigate"}</span>
                              </div>
                              <div className="flex items-center gap-x-1.5 text-accent-foreground">
                                <div className="flex gap-x-1">
                                  <KeyButton onClick={() => listRef.current?.querySelector<HTMLElement>("[cmdk-item][data-selected=true]")?.click()}>
                                    <EnterIcon />
                                  </KeyButton>
                                </div>
                                <span className="text-xs">{"Select"}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-1.5 text-accent-foreground">
                              <span className="text-xs">{"Close"}</span>
                              <div className="flex gap-x-1">
                                <KeyButton onClick={closeSearchModal}>
                                  <span className="text-[8px] leading-3">{"esc"}</span>
                                </KeyButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Drawer open={drawerIn} onClose={closeSearchModal}>
              <div cmdk-root="" aria-label="Search Apps" className="contents">
                <div className="pt-2">{input}</div>
                <ShineBar isSearching={isSearching} />
                <div className="flex flex-1 flex-col overflow-hidden">{resultsNode}</div>
              </div>
            </Drawer>
          ),
          document.body,
        )
      : null;

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-(--dialog-overlay-z-index) bg-black-700/40 backdrop-blur-xs transition-opacity duration-200 ease-(--ease-in-out-quad) ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeSearchModal}
      />
      {dialog}
    </>
  );
}

/** Bottom sheet: slides up, drags down to dismiss. */
function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; t: number; dy: number } | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragging = dragY !== 0;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Search Apps"
      className="fixed right-0 bottom-0 left-0 z-(--dialog-content-z-index) mt-24 flex h-[96%] flex-col rounded-t-xl bg-white-100 backdrop-blur-xs"
      style={{
        transform: open ? `translate3d(0, ${Math.max(0, dragY)}px, 0)` : "translate3d(0, 100%, 0)",
        transition: dragging ? "none" : `transform 0.5s ${DRAWER_EASE}`,
      }}
    >
      <span className="sr-only">{"Search Apps"}</span>
      <div className="flex h-full flex-col rounded-t-2xl bg-primary-background">
        <div
          className="mx-auto mt-1.5 h-1.5 w-8 shrink-0 rounded-full bg-white-500"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            drag.current = { y: e.clientY, t: performance.now(), dy: 0 };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            drag.current.dy = e.clientY - drag.current.y;
            setDragY(drag.current.dy);
          }}
          onPointerUp={() => {
            const d = drag.current;
            drag.current = null;
            setDragY(0);
            if (!d) return;
            const h = ref.current?.offsetHeight ?? 1;
            const velocity = d.dy / Math.max(1, performance.now() - d.t);
            if (d.dy > h * 0.25 || velocity > 0.4) onClose();
          }}
        />
        {children}
      </div>
    </div>
  );
}
