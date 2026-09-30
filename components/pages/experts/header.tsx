import { Wordmark } from "@/components/shell/wordmark";
import { HeaderBehavior } from "./header-behavior";

// Page frame header for the experts directory (static markup; behavior lives in header-behavior.tsx).
export function ExpertsHeader() {
  return (
          <div id="custom-header" className="custom-css joshuattio">
            <div className="inter_4a995166-module__F0d0Tq__variable interdisplay_ab4bf036-module__f38q6G__variable tiempostext_f5e22e8b-module__4u-Eba__variable jetbrains_mono_80e6829-module__gijXjG__variable font-sans text-base text-primary-foreground antialiased data-[scrolled=true]:bg-(--color-overscroll-bottom) data-[scrolled=false]:bg-(--color-overscroll-top) light">
              <div className="header sticky top-0 z-(--site-header-z-index) border-transparent">
                <header className="border-subtle-stroke border-b bg-primary-background/95 transition-colors duration-250 dark:bg-primary-background">
                  <div className="absolute inset-0 -z-1 backdrop-blur-md" />
                  <div className="site-banner dark isolate flex h-(--site-header-banner-visible-height) w-full items-center justify-center bg-(--color-banner-background)" style={{"boxShadow":"oklch(0 0 0 / 0.01) 0px 1px 2px 0px,\n\t\t\t\t\t\t\t\t\toklch(0 0 0 / 0.02) 0px 2px 4px -1px,\n\t\t\t\t\t\t\t\t\toklch(0 0 0 / 0.03) 0px 4px 8px -2px"}}>
                    <div className="container flex h-full items-center justify-center">
                      <div className="relative flex size-full items-stretch justify-center px-12 max-md:justify-start max-md:pl-0">
                        <a className="group relative flex size-full items-center justify-center gap-1.5 text-primary-foreground max-md:justify-start" href="/platform/ask">
                          <span className="joshuattio-group-hover-underline relative truncate text-[13px]/5">
                            {"Ask more from CRM. Ask Joshuattio."}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-[translate] duration-400 ease-in-out group-hover:translate-x-0.25 group-hover:duration-150 group-active:translate-x-0.25 group-active:duration-50">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
                          </svg>
                        </a>
                        <button className="inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default size-8 rounded-[10px] button-outline !bg-transparent !border-transparent dark absolute top-1/2 right-0 -translate-y-1/2 hover:!border-tertiary-foreground">
                          <svg className="dark:text-white-500 text-tertiary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <nav className="pt-2 pb-[7px] lg:pt-4 lg:pb-[15px]">
                      <div className="flex items-center justify-between">
                        <div className="flex grow items-center gap-x-9">
                          <a className="-mx-1.5 rounded-xl px-1.5" referrerPolicy="same-origin" href="/">
                            <Wordmark className="mb-1 h-6 text-primary-foreground" />
                          </a>
                          <nav aria-label="Main" data-orientation="horizontal" dir="ltr" className="relative z-1">
                            <div style={{"position":"relative"}}>
                              <ul data-orientation="horizontal" className="hidden items-center gap-x-1.5 lg:flex" dir="ltr">
                                <li>
                                  <button data-nav-id="1" className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-ghost group select-none text-[15px]" aria-activedescendant="true" id="radix-_r_5_-trigger-radix-_r_6_" data-state="closed" aria-expanded="false" aria-controls="radix-_r_5_-content-radix-_r_6_" data-radix-collection-item="">
                                    <span>
                                      {"Platform"}
                                    </span>
                                    <svg className="transition-[transform,translate] duration-400 ease-in-out group-data-open:translate-y-px group-data-open:duration-150" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
                                    </svg>
                                  </button>
                                </li>
                                <li>
                                  <button data-nav-id="2" className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 button-ghost group select-none text-[15px]" aria-activedescendant="true" id="radix-_r_5_-trigger-radix-_r_7_" data-state="closed" aria-expanded="false" aria-controls="radix-_r_5_-content-radix-_r_7_" data-radix-collection-item="">
                                    <span>
                                      {"Resources"}
                                    </span>
                                    <svg className="transition-[transform,translate] duration-400 ease-in-out group-data-open:translate-y-px group-data-open:duration-150" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
                                    </svg>
                                  </button>
                                </li>
                                <li>
                                  <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-ghost text-[15px]" data-radix-collection-item="" href="/customers">
                                    {"Customers"}
                                  </a>
                                </li>
                                <li>
                                  <a className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-ghost text-[15px]" data-radix-collection-item="" href="/pricing">
                                    {"Pricing"}
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-dp absolute top-full left-0 hidden w-full sm:block">
                              <div data-nav="1" data-state="open" data-orientation="horizontal" className="relative mt-1.5 origin-top-left overflow-hidden rounded-2xl bg-primary-background/95 backdrop-blur-xl h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) transition-all duration-250 ease-in-out data-closed:animate-navigation-disappear data-open:animate-navigation-appear dark:bg-secondary-background shadow-[0px_0px_0px_1px_rgba(28,29,31,0.1),0px_1px_2px_0px_rgba(28,29,31,0.05),0px_2px_4px_-1px_rgba(28,29,31,0.02),0px_4px_8px_-2px_rgba(28,29,31,0.03),0px_8px_16px_-4px_rgba(28,29,31,0.04),0px_16px_32px_-8px_rgba(28,29,31,0.05),0px_32px_64px_-8px_rgba(28,29,31,0.06)] dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.2),0px_1px_2px_0px_rgba(28,29,31,0.05),0px_2px_4px_-1px_rgba(28,29,31,0.02),0px_4px_8px_-2px_rgba(28,29,31,0.03),0px_8px_16px_-4px_rgba(28,29,31,0.04),0px_16px_32px_-8px_rgba(28,29,31,0.05),0px_32px_64px_-8px_rgba(28,29,31,0.06)]" style={{"--radix-navigation-menu-viewport-width":"912px","--radix-navigation-menu-viewport-height":"478px"}}>
                                <div id="radix-_r_5_-content-radix-_r_6_" aria-labelledby="radix-_r_5_-trigger-radix-_r_6_" data-orientation="horizontal" className="absolute top-0 left-0 w-auto data-[motion=from-end]:animate-navigation-enter-from-right data-[motion=from-start]:animate-navigation-enter-from-left data-[motion=to-end]:animate-navigation-exit-to-right data-[motion=to-start]:animate-navigation-exit-to-left" dir="ltr">
                                  <div className="flex">
                                    <ul className="relative flex-col gap-1 p-4 pt-3 grid w-180 grid-cols-2 gap-x-3 max-xl:w-144">
                                      <svg width="1" height="100%" className="divider absolute inset-y-0 left-0 text-primary-foreground/10 dark:text-primary-foreground/20 hidden">
                                        <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
                                      </svg>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4! col-span-2">
                                          {"CRM Platform"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/ask">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-173fe3ea64.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-173fe3ea64.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Ask Joshuattio"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Search and create with AI"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/ai">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-4498f4c83c.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-fd4c1e38c2.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"AI"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Native to your CRM"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/data">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-b0a18cd4ae.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-3014bd09be.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Data model"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Sync and enrich your data"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/productivity">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-5206f52109.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-2e14661cfd.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Productivity & collaboration"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Context for your team operations"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4! col-span-2">
                                          {"Automations"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/automations">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-74cb167320.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-1e9685925f.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Workflows"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Automate any process"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/sequences">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-8587b9faf1.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-f8e07c872d.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Sequences"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Personalized outreach"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4! col-span-2">
                                          {"Insights"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/call-intelligence">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-eeb694ec80.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-947403c610.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Call Intelligence"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Record and analyze meetings"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/reporting">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-de4d82844e.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-957d5d5709.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Reporting"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Insights in real time"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4! col-span-2">
                                          {"Ecosystem"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/platform/developers">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-d757641138.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-6f5bd8313a.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Developer Platform"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Build with the Joshuattio API and SDK"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/apps">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-249be2273b.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-7451fa73fe.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Apps & integrations"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Connect all your favorite tools"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                    </ul>
                                    <ul className="relative flex flex-col p-4 pt-3 w-48 gap-1.25">
                                      <svg width="1" height="100%" className="divider absolute inset-y-0 left-0 text-primary-foreground/10 dark:text-primary-foreground/20">
                                        <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
                                      </svg>
                                      <li className="contents">
                                        <p className="mt-3 inline-block text-overline leading-4! mb-0.5 px-2.75">
                                          {"Get started"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/help/reference/joshuattio-101">
                                          {"Joshuattio 101"}
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a href="/experts" className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="">
                                          {"Hire an expert"}
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/contact/sales">
                                          {"Talk to sales"}
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div data-nav="2" data-state="open" data-orientation="horizontal" className="relative mt-1.5 origin-top-left overflow-hidden rounded-2xl bg-primary-background/95 backdrop-blur-xl h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) transition-all duration-250 ease-in-out data-closed:animate-navigation-disappear data-open:animate-navigation-appear dark:bg-secondary-background shadow-[0px_0px_0px_1px_rgba(28,29,31,0.1),0px_1px_2px_0px_rgba(28,29,31,0.05),0px_2px_4px_-1px_rgba(28,29,31,0.02),0px_4px_8px_-2px_rgba(28,29,31,0.03),0px_8px_16px_-4px_rgba(28,29,31,0.04),0px_16px_32px_-8px_rgba(28,29,31,0.05),0px_32px_64px_-8px_rgba(28,29,31,0.06)] dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.2),0px_1px_2px_0px_rgba(28,29,31,0.05),0px_2px_4px_-1px_rgba(28,29,31,0.02),0px_4px_8px_-2px_rgba(28,29,31,0.03),0px_8px_16px_-4px_rgba(28,29,31,0.04),0px_16px_32px_-8px_rgba(28,29,31,0.05),0px_32px_64px_-8px_rgba(28,29,31,0.06)]" style={{"--radix-navigation-menu-viewport-width":"576px","--radix-navigation-menu-viewport-height":"380px"}}>
                                <div id="radix-_r_5_-content-radix-_r_7_" aria-labelledby="radix-_r_5_-trigger-radix-_r_7_" data-motion="from-end" data-orientation="horizontal" className="absolute top-0 left-0 w-auto data-[motion=from-end]:animate-navigation-enter-from-right data-[motion=from-start]:animate-navigation-enter-from-left data-[motion=to-end]:animate-navigation-exit-to-right data-[motion=to-start]:animate-navigation-exit-to-left" dir="ltr">
                                  <div className="flex">
                                    <ul className="relative flex w-96 flex-col gap-1 p-4 pt-3">
                                      <svg width="1" height="100%" className="divider absolute inset-y-0 left-0 text-primary-foreground/10 dark:text-primary-foreground/20 hidden">
                                        <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
                                      </svg>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4!">
                                          {"Support"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/help">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-92c5495dff.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-6ec67b0a44.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Help center"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Learn more about Joshuattio’s features"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/help/academy">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-11dd21c6cd.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-33828be2bf.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Academy"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Essential Joshuattio features explained"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4!">
                                          {"Developers"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a href="/" className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-daac881a42.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-fc307eb550.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Developer docs"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Start building Joshuattio apps"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <p className="mt-3 mb-1 inline-block px-4 text-overline leading-4!">
                                          {"Partners"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2" data-radix-collection-item="" href="/partners">
                                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                            <svg width="40" height="40" fill="none" className="absolute inset-0">
                                              <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                                <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                                <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                              </g>
                                            </svg>
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-5d7fd69439.svg" style={{"color":"transparent"}} />
                                            <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-f427ee5ba8.svg" style={{"color":"transparent"}} />
                                          </div>
                                          <div className="flex w-full min-w-0 flex-col pr-2">
                                            <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                              <span className="truncate text-sm">
                                                {"Partner programs"}
                                              </span>
                                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <p className="truncate text-accent-foreground text-sm">
                                              {"Developers, creators, consultants"}
                                            </p>
                                          </div>
                                        </a>
                                      </li>
                                    </ul>
                                    <ul className="relative flex flex-col p-4 pt-3 w-48 gap-1.25">
                                      <svg width="1" height="100%" className="divider absolute inset-y-0 left-0 text-primary-foreground/10 dark:text-primary-foreground/20">
                                        <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
                                      </svg>
                                      <li className="contents">
                                        <p className="mt-3 inline-block text-overline leading-4! mb-0.5 px-2.75">
                                          {"Company"}
                                        </p>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/changelog">
                                          {"Changelog"}
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/blog">
                                          {"Announcements"}
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/engineering/blog">
                                          {"Engineering blog"}
                                        </a>
                                      </li>
                                      <li className="contents">
                                        <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" data-radix-collection-item="" href="/careers">
                                          {"Careers"}
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </nav>
                        </div>
                        <button className="h-toggle relative inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default size-9 rounded-[10px] button-ghost lg:hidden">
                          <svg className="open text-black-500 dark:text-white-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 6H3M15 12H3" />
                          </svg>
                          <svg className="close text-black-500 dark:text-white-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
                          </svg>
                        </button>
                        <div className="hidden gap-x-2.5 lg:flex">
                          <a href="/" className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-outline">
                            {"Sign in"}
                          </a>
                          <a href="/welcome/sign-in" className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[>svg:last-child,>img:last-child]:pr-3 max-lg:has-[>svg:first-child,>img:first-child]:pl-3 button-primary">
                            {"Start for free"}
                          </a>
                        </div>
                      </div>
                    </nav>
                  </div>
                </header>
              </div>
              <div role="dialog" id="radix-_r_a_" aria-describedby="radix-_r_c_" aria-labelledby="radix-_r_b_" data-state="open" data-vaul-drawer-direction="top" data-vaul-drawer="" data-vaul-delayed-snap-points="false" data-vaul-snap-points="false" data-vaul-custom-container="false" data-vaul-animate="true" className="mobilenav fixed inset-0 top-(--site-header-height) flex flex-col overflow-hidden border-subtle-stroke border-b bg-primary-background z-(--mobile-nav-drawer-content-z-index)" tabIndex={-1} style={{"pointerEvents":"auto"}}>
                <div className="absolute inset-0 overflow-y-scroll pb-20">
                  <h2 id="radix-_r_b_" style={{"position":"absolute","border":"0px","width":"1px","height":"1px","padding":"0px","margin":"-1px","overflow":"hidden","clip":"rect(0px, 0px, 0px, 0px)","whiteSpace":"nowrap","overflowWrap":"normal"}}>
                    {"Menu"}
                  </h2>
                  <div className="container" data-orientation="vertical">
                    <div data-state="closed" data-orientation="vertical" className="border-subtle-stroke border-b pt-2.5 pb-[9px]">
                      <h3 data-orientation="vertical" data-state="closed" className="flex">
                        <button type="button" aria-controls="radix-_r_af_" aria-expanded="false" data-state="closed" data-orientation="vertical" id="radix-_r_ae_" className="group flex flex-1 cursor-pointer items-center justify-between py-1.5 pl-1.5" data-radix-collection-item="">
                          <span className="text-base text-primary-foreground">
                            {"Platform"}
                          </span>
                          <svg className="h-5 w-5 text-black-500 transition-transform duration-300 ease-in-out group-data-open:rotate-180 dark:text-white-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
                          </svg>
                        </button>
                      </h3>
                      <div data-state="closed" id="radix-_r_af_" role="region" aria-labelledby="radix-_r_ae_" data-orientation="vertical" className="overflow-hidden data-closed:animate-slideUp data-open:animate-slideDown" style={{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)","--radix-collapsible-content-height":"901px","--radix-collapsible-content-width":"400px"}} hidden>
                        <div className="flex flex-col gap-y-1.5">
                          <div className="flex flex-col pb-2.5">
                            <ul className="flex flex-col gap-y-0.5">
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"CRM Platform"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/ask">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-173fe3ea64.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-173fe3ea64.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Ask Joshuattio"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Search and create with AI"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/ai">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-4498f4c83c.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-fd4c1e38c2.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"AI"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Native to your CRM"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/data">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-b0a18cd4ae.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-3014bd09be.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Data model"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Sync and enrich your data"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/productivity">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-5206f52109.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-2e14661cfd.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Productivity & collaboration"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Context for your team operations"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Automations"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/automations">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-74cb167320.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-1e9685925f.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Workflows"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Automate any process"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/sequences">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-8587b9faf1.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-f8e07c872d.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Sequences"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Personalized outreach"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Insights"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/call-intelligence">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-eeb694ec80.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-947403c610.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Call Intelligence"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Record and analyze meetings"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/reporting">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-de4d82844e.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-957d5d5709.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Reporting"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Insights in real time"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Ecosystem"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/platform/developers">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-d757641138.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-6f5bd8313a.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Developer Platform"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Build with the Joshuattio API and SDK"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/apps">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-249be2273b.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-7451fa73fe.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Apps & integrations"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Connect all your favorite tools"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                          <hr className="mb-2 border-weak-stroke" />
                          <div className="flex flex-col pb-2.5">
                            <ul className="flex flex-col gap-y-0.5">
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Get started"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/help/reference/joshuattio-101">
                                  {"Joshuattio 101"}
                                </a>
                              </li>
                              <li>
                                <a href="/experts" className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground">
                                  {"Hire an expert"}
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/contact/sales">
                                  {"Talk to sales"}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-state="closed" data-orientation="vertical" className="border-subtle-stroke border-b pt-2.5 pb-[9px]">
                      <h3 data-orientation="vertical" data-state="closed" className="flex">
                        <button type="button" aria-controls="radix-_r_ah_" aria-expanded="false" data-state="closed" data-orientation="vertical" id="radix-_r_ag_" className="group flex flex-1 cursor-pointer items-center justify-between py-1.5 pl-1.5" data-radix-collection-item="">
                          <span className="text-base text-primary-foreground">
                            {"Resources"}
                          </span>
                          <svg className="h-5 w-5 text-black-500 transition-transform duration-300 ease-in-out group-data-open:rotate-180 dark:text-white-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
                          </svg>
                        </button>
                      </h3>
                      <div data-state="closed" id="radix-_r_ah_" role="region" aria-labelledby="radix-_r_ag_" data-orientation="vertical" className="overflow-hidden data-closed:animate-slideUp data-open:animate-slideDown" style={{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)","--radix-collapsible-content-height":"565px","--radix-collapsible-content-width":"400px"}} hidden>
                        <div className="flex flex-col gap-y-1.5">
                          <div className="flex flex-col pb-2.5">
                            <ul className="flex flex-col gap-y-0.5">
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Support"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/help">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-92c5495dff.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-6ec67b0a44.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Help center"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Learn more about Joshuattio’s features"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/help/academy">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-11dd21c6cd.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-33828be2bf.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Academy"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Essential Joshuattio features explained"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Developers"}
                                </p>
                              </li>
                              <li>
                                <a href="/" className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-daac881a42.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-fc307eb550.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Developer docs"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Start building Joshuattio apps"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Partners"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default rounded-xl text-base has-[>svg:last-child,>img:last-child]:pr-2.5 has-[>svg:first-child,>img:first-child]:pl-2.5 button-ghost group h-fit w-full items-center justify-start gap-x-3 p-1.5 md:p-2 !px-1" href="/partners">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[13px] border border-subtle-stroke md:rounded-none md:border-0">
                                    <svg width="40" height="40" fill="none" className="absolute inset-0">
                                      <g className="transition-colors duration-150ms ease-out stroke-white-700/40 group-hover:stroke-white-700/70 dark:stroke-black-500/40 dark:group-hover:stroke-black-500/70" strokeWidth=".7" strokeMiterlimit="10">
                                        <path d="M40 14H0M40 26H0M19.947 0 20 40" strokeDasharray="1.6 1.6" />
                                        <path d="M35 0v40M5 0v40M0 5h40M0 35h40" />
                                      </g>
                                    </svg>
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate size-10 dark:hidden" src="/img/img-5d7fd69439.svg" style={{"color":"transparent"}} />
                                    <img alt="" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="isolate hidden size-10 dark:block" src="/img/img-f427ee5ba8.svg" style={{"color":"transparent"}} />
                                  </div>
                                  <div className="flex w-full min-w-0 flex-col pr-2">
                                    <div className="flex w-full items-baseline justify-between gap-1.5 text-primary-foreground">
                                      <span className="truncate text-sm">
                                        {"Partner programs"}
                                      </span>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative shrink-0 text-secondary-foreground opacity-0 max-lg:hidden -translate-x-0.25 transition-[opacity,translate] duration-400 ease-in-out group-hover:translate-0 group-hover:opacity-100 group-hover:duration-300 group-active:translate-0 group-active:opacity-100 group-active:duration-50">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <p className="truncate text-accent-foreground text-sm">
                                      {"Developers, creators, consultants"}
                                    </p>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                          <hr className="mb-2 border-weak-stroke" />
                          <div className="flex flex-col pb-2.5">
                            <ul className="flex flex-col gap-y-0.5">
                              <li>
                                <p className="mt-3.5 mb-2 px-2 text-overline">
                                  {"Company"}
                                </p>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/changelog">
                                  {"Changelog"}
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/blog">
                                  {"Announcements"}
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/engineering/blog">
                                  {"Engineering blog"}
                                </a>
                              </li>
                              <li>
                                <a className="relative inline-flex cursor-pointer items-center text-nowrap border transition-colors duration-400 ease-in-out hover:duration-150 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost !text-sm mt-1 w-full justify-start whitespace-nowrap text-primary-foreground" href="/careers">
                                  {"Careers"}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-subtle-stroke border-b pt-2.5 pb-[9px]">
                      <a className="inline-block w-full py-1.5 pr-0.5 pl-1.5 text-secondary-foreground" href="/customers">
                        {"Customers"}
                      </a>
                    </div>
                    <div className="border-subtle-stroke border-b pt-2.5 pb-[9px]">
                      <a className="inline-block w-full py-1.5 pr-0.5 pl-1.5 text-secondary-foreground" href="/pricing">
                        {"Pricing"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hp" />
            <HeaderBehavior />
          </div>
  );
}
