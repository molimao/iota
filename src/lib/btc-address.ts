import { base58check, bech32, bech32m } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";

const base58 = base58check(sha256);
const BECH32_LIMIT = 90;

/** Mainnet P2PKH, P2SH, witness v0, or Taproot. Mixed-case bech32 and testnet fail. */
export function validBtcAddress(value: string) {
  if (value !== value.trim() || value.length < 26 || value.length > BECH32_LIMIT) return false;
  if (/[\s/?#%]/.test(value) || value.includes(":") || value.includes("\\")) return false;
  if (/^(tb1|bcrt1)/i.test(value) || /^[2mn]/.test(value)) return false;
  if (/^bc1/i.test(value)) {
    if (value !== value.toLowerCase() && value !== value.toUpperCase()) return false;
    const canonical = value.toLowerCase();
    if (canonical.startsWith("bc1q")) return witnessV0(canonical);
    if (canonical.startsWith("bc1p")) return taproot(canonical);
    return false;
  }
  return base58Mainnet(value);
}

export function normalizeBtcAddress(value: string) {
  if (!validBtcAddress(value)) return value;
  return /^bc1/i.test(value) ? value.toLowerCase() : value;
}

function witnessV0(value: string) {
  if (bech32m.decodeUnsafe(value, BECH32_LIMIT)) return false;
  const decoded = bech32.decodeUnsafe(value, BECH32_LIMIT);
  if (!decoded || decoded.prefix !== "bc" || decoded.words[0] !== 0) return false;
  const program = bech32.fromWordsUnsafe(decoded.words.slice(1));
  return program?.length === 20 || program?.length === 32;
}

function taproot(value: string) {
  if (bech32.decodeUnsafe(value, BECH32_LIMIT)) return false;
  const decoded = bech32m.decodeUnsafe(value, BECH32_LIMIT);
  if (!decoded || decoded.prefix !== "bc" || decoded.words[0] !== 1) return false;
  const program = bech32m.fromWordsUnsafe(decoded.words.slice(1));
  return program?.length === 32;
}

function base58Mainnet(value: string) {
  if (!/^[13][1-9A-HJ-NP-Za-km-z]{25,33}$/.test(value)) return false;
  try {
    const data = base58.decode(value);
    return data.length === 21 && (data[0] === 0x00 || data[0] === 0x05);
  } catch {
    return false;
  }
}
