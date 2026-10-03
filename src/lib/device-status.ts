import type { MinerRecord } from "./iota-types";

export type DeviceStatus =
  "contributing" | "waiting" | "idle" | "not_found" | "unknown" | "refresh_interrupted";

export const REFRESH_INTERRUPTED_MS = 5 * 60 * 1000;

/** Accept only millisecond clocks. Reject 0, NaN, and unix-second timestamps. */
export function validFetchedAt(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 1_000_000_000_000
    ? value
    : null;
}

/** Newest valid millisecond clock, or null if none are usable. */
export function latestValidClock(...values: Array<number | null | undefined>): number | null {
  let best: number | null = null;
  for (const value of values) {
    const next = validFetchedAt(value);
    if (next !== null && (best === null || next > best)) best = next;
  }
  return best;
}

/**
 * Only successful official roster fetch clocks count. A successful application
 * round-trip (including one returning stale data) cannot renew a failed source.
 */
export function resolveLastSuccessfulFetchAt(input: {
  querySuccess: boolean;
  queryUpdatedAt: number | null | undefined;
  deviceFetchedAt: number | null | undefined;
  discoveryFetchedAt: number | null | undefined;
}): number | null {
  return validFetchedAt(input.deviceFetchedAt) ?? validFetchedAt(input.discoveryFetchedAt);
}

export type StatusInput = {
  miner: MinerRecord | null;
  /** true only if every active run's miner list was fetched successfully */
  fullCoverage: boolean;
  /** last successful upstream fetch of miner lists (NOT the sample timestamp) */
  lastSuccessfulFetchAt: number | null;
  now: number;
  /** A refresh is in flight; it does not renew the last successful source clock. */
  fetching?: boolean;
};

/**
 * IMPORTANT: `miner.timestamp` is the official statistics sample time, not a
 * heartbeat and not our refresh time. An old sample timestamp never makes a
 * device offline. Only a missing successful fetch of our own produces 刷新中断.
 */
export function computeStatus(input: StatusInput): DeviceStatus {
  const { miner, fullCoverage, lastSuccessfulFetchAt, now } = input;
  const fetchedAt = validFetchedAt(lastSuccessfulFetchAt);
  if (fetchedAt === null) return miner ? "refresh_interrupted" : "unknown";
  if (now - fetchedAt > REFRESH_INTERRUPTED_MS) {
    return "refresh_interrupted";
  }
  if (miner) {
    if (miner.throughput > 0) return "contributing";
    if (miner.is_active) return "waiting";
    return "idle";
  }
  return fullCoverage ? "not_found" : "unknown";
}

export const STATUS_META: Record<
  DeviceStatus,
  { label: string; explain: string; tone: "good" | "info" | "warn" | "muted" }
> = {
  contributing: {
    label: "有训练贡献",
    explain: "官方最近一次统计显示该设备正在处理训练任务（为上报数据，不代表此刻一定在算）。",
    tone: "good",
  },
  waiting: {
    label: "在线待任务",
    explain: "官方统计显示设备在线，但最近一次采样没有处理量，通常是在等待分配任务。",
    tone: "info",
  },
  idle: {
    label: "暂未参与",
    explain: "官方统计显示该设备当前未参与训练，这不等于设备已离线或出错。",
    tone: "warn",
  },
  not_found: {
    label: "尚未找到",
    explain: "已成功读取全部进行中的训练任务名单，其中没有这个 Miner ID。请核对 ID 是否正确。",
    tone: "warn",
  },
  unknown: {
    label: "待确认",
    explain: "部分训练任务名单本次没读取成功，覆盖不完整，暂时无法判断，不代表设备有问题。",
    tone: "muted",
  },
  refresh_interrupted: {
    label: "刷新中断",
    explain: "超过 5 分钟没有成功获取官方数据，下面显示的是上一次成功读取的内容。",
    tone: "muted",
  },
};

export type OfficialSignal = "yes" | "no" | "unknown";

/**
 * Official miner-list sample only. This is not a Mac heartbeat:
 * `is_active` = reported in the current training set,
 * `throughput > 0` = that sample recorded training work.
 */
export function officialSignals(miner: MinerRecord | null): {
  online: OfficialSignal;
  training: OfficialSignal;
} {
  if (!miner) return { online: "unknown", training: "unknown" };
  return {
    online: miner.is_active ? "yes" : "no",
    training: miner.throughput > 0 ? "yes" : "no",
  };
}

export type StatusBucket = "contributing" | "waiting" | "attention" | "pending";

export function statusBucket(status: DeviceStatus): StatusBucket {
  switch (status) {
    case "contributing":
      return "contributing";
    case "waiting":
      return "waiting";
    case "idle":
    case "not_found":
      return "attention";
    default:
      return "pending";
  }
}

export const BUCKET_LABEL: Record<StatusBucket, string> = {
  contributing: "有贡献",
  waiting: "等待任务",
  attention: "需检查",
  pending: "待确认",
};
