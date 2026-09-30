import { AnimatedKicker } from "@/components/hero/kicker";
import { HeroDesktopScene, HeroMobileScene, HeroMotion } from "@/components/hero/hero-scene";

const TITLE = "Welcome to agentic revenue.";
const SUBTITLE = "Joshuattio is the CRM that builds pipeline, advances deals, and grows accounts 24/7.";
const KICKER = "GTM lessons from Elena Verna and more";

export function Hero() {
  return (
    <section className="border-subtle-stroke border-b bg-primary-background">
      <HeroMotion>
        <div className="hidden md:block">
          <HeroDesktopScene
            kicker={<AnimatedKicker title={KICKER} href="#" />}
            title={TITLE}
            subtitle={SUBTITLE}
            ctaTalk={
              <>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-outline max-md:hidden" href="/contact/sales">
                  {"Talk to sales"}
                </a>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-ghost group self-center md:hidden" href="/contact/sales">
                  <span>
                    {"Talk to sales"}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative transition-[translate] duration-400 ease-in-out group-hover:translate-x-0.25 group-hover:duration-150 group-active:translate-x-0.25 group-active:duration-50">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
                  </svg>
                </a>
              </>
            }
            ctaStart={
              <>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-primary max-md:hidden" href="#">
                  {"Start for free"}
                </a>
                <form className="relative flex w-full max-w-xs flex-col gap-2 md:hidden" toolname="subscribe_newsletter" tooldescription="Subscribe to Joshuattio product updates and newsletters with a work email address">
                  <div className="flex flex-col gap-y-1.5">
                    <div>
                      <input className="block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300 placeholder:max-w-full placeholder-shown:truncate placeholder:text-base" type="text" placeholder="Your email address" id="_R_5lech5fiv9f9k7ivb_" aria-invalid="false" name="email" defaultValue="" suppressHydrationWarning />
                    </div>
                  </div>
                  <button className="inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-11.5 gap-x-2 rounded-xl px-3.5 text-base has-[>svg:last-child,>img:last-child]:pr-3 has-[>svg:first-child,>img:first-child]:pl-3 button-primary relative" type="submit">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-spin opacity-0 transition-opacity duration-150">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
                        <path d="M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="transition-opacity duration-150">
                      {"Send me a demo"}
                    </span>
                  </button>
                </form>
              </>
            }
          />
        </div>
        <div className="md:hidden">
          <HeroMobileScene
            kicker={<AnimatedKicker title={KICKER} href="#" />}
            title={TITLE}
            subtitle={SUBTITLE}
            ctaStart={
              <>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-primary max-md:hidden" href="#">
                  {"Start for free"}
                </a>
                <form className="relative grid min-h-16 w-full max-w-sm items-start gap-2 md:grid-cols-[1fr_min-content] [&_button]:h-10 [&_input]:h-10! md:hidden mx-auto max-w-xs!" toolname="subscribe_newsletter" tooldescription="Subscribe to Joshuattio product updates and newsletters with a work email address">
                  <div className="flex flex-col gap-y-1.5 relative">
                    <div>
                      <input className="block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300 placeholder:max-w-full placeholder-shown:truncate text-sm placeholder:text-sm" type="text" placeholder="Your email address" id="_R_mj715fiv9f9k7ivb_" aria-invalid="false" name="email" defaultValue="" suppressHydrationWarning />
                    </div>
                  </div>
                  <button className="inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-primary relative" type="submit">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-spin opacity-0 transition-opacity duration-150">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
                        <path d="M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="transition-opacity duration-150">
                      {"Send me a demo"}
                    </span>
                  </button>
                </form>
              </>
            }
            ctaTalk={
              <>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-outline max-md:hidden" href="/contact/sales">
                  {"Talk to sales"}
                </a>
                <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-ghost group self-center md:hidden" href="/contact/sales">
                  <span>
                    {"Talk to sales"}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative transition-[translate] duration-400 ease-in-out group-hover:translate-x-0.25 group-hover:duration-150 group-active:translate-x-0.25 group-active:duration-50">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
                  </svg>
                </a>
              </>
            }
          />
        </div>
      </HeroMotion>
    </section>
  );
}
