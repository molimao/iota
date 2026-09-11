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
    setDevices(next);
    const saved = saveWatchlist(next);
    setStorageError(saved.ok ? null : saved.error);
    return saved.ok;
  }, []);

  const add = useCallback(
    (input: { hotkey: string; label: string }): { ok: boolean; error?: string } => {
      const result = addEntry(devices, input);
      if (!result.ok) return { ok: false, error: result.error };
      commit(result.value);
      return { ok: true };
    },
    [devices, commit],
  );

  const rename = useCallback(
    (hotkey: string, label: string): { ok: boolean; error?: string } => {
      const result = renameEntry(devices, hotkey, label);
      if (!result.ok) return { ok: false, error: result.error };
      commit(result.value);
      return { ok: true };
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
      commit(result.value.devices);
      return { ok: true, report: result.value };
    },
    [devices, commit],
  );

  const exportJson = useCallback(() => serializeExport(devices), [devices]);

  return { devices, loaded, storageError, add, rename, remove, importJson, exportJson };
}
