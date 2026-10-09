import type { ProjectId } from "./projects";
import type { SiteLocale } from "./site";
// Verified release milestone: 5ac272d introduced these three editions on Oct 2.
export function editionDate(date: string, locale?: SiteLocale) {
  return locale && !["zh", "en"].includes(locale) ? [date, "2026-10-02"].sort().at(-1)! : date;
}
// Editorial dates, never build/deploy clocks. Change only the page actually edited.
export const PROJECT_CONTENT_DATES: Record<ProjectId, string> = {
  iota: "2026-10-09",
  xid: "2026-10-09",
  quantus: "2026-10-09",
  flyai: "2026-10-09",
  nosana: "2026-10-09",
  gonka: "2026-10-09",
  akash: "2026-10-09",
  ionet: "2026-10-09",
  vast: "2026-10-09",
  golem: "2026-10-09",
};
export const PROJECT_INDEX_UPDATED = "2026-10-09";
