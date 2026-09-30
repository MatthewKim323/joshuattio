import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { PrivacyPolicy } from "@/components/pages/legal/privacy/00-privacy-policy";
import { Block } from "@/components/pages/legal/privacy/01-block";
import { Block2 } from "@/components/pages/legal/privacy/02-block-2";
import { S1Introduction } from "@/components/pages/legal/privacy/03-1-introduction";

export const metadata: Metadata = {
  title: "Privacy Policy | Joshuattio",
  description: "We are committed to providing an environment that is safe, secure, and available to all of our customers all the time.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "privacy-policy": PrivacyPolicy,
  "block": Block,
  "block-2": Block2,
  "1-introduction": S1Introduction,
} as const;

export default async function Page({ searchParams }: PageProps<"/legal/privacy">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell bare>
      <main className="container pt-10 pb-20 lg:pt-32 xl:pt-40 xl:pb-40">
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </main>
    </SiteShell>
  );
}
