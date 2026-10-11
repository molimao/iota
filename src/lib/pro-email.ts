import { escapeEmail } from "./daily-report-email";
import { summarizeMonth } from "./pro-tools";
import { proCopy } from "@/components/pro-tools-copy";
import { ORIGIN, LANGUAGE_TAG, type SiteLocale } from "./site";
import { PROJECTS, type ProjectId } from "./projects";
const usd = (n: number | null) =>
  n === null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
function emailShell(locale: SiteLocale, title: string, body: string, plain: string, unsub: string) {
  const url = new URL(unsub);
  if (
    url.origin !== ORIGIN ||
    url.pathname !== "/api/pro/unsubscribe" ||
    url.username ||
    url.password
  )
    throw new Error("invalid_unsubscribe_url");
  const e = escapeEmail,
    view = ORIGIN + "/" + locale + "/devices";
  return {
    subject: "IOTA Watch · " + title,
    text: `${title}\n\n${plain}\n\n${proCopy.view[locale]}: ${view}\n${proCopy.unsubscribe[locale]}: ${unsub}`,
    html: `<!doctype html><html lang="${LANGUAGE_TAG[locale]}"><meta charset="utf-8"><body style="margin:0;background:#f3f3f3;color:#171717;font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;padding:36px 24px"><p style="font-size:12px;letter-spacing:2px">IOTA WATCH / PRO</p><h1 style="font-size:25px">${e(title)}</h1>${body}<p style="margin-top:30px"><a href="${e(view)}" style="display:inline-block;background:#171717;color:white;text-decoration:none;padding:13px 20px;border-radius:8px">${e(proCopy.view[locale])}</a></p><p style="font-size:12px;color:#666"><a href="${e(unsub)}" style="color:#666">${e(proCopy.unsubscribe[locale])}</a></p></div></body></html>`,
  };
}
export function renderMonthlyReport(
  report: ReturnType<typeof summarizeMonth>,
  locale: SiteLocale,
  unsub: string,
) {
  const e = escapeEmail,
    c = proCopy,
    title = c.monthly[locale] + " · " + report.month;
  const detail = report.projects
    .map(
      (p) =>
        `${p.name}: ${p.amount ?? "—"} ${p.currency} · ${usd(p.usd)}${p.partial ? " · " + c.partial[locale] : ""}`,
    )
    .join("\n");
  const rows = report.projects
    .map(
      (p) =>
        `<tr><td style="padding:14px 0;border-bottom:1px solid #ddd">${e(p.name)}<br><small style="color:#666">${p.days}/${report.expected} ${e(c.coverage[locale])}</small></td><td style="padding:14px 0;text-align:right;border-bottom:1px solid #ddd">${e(p.amount ?? "—")} ${e(p.currency)}<br><small>${e(usd(p.usd))}${p.partial ? " · " + e(c.partial[locale]) : ""}</small></td></tr>`,
    )
    .join("");
  return emailShell(
    locale,
    title,
    `<p style="color:#666">${e(c.knownUsd[locale])}</p><strong style="font-size:42px">${e(usd(report.usdSubtotal))}</strong><p>${report.days}/${report.expected} ${e(c.coverage[locale])}${report.partial ? " · " + e(c.partial[locale]) : ""}</p><table style="width:100%;border-collapse:collapse">${rows}</table><p style="font-size:12px;color:#666;line-height:1.7">${e(c.historyNote[locale])}</p>`,
    `${c.knownUsd[locale]}: ${usd(report.usdSubtotal)}\n${report.days}/${report.expected} ${c.coverage[locale]}\n${detail}\n${c.historyNote[locale]}`,
    unsub,
  );
}
export function renderStatusAlert(
  event: { name: string; project: ProjectId; identifier: string },
  since: string,
  locale: SiteLocale,
  unsub: string,
) {
  const e = escapeEmail,
    c = proCopy,
    project = PROJECTS[event.project].name;
  const at = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Shanghai",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(since));
  return emailShell(
    locale,
    c.alertsSubject[locale],
    `<p style="line-height:1.8">${e(c.alertBody[locale])}</p><div style="padding:24px 0;border-top:1px solid #ccc;border-bottom:1px solid #ccc"><h2>${e(event.name)}</h2><p>${e(project)}</p><p style="font-family:monospace;word-break:break-all">${e(event.identifier)}</p><small>${e(at)} · UTC+8</small></div>`,
    `${c.alertBody[locale]}\n${event.name} · ${project}\n${event.identifier}\n${at} UTC+8`,
    unsub,
  );
}
