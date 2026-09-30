import { PlaysFeed } from "./re-plays";
import { RetainBoard } from "./re-book";
export function RetainAndExpandChapter() {
  return (
    <article id="home-2026-retain-and-expand" className="scroll-mt-[calc(var(--site-header-height)+88px)]! border-subtle-stroke border-b last:border-b-0 lg:scroll-mt-(--site-header-height)!">
      <div className="px-[calc(100%/24)] pt-16 pb-11 lg:px-[calc(100%/18)] lg:pt-20 lg:pb-14 xl:pt-28 xl:pb-20">
        <h3 className="max-w-[560px] text-balance font-display text-2xl text-primary-foreground leading-[1.15]">
          {"Keep more. Grow more."}
          {" "}
          <span className="text-accent-foreground">
            {"Agents track the whole book, so you save what's slipping and grow what's rising."}
          </span>
        </h3>
      </div>
      <div className="select-none border-subtle-stroke border-t">
        <RetainBoard />
      </div>
      <div className="grid border-subtle-stroke border-t bg-secondary-background xl:grid-cols-2">
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px] border-subtle-stroke border-b xl:border-r xl:border-b-0">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"Spot the shift early."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Whether an account's climbing or cooling, you'll know weeks before the call."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <div className="mx-auto h-full w-full max-w-[150px] overflow-hidden px-[4px] lg:max-w-[300px] lg:px-2" style={{"maskImage":"linear-gradient(transparent 0%, rgb(0, 0, 0) 14%, rgb(0, 0, 0) 78%, transparent 100%)"}}>
              <style dangerouslySetInnerHTML={{__html:"\n@keyframes signal-roller-roll {\n  from { transform: translateY(0); }\n  to { transform: translateY(-50%); }\n}\n.signal-roller-track {\n  will-change: transform;\n  animation: signal-roller-roll 24s linear infinite;\n}\n@media (prefers-reduced-motion: reduce) {\n  .signal-roller-track { animation: none; }\n}\n"}} />
              <div className="signal-roller-track flex flex-col">
                <div className="flex flex-col gap-[10px] pb-[10px] lg:gap-5 lg:pb-5">
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] bg-gradient-to-br from-[#d6a07a] to-[#a8623d] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]">
                        {"D"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Drew Austin"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Changed roles"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[3px] py-[2px] lg:px-[6px] lg:py-1">
                          <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]">
                            {"Head of IT"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] bg-green-500 lg:size-4 lg:rounded-[4.8px]">
                        <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[5px] lg:size-[10px]">
                          <path d="M9.2 2.4C5.6 2.4 3 4.2 3 7.6c0 .7.2 1.3.5 1.8C4 7.6 5.6 6.3 7.6 5.6c-1.5 1-2.7 2.2-3.3 3.9.7.3 1.5.4 2.2.2 2.6-.5 3.5-3.6 2.7-7.3Z" fill="#fff" />
                        </svg>
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"GreenLeaf"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"New funding round"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[1.5px] py-[2px] lg:px-[3px] lg:py-1">
                          <span className="flex h-[11px] items-center rounded-[3.5px] border border-[#e8ddfe] bg-[#f5f0ff] px-[2.5px] font-medium text-[#6238b5] text-[6.5px] leading-[10px] tracking-[-0.13px] lg:h-[22px] lg:rounded-[7px] lg:px-[5px] lg:text-[13px] lg:leading-5 lg:tracking-[-0.26px]">
                            {"$250M"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]" style={{"backgroundColor":"rgb(38, 109, 240)"}}>
                        {"J"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Joshua Reed"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Upcoming renewal date"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[3px] py-[3px] lg:px-[6px] lg:py-[6px]">
                          <span className="truncate font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]">
                            {"Joshua to send documentation on the public API"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]" style={{"backgroundColor":"rgb(155, 105, 255)"}}>
                        {"M"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Maya Lin"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Usage spike"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[1.5px] py-[2px] lg:px-[3px] lg:py-1">
                          <span className="flex h-[11px] items-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2.5px] font-medium text-[#007d53] text-[6.5px] leading-[10px] tracking-[-0.13px] lg:h-[22px] lg:rounded-[7px] lg:px-[5px] lg:text-[13px] lg:leading-5 lg:tracking-[-0.26px]">
                            {"+42% seats"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="flex flex-col gap-[10px] pb-[10px] lg:gap-5 lg:pb-5">
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] bg-gradient-to-br from-[#d6a07a] to-[#a8623d] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]">
                        {"D"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Drew Austin"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Changed roles"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[3px] py-[2px] lg:px-[6px] lg:py-1">
                          <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]">
                            {"Head of IT"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-[2.4px] border border-[rgba(0,0,0,0.05)] bg-green-500 lg:size-4 lg:rounded-[4.8px]">
                        <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[5px] lg:size-[10px]">
                          <path d="M9.2 2.4C5.6 2.4 3 4.2 3 7.6c0 .7.2 1.3.5 1.8C4 7.6 5.6 6.3 7.6 5.6c-1.5 1-2.7 2.2-3.3 3.9.7.3 1.5.4 2.2.2 2.6-.5 3.5-3.6 2.7-7.3Z" fill="#fff" />
                        </svg>
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"GreenLeaf"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"New funding round"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[1.5px] py-[2px] lg:px-[3px] lg:py-1">
                          <span className="flex h-[11px] items-center rounded-[3.5px] border border-[#e8ddfe] bg-[#f5f0ff] px-[2.5px] font-medium text-[#6238b5] text-[6.5px] leading-[10px] tracking-[-0.13px] lg:h-[22px] lg:rounded-[7px] lg:px-[5px] lg:text-[13px] lg:leading-5 lg:tracking-[-0.26px]">
                            {"$250M"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]" style={{"backgroundColor":"rgb(38, 109, 240)"}}>
                        {"J"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Joshua Reed"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Upcoming renewal date"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[3px] py-[3px] lg:px-[6px] lg:py-[6px]">
                          <span className="truncate font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]">
                            {"Joshua to send documentation on the public API"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] lg:gap-2">
                    <div className="flex items-center gap-[2.5px] px-[1.5px] pb-[1px] lg:gap-[5px] lg:px-[3px] lg:pb-[2px]">
                      <span className="grid size-[8px] shrink-0 place-items-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.05)] font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]" style={{"backgroundColor":"rgb(155, 105, 255)"}}>
                        {"M"}
                      </span>
                      <span className="font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] underline decoration-[rgba(0,0,0,0.1)] underline-offset-[1px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px] lg:underline-offset-2">
                        {"Maya Lin"}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-primary-background lg:rounded-xl" style={{"boxShadow":"rgba(0, 22, 62, 0.01) 0px 0px 1px 1px, rgba(0, 22, 62, 0.04) 0px 4px 12px -1px, rgba(0, 22, 62, 0.18) 0px 1px 3px -1px"}}>
                      <div className="flex items-center justify-between gap-[4px] pt-[5px] pr-[4px] pb-[1px] pl-[6px] lg:gap-2 lg:pt-[10px] lg:pr-2 lg:pb-[2px] lg:pl-3">
                        <span className="flex min-w-0 items-center gap-[2px] lg:gap-1">
                          <span className="truncate font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
                            {"Usage spike"}
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-[6px] shrink-0 text-tertiary-foreground lg:size-3">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                            <path d="M6 5.4v2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            <circle cx="6" cy="3.9" r="0.55" fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                      <div className="px-[4px] pt-[1px] pb-[3px] lg:px-2 lg:pt-[2px] lg:pb-[6px]">
                        <div className="flex items-center px-[1.5px] py-[2px] lg:px-[3px] lg:py-1">
                          <span className="flex h-[11px] items-center rounded-[3.5px] border border-[#cbf7e1] bg-[#e0fced] px-[2.5px] font-medium text-[#007d53] text-[6.5px] leading-[10px] tracking-[-0.13px] lg:h-[22px] lg:rounded-[7px] lg:px-[5px] lg:text-[13px] lg:leading-5 lg:tracking-[-0.26px]">
                            {"+42% seats"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px]">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"The move's ready. You make the call."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Save, upsell, or renewal, agents draft the play for you to approve and run."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <PlaysFeed />
          </div>
        </div>
      </div>
    </article>
  );
}
