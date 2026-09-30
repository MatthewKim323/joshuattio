"use client";
import { useRef, type ComponentProps } from "react";
import { useHeaderDarkSection } from "@/components/shell/header-shell";

/** CTA section wrapper: turns the header dark while it sits under it. */
export function CtaSection(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  useHeaderDarkSection(ref);
  return <section ref={ref} data-header-dark-managed="" {...props} />;
}
