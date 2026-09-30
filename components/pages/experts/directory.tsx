"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExpertCard, MatchmakingCard } from "./card";
import { EXPERTS, TOTAL_RESULTS, type Expert } from "./data";
import {
  DEFAULT_SORT,
  FILTERS,
  PAGE_SIZE,
  PLACEHOLDER_MULTIPLE,
  PLACEHOLDER_SINGLE,
  QUERY,
  SORT_OPTIONS,
  TIER_ORDER,
  type FilterDef,
  type SortValue,
} from "./filters";

type Selected = Record<FilterDef["slug"], string[]>;
const EMPTY: Selected = { "supported-regions": [], "expert-location": [], languages: [], "expert-tier": [] };

const CHEVRON = "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z";
const CHECK = "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z";

function matches(e: Expert, sel: Selected, search: string, onlyAvailable: boolean) {
  if (onlyAvailable && !e.available) return false;
  const any = (list: string[], picked: string[]) => !picked.length || picked.some((p) => list.includes(p));
  if (!any(e.regions, sel["supported-regions"])) return false;
  if (!any(e.location, sel["expert-location"])) return false;
  if (!any(e.languages, sel.languages)) return false;
  if (!any([e.tier.toLowerCase()], sel["expert-tier"])) return false;
  const q = search.trim().toLowerCase();
  if (q && !`${e.name} ${e.description}`.toLowerCase().includes(q)) return false;
  return true;
}

function sortExperts(list: Expert[], sort: SortValue) {
  const byTier = (a: Expert, b: Expert) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
  const out = [...list];
  if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "tier") out.sort(byTier);
  else if (sort === "tier_reviews") out.sort((a, b) => byTier(a, b) || b.reviews - a.reviews);
  else if (sort === "rating") out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  else if (sort === "reviews") out.sort((a, b) => b.reviews - a.reviews);
  return out;
}

