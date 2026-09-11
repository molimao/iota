export function formatClock(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Hong_Kong",
  });
}

export function formatDateTime(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Hong_Kong",
  });
}

export function formatSecondsTimestamp(seconds: number | null | undefined): string {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  return formatDateTime(seconds * 1000);
}

export function formatAgo(ms: number | null | undefined, now: number): string {
  if (!ms) return "尚无数据";
  const diff = Math.max(0, now - ms);
  if (diff < 60_000) return `${Math.round(diff / 1000)} 秒前`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)} 分钟前`;
  return `${Math.round(diff / 3_600_000)} 小时前`;
}

export function formatCount(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("zh-CN");
}
