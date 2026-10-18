import { validCsdAddress } from "./csd";
import { validBntAddress } from "./bnt";
export const POOL_PROJECT_IDS = [
  "prl",
  "xmr",
  "etc",
  "rvn",
  "zec",
  "kas",
  "mds",
  "bnt",
  "csd",
] as const;
export type PoolProject = (typeof POOL_PROJECT_IDS)[number];
export type PoolProvider = "kryptex" | "2miners" | "luckypool" | "bntpool" | "gpools";
export const isPoolProject = (v: unknown): v is PoolProject =>
  POOL_PROJECT_IDS.includes(v as PoolProject);
export const poolProvider = (p: PoolProject): PoolProvider =>
  p === "csd"
    ? "gpools"
    : p === "bnt"
      ? "bntpool"
      : p === "mds"
        ? "luckypool"
        : p === "prl" || p === "xmr"
          ? "kryptex"
          : "2miners";
export const poolName = (p: PoolProject) =>
  p === "csd"
    ? "G-pools"
    : p === "bnt"
      ? "bntpool.com"
      : p === "mds"
        ? "LuckyPool"
        : poolProvider(p) === "kryptex"
          ? "Kryptex"
          : "2Miners";
export const POOL_PROJECTS = {
  csd: {
    name: "Compute Substrate",
    detail: "CSD · SHA-256d",
    token: "CSD",
    website: "https://computesubstrate.org/",
    guide: "https://csd.yamaduo.no/#mine",
    explorer: "https://csd.yamaduo.no/",
  },
  bnt: {
    name: "Blocknet",
    detail: "BNT · Argon2id",
    token: "BNT",
    website: "https://blocknetcrypto.com/",
    guide: "https://github.com/zpalmtree/seine",
    explorer: "https://bntpool.com/",
  },
  mds: {
    name: "Midstate",
    detail: "MDS · BLAKE3 sequential",
    token: "MDS",
    website: "https://midstate.cash/",
    guide: "https://github.com/ciphernom/midstate/blob/main/pools.md",
    explorer: "https://midstate.luckypool.io/",
  },
  prl: {
    name: "Pearl",
    detail: "PearlHash",
    token: "PRL",
    website: "https://pool.kryptex.com/en/prl",
    guide: "https://pool.kryptex.com/en/prl",
    explorer: "https://pool.kryptex.com/en/prl",
  },
  xmr: {
    name: "Monero",
    detail: "RandomX",
    token: "XMR",
    website: "https://www.getmonero.org/",
    guide: "https://pool.kryptex.com/en/xmr",
    explorer: "https://pool.kryptex.com/en/xmr",
  },
  etc: {
    name: "Ethereum Classic",
    detail: "ETCHash",
    token: "ETC",
    website: "https://ethereumclassic.org/",
    guide: "https://etc.2miners.com/help",
    explorer: "https://etc.2miners.com/",
  },
  rvn: {
    name: "Ravencoin",
    detail: "KawPoW",
    token: "RVN",
    website: "https://ravencoin.org/",
    guide: "https://rvn.2miners.com/help",
    explorer: "https://rvn.2miners.com/",
  },
  zec: {
    name: "Zcash",
    detail: "Equihash",
    token: "ZEC",
    website: "https://z.cash/",
    guide: "https://zec.2miners.com/help",
    explorer: "https://zec.2miners.com/",
  },
  kas: {
    name: "Kaspa",
    detail: "kHeavyHash",
    token: "KAS",
    website: "https://kaspa.org/",
    guide: "https://kas.2miners.com/help",
    explorer: "https://kas.2miners.com/",
  },
} as const;
// Public mainnet payout addresses only; never URLs, credentials or arbitrary upstream hosts.
export function validPoolAddress(p: PoolProject, v: string) {
  if (v !== v.trim()) return false;
  switch (p) {
    case "csd":
      return validCsdAddress(v);
    case "bnt":
      return validBntAddress(v);
    case "mds":
      return /^[0-9a-f]{64}$/.test(v);
    case "prl":
      return /^prl1[023456789acdefghjklmnpqrstuvwxyz]{40,90}$/.test(v);
    case "xmr":
      return /^[48][1-9A-HJ-NP-Za-km-z]{94}$/.test(v) || /^4[1-9A-HJ-NP-Za-km-z]{105}$/.test(v);
    case "etc":
      return /^0x[0-9a-fA-F]{40}$/.test(v);
    case "rvn":
      return /^R[1-9A-HJ-NP-Za-km-z]{33}$/.test(v);
    case "zec":
      return /^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(v);
    case "kas":
      return /^kaspa:[023456789acdefghjklmnpqrstuvwxyz]{61,65}$/.test(v);
  }
}
export function poolAccountUrl(p: PoolProject, address: string) {
  if (p === "csd") return "https://csd.yamaduo.no/";
  if (p === "bnt") return "https://bntpool.com/stats";
  if (p === "mds")
    return `https://midstate.luckypool.io/miner-stats?address=${encodeURIComponent(address)}`;
  return poolProvider(p) === "kryptex"
    ? `https://pool.kryptex.com/${p}/miner/stats/${encodeURIComponent(address)}`
    : `https://${p}.2miners.com/account/${encodeURIComponent(address)}`;
}
