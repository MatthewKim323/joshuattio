import type { Metadata } from "next";
import { Header } from "@/components/sections/00-header";
import { CookieBanner } from "@/components/shell/cookie-banner";
import { RedefinePage } from "@/components/pages/redefine/redefine-page";

export const metadata: Metadata = {
  title: "Redefining CRM | Joshuattio",
  description: "Customer relationship magic: A CRM that works for you, not the other way around.",
};

// Campaign template: header, content and consent sit straight in <body>, with no page frame and no footer.
const SECTIONS = {
  "customer-relationship-magic": RedefinePage,
} as const;

export default async function Page({ searchParams }: PageProps<"/redefine">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <>
      <Header />
      <RedefinePage />
      <CookieBanner />
    </>
  );
}
