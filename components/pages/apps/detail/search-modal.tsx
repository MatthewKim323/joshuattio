"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type SearchModal = {
  closeSearchModal: () => void;
  isOpen: boolean;
  openSearchModal: (query?: string) => void;
  query: string | null;
  syncQueryToUrl: (query: string) => void;
};

const SearchModalContext = createContext<SearchModal | null>(null);

/**
 * Open state of the app search dialog, mirrored into `?s=<query>`: opening pushes a history entry,
 * typing replaces it (300ms debounce), closing pops it again.
 */
export function SearchModalProvider({ urlParamName = "s", children }: { urlParamName?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const pushedRef = useRef(false);
  const closingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paramRef = useRef(urlParamName);
  useEffect(() => {
    paramRef.current = urlParamName;
  });

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get(paramRef.current);
    if (initial !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring the dialog from the address bar after hydration
      setIsOpen(true);
      setQuery(initial);
    }
  }, []);

  const pathname = usePathname();
  const urlFor = useCallback((value: string | null) => {
    const url = new URL(window.location.href);
    if (value !== null) url.searchParams.set(paramRef.current, value);
    else url.searchParams.delete(paramRef.current);
    return `${url.pathname}${url.search}`;
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (closingRef.current) {
        closingRef.current = false;
        const url = new URL(window.location.href);
        if (url.searchParams.has(paramRef.current)) {
          url.searchParams.delete(paramRef.current);
          window.history.replaceState(null, "", `${url.pathname}${url.search}`);
        }
        return;
      }
      const value = new URLSearchParams(window.location.search).get(paramRef.current);
      if (value !== null) {
        pushedRef.current = true;
        setIsOpen(true);
        setQuery(value);
      } else {
        setIsOpen(false);
        setQuery(null);
        pushedRef.current = false;
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Route change without the param: the dialog closes and stops owning a history entry.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;
    if (new URLSearchParams(window.location.search).has(paramRef.current)) return;
    pushedRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors navigation into dialog state
    setIsOpen(false);
    setQuery(null);
  }, [pathname]);

  const openSearchModal = useCallback(
    (value = "") => {
      setIsOpen(true);
      setQuery(value);
      if (!pushedRef.current) {
        pushedRef.current = true;
        requestAnimationFrame(() => {
          window.history.pushState(null, "", urlFor(value));
        });
      }
    },
    [urlFor],
  );

  const syncQueryToUrl = useCallback(
    (value: string) => {
      setQuery(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        window.history.replaceState(null, "", urlFor(value));
      }, 300);
    },
    [urlFor],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const closeSearchModal = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(false);
    setQuery(null);
    if (pushedRef.current) {
      pushedRef.current = false;
      closingRef.current = true;
      window.history.back();
    } else {
      requestAnimationFrame(() => {
        window.history.replaceState(null, "", urlFor(null));
      });
    }
  }, [urlFor]);

  const value = useMemo(
    () => ({ closeSearchModal, isOpen, openSearchModal, query, syncQueryToUrl }),
    [closeSearchModal, isOpen, openSearchModal, query, syncQueryToUrl],
  );
  return <SearchModalContext value={value}>{children}</SearchModalContext>;
}

export function useSearchModal() {
  const ctx = use(SearchModalContext);
  if (!ctx) throw Error("useSearchModal must be used within SearchModalProvider");
  return ctx;
}