/** One filter: a focusable field that opens an option list (checkboxes when the filter takes several values). */
function FilterField({ def, value, onChange }: { def: FilterDef; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const names = def.options.filter((o) => value.includes(o.slug)).map((o) => o.name);
  const label = names.length ? names.join(", ") : def.multiple ? PLACEHOLDER_MULTIPLE : PLACEHOLDER_SINGLE;
  const shown = def.options.filter((o) => o.name.toLowerCase().includes(query.trim().toLowerCase()));

  const pick = (slug: string) => {
    if (def.multiple) onChange(value.includes(slug) ? value.filter((v) => v !== slug) : [...value, slug]);
    else {
      onChange(value.includes(slug) ? [] : [slug]);
      setOpen(false);
    }
  };

  return (
    <div data-test-filter="" data-test-filter-slug={def.slug} ref={ref}>
      <div data-test-uifield="" data-test-label={def.name} data-test-uifieldoptionlist="" className="min-w-0 xp-field">
        <div className="pb-1">
          <div data-test-label="">
            <label className="break-words typography-label typography-label-md text-text">{def.name}</label>{" "}
          </div>
        </div>{" "}
        <div
          tabIndex={0}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          data-test-input=""
          className="flex items-center gap-x-2 rounded border py-[7px] pl-3 pr-2 text-14 focus:outline-none focus:ring-2 focus:ring-focused border-border bg-surface focus:border-border-subtle xp-field-input"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className="grow select-none overflow-hidden truncate text-14 text-text-on-input">
            {" "}
            <span>{label}</span>
          </span>{" "}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20px" height="20px" className="shrink-0 text-icon">
            <path fillRule="evenodd" d={CHEVRON} clipRule="evenodd" />
          </svg>
        </div>
        {open ? (
          <div className="xp-optlist" role="listbox" aria-multiselectable={def.multiple || undefined}>
            {def.options.length > 8 ? (
              <div className="xp-optlist-search">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full rounded border border-border bg-surface px-3 py-[7px] text-14 text-text-on-input placeholder:text-text-placeholder"
                />
              </div>
            ) : null}
            {shown.length ? (
              shown.map((o) => {
                const on = value.includes(o.slug);
                return (
                  <button type="button" role="option" aria-selected={on} key={o.slug} className="xp-opt" data-selected={on || undefined} onClick={() => pick(o.slug)}>
                    {def.multiple ? (
                      <span className="xp-check" data-on={on || undefined}>
                        {on ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" aria-hidden="true">
                            <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
                          </svg>
                        ) : null}
                      </span>
                    ) : null}
                    <span className="truncate">{o.name}</span>
                    {!def.multiple && on ? (
                      <svg className="xp-opt-tick" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                        <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="xp-opt-empty">{"No items found"}</div>
            )}
          </div>
        ) : null}
      </div>{" "}
    </div>
  );
}

function SortSelect({ value, onChange }: { value: SortValue; onChange: (v: SortValue) => void }) {
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "";
  return (
    <div data-test-uifield="" data-test-label="" data-test-uifieldselect="" className="min-w-0">
      {" "}
      <div className="relative flex h-[36px] items-center gap-x-2 rounded border pl-3 pr-2 bg-surface border-border">
        <select className="absolute left-0 top-0 h-full w-full border-0 text-14 opacity-0" value={value} onChange={(e) => onChange(e.target.value as SortValue)} aria-label="Sort by">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>{" "}
        <span className="grow select-none truncate text-14 text-text-on-input">
          <span className="text-text-subtle">{"Sort by"}</span> <span>{label}</span>
        </span>{" "}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20px" height="20px" className="shrink-0 text-icon">
          <path fillRule="evenodd" d={CHEVRON} clipRule="evenodd" />
        </svg>
      </div>{" "}
    </div>
  );
}

/**
 * Expert directory: filter row, search, availability toggle, sort, the card grid and "Load more results".
 * Starts in the served state (no filters, available experts only, tier and review count order) and keeps
 * its state in the url query like the directory does.
 */
export function ExpertsDirectory() {
  const [selected, setSelected] = useState<Selected>(EMPTY);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [page, setPage] = useState(1);
  const [exhausted, setExhausted] = useState(false);
  const [loading, setLoading] = useState(false);
  const hydrated = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Restore state from the url once mounted.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next = { ...EMPTY };
    let touched = false;
    for (const f of FILTERS) {
      const v = q.get(f.slug);
      if (v) {
        next[f.slug] = v.split(",").filter((s) => f.options.some((o) => o.slug === s));
        touched = true;
      }
    }
    if (touched) setSelected(next);
    const s = q.get(QUERY.search);
    if (s) setSearch(s);
    const so = q.get(QUERY.sort);
    if (so && SORT_OPTIONS.some((o) => o.value === so)) setSort(so as SortValue);
    if (q.get(QUERY.available) === "false") setOnlyAvailable(false);
    hydrated.current = true;
  }, []);

  // Mirror state into the url.
  useEffect(() => {
    if (!hydrated.current) return;
    const url = new URL(window.location.href);
    for (const f of FILTERS) {
      if (selected[f.slug].length) url.searchParams.set(f.slug, selected[f.slug].join(","));
      else url.searchParams.delete(f.slug);
    }
    if (search.trim()) url.searchParams.set(QUERY.search, search.trim());
    else url.searchParams.delete(QUERY.search);
    if (sort !== DEFAULT_SORT) url.searchParams.set(QUERY.sort, sort);
    else url.searchParams.delete(QUERY.sort);
    if (!onlyAvailable) url.searchParams.set(QUERY.available, "false");
    else url.searchParams.delete(QUERY.available);
    url.searchParams.delete(QUERY.page);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url.href);
  }, [selected, search, sort, onlyAvailable]);

  const filtersActive = FILTERS.some((f) => selected[f.slug].length > 0) || search.trim() !== "";
  const results = useMemo(
    () => sortExperts(EXPERTS.filter((e) => matches(e, selected, search, onlyAvailable)), sort),
    [selected, search, sort, onlyAvailable],
  );
  // The served listing holds the first page; further pages come from the same local list.
  const total = filtersActive || !onlyAvailable ? results.length : Math.max(TOTAL_RESULTS, results.length);
  const visible = results.slice(0, EXPERTS.length + (page - 1) * PAGE_SIZE);
  const canLoadMore = !exhausted && visible.length < total;

  const resetPaging = useCallback(() => {
    setPage(1);
    setExhausted(false);
  }, []);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    const before = visible.length;
    const after = Math.min(results.length, EXPERTS.length + page * PAGE_SIZE);
    setPage((p) => p + 1);
    if (after <= before) setExhausted(true);
    setLoading(false);
  };

  const setFilter = (slug: FilterDef["slug"], v: string[]) => {
    setSelected((s) => ({ ...s, [slug]: v }));
    resetPaging();
  };
  const clearAll = () => {
    setSelected(EMPTY);
    setSearch("");
    resetPaging();
  };

  return (
    <div>
      <div data-test-service-partner-directory="" data-fetch-key="DirectoryV2:0" data-test-route="$dir-vendor">
        {" "}
        <section className="container py-8">
          <div data-test-horizontal-filters-directory="" data-fetch-key="0" className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-8">
                {" "}
                <nav data-test-filters="" className="grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {" "}
                  {FILTERS.map((f) => (
                    <FilterField key={f.slug} def={f} value={selected[f.slug]} onChange={(v) => setFilter(f.slug, v)} />
                  ))}
                </nav>
              </div>{" "}
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2.5">
                    <div data-test-search="" className="grow">
                      <div data-test-uiinput="" className="relative flex rounded border border-border bg-surface focus:border-border-subtle" data-v-321e214d="">
                        <div className="flex items-center" data-v-321e214d="">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" width="24px" height="24px" className="ml-3 h-5 w-5 text-icon" data-v-321e214d="">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-321e214d="" />
                          </svg>
                        </div>{" "}
                        <input
                          autoComplete="off"
                          type="text"
                          maxLength={200}
                          placeholder="Search by name, service or phrases"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            resetPaging();
                          }}
                          className="block w-full truncate border-none bg-transparent px-3 py-[7px] text-14 !ring-transparent placeholder:text-text-placeholder text-text-on-input"
                          data-v-321e214d=""
                        />{" "}
                        <div className="flex items-center" data-v-321e214d="">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            width="24px"
                            height="24px"
                            className="pointer-events-auto mr-3 h-5 w-5 cursor-pointer text-icon hover:text-icon"
                            style={search ? undefined : { display: "none" }}
                            onClick={() => {
                              setSearch("");
                              resetPaging();
                            }}
                            data-v-321e214d=""
                          >
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" data-v-321e214d="" />
                          </svg>
                        </div>
                      </div>{" "}
                    </div>{" "}
                    <div data-test-sorting="" className="hidden sm:block">
                      <SortSelect value={sort} onChange={setSort} />{" "}
                    </div>
                  </div>{" "}
                </div>{" "}
                <div data-test-availability="" className="flex justify-end gap-x-2">
                  {filtersActive ? (
                    <button type="button" className="xp-clear" onClick={clearAll}>
                      {"Clear All"}
                    </button>
                  ) : null}
                  {"Available experts only"}
                  <button
                    type="button"
                    data-test-uitoggle=""
                    data-test-value={onlyAvailable ? "true" : "false"}
                    aria-pressed={onlyAvailable}
                    onClick={() => {
                      setOnlyAvailable((v) => !v);
                      resetPaging();
                    }}
                    className={`relative flex h-6 w-14 items-center overflow-hidden rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-focused focus:ring-offset-1 disabled:bg-interactive-disabled ${onlyAvailable ? "bg-interactive" : "bg-icon"}`}
                  >
                    <div className={`flex grow items-center justify-center text-text-on-interactive typography-xsmall ${onlyAvailable ? "pr-5" : "pl-5"}`}>
                      <div data-test-label={onlyAvailable ? "on" : "off"}>{onlyAvailable ? "ON" : "OFF"}</div>
                    </div>{" "}
                    <div className={`absolute size-5 rounded-full bg-text-on-interactive transition-transform duration-150 ease-in-out ${onlyAvailable ? "translate-x-8" : "translate-x-0"}`} />
                  </button>
                </div>{" "}
                <div className="sm:hidden">
                  <SortSelect value={sort} onChange={setSort} />{" "}
                </div>
              </div>
            </div>{" "}
            <div className="flex flex-col gap-y-5" style={{ scrollMarginTop: "20px" }} ref={resultsRef}>
              {" "}
              <div data-test-cards-grid="" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <MatchmakingCard />{" "}
                {visible.map((e) => (
                  <ExpertCard key={e.slug} expert={e} />
                ))}
              </div>
              {visible.length === 0 ? (
                <div data-test-no-results="" className="xp-empty">
                  <div className="text-16 font-bold text-text">{"No results found."}</div>
                  <div className="text-text-subtle">{"Try searching for another word or phrase"}</div>
                </div>
              ) : null}
            </div>{" "}
            {canLoadMore ? (
              <div className="text-center">
                <button
                  type="button"
                  data-test-uibutton=""
                  data-test-load-more-button=""
                  disabled={loading}
                  onClick={loadMore}
                  className="group/button relative inline-flex min-w-0 items-center justify-center transition-colors duration-75 focus:outline-none focus:ring-2 focus:ring-focused active:ring-0 rounded border cursor-pointer bg-surface dark:bg-transparent hover:bg-surface-hover dark:hover:bg-surface-hover-dark active:bg-surface-pressed dark:active:bg-transparent border-border hover:border-border-hover active:border-border text-text dark:text-text-on-interactive hover:text-text dark:hover:text-text-on-interactive active:text-text dark:active:text-text-on-interactive font-normal px-4 py-2"
                >
                  <div className="flex w-full justify-center gap-1 flex-row items-center">
                    {" "}
                    <div data-test-text="" className="min-w-0 text-14 truncate whitespace-nowrap">
                      {"Load more results"}
                    </div>
                  </div>{" "}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
