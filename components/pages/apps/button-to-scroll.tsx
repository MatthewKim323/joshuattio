"use client";

import type { ComponentProps } from "react";
import { scrollToElementWithId } from "@/components/pages/apps/detail/scroll-to";

/** A button that smooth-scrolls to `scrollTargetId` (and optionally writes the hash). */
export function ButtonToScroll({
  scrollTargetId,
  updateAddress,
  ...props
}: ComponentProps<"button"> & { scrollTargetId: string; updateAddress?: boolean }) {
  return <button {...props} onClick={() => scrollToElementWithId(scrollTargetId, updateAddress)} />;
}
