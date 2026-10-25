import { upstreamJson } from "./upstream-json.server";
import type { AcurastRewards } from "./acurast-rewards";

// Official indexer's archive node: Acurast/acurast-indexer configuration/base.yaml.
export const ACURAST_ARCHIVE = "https://public-archive.mainnet.acurast.com";
export const ACURAST_PAID_PREFIX =
  "0x56c55973ec96db3a5ef84bbd48553aeb0c1fdeee4e7ee84aba8add5230cc578f";
export const ACURAST_TIMESTAMP_KEY =
  "0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb";
export const hkDayStart = (now: number) =>
  Math.floor((now + 28800000) / 86400000) * 86400000 - 28800000;
export function littleInteger(raw: unknown, bytes: number): bigint {
  if (typeof raw !== "string" || !new RegExp(`^0x[0-9a-f]{${bytes * 2}}$`).test(raw))
    throw new Error("invalid-data");
  return BigInt("0x" + raw.slice(2).match(/../g)!.reverse().join(""));
}
export function acuAmount(raw: bigint): string {
  return `${raw / 1000000000000n}.${(raw % 1000000000000n).toString().padStart(12, "0")}`.replace(
    /\.?0+$/,
    "",
  );
}
export function paidReward(raw: unknown): bigint {
  // MetricsRewardState { paid: Balance(u128), claimed: Epoch(u32) }; missing state means no paid rewards.
  if (raw === null) return 0n;
  if (typeof raw !== "string" || !/^0x[0-9a-f]{40}$/.test(raw)) throw new Error("invalid-data");
  return littleInteger(raw.slice(0, 34), 16);
}
const managerKey = (id: string) => {
  if (!/^\d{1,39}$/.test(id) || BigInt(id) >= 1n << 128n) throw new Error("invalid-data");
  return (
    ACURAST_PAID_PREFIX + BigInt(id).toString(16).padStart(32, "0").match(/../g)!.reverse().join("")
  );
};
type Point = { hash: string; height: number; time: number };
const boundaries = new Map<number, Promise<Point>>();
export async function readAcurastRewards(
  ids: string[],
  fetcher: typeof fetch = fetch,
  now = Date.now(),
): Promise<AcurastRewards> {
  const started = Date.now();
  let calls = 0;
  async function rpc(method: string, params: unknown[]) {
    if (++calls > 100 || Date.now() - started > 40000) throw new Error("unavailable");
    const raw = await upstreamJson(
      ACURAST_ARCHIVE,
      { body: { jsonrpc: "2.0", id: 1, method, params }, maxBytes: 10000 },
      fetcher,
    );
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("invalid-data");
    const r = raw as Record<string, unknown>;
    if (r["jsonrpc"] !== "2.0" || r["id"] !== 1 || r["error"] || !("result" in r))
      throw new Error("unavailable");
    return r["result"];
  }
  function blockHash(raw: unknown): string {
    if (typeof raw !== "string" || !/^0x[0-9a-f]{64}$/.test(raw)) throw new Error("invalid-data");
    return raw;
  }
  async function point(height: number): Promise<Point> {
    const hash = blockHash(await rpc("chain_getBlockHash", [height]));
    const time = Number(
      littleInteger(await rpc("state_getStorage", [ACURAST_TIMESTAMP_KEY, hash]), 8),
    );
    if (!Number.isSafeInteger(time) || time <= 0 || time > now + 60000)
      throw new Error("invalid-data");
    return { hash, height, time };
  }
  const hash = blockHash(await rpc("chain_getFinalizedHead", []));
  const header = (await rpc("chain_getHeader", [hash])) as { number?: unknown } | null;
  if (typeof header?.number !== "string" || !/^0x[0-9a-f]+$/.test(header.number))
    throw new Error("invalid-data");
  const height = Number.parseInt(header.number, 16);
  if (!Number.isSafeInteger(height) || height < 1) throw new Error("invalid-data");
  const headTime = Number(
    littleInteger(await rpc("state_getStorage", [ACURAST_TIMESTAMP_KEY, hash]), 8),
  );
  if (!Number.isSafeInteger(headTime) || headTime > now || now - headTime > 600000)
    throw new Error("unavailable");
  const head = { hash, height, time: headTime },
    dayStart = hkDayStart(now);
  // Find the LAST finalized block strictly before midnight, so the delta includes
  // every payout timestamped in [midnight, next midnight). Interpolation only
  // proposes probes; adjacent timestamp brackets prove the boundary.
  async function before(target: number): Promise<Point> {
    let hi = head,
      lo = await point(Math.max(1, height - 43200));
    for (let n = 0; lo.time >= target && n < 6; n++) {
      hi = lo;
      lo = await point(Math.max(1, lo.height - 43200 * 2 ** (n + 1)));
    }
    if (lo.time >= target || hi.time < target) throw new Error("unavailable");
    for (let n = 0; hi.height - lo.height > 1 && n < 32; n++) {
      const guess =
        n < 12
          ? lo.height +
            Math.floor(((target - lo.time) / (hi.time - lo.time)) * (hi.height - lo.height))
          : Math.floor((lo.height + hi.height) / 2);
      const p = await point(Math.max(lo.height + 1, Math.min(hi.height - 1, guess)));
      if (p.time <= lo.time || p.time >= hi.time) throw new Error("invalid-data");
      if (p.time < target) lo = p;
      else hi = p;
    }
    if (hi.height - lo.height !== 1) throw new Error("unavailable");
    return lo;
  }
  function boundary(target: number): Promise<Point> {
    if (fetcher !== fetch) return before(target);
    const cached = boundaries.get(target);
    if (cached) return cached;
    if (boundaries.size >= 4) boundaries.delete(boundaries.keys().next().value!);
    const pending = before(target).catch((e) => {
      boundaries.delete(target);
      throw e;
    });
    boundaries.set(target, pending);
    return pending;
  }
  const unique = [...new Set(ids)];
  if (!unique.length || unique.length > 20) throw new Error("invalid-data");
  const paid = await Promise.all(
    unique.map((id) => rpc("state_getStorage", [managerKey(id), hash]).then(paidReward)),
  );
  let history: [Point, Point] | null = null;
  try {
    history = await Promise.all([boundary(dayStart), boundary(dayStart - 86400000)]);
  } catch {
    /* paid cumulative remains valid; unavailable history is never zero */
  }
  const managers: AcurastRewards["managers"] = [];
  for (let i = 0; i < unique.length; i++) {
    const id = unique[i]!,
      cumulative = paid[i]!;
    let today: string | null = null,
      yesterday: string | null = null;
    if (history)
      try {
        const [atStart, atYesterday] = await Promise.all(
          history.map((p) => rpc("state_getStorage", [managerKey(id), p.hash]).then(paidReward)),
        );
        if (atStart! > cumulative || atYesterday! > atStart!) throw new Error("invalid-data");
        today = acuAmount(cumulative - atStart!);
        yesterday = acuAmount(atStart! - atYesterday!);
      } catch {
        /* preserve independently verified cumulative */
      }
    managers.push({ id, cumulative: acuAmount(cumulative), today, yesterday });
  }
  return { managers, dayStart, observedAt: head.time, blockHash: hash };
}
