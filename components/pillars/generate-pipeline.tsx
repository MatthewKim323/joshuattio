import { GpAsk } from "./gp-ask";
import { GpCompanies } from "./gp-companies";

export function GeneratePipelineChapter() {
  return (
    <article id="home-2026-generate-pipeline" className="scroll-mt-[calc(var(--site-header-height)+88px)]! border-subtle-stroke border-b last:border-b-0 lg:scroll-mt-(--site-header-height)!">
      <div className="px-[calc(100%/24)] pt-16 pb-11 lg:px-[calc(100%/18)] lg:pt-20 lg:pb-14 xl:pt-28 xl:pb-20">
        <h3 className="max-w-[560px] text-balance font-display text-2xl text-primary-foreground leading-[1.15]">
          {"Your team, amplified."}
          {" "}
          <span className="text-accent-foreground">
            {"Agents prospect and reach out when buyers are looking, building a pipeline of deals ready to win."}
          </span>
        </h3>
      </div>
      <div className="select-none border-subtle-stroke border-t">
        <GpCompanies />
      </div>
      <div className="grid border-subtle-stroke border-t bg-secondary-background xl:grid-cols-2">
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px] border-subtle-stroke border-b xl:border-r xl:border-b-0">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"Free your reps to sell."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Agents handle the research and busywork. Reps focus their time where deals get won."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <GpAsk />
          </div>
        </div>
        <div className="flex h-[360px] flex-col gap-8 lg:h-[480px]">
          <div className="px-[calc(100%/24)] pt-6 md:pt-11 lg:pr-8 lg:pl-[calc(100%/18)]">
            <h4 className="text-lg text-primary-foreground leading-[22px]">
              {"Agents dig. You close."}
            </h4>
            <p className="mt-1 max-w-[352px] text-base text-black-800">
              {"Every lead is enriched and qualified, so reps know when and why to engage."}
            </p>
          </div>
          <div className="flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden px-6 pb-6 [contain:layout] [overflow-anchor:none] md:px-8 md:pb-8">
            <svg viewBox="0 0 320 320" className="mx-auto h-auto w-full max-w-[160px] lg:max-w-[320px]" aria-hidden="true">
              <style dangerouslySetInnerHTML={{__html:"\n@keyframes pipeline-radar-ring-inner {\n  0% { opacity: 0.11; }\n  16% { opacity: 0.22; }\n  50% { opacity: 0.07; }\n  68% { opacity: 0.11; }\n  100% { opacity: 0.11; }\n}\n@keyframes pipeline-radar-ring-outer {\n  0% { opacity: 0.067; }\n  16% { opacity: 0.135; }\n  50% { opacity: 0.045; }\n  68% { opacity: 0.067; }\n  100% { opacity: 0.067; }\n}\n@keyframes pipeline-radar-bob {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-5px); }\n}\n.pipeline-radar-ring-inner {\n  opacity: 0.11;\n  animation: pipeline-radar-ring-inner 3.6s ease-in-out infinite;\n}\n.pipeline-radar-ring-outer {\n  opacity: 0.067;\n  animation: pipeline-radar-ring-outer 3.6s ease-in-out infinite;\n}\n.pipeline-radar-bob {\n  transform-box: fill-box;\n  transform-origin: center;\n  will-change: transform;\n  animation: pipeline-radar-bob 4s ease-in-out infinite;\n}\n@media (prefers-reduced-motion: reduce) {\n  .pipeline-radar-ring-inner,\n  .pipeline-radar-ring-outer,\n  .pipeline-radar-bob {\n    animation: none;\n  }\n}\n"}} />
              <circle className="pipeline-radar-ring-outer" cx="160" cy="160" r="148" fill="none" stroke="rgba(28,40,64,0.9)" strokeWidth="1" style={{"animationDelay":"0.4s"}} />
              <circle className="pipeline-radar-ring-inner" cx="160" cy="160" r="100" fill="none" stroke="rgba(28,40,64,0.9)" strokeWidth="1" />
              <circle cx="160" cy="160" r="56" fill="var(--color-white-100)" stroke="rgba(28,40,64,0.05)" strokeWidth="1" style={{"filter":"drop-shadow(0 8px 20px rgba(28,40,64,0.12))"}} />
              <image href="/img/img-ae407eae3f.png" x="137" y="138.5" width="46" height="43" preserveAspectRatio="xMidYMid meet" />
              <g className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500" style={{"animationDelay":"0ms","transformBox":"fill-box","transformOrigin":"center"}}>
                <g className="pipeline-radar-bob" style={{"animationDelay":"1000ms","animationDuration":"3800ms"}}>
                  <rect x="39.5" y="94" width="71" height="26" rx="9" fill="#e0fced" stroke="#cbf7e1" strokeWidth="1.27" />
                  <text x="75" y="107" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" letterSpacing="-0.13" fill="#007d53">
                    {"ICP: 98"}
                  </text>
                </g>
              </g>
              <g className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500" style={{"animationDelay":"120ms","transformBox":"fill-box","transformOrigin":"center"}}>
                <g className="pipeline-radar-bob" style={{"animationDelay":"1650ms","animationDuration":"4150ms"}}>
                  <rect x="229" y="46" width="78" height="26" rx="9" fill="#fdf7c4" stroke="#fcef7e" strokeWidth="1.27" />
                  <text x="268" y="59" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" letterSpacing="-0.13" fill="#665a00">
                    {"New Exec"}
                  </text>
                </g>
              </g>
              <g className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500" style={{"animationDelay":"240ms","transformBox":"fill-box","transformOrigin":"center"}}>
                <g className="pipeline-radar-bob" style={{"animationDelay":"2300ms","animationDuration":"4500ms"}}>
                  <rect x="2.5" y="255" width="151" height="26" rx="9" fill="#e5eeff" stroke="#d6e5ff" strokeWidth="1.27" />
                  <text x="78" y="268" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" letterSpacing="-0.13" fill="#215bc4">
                    {"Warm intro via a16z"}
                  </text>
                </g>
              </g>
              <g className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500" style={{"animationDelay":"360ms","transformBox":"fill-box","transformOrigin":"center"}}>
                <g className="pipeline-radar-bob" style={{"animationDelay":"2950ms","animationDuration":"4850ms"}}>
                  <rect x="194" y="268" width="104" height="26" rx="9" fill="#f5f0ff" stroke="#e8ddfe" strokeWidth="1.27" />
                  <text x="246" y="281" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" letterSpacing="-0.13" fill="#6238b5">
                    {"$5B Series H"}
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
