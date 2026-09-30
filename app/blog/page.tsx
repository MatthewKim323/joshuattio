import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { WhatAiCanT } from "@/components/pages/blog/00-what-ai-can-t";
import { Divider } from "@/components/pages/blog/01-divider";
import { LatestArticles } from "@/components/pages/blog/02-latest-articles";
import { Divider3 } from "@/components/pages/blog/03-divider-3";
import { Block } from "@/components/pages/blog/04-block";

export const metadata: Metadata = {
  title: "Insights & updates | Joshuattio Blog",
  description: "Learn more about Joshuattio, CRM, and GTM from members of our team and industry-leading experts.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "what-ai-can-t": WhatAiCanT,
  "divider": Divider,
  "latest-articles": LatestArticles,
  "divider-3": Divider3,
  "block": Block,
} as const;

export default async function Page({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const only = params.only;
  const category = typeof params.category === "string" ? params.category : "All";
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main>{pick === "latest-articles" ? <LatestArticles category={category} /> : <One />}</main>;
  }
  return (
    <SiteShell>
      <>
        {Object.entries(SECTIONS).map(([name, S]) =>
          name === "latest-articles" ? <LatestArticles key={name} category={category} /> : <S key={name} />,
        )}
      </>
    </SiteShell>
  );
}
