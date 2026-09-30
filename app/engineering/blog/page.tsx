import type { Metadata } from "next";
import { ForceDark } from "@/components/pages/engineering/blog/force-dark";
import { SiteShell } from "@/components/shell/site-shell";
import { JoshuattioEngineeringBlog } from "@/components/pages/engineering/blog/00-joshuattio-engineering-blog";
import { LatestArticles } from "@/components/pages/engineering/blog/01-latest-articles";
import { ReadyToRedefineThe } from "@/components/pages/engineering/blog/02-ready-to-redefine-the";

export const metadata: Metadata = {
  title: "Engineering Blog | Joshuattio",
  description: "How our engineering team builds the infrastructure, systems, and interfaces on our mission to redefine CRM.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "joshuattio-engineering-blog": JoshuattioEngineeringBlog,
  "latest-articles": LatestArticles,
  "ready-to-redefine-the": ReadyToRedefineThe,
} as const;

export default async function Page({ searchParams }: PageProps<"/engineering/blog">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><ForceDark /><One /></main>;
  }
  return (
    <SiteShell>
      <>
        <ForceDark />
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </>
    </SiteShell>
  );
}
