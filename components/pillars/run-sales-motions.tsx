import { SalesBoard } from "./rs-board";
import { DealStack } from "./rs-deal-stack";
import { ReviewPanel } from "./rs-review";
export function RunSalesMotionsChapter() {
  return (
    <article id="home-2026-run-sales-motions" className="scroll-mt-[calc(var(--site-header-height)+88px)]! border-subtle-stroke border-b last:border-b-0 lg:scroll-mt-(--site-header-height)!">
      <div className="px-[calc(100%/24)] pt-16 pb-11 lg:px-[calc(100%/18)] lg:pt-20 lg:pb-14 xl:pt-28 xl:pb-20">
        <h3 className="max-w-[560px] text-balance font-display text-2xl text-primary-foreground leading-[1.15]">
          {"Run every motion, your way."}
          {" "}
          <span className="text-accent-foreground">
            {"Pipeline built for how you sell, while agents brief the meetings and keep deals moving."}
          </span>
        </h3>
      </div>
      <div className="select-none border-subtle-stroke border-t">
        <div aria-hidden="true" className="@container relative aspect-[1044/654] overflow-hidden bg-surface-subtle">
          <div className="absolute top-0 left-0 h-[327px] w-[522px] origin-top-left [transform:scale(calc(100cqw/522px))] lg:h-[654px] lg:w-[1044px] lg:[transform:scale(calc(100cqw/1044px))]">
            <div className="relative h-full w-full overflow-hidden bg-surface-subtle">
              <div aria-hidden="true" className="absolute inset-0 bg-surface-subtle" />
              <SalesBoard />
            </div>
          </div>
        </div>
      </div>
      <div className="grid border-subtle-stroke border-t bg-secondary-background xl:grid-cols-2">
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px] border-subtle-stroke border-b xl:border-r xl:border-b-0">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"Catch changes to the deal."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Spot new stakeholders, competitor moves, and stalls before your next call."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <DealStack />
          </div>
        </div>
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px]">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"Skip the review scramble."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Walk in with quota coverage, deal velocity, and potential risks already mapped."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <ReviewPanel />
          </div>
        </div>
      </div>
    </article>
  );
}
