export { NAV, ICONS, DESCRIPTIONS } from "./config";
export type { NavItem, NavGroup } from "./config";

import { NAV } from "./config";

export function titleFor(slug: string): string {
  for (const g of NAV) {
    for (const it of g.items) {
      if (it.slug === slug) return it.title;
    }
  }
  return slug;
}

export function groupFor(slug: string) {
  return NAV.find((g) => g.items.some((it) => it.slug === slug));
}

export function allSlugs(): string[] {
  return NAV.flatMap((g) => g.items.map((it) => it.slug));
}
