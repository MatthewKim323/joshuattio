"use client";

import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { SalesSelect } from "@/components/pages/contact/sales/sales-select";
import { POSITIONS, REGIONS } from "./careers-data";
import "./careers.css";

// Open roles: location / team / title filters over the full list, grouped by
// department (Open Applications last), numbered per group. Filters live in the
// query string (?location=&team=&q=), cleared when back at their defaults; the
// search box writes through at most every 300ms.

type Filters = { location: string; team: string; query: string };
const DEFAULTS: Filters = { location: "all", query: "", team: "all" };
const WORKPLACE: Record<string, string> = { Hybrid: "Hybrid", OnSite: "On-site", Remote: "Remote" };
const QUERY_THROTTLE_MS = 300;

const slug = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
const isOpenApplications = (s: string) => /open applications/i.test(s);
const sortDepartments = (list: string[]) =>
  [...list].sort((e, t) => (isOpenApplications(e) ? 1 : isOpenApplications(t) ? -1 : e.localeCompare(t)));

function DashedH({ className }: { className: string }) {
  return (
    <svg width="100%" height="1" className={`text-subtle-stroke ${className}`}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}
function SolidH({ className }: { className: string }) {
  return (
    <svg width="100%" height="1" className={`text-subtle-stroke ${className}`}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
function DashedV({ className }: { className: string }) {
  return (
    <svg width="1" height="100%" className={`text-subtle-stroke ${className}`}>
      <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

function readUrl(): Filters {
  const p = new URLSearchParams(window.location.search);
  return { location: p.get("location") ?? DEFAULTS.location, team: p.get("team") ?? DEFAULTS.team, query: p.get("q") ?? DEFAULTS.query };
}
function writeUrl(f: Filters) {
  const url = new URL(window.location.href);
  const set = (key: string, value: string, def: string) => (value === def ? url.searchParams.delete(key) : url.searchParams.set(key, value));
  set("location", f.location, DEFAULTS.location);
  set("team", f.team, DEFAULTS.team);
  set("q", f.query, DEFAULTS.query);
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url.href);
}

function useUrlFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const latest = useRef(filters);
  const queryTimer = useRef(0);
  const lastQueryWrite = useRef(0);

  useEffect(() => {
    const f = readUrl();
    latest.current = f;
    setFilters(f);
    return () => window.clearTimeout(queryTimer.current);
  }, []);

  const update = useCallback((patch: Partial<Filters>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    setFilters(next);
    if (patch.query === undefined) {
      writeUrl(next);
      return;
    }
    // Throttle the address bar writes for typing.
    const wait = Math.max(0, lastQueryWrite.current + QUERY_THROTTLE_MS - performance.now());
    window.clearTimeout(queryTimer.current);
    queryTimer.current = window.setTimeout(() => {
      lastQueryWrite.current = performance.now();
      writeUrl(latest.current);
    }, wait);
  }, []);

  return [filters, update] as const;
}

const SEARCH_ICON =
  "M6 0.5C9.03757 0.5 11.5 2.96243 11.5 6C11.5 7.33872 11.0206 8.56482 10.2256 9.51855L12.8535 12.1465L12.918 12.2246C13.0461 12.4187 13.0244 12.6827 12.8535 12.8535C12.6827 13.0244 12.4187 13.0461 12.2246 12.918L12.1465 12.8535L9.51855 10.2256C8.56482 11.0206 7.33872 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5ZM6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5Z";
const CROSS_ICON =
  "M10.6469 2.64673C10.8421 2.45147 11.1586 2.45147 11.3539 2.64673C11.5488 2.84202 11.549 3.1586 11.3539 3.35376L7.7074 6.99927L11.3539 10.6458C11.5491 10.841 11.5491 11.1585 11.3539 11.3538C11.1586 11.549 10.8411 11.549 10.6459 11.3538L6.99939 7.70728L3.35388 11.3538C3.15871 11.5488 2.84208 11.5487 2.64685 11.3538C2.45159 11.1585 2.45159 10.841 2.64685 10.6458L6.29236 6.99927L2.64685 3.35376C2.45159 3.1585 2.45159 2.84199 2.64685 2.64673C2.84211 2.45147 3.15862 2.45147 3.35388 2.64673L7.00037 6.29224L10.6469 2.64673Z";
const ARROW_PATH = "M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5";

const INPUT =
  "block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground placeholder:text-sm border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300 px-3! py-2! pl-9! text-sm leading-6";
const BUTTON_XS =
  "inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-outline";

export function OpenRoles() {
  const [filters, update] = useUrlFilters();
  const { location, team, query } = filters;
  const ids = useId();
  const locationId = `${ids}-location`;
  const teamId = `${ids}-team`;
  const searchId = `${ids}-search`;
  const searchRef = useRef<HTMLInputElement>(null);

  const regions = useMemo(() => {
    const used = new Set(POSITIONS.flatMap((p) => p.locs.map((l) => l[0])));
    return REGIONS.filter((r) => r[1].some((id) => used.has(id)));
  }, []);
  const departments = useMemo(
    () => sortDepartments(Array.from(new Set(POSITIONS.map((p) => p.dept).filter((d) => !isOpenApplications(d))))),
    [],
  );

  const matches = useMemo(() => {
    const region = regions.find((r) => slug(r[0]) === location);
    const dept = departments.find((d) => slug(d) === team);
    const q = query.trim().toLowerCase();
    return POSITIONS.filter((p) => {
      const inRegion = !region || p.locs.some((l) => region[1].includes(l[0]));
      const inDept = !dept || p.dept === dept;
      const inQuery = !q || p.title.toLowerCase().includes(q);
      return inRegion && inDept && inQuery;
    });
  }, [regions, departments, location, team, query]);

  const groups = sortDepartments(Array.from(new Set(matches.map((p) => p.dept))));
  const locationOptions = [{ label: "All locations", value: "all" }, ...regions.map((r) => ({ label: r[0], value: slug(r[0]) }))];
  const teamOptions = [{ label: "All teams", value: "all" }, ...departments.map((d) => ({ label: d, value: slug(d) }))];
  const filtered = location !== "all" || team !== "all" || query !== "";
  const pickOption = (opts: { value: string }[], v: string) => (opts.some((o) => o.value === v) ? v : opts[0].value);

  return (
    <>
      <div className="relative grid grid-cols-12 pb-5">
        <div className="grid items-center gap-2 max-lg:grid-cols-2 max-lg:gap-y-2.5 lg:grid-cols-[1fr_1fr_2fr] col-[4/-4] max-lg:col-[2/-2]">
          <label className="sr-only" htmlFor={locationId}>
            {"Filter by location"}
          </label>
          <div className="careers-filter-select contents">
            <SalesSelect
              id={locationId}
              name="location"
              placeholder="All locations"
              options={locationOptions}
              value={pickOption(locationOptions, location)}
              isError={false}
              onChange={(v) => update({ location: v })}
            />
          </div>
          <label className="sr-only" htmlFor={teamId}>
            {"Filter by team"}
          </label>
          <div className="careers-filter-select contents">
            <SalesSelect
              id={teamId}
              name="team"
              placeholder="All teams"
              options={teamOptions}
              value={pickOption(teamOptions, team)}
              isError={false}
              onChange={(v) => update({ team: v })}
            />
          </div>
          <div role="search" className="relative max-lg:col-span-2">
            <label className="sr-only" htmlFor={searchId}>
              {"Search open positions"}
            </label>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="pointer-events-none absolute top-1/2 left-3.25 -translate-y-1/2 text-accent-foreground">
              <path d={SEARCH_ICON} fill="currentColor" />
            </svg>
            <div>
              <input
                ref={searchRef}
                className={`${INPUT}${query ? " pr-9!" : ""}`}
                id={searchId}
                placeholder="Search open positions…"
                autoComplete="off"
                enterKeyHint="search"
                type="text"
                value={query}
                onChange={(e) => update({ query: e.target.value })}
              />
            </div>
            {query ? (
              <button
                type="button"
                onClick={() => {
                  update({ query: "" });
                  searchRef.current?.focus();
                }}
                className="absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-accent-foreground transition-colors duration-150 ease-in-out hover:bg-secondary-background hover:text-secondary-foreground"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d={CROSS_ICON} fill="currentColor" />
                </svg>
                <span className="sr-only">{"Clear search"}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {matches.length === 1 ? "1 open position matches the current filters." : `${matches.length} open positions match the current filters.`}
      </p>
      <div className="relative grid h-5 grid-cols-12 max-lg:hidden">
        <DashedV className="col-2" />
        <DashedV className="col-[-3] justify-self-end" />
      </div>
      <div className="relative grid grid-cols-12">
        <div
          className="size-full text-surface-subtle absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(125deg, transparent, transparent 6px, currentcolor 6px, currentcolor 7px)" }}
        />
        <DashedH className="absolute top-0 col-span-full" />
        <div className="relative col-[2/-2] bg-white-100 max-xl:col-[1/-1] xl:border-subtle-stroke xl:border-x">
          {groups.length === 0 ? (
            <>
              <SolidH className="relative" />
              <div className="flex flex-col items-center gap-4 px-4 py-18 text-center">
                <p className="text-balance text-tertiary-foreground">
                  {filtered ? "No open positions match these filters." : "There are no open positions right now."}
                </p>
                {filtered ? (
                  <button className={BUTTON_XS} onClick={() => update(DEFAULTS)}>
                    {"Clear filters"}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
          {groups.map((dept) => {
            const roles = matches
              .filter((p) => p.dept === dept)
              .sort((e, t) => {
                const a = e.title.localeCompare(t.title);
                if (a !== 0) return a;
                return e.locs.map((l) => l[1]).join(", ").localeCompare(t.locs.map((l) => l[1]).join(", "));
              });
            return (
              <div key={dept} className="relative flex flex-col pb-18">
                <DashedH className="absolute top-0 left-1/2 w-[200%] -translate-x-1/2" />
                <SolidH className="relative" />
                <div className="relative grid grid-cols-12 bg-surface-subtle py-5 xl:grid-cols-10">
                  <div className="col-[2/-2] flex gap-1">
                    <h3 className="font-display text-xl xl:text-2xl" id={slug(dept)}>
                      {dept}
                    </h3>
                    <p className="align-super text-accent-foreground text-overline">
                      {"["}
                      {roles.length}
                      {"]"}
                    </p>
                  </div>
                </div>
                <SolidH className="-translate-y-[0.5px]" />
                {roles.map((p, i) => (
                  <Fragment key={p.id}>
                    <a
                      className="group relative grid grid-cols-12 items-baseline gap-y-1 py-4 md:gap-y-[5px] md:py-4.5 lg:py-5 xl:grid-cols-10 *:mix-blend-multiply"
                      href={p.href}
                    >
                      <div className="pointer-events-none absolute inset-0 bg-secondary-background opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-80 group-hover:duration-50 group-active:opacity-100 group-active:duration-50" />
                      <p className="relative col-[2/-2] row-1 mb-0.5 text-caption-foreground text-xs tabular-nums tracking-tight! md:col-1 md:row-1 md:mb-0 md:justify-self-center xl:text-sm">
                        {(i + 1).toString().padStart(2, "0")}
                      </p>
                      <h4 className="relative col-[2/-2] row-2 overflow-hidden text-ellipsis whitespace-nowrap pr-6 text-sm md:row-1 lg:col-[2/6] lg:text-base">
                        {p.title}
                      </h4>
                      <p className="relative col-[2/-3] row-3 text-accent-foreground text-sm max-md:line-clamp-2 md:truncate md:col-[2/-2] md:row-2 lg:col-[7/-2] lg:row-1 lg:text-base xl:col-[7/-2]">
                        {p.locs.map((l) => l[1]).join(", ")}
                        {" "}
                        {p.wt ? `[${WORKPLACE[p.wt] ?? p.wt}]` : null}
                      </p>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="col-11 row-3 self-center justify-self-end text-accent-foreground transition-[translate,color] duration-400 ease-in-out group-hover:translate-x-0.5 group-hover:duration-150 group-active:translate-x-0.5 group-active:duration-50 md:row-2 lg:col-12 lg:row-1 lg:justify-self-center xl:col-[-2/-1]"
                      >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d={ARROW_PATH} />
                      </svg>
                    </a>
                    <DashedH className="" />
                  </Fragment>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
