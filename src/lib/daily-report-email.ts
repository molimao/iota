import { reportDayWindow, type DailyReport } from "./daily-report";
import { reportCopy } from "@/components/daily-report-copy";
import { ORIGIN, LANGUAGE_TAG } from "./site";

export const escapeEmail = (v: unknown) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
export function renderDailyReport(report: DailyReport, unsubscribeUrl: string) {
  reportDayWindow(report.day);
  const url = new URL(unsubscribeUrl);
  if (
    url.origin !== ORIGIN ||
    url.username ||
    url.password ||
    url.pathname !== "/api/reports/unsubscribe"
  )
    throw new Error("invalid_unsubscribe_url");
  const l = report.locale,
    c = reportCopy,
    esc = escapeEmail;
  const money = (v: number | null) =>
    v === null
      ? "—"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(v);
  const note = (p: DailyReport["projects"][number]) =>
    p.reason === "unsupported"
      ? c.unsupported[l]
      : p.reason === "different_period"
        ? c.differentPeriod[l]
        : p.reason === "connect_required"
          ? c.connect[l]
          : p.partial
            ? c.partial[l]
            : "";
  const rows = report.projects
    .map(
      (p) =>
        `<tr><td style="padding:18px 12px;border-bottom:1px solid #ededed;vertical-align:top"><b>${esc(p.name)}</b>${note(p) ? `<div style="color:#6b6b6b;font-size:12px;margin-top:5px">${esc(note(p))}</div>` : ""}</td><td style="padding:18px 8px;border-bottom:1px solid #ededed;vertical-align:top;font-weight:600">${esc(p.amount ?? "—")}<div style="font-size:11px;color:#777;font-weight:400">${esc(p.currency)}</div></td><td style="padding:18px 8px;border-bottom:1px solid #ededed;vertical-align:top">${esc(money(p.usd))}</td><td style="padding:18px 8px;border-bottom:1px solid #ededed;vertical-align:top;color:#777;font-size:12px">${p.known}/${p.total}</td></tr>`,
    )
    .join("");
  const priced = report.projects.filter((p) => p.usd !== null && p.usd > 0),
    total = report.usdSubtotal;
  const bars =
    total !== null && total > 0 && priced.length > 1
      ? `<h2 style="font-size:15px;margin:30px 0 16px">${esc(c.known[l])}</h2>${priced.map((p) => `<table role="presentation" width="100%" style="margin:9px 0;border-collapse:collapse"><tr><td width="90" style="font-size:12px">${esc(p.name)}</td><td><table role="presentation" width="100%" style="background:#ededed;border-collapse:collapse"><tr><td width="${Math.max(1, Math.round((p.usd! / total) * 100))}%" height="7" style="background:#222;font-size:1px;line-height:7px">&nbsp;</td><td height="7" style="font-size:1px;line-height:7px">&nbsp;</td></tr></table></td><td width="72" align="right" style="font-size:12px">${esc(money(p.usd))}</td></tr></table>`).join("")}`
      : "";
  const retrieved = new Intl.DateTimeFormat(LANGUAGE_TAG[l], {
    timeZone: "Asia/Shanghai",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(report.generatedAt));
  const quoteAt = report.valuationAt
    ? new Intl.DateTimeFormat(LANGUAGE_TAG[l], {
        timeZone: "Asia/Shanghai",
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(report.valuationAt))
    : null;
  const subject = `IOTA Watch · ${c.yesterday[l]} · ${report.day}`;
  const html = `<!doctype html><html lang="${LANGUAGE_TAG[l]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#fff;color:#202020;font-family:Arial,'Segoe UI',sans-serif"><div style="display:none;max-height:0;overflow:hidden">${esc(report.day)} · ${esc(c.intro[l])}</div><table role="presentation" width="100%" style="border-collapse:collapse;background:#fff"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="100%" style="max-width:620px;border-collapse:collapse"><tr><td style="padding:12px 4px 24px;border-bottom:2px solid #222;font-size:18px;font-weight:700;letter-spacing:-.5px">IOTA Watch <span style="font-size:11px;letter-spacing:1px;color:#777;margin-left:12px">PRO</span></td><td align="right" style="border-bottom:2px solid #222;font-size:12px;color:#777">${esc(report.day)}</td></tr><tr><td colspan="2" style="padding:28px 4px 22px"><h1 style="font-size:23px;font-weight:600;margin:0 0 10px">${esc(c.yesterday[l])}</h1><p style="font-size:13px;color:#666;margin:0">${report.deviceCount} ${esc(c.devices[l])} · ${report.projects.length} ${esc(c.projects[l])}</p></td></tr><tr><td colspan="2" style="background:#f5f5f5;border:1px solid #e9e9e9;border-radius:12px;padding:26px"><div style="font-size:12px;color:#666;margin-bottom:10px">${esc(c.estimate[l])}${report.partial ? ` · ${esc(c.partial[l])}` : ""}</div><strong style="font-size:38px;letter-spacing:-1.5px;font-weight:600">${esc(money(report.usdSubtotal))}</strong><span style="font-size:12px;color:#777;margin-left:8px">USD</span><p style="font-size:12px;color:#777;line-height:1.6;margin:12px 0 0">${esc(c.estimateNote[l])}</p></td></tr><tr><td colspan="2" style="padding-top:24px"><table width="100%" style="border-collapse:collapse;font-size:14px"><thead><tr>${[c.project[l], c.amount[l], c.usd[l], c.coverage[l]].map((h) => `<th align="left" style="padding:12px 8px;font-size:11px;color:#777;font-weight:400;border-bottom:1px solid #ddd">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>${bars}<p style="font-size:12px;color:#777;line-height:1.7;margin:26px 0 0">${esc(c.window[l])}</p><p style="font-size:11px;color:#888;line-height:1.6;margin:8px 0 24px">${esc(c.generated[l])} · ${esc(retrieved)}${quoteAt ? `<br>${esc(c.quoteTime[l])} · ${esc(quoteAt)}` : ""}</p><a href="${ORIGIN}/${l}/devices" style="display:inline-block;background:#222;color:#fff;border-radius:7px;text-decoration:none;padding:13px 20px;font-size:13px">${esc(c.open[l])} →</a></td></tr><tr><td colspan="2" style="padding:28px 4px;margin-top:24px;font-size:11px;color:#888;line-height:1.8">${esc(c.reason[l])}<br><a href="${esc(url.toString())}" style="color:#666;text-decoration:underline">${esc(c.unsubscribe[l])}</a> · <a href="${ORIGIN}/${l}/privacy" style="color:#666;text-decoration:underline">IOTA Watch</a></td></tr></table></td></tr></table></body></html>`;
  const text = [
    subject,
    `${report.deviceCount} ${c.devices[l]} · ${report.projects.length} ${c.projects[l]}`,
    `${c.estimate[l]}: ${money(report.usdSubtotal)} USD`,
    ...report.projects.map(
      (p) =>
        `${p.name}: ${p.amount ?? "—"} ${p.currency} · ${money(p.usd)} USD · ${p.known}/${p.total}${note(p) ? " · " + note(p) : ""}`,
    ),
    c.window[l],
    c.estimateNote[l],
    `${c.generated[l]}: ${retrieved}`,
    ...(quoteAt ? [`${c.quoteTime[l]}: ${quoteAt}`] : []),
    `${c.open[l]}: ${ORIGIN}/${l}/devices`,
    `${c.unsubscribe[l]}: ${url}`,
  ].join("\n\n");
  if (new TextEncoder().encode(html).length > 90000) throw new Error("report_too_large");
  return { subject, html, text };
}
