import { useCallback, useEffect, useState } from "react";

import { useLocale } from "@/components/site/locale";
import {
  ACCOUNT_LIMIT,
  ACCOUNT_LIMIT_MESSAGE,
  LOCAL_LIMIT,
  LOCAL_LIMIT_MESSAGE,
  addCloudDevice,
  listCloudDevices,
  removeCloudDevice,
  renameCloudDevice,
} from "@/lib/cloud-devices";
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

export type WatchlistResult = { ok: boolean; error?: string };

export function useWatchlist(userId: string | null, authReady = true) {
  const { en } = useLocale();
  const [devices, setDevices] = useState<WatchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const cloud = !!userId;
  const limit = cloud ? ACCOUNT_LIMIT : LOCAL_LIMIT;
  const limitMessage = cloud ? ACCOUNT_LIMIT_MESSAGE : LOCAL_LIMIT_MESSAGE;

  const commitLocal = useCallback((next: WatchEntry[]) => {
    const saved = saveWatchlist(next);
    setStorageError(saved.ok ? null : saved.error);
    if (saved.ok) setDevices(next);
    return saved.ok;
  }, []);

  const reloadCloud = useCallback(async () => {
    const result = await listCloudDevices();
    if (result.ok) {
      setDevices(result.value);
      setStorageError(null);
    } else setStorageError(result.error);
    return result;
  }, []);

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    setLoaded(false);
    if (!userId) {
      const result = loadWatchlist();
      if (result.ok) setDevices(result.value.slice(0, LOCAL_LIMIT));
      else setStorageError(result.error);
      setLoaded(true);
      return;
    }
    void (async () => {
      const remote = await listCloudDevices();
      if (cancelled) return;
      if (!remote.ok) {
        setStorageError(remote.error);
        setLoaded(true);
        return;
      }
      let list = remote.value;
      const local = loadWatchlist();
      if (local.ok && local.value.length > 0) {
        let moved = 0;
        let skipped = 0;
        for (const entry of local.value) {
          if (list.some((item) => item.hotkey === entry.hotkey)) continue;
          if (list.length + moved >= ACCOUNT_LIMIT) {
            skipped += 1;
            continue;
          }
          const added = await addCloudDevice(userId, entry);
          if (added.ok) moved += 1;
          else skipped += 1;
        }
        if (moved > 0) {
          const refreshed = await listCloudDevices();
          if (refreshed.ok) list = refreshed.value;
        }
        if (!cancelled && (moved > 0 || skipped > 0)) {
          setSyncMessage(
            skipped > 0
              ? en
                ? `Bound ${moved} local device(s) to your account. ${skipped} could not be added (limit ${ACCOUNT_LIMIT} or already saved).`
                : `已把 ${moved} 台本地设备绑定到账号，${skipped} 台未能加入（超过 ${ACCOUNT_LIMIT} 台或重复）。`
              : en
                ? `Bound ${moved} local device(s) to your account.`
                : `已把 ${moved} 台本地设备绑定到账号。`,
          );
        }
      }
      if (cancelled) return;
      setDevices(list);
      setStorageError(null);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, authReady, en]);

  const add = useCallback(
    async (input: { hotkey: string; label: string }): Promise<WatchlistResult> => {
      if (devices.length >= limit) return { ok: false, error: limitMessage };
      if (cloud) {
        const result = await addCloudDevice(userId!, input);
        if (!result.ok) return { ok: false, error: result.error };
        await reloadCloud();
        return { ok: true };
      }
      const result = addEntry(devices, input);
      if (!result.ok) return { ok: false, error: result.error };
      return commitLocal(result.value)
        ? { ok: true }
        : { ok: false, error: "浏览器未能保存，请检查存储权限。" };
    },
    [devices, limit, limitMessage, cloud, userId, reloadCloud, commitLocal],
  );

  const rename = useCallback(
    async (hotkey: string, label: string): Promise<WatchlistResult> => {
      if (cloud) {
        const result = await renameCloudDevice(hotkey, label);
        if (!result.ok) return { ok: false, error: result.error };
        await reloadCloud();
        return { ok: true };
      }
      const result = renameEntry(devices, hotkey, label);
      if (!result.ok) return { ok: false, error: result.error };
      return commitLocal(result.value)
        ? { ok: true }
        : { ok: false, error: "浏览器未能保存，请检查存储权限。" };
    },
    [devices, cloud, reloadCloud, commitLocal],
  );

  const remove = useCallback(
    async (hotkey: string) => {
      if (cloud) {
        const result = await removeCloudDevice(hotkey);
        if (!result.ok) setStorageError(result.error);
        await reloadCloud();
        return;
      }
      commitLocal(removeEntry(devices, hotkey));
    },
    [devices, cloud, reloadCloud, commitLocal],
  );

  const importJson = useCallback(
    async (raw: string): Promise<{ ok: boolean; error?: string; report?: ImportReport }> => {
      const result = importDevices(devices, raw);
      if (!result.ok) return { ok: false, error: result.error };
      if (cloud) {
        let added = 0;
        let skipped = result.value.invalid;
        for (const entry of result.value.devices) {
          if (devices.some((item) => item.hotkey === entry.hotkey)) continue;
          if (devices.length + added >= ACCOUNT_LIMIT) {
            skipped += 1;
            continue;
          }
          const outcome = await addCloudDevice(userId!, entry);
          if (outcome.ok) added += 1;
          else skipped += 1;
        }
        await reloadCloud();
        return {
          ok: true,
          report: {
            devices: [],
            added,
            duplicates: result.value.duplicates,
            invalid: skipped,
          },
        };
      }
      const next = result.value.devices.slice(0, LOCAL_LIMIT);
      const trimmed = result.value.devices.length - next.length;
      if (!commitLocal(next)) return { ok: false, error: "浏览器未能保存导入清单。" };
      return {
        ok: true,
        report: {
          ...result.value,
          added: Math.max(0, result.value.added - trimmed),
          invalid: result.value.invalid + trimmed,
        },
      };
    },
    [devices, cloud, userId, reloadCloud, commitLocal],
  );

  const exportJson = useCallback(() => serializeExport(devices), [devices]);

  return {
    devices,
    loaded,
    storageError,
    syncMessage,
    clearSyncMessage: () => setSyncMessage(null),
    cloud,
    limit,
    limitMessage,
    add,
    rename,
    remove,
    importJson,
    exportJson,
  };
}
