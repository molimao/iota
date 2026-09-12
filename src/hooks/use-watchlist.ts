import { useCallback, useEffect, useState } from "react";

import {
  addEntry,
  importDevices,
  loadWatchlist,
  removeEntry,
  renameEntry,
  saveWatchlist,
  serializeExport,
  type ImportReport,
  type WatchEntry,
} from "@/lib/watchlist";

export function useWatchlist() {
  const [devices, setDevices] = useState<WatchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const result = loadWatchlist();
    if (result.ok) setDevices(result.value);
    else setStorageError(result.error);
    setLoaded(true);
  }, []);

  const commit = useCallback((next: WatchEntry[]) => {
    const saved = saveWatchlist(next);
    setStorageError(saved.ok ? null : saved.error);
    if (saved.ok) setDevices(next);
    return saved.ok;
  }, []);

  const add = useCallback(
    (input: { hotkey: string; label: string }): { ok: boolean; error?: string } => {
      const result = addEntry(devices, input);
      if (!result.ok) return { ok: false, error: result.error };
      return commit(result.value)
        ? { ok: true }
        : { ok: false, error: "浏览器未能保存，请检查存储权限。" };
    },
    [devices, commit],
  );

  const rename = useCallback(
    (hotkey: string, label: string): { ok: boolean; error?: string } => {
      const result = renameEntry(devices, hotkey, label);
      if (!result.ok) return { ok: false, error: result.error };
      return commit(result.value)
        ? { ok: true }
        : { ok: false, error: "浏览器未能保存，请检查存储权限。" };
    },
    [devices, commit],
  );

  const remove = useCallback(
    (hotkey: string) => {
      commit(removeEntry(devices, hotkey));
    },
    [devices, commit],
  );

  const importJson = useCallback(
    (raw: string): { ok: boolean; error?: string; report?: ImportReport } => {
      const result = importDevices(devices, raw);
      if (!result.ok) return { ok: false, error: result.error };
      return commit(result.value.devices)
        ? { ok: true, report: result.value }
        : { ok: false, error: "浏览器未能保存导入清单。" };
    },
    [devices, commit],
  );

  const exportJson = useCallback(() => serializeExport(devices), [devices]);

  return { devices, loaded, storageError, add, rename, remove, importJson, exportJson };
}
