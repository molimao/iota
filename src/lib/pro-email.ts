import { statusAlertCopy as alertCopy } from "./status-alert-copy";
import type { AlertReason } from "./pro-alerts.server";
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
  event: { name: string; project: ProjectId; identifier: string; reason?: AlertReason | undefined },
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
  const reason = alertCopy[event.reason ?? "unknown"][locale];
  const next = (event.project === "iota" ? alertCopy.iotaSteps : alertCopy.platformSteps)[locale];
  const shortId = event.identifier.length > 22
    ? event.identifier.slice(0, 8) + "…" + event.identifier.slice(-6)
    : event.identifier;
  const title = event.name + " · " + c.alertsSubject[locale];
  return emailShell(
    locale,
    title,
    `<p style="color:#666">${e(project)} · ID ${e(shortId)}</p><h2 style="font-size:20px;line-height:1.5">${e(reason)}</h2><p style="line-height:1.7">${e(alertCopy.context[locale])}</p><p style="color:#666;font-size:13px">${e(alertCopy.since[locale])}: ${e(at)} · UTC+8</p><div style="margin-top:24px;border-top:1px solid #ddd;padding-top:16px"><h2 style="font-size:17px">${e(alertCopy.next[locale])}</h2><p style="line-height:1.7">${e(next)}</p></div>`,
    `${event.name} · ${project} · ID ${shortId}\n${reason}\n${alertCopy.context[locale]}\n${alertCopy.since[locale]}: ${at} UTC+8\n\n${alertCopy.next[locale]}\n${next}`,
    unsub,
  );
}
