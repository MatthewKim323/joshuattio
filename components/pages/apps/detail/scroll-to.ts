/** Smooth-scroll to an element by id, optionally writing `#id` into the address bar. */
export function scrollToElementWithId(id: string, updateAddress?: boolean) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with ID "${id}" not found`);
    return;
  }
  if (updateAddress) window.history.replaceState(null, "", `#${id}`);
  el.scrollIntoView({ behavior: "smooth" });
}
