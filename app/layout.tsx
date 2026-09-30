import type { Metadata } from "next";
import "./site.css";
import "./fonts.css";
import { ScrollState } from "@/components/scroll-state";

export const metadata: Metadata = {
  title: "Joshuattio: The CRM for agentic revenue",
  description: "Joshuattio is the CRM that builds pipeline, advances deals, and grows accounts around the clock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="inter_4a995166-module__F0d0Tq__variable interdisplay_ab4bf036-module__f38q6G__variable tiempostext_f5e22e8b-module__4u-Eba__variable jetbrains_mono_80e6829-module__gijXjG__variable font-sans text-base text-primary-foreground antialiased data-[scrolled=true]:bg-(--color-overscroll-bottom) data-[scrolled=false]:bg-(--color-overscroll-top) light"
      style={{ colorScheme: "light" }}
      data-scrolled="false"
      suppressHydrationWarning
    >
      <body className="bg-(--color-page-background) [&_*[id]]:scroll-mt-[calc(var(--site-header-height)+24px)] [&_*[id]]:scroll-mb-6">
        <ScrollState />
        {children}
      </body>
    </html>
  );
}
