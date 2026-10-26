import type { ProjectId } from "./projects";
import type { SiteLocale } from "./site";
// Verified release milestone: 5ac272d introduced these three editions on Oct 2.
export function editionDate(date: string, locale?: SiteLocale) {
  return locale && !["zh", "en"].includes(locale) ? [date, "2026-10-02"].sort().at(-1)! : date;
}
// Editorial dates, never build/deploy clocks. Change only the page actually edited.
export const PROJECT_CONTENT_DATES: Record<ProjectId, string> = {
  tsc: "2026-10-26",
  mds: "2026-10-26",
  bnt: "2026-10-26",
  csd: "2026-10-26",
  erg: "2026-10-26",
  zeph: "2026-10-26",
  btc: "2026-10-26",
  ethw: "2026-10-26",
  prl: "2026-10-26",
  xmr: "2026-10-26",
  etc: "2026-10-26",
  rvn: "2026-10-26",
  zec: "2026-10-26",
  kas: "2026-10-26",
  iota: "2026-10-26",
  xid: "2026-10-26",
  quantus: "2026-10-26",
  flyai: "2026-10-26",
  nosana: "2026-10-26",
  gonka: "2026-10-26",
  akash: "2026-10-26",
  ionet: "2026-10-26",
  vast: "2026-10-26",
  noid: "2026-10-26",
  acurast: "2026-10-26",
  golem: "2026-10-26",
};
export const PROJECT_INDEX_UPDATED = "2026-10-26";
