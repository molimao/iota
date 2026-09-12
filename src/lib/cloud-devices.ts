import { supabase } from "@/integrations/supabase/client";

import { isValidMinerId } from "./ss58";
import type { StorageOutcome, WatchEntry } from "./watchlist";

export const ACCOUNT_LIMIT = 10;
export const LOCAL_LIMIT = 3;

const LIMIT_MESSAGE = `每个账号最多绑定 ${ACCOUNT_LIMIT} 台设备，更多暂不支持。`;

function isLimitError(message: string): boolean {
  return message.includes("device_limit_reached");
}

export async function listCloudDevices(): Promise<StorageOutcome<WatchEntry[]>> {
  const { data, error } = await supabase
    .from("user_devices")
    .select("hotkey,label,added_at")
    .order("added_at", { ascending: true });
  if (error) return { ok: false, error: "读取账号设备清单失败，请稍后重试。" };
  return {
    ok: true,
    value: (data ?? []).map((row) => ({
      hotkey: row.hotkey,
      label: row.label,
      addedAt: new Date(row.added_at).getTime() || Date.now(),
    })),
  };
}

export async function addCloudDevice(
  userId: string,
  input: { hotkey: string; label: string; addedAt?: number },
): Promise<StorageOutcome<true>> {
  const hotkey = input.hotkey.trim();
  const label = input.label.trim();
  if (!label) return { ok: false, error: "请填写设备名称" };
  if (label.length > 40) return { ok: false, error: "设备名称最多 40 个字" };
  if (!isValidMinerId(hotkey)) return { ok: false, error: "Miner ID 无效" };
  const { error } = await supabase.from("user_devices").insert({
    user_id: userId,
    hotkey,
    label,
    ...(input.addedAt ? { added_at: new Date(input.addedAt).toISOString() } : {}),
  });
  if (error) {
    if (isLimitError(error.message)) return { ok: false, error: LIMIT_MESSAGE };
    if (error.code === "23505" || error.code === "23305" || error.code === "23000")
      return { ok: false, error: "这个 Miner ID 已经添加过了" };
    if (error.code === "23305" || error.message.includes("duplicate"))
      return { ok: false, error: "这个 Miner ID 已经添加过了" };
    return { ok: false, error: "保存到账号失败，请稍后重试。" };
  }
  return { ok: true, value: true };
}

export async function renameCloudDevice(
  hotkey: string,
  label: string,
): Promise<StorageOutcome<true>> {
  const next = label.trim();
  if (!next) return { ok: false, error: "请填写设备名称" };
  if (next.length > 40) return { ok: false, error: "设备名称最多 40 个字" };
  const { error } = await supabase.from("user_devices").update({ label: next }).eq("hotkey", hotkey);
  if (error) return { ok: false, error: "改名失败，请稍后重试。" };
  return { ok: true, value: true };
}

export async function removeCloudDevice(hotkey: string): Promise<StorageOutcome<true>> {
  const { error } = await supabase.from("user_devices").delete().eq("hotkey", hotkey);
  if (error) return { ok: false, error: "移除失败，请稍后重试。" };
  return { ok: true, value: true };
}

export { LIMIT_MESSAGE as ACCOUNT_LIMIT_MESSAGE };
