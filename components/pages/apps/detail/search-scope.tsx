"use client";

import { SearchModalProvider } from "@/components/pages/apps/detail/search-modal";
import { AppsSearch } from "@/components/pages/apps/detail/apps-search";
import { OfficialBadgeTooltips } from "@/components/pages/apps/detail/official-badge";

/**
 * App-route behavior shared by the directory and every app page: search dialog state (with its
 * backdrop rendered after the page content, Cmd/Ctrl+K) and the "Official app" badge tooltips.
 */
export function AppsSearchScope({ children, backdrop = true }: { children: React.ReactNode; backdrop?: boolean }) {
  return (
    <SearchModalProvider>
      {children}
      {backdrop ? <AppsSearch /> : null}
      <OfficialBadgeTooltips />
    </SearchModalProvider>
  );
}
