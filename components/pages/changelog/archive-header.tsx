import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";
import { YearTicker } from "./year-ticker";

export const CHANGELOG_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
export const CHANGELOG_YEAR_COUNTS: Record<number, number> = { 2026: 55 };

const FLOW_STYLE =
  ":where(.cl-number-flow){line-height:1}.cl-number-flow > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0}";

// Rolling-number host at rest: the value sits in one inline-block span with a
// mask-height padding, which is what the line box measures.
function FlowNumber({ value }: { value: number }) {
  return (
    <span className="cl-number-flow tabular-nums" style={{ "--number-flow-mask-height": "1px" }}>
      <span>{value}</span>
    </span>
  );
}

export function ArchiveHeader({ year = 2026 }: { year?: number }) {
  const count = CHANGELOG_YEAR_COUNTS[year] ?? 0;
  return (
    <div className="container flex flex-1 flex-col max-lg:contents">
      <style>{FLOW_STYLE}</style>
      <div className="flex w-full flex-1 flex-col border-subtle-stroke border-x max-lg:border-none">
        <section className="grid grid-cols-12">
          <nav aria-label="breadcrumbs" className="col-[2/-2] flex h-28 items-end justify-between pb-5">
            <p className="text-overline">
              <Link
                className="whitespace-nowrap text-accent-foreground transition-colors duration-400 ease-in-out hover:text-secondary-foreground hover:duration-150 active:text-primary-foreground active:duration-50"
                href="/changelog"
              >
                {"Changelog"}
              </Link>{" "}
              {"/"} <FlowNumber value={year} />
            </p>
            <p className="text-caption-foreground text-overline">
              <FlowNumber value={count} /> {count === 1 ? "update" : "updates"}
            </p>
          </nav>
          <svg width="100%" height="1" className="text-subtle-stroke col-[1/-1]">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
          <header
            className="flex w-full flex-col pb-15 max-xl:pt-25 max-lg:pt-20 items-center col-[2/-2] pt-15 text-primary-foreground md:pb-10 lg:pt-20"
            style={{ "--animate-delay": "0ms", "--animate-delay-mobile": "0ms" }}
          >
            <h1 className="max-w-[15em] text-balance text-heading-responsive-lg text-center">{"What’s new"}</h1>
            <p className="mt-4 max-w-xl text-balance text-lg text-secondary-foreground lg:text-xl text-center">
              {"The latest Joshuattio releases, updates, and fixes."}
            </p>
            <SubscribeForm className="mt-6" />
          </header>
          <YearTicker allYears={CHANGELOG_YEARS} currentYear={year} className="col-[1/-1] mt-2 mb-10 lg:mb-15" />
        </section>
      </div>
    </div>
  );
}
