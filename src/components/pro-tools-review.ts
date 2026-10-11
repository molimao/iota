import { buildDeviceSnapshots } from "@/lib/device-history";
import { aggregateDailyReport, reportDayWindow } from "@/lib/daily-report";
import { validateBulkRows, type BulkRow } from "@/lib/pro-tools";
import { parseFleet, canLinkProject, type FleetDevice } from "@/lib/fleet";
import type { SiteLocale } from "@/lib/site";
export function reviewProHistory(locale: SiteLocale) {
  const today = new Date(Date.now() + 28800000).toISOString().slice(0, 10);
  const end = Date.parse(today + "T00:00:00+08:00");
  return Array.from({ length: 45 }, (_, i) => {
    const at = end - (45 - i) * 86400000;
    const w = reportDayWindow(new Date(at + 28800000).toISOString().slice(0, 10));
    return aggregateDailyReport(
      w,
      [
        {
          project: "iota",
          resource: "demo",
          units: String(Math.round((0.4 + Math.sin(i / 4) * 0.15) * 1e8)),
          decimals: 8,
          currency: "IOTA",
          usd: i === 11 || i === 25 ? null : 2.5 + Math.sin(i / 4) * 0.8,
        },
        {
          project: "quantus",
          resource: "demo",
          units: i % 9 === 0 ? null : String((100 + i) * 1e12),
          decimals: 12,
          currency: "QUAN",
          usd: null,
          ...(i % 9 === 0 ? { reason: "unavailable" as const } : {}),
        },
      ],
      locale,
      2,
      at + 86400000 + 5400000,
    );
  });
}
export function applyReviewBulk(rows: BulkRow[], devices: FleetDevice[]) {
  validateBulkRows(rows, devices);
  const next = structuredClone(devices);
  const ids = new Map<string, string>();
  for (const r of rows) {
    let id = r.device_id || ids.get(r.device_key);
    if (!id) {
      id = crypto.randomUUID();
      ids.set(r.device_key, id);
      next.push({ id, name: r.name, hardware: r.hardware, createdAt: Date.now(), bindings: [] });
    }
    const d = next.find((d) => d.id === id)!;
    if (!r.project) {
      d.name = r.name;
      d.hardware = r.hardware;
    } else {
      if (!canLinkProject(next, id, r.project, 50)) throw new Error("project_device_limit_reached");
      d.bindings.push({
        id: crypto.randomUUID(),
        project: r.project,
        identifier: r.identifier,
        worker: r.worker,
      });
    }
  }
  if (next.some((d) => d.bindings.length > 12)) throw new Error("binding_limit");
  return next;
}

export function reviewDeviceHistory(locale: SiteLocale, device: FleetDevice) {
  return reviewProHistory(locale).map((d) => {
    const readings = device.bindings.map((b) => {
      const iota = d.projects.find((p) => p.project === "iota");
      const total = Math.round(Number(iota?.amount ?? 0) * 1e8);
      const part = Math.floor(total * 0.48);
      const units =
        b.id === "studio-iota" || b.id === "gpu-iota"
          ? part
          : b.id === "laptop-iota"
            ? total - 2 * part
            : null;
      const quantus = d.projects.find((p) => p.project === "quantus");
      const quanTotal = quantus?.amount === null || !quantus ? null : Number(quantus.amount) * 1e12;
      const quanPart =
        quanTotal === null
          ? null
          : b.id === "gpu-quantus"
            ? Math.floor(quanTotal * 0.3)
            : b.id === "node-quantus"
              ? quanTotal - Math.floor(quanTotal * 0.3)
              : null;
      return {
        project: b.project,
        resource: b.identifier,
        units:
          b.project === "iota" && units !== null
            ? String(units)
            : b.project === "quantus" && quanPart !== null
              ? String(quanPart)
              : null,
        decimals: b.project === "quantus" ? 12 : 8,
        currency:
          b.project === "quantus"
            ? "QUAN"
            : b.project === "iota"
              ? "IOTA"
              : b.project.toUpperCase(),
        usd:
          b.project === "iota" &&
          units !== null &&
          iota?.usd !== null &&
          iota?.usd !== undefined &&
          total > 0
            ? (iota.usd * units) / total
            : null,
        ...(!["iota", "quantus"].includes(b.project) ? { reason: "unsupported" as const } : {}),
      };
    });
    const snapshot = buildDeviceSnapshots(
      d.day,
      device.bindings.map((b) => ({ ...b, device: device.id })),
      readings,
      locale,
      Date.parse(d.generatedAt),
    )[0];
    if (!snapshot)
      return {
        report: { ...d, projects: [], usdSubtotal: null, partial: true },
        deviceReport: { ...d, projects: [], usdSubtotal: null, partial: true },
        walletProjects: [],
      };
    return snapshot;
  });
}
