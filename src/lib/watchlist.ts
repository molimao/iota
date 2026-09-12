import { z } from "zod";

import { isValidMinerId } from "./ss58";

export const WATCHLIST_KEY = "iota-watchlist-v1";
export const TELEMETRY_KEY = "iota-telemetry-cache-v1";
export const TELEMETRY_MAX_BYTES = 256 * 1024;
export const TELEMETRY_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const entrySchema = z.object({
  hotkey: z.string().refine(isValidMinerId, "Miner ID 无效"),
  label: z.string().min(1).max(40),
  addedAt: z.number().int().positive(),
});

export type WatchEntry = z.infer<typeof entrySchema>;

const storedSchema = z.object({
  version: z.literal(1),
  devices: z.array(entrySchema),
});

export const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.number().int().positive().optional(),
  devices: z.array(
    z.object({
      hotkey: z.string(),
      label: z.string().optional(),
      addedAt: z.number().optional(),
    }),
  ),
});

export type StorageOutcome<T> = { ok: true; value: T } | { ok: false; error: string };

function storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function parseWatchlist(raw: string | null): StorageOutcome<WatchEntry[]> {
  if (!raw) return { ok: true, value: [] };
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "本地保存的设备清单格式损坏，已忽略。可以重新添加或导入备份。" };
  }
  const parsed = storedSchema.safeParse(json);
  if (!parsed.success) {
    const loose = z.object({ devices: z.array(z.unknown()) }).safeParse(json);
    if (loose.success) {
      const kept: WatchEntry[] = [];
      for (const item of loose.data.devices) {
        const entry = entrySchema.safeParse(item);
        if (entry.success && !kept.some((k) => k.hotkey === entry.data.hotkey))
          kept.push(entry.data);
      }
      if (kept.length > 0) return { ok: true, value: kept };
    }
    return { ok: false, error: "本地保存的设备清单不符合格式要求，已忽略。" };
  }
  const deduped: WatchEntry[] = [];
  for (const entry of parsed.data.devices) {
    if (!deduped.some((item) => item.hotkey === entry.hotkey)) deduped.push(entry);
  }
  return { ok: true, value: deduped };
}

export function loadWatchlist(): StorageOutcome<WatchEntry[]> {
  const store = storage();
  if (!store) return { ok: false, error: "此浏览器不允许本地存储，设备清单无法保存。" };
  try {
    return parseWatchlist(store.getItem(WATCHLIST_KEY));
  } catch {
    return { ok: false, error: "读取本地设备清单失败。" };
  }
}

export function saveWatchlist(devices: WatchEntry[]): StorageOutcome<true> {
  const store = storage();
  if (!store) return { ok: false, error: "此浏览器不允许本地存储，改动无法保存。" };
  try {
    store.setItem(
      WATCHLIST_KEY,
      JSON.stringify({ version: 1, devices } satisfies z.infer<typeof storedSchema>),
    );
    return { ok: true, value: true };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    return {
      ok: false,
      error:
        name === "QuotaExceededError"
          ? "浏览器存储空间已满，改动没能保存。"
          : "写入本地存储失败，改动没能保存（可能处于隐私模式）。",
    };
  }
}

export function addEntry(
  devices: WatchEntry[],
  input: { hotkey: string; label: string },
): StorageOutcome<WatchEntry[]> {
  const hotkey = input.hotkey.trim();
  const label = input.label.trim();
  if (!label) return { ok: false, error: "请填写设备名称" };
  if (label.length > 40) return { ok: false, error: "设备名称最多 40 个字" };
  if (!isValidMinerId(hotkey)) return { ok: false, error: "Miner ID 无效" };
  if (devices.some((device) => device.hotkey === hotkey)) {
    return { ok: false, error: "这个 Miner ID 已经添加过了" };
  }
  return { ok: true, value: [...devices, { hotkey, label, addedAt: Date.now() }] };
}

export function renameEntry(
  devices: WatchEntry[],
  hotkey: string,
  label: string,
): StorageOutcome<WatchEntry[]> {
  const next = label.trim();
  if (!next) return { ok: false, error: "请填写设备名称" };
  if (next.length > 40) return { ok: false, error: "设备名称最多 40 个字" };
  if (!devices.some((device) => device.hotkey === hotkey)) {
    return { ok: false, error: "找不到这台设备" };
  }
  return {
    ok: true,
    value: devices.map((device) =>
      device.hotkey === hotkey ? { ...device, label: next } : device,
    ),
  };
}

export function removeEntry(devices: WatchEntry[], hotkey: string): WatchEntry[] {
  return devices.filter((device) => device.hotkey !== hotkey);
}

export function serializeExport(devices: WatchEntry[]): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: Date.now(),
      devices: devices.map(({ hotkey, label, addedAt }) => ({ hotkey, label, addedAt })),
    },
    null,
    2,
  );
}

export type ImportReport = {
  devices: WatchEntry[];
  added: number;
  duplicates: number;
  invalid: number;
};

export function importDevices(existing: WatchEntry[], raw: string): StorageOutcome<ImportReport> {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "文件不是有效的 JSON" };
  }
  const parsed = exportSchema.safeParse(json);
  if (!parsed.success) return { ok: false, error: "文件格式不符合导入要求" };

  const devices = [...existing];
  let added = 0;
  let duplicates = 0;
  let invalid = 0;

  parsed.data.devices.forEach((item, index) => {
    const hotkey = typeof item.hotkey === "string" ? item.hotkey.trim() : "";
    if (!isValidMinerId(hotkey)) {
      invalid += 1;
      return;
    }
    if (devices.some((device) => device.hotkey === hotkey)) {
      duplicates += 1;
      return;
    }
    const label = (item.label ?? "").trim().slice(0, 40) || `设备 ${devices.length + 1}`;
    const addedAt =
      typeof item.addedAt === "number" && Number.isFinite(item.addedAt) && item.addedAt > 0
        ? Math.floor(item.addedAt)
        : Date.now() + index;
    devices.push({ hotkey, label, addedAt });
    added += 1;
  });

  return { ok: true, value: { devices, added, duplicates, invalid } };
}

/* ---------- timestamped, size-bounded telemetry cache (never "fresh") ---------- */

export type TelemetryCache<T> = { savedAt: number; payload: T };

export function readTelemetryCache<T>(): TelemetryCache<T> | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(TELEMETRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TelemetryCache<T>;
    if (
      typeof parsed?.savedAt !== "number" ||
      !Number.isFinite(parsed.savedAt) ||
      parsed.savedAt > Date.now() ||
      !parsed.payload ||
      raw.length > TELEMETRY_MAX_BYTES
    )
      return null;
    if (Date.now() - parsed.savedAt > TELEMETRY_MAX_AGE_MS) {
      store.removeItem(TELEMETRY_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeTelemetryCache<T>(payload: T): void {
  const store = storage();
  if (!store) return;
  try {
    const serialized = JSON.stringify({ savedAt: Date.now(), payload } satisfies TelemetryCache<T>);
    if (serialized.length > TELEMETRY_MAX_BYTES) {
      store.removeItem(TELEMETRY_KEY);
      return;
    }
    store.setItem(TELEMETRY_KEY, serialized);
  } catch {
    /* caching is best-effort only */
  }
}
