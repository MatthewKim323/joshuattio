import { Header } from "@/components/sections/00-header";
import { Footer } from "@/components/sections/16-footer";
import { CookieBanner } from "@/components/shell/cookie-banner";

/** Page frame shared by every route: sticky header, main, footer. */
/** `bare` renders children straight into the frame, for templates that lay out their own <main> and siblings. */
export function SiteShell({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) {
  return (
    <>
      <div className="flex min-h-screen max-w-screen flex-col justify-between overflow-x-clip">
        <Header />
        {bare ? children : <main>{children}</main>}
        <Footer />
      </div>
      <CookieBanner />
    </>
  );
}
