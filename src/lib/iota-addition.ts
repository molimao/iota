import { isValidMinerId } from "./ss58";
export type AdditionRow = { hotkey: string; label: string; issue: "invalid" | "duplicate" | null };
/** Validate whole lines, never extract addresses from secrets, URLs or mixed text. */
export function parseIotaAddresses(raw: string, existing: string[]): AdditionRow[] {
  if (raw.length > 14000) throw new Error("too_many_addresses");
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length > 200) throw new Error("too_many_addresses");
  const seen = new Set(existing);
  return lines.map((hotkey, index) => {
    const issue = !isValidMinerId(hotkey) ? "invalid" : seen.has(hotkey) ? "duplicate" : null;
    seen.add(hotkey);
    return { hotkey, label: `IOTA ${index + 1}`, issue };
  });
}
