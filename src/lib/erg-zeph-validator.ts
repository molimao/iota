import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
import { keccak_256 } from "@noble/hashes/sha3.js";

/** Public 2Miners payout addresses from account.js. Not customer wallets. */
export const ERG_2MINERS_PAYOUT = "9hcksqJGwwYP6hwxzs6fAqfu3Qdi7YdHoK9GrUxpYhNDeFCZrPh";
export const ZEPH_2MINERS_PAYOUT =
  "ZEPHYR2u8Zg9uwdHHU5oQRG2ZDniADy71M1m7VwA1T9yHHEirSAJffBGx4QhbsurRX9jK6FgWxD7DHwGmxAQHYqZ7ABLifBAiEM1o";

const ERG_P2PK = 0x01;
const ERG_KEY_BYTES = 33;
const CHECKSUM_BYTES = 4;
/** Zephyr mainnet standard address. Integrated 0xc4f7d18c0 and subaddress 0x8dd58c0 are not accepted. */
const ZEPH_STANDARD_PREFIX = 0x6241d18c0n;
const CN_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const CN_ENCODED_BLOCK_SIZES = [0, 2, 3, 5, 6, 7, 9, 10, 11];

/** Ergo mainnet P2PK only: 0x01 + 33-byte key + 4-byte Blake2b-256 checksum. */
export function validErgP2pkAddress(address: string) {
  if (!/^9[1-9A-HJ-NP-Za-km-z]{50}$/.test(address)) return false;
  try {
    const bytes = base58.decode(address);
    if (bytes.length !== 1 + ERG_KEY_BYTES + CHECKSUM_BYTES || bytes[0] !== ERG_P2PK) return false;
    const body = bytes.subarray(0, -CHECKSUM_BYTES);
    const digest = blake2b(body, { dkLen: 32 });
    return bytes.subarray(-CHECKSUM_BYTES).every((byte, i) => byte === digest[i]);
  } catch {
    return false;
  }
}

function cnDecodeBlock(block: string) {
  const decodedSize = CN_ENCODED_BLOCK_SIZES.indexOf(block.length);
  if (decodedSize <= 0) return null;
  let value = 0n;
  let order = 1n;
  for (let i = block.length - 1; i >= 0; i--) {
    const digit = CN_ALPHABET.indexOf(block[i]!);
    if (digit < 0) return null;
    value += order * BigInt(digit);
    order *= 58n;
    if (value >= 1n << 64n) return null;
  }
  if (decodedSize < 8 && value >> BigInt(8 * decodedSize) !== 0n) return null;
  const out = new Uint8Array(decodedSize);
  for (let i = decodedSize - 1; i >= 0; i--) {
    out[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  return out;
}

function cnDecode(address: string) {
  if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) return null;
  const parts: Uint8Array[] = [];
  for (let i = 0; i < address.length; i += 11) {
    const block = cnDecodeBlock(address.slice(i, i + 11));
    if (!block) return null;
    parts.push(block);
  }
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function readVarint(bytes: Uint8Array) {
  let value = 0n;
  let shift = 0n;
  for (let i = 0; i < bytes.length && i < 8; i++) {
    const byte = bytes[i]!;
    value += BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return { value, next: i + 1 };
    shift += 7n;
  }
  return null;
}

/**
 * Zephyr mainnet standard address only.
 * CryptoNote base58, prefix 0x6241d18c0, 32-byte spend key, 32-byte view key, Keccak-256 checksum.
 * Integrated, subaddress, testnet and stagenet prefixes are rejected.
 */
export function validZephStandardAddress(address: string) {
  if (address.length !== 101 || !address.startsWith("ZEPHYR")) return false;
  const raw = cnDecode(address);
  if (!raw || raw.length !== 73) return false;
  const payload = raw.subarray(0, -CHECKSUM_BYTES);
  const prefix = readVarint(payload);
  if (!prefix || prefix.value !== ZEPH_STANDARD_PREFIX || payload.length - prefix.next !== 64)
    return false;
  const digest = keccak_256(payload);
  return raw.subarray(-CHECKSUM_BYTES).every((byte, i) => byte === digest[i]);
}

function encodeVarint(value: bigint) {
  const out: number[] = [];
  let rest = value;
  while (rest >= 0x80n) {
    out.push(Number((rest & 0x7fn) | 0x80n));
    rest >>= 7n;
  }
  out.push(Number(rest));
  return out;
}

function cnEncode(bytes: Uint8Array) {
  let out = "";
  for (let offset = 0; offset < bytes.length; offset += 8) {
    const block = bytes.subarray(offset, Math.min(offset + 8, bytes.length));
    const size = CN_ENCODED_BLOCK_SIZES[block.length];
    if (size === undefined) throw new Error("invalid-block");
    let value = 0n;
    for (const byte of block) value = (value << 8n) + BigInt(byte);
    let encoded = "";
    for (let i = 0; i < size; i++) {
      encoded = CN_ALPHABET[Number(value % 58n)] + encoded;
      value /= 58n;
    }
    out += encoded;
  }
  return out;
}

/** Deterministic mainnet P2PK fixture. fill is a byte, not a secret. */
export function ergP2pkFromFill(fill: number) {
  if (!Number.isInteger(fill) || fill < 0 || fill > 255) throw new Error("invalid-fill");
  const body = new Uint8Array(1 + ERG_KEY_BYTES);
  body[0] = ERG_P2PK;
  body.fill(fill, 1);
  const checksum = blake2b(body, { dkLen: 32 }).subarray(0, CHECKSUM_BYTES);
  return base58.encode(new Uint8Array([...body, ...checksum]));
}

/** Deterministic mainnet standard fixture. Not an integrated or subaddress. */
export function zephStandardFromFill(fill: number) {
  if (!Number.isInteger(fill) || fill < 0 || fill > 255) throw new Error("invalid-fill");
  const payload = new Uint8Array([
    ...encodeVarint(ZEPH_STANDARD_PREFIX),
    ...new Uint8Array(64).fill(fill),
  ]);
  const checksum = keccak_256(payload).subarray(0, CHECKSUM_BYTES);
  return cnEncode(new Uint8Array([...payload, ...checksum]));
}
