import { DesktopNav } from "@/components/shell/desktop-nav";
import { HeaderShell } from "@/components/shell/header-shell";
import { MenuButton, MobileMenu } from "@/components/shell/mobile-menu";
import { SiteBanner } from "@/components/shell/site-banner";
import { Wordmark } from "@/components/shell/wordmark";

const ACTION_CLASS =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[>svg:last-child,>img:last-child]:pr-2 has-[>svg:first-child,>img:first-child]:pl-2";

export function Header() {
  return (
    <HeaderShell>
      <header className="border-subtle-stroke border-b bg-primary-background/95 transition-colors duration-250 dark:bg-primary-background">
        <div className="absolute inset-0 -z-1 backdrop-blur-md" />
        <SiteBanner uid="5e29c92a-9b3f-4305-8d65-dbaf47061b05" title="Orchestrate revenue agents with Workflows" href="/platform/workflows" />
        <div className="container">
          <nav className="pt-2 pb-[7px] lg:pt-4 lg:pb-[15px]">
            <div className="flex items-center justify-between">
              <div className="flex grow items-center gap-x-9">
                <a className="-mx-1 -my-2 rounded-xl px-1 py-2" aria-label="Joshuattio homepage" referrerPolicy="same-origin" style={{ WebkitTouchCallout: "none" }} href="/">
                  <Wordmark className="h-6 text-primary-foreground" />
                </a>
                <DesktopNav />
              </div>
              <MenuButton />
              <div className="hidden gap-x-2.5 lg:flex">
                <div className="contents signed-in:hidden">
                  <a className={`${ACTION_CLASS} button-outline`} href="#">
                    {"Sign in"}
                  </a>
                </div>
                <div className="contents signed-in:hidden">
                  <a className={`${ACTION_CLASS} button-primary`} href="#">
                    {"Start for free"}
                  </a>
                </div>
                <div className="contents signed-out:hidden">
                  <a className={`${ACTION_CLASS} button-outline`} href="#">
                    {"Open Joshuattio"}
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <MobileMenu />
    </HeaderShell>
  );
}
