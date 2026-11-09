import { sha3_256 } from "@noble/hashes/sha3.js";
import { bech32m } from "@scure/base";

const ADDRESS_HEADER = [1, 0xdb, 0x8b, 0xd1, 1];
const VIEW_KEY_BYTES = 1184;
export const DISCRETE_SPEND_KEY_BYTES = 1952;
const PAYLOAD_BYTES = ADDRESS_HEADER.length + VIEW_KEY_BYTES + DISCRETE_SPEND_KEY_BYTES + 4;
export const DISCRETE_ADDRESS_LENGTH = 5 + Math.ceil((PAYLOAD_BYTES * 8) / 5) + 6;
export const DISCRETE_BLOCK_SECONDS = 90;
export const DISCRETE_SOLO_PAGE_SIZE = 1000;

export type DiscreteSoloBlock = {
  height: number;
  hash: string;
  timestamp: number;
  rewardUnits: number;
};
export type DiscreteSoloPage = {
  fromHeight: number;
  toHeight: number;
  fromTime: number;
  toTime: number;
  blocks: DiscreteSoloBlock[];
};

export function discreteAddressKeys(address: string) {
  if (address.length !== DISCRETE_ADDRESS_LENGTH) return null;
  try {
    const decoded = bech32m.decode(address as `${string}1${string}`, DISCRETE_ADDRESS_LENGTH);
    if (decoded.prefix !== "disc") return null;
    const bytes = bech32m.fromWords(decoded.words);
    if (bytes.length !== PAYLOAD_BYTES || !ADDRESS_HEADER.every((byte, i) => bytes[i] === byte))
      return null;

    // Discrete checks the inner SHA3 checksum as well as the outer Bech32m checksum.
    const checksum = sha3_256(bytes.subarray(0, -4)).subarray(0, 4);
    if (!checksum.every((byte, i) => bytes[bytes.length - 4 + i] === byte)) return null;
    const spendOffset = ADDRESS_HEADER.length + VIEW_KEY_BYTES;
    return {
      view: bytes.subarray(ADDRESS_HEADER.length, spendOffset),
      spend: bytes.subarray(spendOffset, -4),
    };
  } catch {
    return null;
  }
}
