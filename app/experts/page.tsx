import type { Metadata } from "next";
import { ExpertsHeader } from "@/components/pages/experts/header";
import { ExpertsHero } from "@/components/pages/experts/hero";
import { ExpertsDirectory } from "@/components/pages/experts/directory";
import { ExpertsApply } from "@/components/pages/experts/apply";
import { ExpertsFooter } from "@/components/pages/experts/footer";
import "@/components/pages/experts/experts.css";
import "@/components/pages/experts/directory.css";

export const metadata: Metadata = {
  title: "Hire an expert | Joshuattio",
  description: "Supercharge your go-to-market motion by working with an Joshuattio Expert. Get hands-on guidance to unlock your team's full potential.",
};

// The directory page has its own frame (header, hero, footer) around the expert directory, all scoped under .xp-root.
// `?only=<name>` renders one block inside the scope without the frame.
const SECTIONS = {
  hero: ExpertsHero,
  directory: ExpertsDirectory,
  apply: ExpertsApply,
  footer: ExpertsFooter,
} as const;

export default async function Page({ searchParams }: PageProps<"/experts">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return (
      <div className="xp-root">
        <One />
      </div>
    );
  }
  return (
    <div className="xp-root">
      <div id="__nuxt">
        <div id="__layout">
          <div>
            <ExpertsHeader />{" "}
            <ExpertsHero />{" "}
            <ExpertsDirectory />{" "}
            <ExpertsApply />{" "}
            <ExpertsFooter />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
