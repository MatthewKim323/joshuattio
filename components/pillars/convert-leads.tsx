import { ClWorkflow } from "./cl-workflow";

export function ConvertLeadsChapter() {
  return (
    <article id="home-2026-convert-leads" className="scroll-mt-[calc(var(--site-header-height)+88px)]! border-subtle-stroke border-b last:border-b-0 lg:scroll-mt-(--site-header-height)!">
      <div className="px-[calc(100%/24)] pt-16 pb-11 lg:px-[calc(100%/18)] lg:pt-20 lg:pb-14 xl:pt-28 xl:pb-20">
        <h3 className="max-w-[560px] text-balance font-display text-2xl text-primary-foreground leading-[1.15]">
          {"Speed to lead, every time."}
          {" "}
          <span className="text-accent-foreground">
            {"New leads get enriched, scored, and routed to the right rep before they ever cool off."}
          </span>
        </h3>
      </div>
      <div className="select-none border-subtle-stroke border-t">
        <ClWorkflow />
      </div>
    </article>
  );
}
