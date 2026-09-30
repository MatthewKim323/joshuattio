type ClassValue = string | number | false | null | undefined | Record<string, unknown> | ClassValue[];

/** Joins class names (strings, arrays and `{ class: condition }` maps), skipping falsy values. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else {
      for (const k of Object.keys(v)) if (v[k]) out.push(k);
    }
  };
  values.forEach(walk);
  return out.join(" ");
}
