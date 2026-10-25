import { blake2b } from "@noble/hashes/blake2.js";
import { base58 } from "@scure/base";
import { acurastPublicKey } from "./additional-platforms";
import { emptyNode, type PlatformNode } from "./platforms";
import { upstreamJson } from "./upstream-json.server";

// Official Hub mainnet endpoint. Storage hashers and u128 manager IDs verified in
// Acurast/acurast-substrate pallets/processor-manager and mainnet runtime config.
export const ACURAST_RPC = "https://frontend-rpc.mainnet.acurast.com";
const PREFIX = {
  processor: "0xc698b31ad72d251a494de23e0dd66846f3a728ad8efdeffd18f039142abe31b2",
  heartbeat: "0xc698b31ad72d251a494de23e0dd6684690ede7a772410f47186f66100c0bf9ec",
  managed: "0xc698b31ad72d251a494de23e0dd66846211ec8b3b481a558895c57086b3d085d",
  owner: "0x5e8a19e3cd1b7c148b33880c479c0281b99d880ec681799c0cf30e8886371da9",
  asset: "0x5e8a19e3cd1b7c148b33880c479c0281d34371a193a751eea5883e9553457b2e",
  account: "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9",
} as const;
const hex = (v: Uint8Array) => Array.from(v, (b) => b.toString(16).padStart(2, "0")).join("");
const bytes = (v: string) => Uint8Array.from(v.match(/../g) ?? [], (p) => parseInt(p, 16));
const hash = (v: string) => hex(blake2b(bytes(v), { dkLen: 16 }));
const concat = (v: string) => hash(v) + v;
const u128 = (v: unknown): string | null => {
  if (v === null) return null;
  if (typeof v !== "string" || !/^0x[0-9a-f]{32}$/.test(v)) throw new Error("invalid-data");
  return v.slice(2);
};
const integer = (little: string) => BigInt("0x" + (little.match(/../g) ?? []).reverse().join(""));
function address(publicKey: string) {
  const body = new Uint8Array([42, ...bytes(publicKey)]);
  const checksum = blake2b(new Uint8Array([...new TextEncoder().encode("SS58PRE"), ...body]), {
    dkLen: 64,
  });
  return base58.encode(new Uint8Array([...body, ...checksum.slice(0, 2)]));
}
export function acurastStorageKey(kind: "processor" | "heartbeat", publicKey: string) {
  return PREFIX[kind] + hash(publicKey);
}
export function decodeAcurastBalance(raw: unknown) {
  if (raw === null) return { free: 0n, reserved: 0n, frozen: 0n };
  // AccountInfo: four u32 counters then AccountData (four u128 fields).
  // The fourth AccountData field is flags, not additional tokens.
  if (typeof raw !== "string" || !/^0x[0-9a-f]{160}$/.test(raw)) throw new Error("invalid-data");
  return {
    free: integer(raw.slice(34, 66)),
    reserved: integer(raw.slice(66, 98)),
    frozen: integer(raw.slice(98, 130)),
  };
}
export async function readAcurastChain(
  id: string,
  fetcher: typeof fetch = fetch,
  now = Date.now(),
): Promise<PlatformNode> {
  const key = acurastPublicKey(id);
  if (!key) throw new Error("invalid-data");
  async function rpc(method: string, params: unknown[]) {
    const value = await upstreamJson(
      ACURAST_RPC,
      { body: { jsonrpc: "2.0", id: 1, method, params }, maxBytes: 200000 },
      fetcher,
    );
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("invalid-data");
    const r = value as Record<string, unknown>;
    if (r["jsonrpc"] !== "2.0" || r["id"] !== 1 || r["error"] || !("result" in r))
      throw new Error("invalid-data");
    return r["result"];
  }
  const block = await rpc("chain_getFinalizedHead", []);
  if (typeof block !== "string" || !/^0x[0-9a-f]{64}$/.test(block)) throw new Error("invalid-data");
  const storage = (k: string) => rpc("state_getStorage", [k, block]);
  let complete = true;
  async function keys(prefix: string) {
    const result: string[] = [];
    let after: string | null = null;
    for (let page = 0; page < 5; page++) {
      const values = await rpc("state_getKeysPaged", [prefix, 100, after, block]);
      if (
        !Array.isArray(values) ||
        values.length > 100 ||
        values.some(
          (v) => typeof v !== "string" || !/^0x[0-9a-f]+$/.test(v) || !v.startsWith(prefix),
        )
      )
        throw new Error("invalid-data");
      const batch = values as string[];
      if (batch.some((v, i) => (i > 0 && v <= batch[i - 1]!) || (after !== null && v <= after)))
        throw new Error("invalid-data");
      result.push(...batch);
      if (batch.length < 100) return result;
      after = batch.at(-1)!;
    }
    complete = false;
    return result;
  }
  const manager = u128(await storage(acurastStorageKey("processor", key)));
  const managerIds: string[] = [];
  if (manager !== null) managerIds.push(manager);
  else {
    // Uniques collection 0 holds Acurast manager identities. Account uses
    // Blake2_128Concat for owner, collection (u128), and manager item (u128).
    const prefix = PREFIX.owner + concat(key) + concat("00".repeat(16));
    for (const entry of await keys(prefix)) {
      const suffix = entry.slice(prefix.length);
      if (!/^[0-9a-f]{64}$/.test(suffix) || hash(suffix.slice(32)) !== suffix.slice(0, 32))
        throw new Error("invalid-data");
      managerIds.push(suffix.slice(32));
    }
    if (!managerIds.length) throw new Error("not-found");
  }
  const processors = new Set<string>();
  if (manager !== null) processors.add(key);
  else {
    for (const mid of managerIds.slice(0, 20)) {
      const prefix = PREFIX.managed + concat(mid);
      for (const entry of await keys(prefix)) {
        const suffix = entry.slice(prefix.length);
        if (!/^[0-9a-f]{96}$/.test(suffix) || hash(suffix.slice(32)) !== suffix.slice(0, 32))
          throw new Error("invalid-data");
        processors.add(suffix.slice(32));
      }
    }
  }
  const list: NonNullable<PlatformNode["acurast"]>["processors"] = [];
  if (managerIds.length > 20 || processors.size > 100) complete = false;
  const all = [...processors].slice(0, 100);
  // Fixed concurrency; never query unrelated accounts or the entire chain.
  for (let i = 0; i < all.length; i += 4) {
    list.push(
      ...(await Promise.all(
        all.slice(i, i + 4).map(async (pub) => {
          const raw = u128(await storage(acurastStorageKey("heartbeat", pub)));
          const n = raw === null ? null : integer(raw);
          const seen =
            n !== null && n <= BigInt(Number.MAX_SAFE_INTEGER) && n > 0n && n <= BigInt(now)
              ? Number(n)
              : null;
          // Same 31-minute active window used by the official Hub.
          return {
            id: address(pub),
            lastSeen: seen,
            online: seen === null ? null : now - seen < 31 * 60000,
          };
        }),
      )),
    );
  }
  const { readAcurastRewards, acuAmount } = await import("./acurast-rewards.server");
  const balances: import("./acurast-rewards").AcurastBalance[] = [];
  try {
    const owners = new Set<string>();
    if (manager === null) owners.add(key);
    else {
      const asset = await storage(PREFIX.asset + concat("00".repeat(16)) + concat(manager));
      // ItemDetails { owner:AccountId32, approved:Option<AccountId32>, frozen:bool, deposit:u128 }.
      if (
        typeof asset !== "string" ||
        !/^0x[0-9a-f]+$/.test(asset) ||
        ![102, 166].includes(asset.length)
      )
        throw new Error("invalid-data");
      const approved = asset.slice(66, 68),
        frozen = asset.slice(asset.length - 34, asset.length - 32);
      if (
        (approved !== "00" && approved !== "01") ||
        (approved === "00") !== (asset.length === 102) ||
        !["00", "01"].includes(frozen)
      )
        throw new Error("invalid-data");
      owners.add(asset.slice(2, 66));
    }
    for (const owner of owners) {
      const b = decodeAcurastBalance(await storage(PREFIX.account + concat(owner)));
      balances.push({
        address: address(owner),
        total: acuAmount(b.free + b.reserved),
        free: acuAmount(b.free),
        reserved: acuAmount(b.reserved),
        frozen: acuAmount(b.frozen),
      });
    }
  } catch {
    /* A balance read failure never becomes zero or hides known rewards. */
  }

  const rewards = await readAcurastRewards(
    managerIds.map((m) => integer(m).toString()),
    fetcher,
    now,
  ).catch(() => null);
  return {
    ...emptyNode(id),
    ...(rewards ? { acurastRewards: rewards } : {}),
    ...(balances.length ? { acurastBalances: balances } : {}),
    scope: manager !== null ? "device" : "provider",
    online: list.some((p) => p.online === true)
      ? true
      : list.length > 0 && list.every((p) => p.online === false)
        ? false
        : null,
    sourceUpdatedAt: list.some((p) => p.lastSeen !== null)
      ? Math.max(...list.map((p) => p.lastSeen ?? 0))
      : null,
    partial: true,
    acurast: {
      role: manager !== null ? "processor" : "manager",
      managerIds: managerIds.map((m) => integer(m).toString()),
      processors: list,
      complete,
    },
  };
}
