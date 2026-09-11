import { blake2b } from "@noble/hashes/blake2";
import { base58 } from "@scure/base";

const SS58_PREFIX = new TextEncoder().encode("SS58PRE");

export type Ss58Decoded = {
  networkPrefix: number;
  publicKey: Uint8Array;
};

export type Ss58Result =
  | { ok: true; value: Ss58Decoded }
  | { ok: false; reason: "empty" | "charset" | "length" | "checksum" | "network" };

/** Bittensor / IOTA uses the generic Substrate network prefix 42. */
export const GENERIC_SUBSTRATE_PREFIX = 42;

function decodeChecksummed(address: string): Ss58Result {
  const trimmed = address.trim();
  if (!trimmed) return { ok: false, reason: "empty" };

  let raw: Uint8Array;
  try {
    raw = base58.decode(trimmed);
  } catch {
    return { ok: false, reason: "charset" };
  }

  // 1-byte prefix + 32-byte public key + 2-byte checksum, or 2-byte prefix variant.
  if (raw.length !== 35 && raw.length !== 36) return { ok: false, reason: "length" };

  let prefixLength: number;
  let networkPrefix: number;
  const first = raw[0]!;
  if (first < 64) {
    prefixLength = 1;
    networkPrefix = first;
  } else if (first < 128) {
    prefixLength = 2;
    const second = raw[1]!;
    const lower = ((first & 0b0011_1111) << 2) | (second >> 6);
    const upper = (second & 0b0011_1111) << 8;
    networkPrefix = lower | upper;
  } else {
    return { ok: false, reason: "charset" };
  }

  if (raw.length - prefixLength !== 34) return { ok: false, reason: "length" };

  const body = raw.subarray(0, raw.length - 2);
  const checksum = raw.subarray(raw.length - 2);
  const expected = blake2b(new Uint8Array([...SS58_PREFIX, ...body]), { dkLen: 64 });
  if (expected[0] !== checksum[0] || expected[1] !== checksum[1]) {
    return { ok: false, reason: "checksum" };
  }

  return {
    ok: true,
    value: { networkPrefix, publicKey: raw.subarray(prefixLength, raw.length - 2) },
  };
}

export function decodeSs58(address: string): Ss58Result {
  return decodeChecksummed(address);
}

/** Validates a public Miner ID (hotkey) as an SS58 address on network 42. */
export function validateMinerId(address: string): Ss58Result {
  const result = decodeChecksummed(address);
  if (!result.ok) return result;
  if (result.value.networkPrefix !== GENERIC_SUBSTRATE_PREFIX) {
    return { ok: false, reason: "network" };
  }
  return result;
}

export function isValidMinerId(address: string): boolean {
  return validateMinerId(address).ok;
}

export function minerIdError(address: string): string | null {
  const result = validateMinerId(address);
  if (result.ok) return null;
  switch (result.reason) {
    case "empty":
      return "请填写 Miner ID";
    case "charset":
      return "格式不对：含有无效字符";
    case "length":
      return "长度不对：应为 48 位左右的 SS58 地址";
    case "checksum":
      return "校验失败：请检查是否有漏字或错字";
    case "network":
      return "网络前缀不对：需要通用网络 42 的地址";
    default:
      return "Miner ID 无效";
  }
}

export function shortId(address: string, head = 6, tail = 6): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
