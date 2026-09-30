import { ForecastChat } from "./fr-chat";
export function ForecastRevenueChapter() {
  return (
    <article id="home-2026-forecast-revenue" className="scroll-mt-[calc(var(--site-header-height)+88px)]! border-subtle-stroke border-b last:border-b-0 lg:scroll-mt-(--site-header-height)!">
      <div className="px-[calc(100%/24)] pt-16 pb-11 lg:px-[calc(100%/18)] lg:pt-20 lg:pb-14 xl:pt-28 xl:pb-20">
        <h3 className="max-w-[560px] text-balance font-display text-2xl text-primary-foreground leading-[1.15]">
          {"For the people who own the number."}
          {" "}
          <span className="text-accent-foreground">
            {"Ask any revenue question. From the weekly forecast to performance by rep, get the answer in seconds."}
          </span>
        </h3>
      </div>
      <div className="select-none border-subtle-stroke border-t">
        <ForecastChat />
      </div>
    </article>
  );
}
