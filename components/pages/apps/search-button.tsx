"use client";

import { useSearchModal } from "@/components/pages/apps/detail/search-modal";

/** The "Search..." field under the directory header: opens the app search dialog. */
export function AppsSearchButton() {
  const { openSearchModal } = useSearchModal();
  return (
    <button className="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-11.5 gap-x-2 rounded-xl px-3.5 has-[>svg:last-child,>img:last-child]:pr-3 has-[>svg:first-child,>img:first-child]:pl-3 button-outline text-sm shadow-joshuattio-3 w-full min-w-80 max-w-80" onClick={() => openSearchModal()}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-accent-foreground">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="m15.8 15.8-3.62-3.62M1.8 7.833a6.034 6.034 0 1 1 12.069 0 6.034 6.034 0 0 1-12.07 0Z" />
                  </svg>
                  <p className="w-full truncate text-left text-accent-foreground">
                    {"Search…"}
                  </p>
                  <p className="text-caption-foreground text-xs tracking-wider" aria-hidden="true">
                    {"⌘K"}
                  </p>
    </button>
  );
}
