import { validTscAddress } from "./tensorcash-address";
import { normalizeBtcAddress, validBtcAddress } from "./btc-address";
import { validErgP2pkAddress, validZephStandardAddress } from "./erg-zeph-validator";
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
  "erg",
  "zeph",
  "btc",
  "ethw",
  "tsc",
] as const;
export type PoolProject = (typeof POOL_PROJECT_IDS)[number];
export type PoolProvider =
  | "kryptex"
  | "2miners"
  | "luckypool"
  | "bntpool"
  | "gpools"
  | "ckpool"
  | "chain"
  | "tigerpool"
  | "boblabs"
  | "ariapool"
  | "suprnova";
export const isPoolProject = (v: unknown): v is PoolProject =>
  POOL_PROJECT_IDS.includes(v as PoolProject);
export const poolProvider = (p: PoolProject): PoolProvider =>
  p === "tsc"
    ? "boblabs"
    : p === "btc"
      ? "ckpool"
      : p === "csd"
        ? "gpools"
        : p === "bnt"
          ? "bntpool"
          : p === "mds"
            ? "luckypool"
            : p === "prl" || p === "xmr"
              ? "kryptex"
              : "2miners";
export function validPoolProvider(
  project: PoolProject,
  provider: unknown,
): provider is PoolProvider {
  if (project === "tsc")
    return ["chain", "tigerpool", "boblabs", "ariapool", "luckypool", "suprnova"].includes(
      String(provider),
    );
  return provider === poolProvider(project) || (project === "prl" && provider === "luckypool");
}
export function poolAccountKey(
  project: PoolProject,
  address: string,
  provider = poolProvider(project),
) {
  return project === "prl" || project === "tsc"
    ? ["pool-account", project, address, provider]
    : ["pool-account", project, address];
}
export const poolName = (p: PoolProject, provider = poolProvider(p)) =>
  p === "tsc"
    ? (
        {
          chain: "TensorCash Mainnet",
          tigerpool: "Tigerpool",
          boblabs: "Bob Labs",
          ariapool: "AriaPool",
          luckypool: "LuckyPool",
          suprnova: "Suprnova",
        } as Record<string, string>
      )[provider]!
    : p === "prl" && provider === "luckypool"
      ? "LuckyPool"
      : p === "btc"
        ? "CKPool"
        : p === "csd"
          ? "G-pools"
          : p === "bnt"
            ? "bntpool.com"
            : p === "mds"
              ? "LuckyPool"
              : poolProvider(p) === "kryptex"
                ? "Kryptex"
                : "2Miners";
export const POOL_PROJECTS = {
  tsc: {
    name: "TensorCash",
    detail: "Proof of inference",
    token: "TSC",
    website: "https://tensorcash.org/",
    guide: "https://tensorcash.org/pools",
    explorer: "https://scan.tensorcash.org/",
  },
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
  erg: {
    name: "Ergo",
    detail: "ERG · Autolykos v2",
    token: "ERG",
    website: "https://ergoplatform.org/",
    guide: "https://docs.ergoplatform.com/dev/wallet/address/address_types/",
    explorer: "https://erg.2miners.com/",
  },
  zeph: {
    name: "Zephyr",
    detail: "ZEPH · RandomX",
    token: "ZEPH",
    website: "https://zephyrprotocol.com/",
    guide: "https://zeph.2miners.com/help",
    explorer: "https://zeph.2miners.com/",
  },
  btc: {
    name: "Bitcoin",
    detail: "BTC · SHA-256",
    token: "BTC",
    website: "https://solo.ckpool.org/",
    guide: "https://solo.ckpool.org/",
    explorer: "https://solo.ckpool.org/",
  },
  ethw: {
    name: "EthereumPoW",
    detail: "ETHW · ETHash",
    token: "ETHW",
    website: "https://ethw.2miners.com/",
    guide: "https://ethw.2miners.com/help",
    explorer: "https://ethw.2miners.com/",
  },
} as const;
const TWO_MINERS_ORIGIN = {
  etc: "https://etc.2miners.com",
  rvn: "https://rvn.2miners.com",
  zec: "https://zec.2miners.com",
  kas: "https://kas.2miners.com",
  erg: "https://erg.2miners.com",
  zeph: "https://zeph.2miners.com",
  ethw: "https://ethw.2miners.com",
} as const;
export type TwoMinersProject = keyof typeof TWO_MINERS_ORIGIN;
export function twoMinersOrigin(project: PoolProject): string | null {
  return project in TWO_MINERS_ORIGIN ? TWO_MINERS_ORIGIN[project as TwoMinersProject] : null;
}
export function twoMinersAccountUrl(project: PoolProject, address: string) {
  const origin = twoMinersOrigin(project);
  if (!origin || !validPoolAddress(project, address)) return null;
  return `${origin}/api/accounts/${encodeURIComponent(address)}`;
}
// Public mainnet payout addresses only; never URLs, credentials or arbitrary upstream hosts.
export function validPoolAddress(p: PoolProject, v: string) {
  if (v !== v.trim()) return false;
  switch (p) {
    case "tsc":
      return validTscAddress(v);
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
    case "ethw":
      return /^0x[0-9a-fA-F]{40}$/.test(v);
    case "btc":
      return validBtcAddress(v);
    case "rvn":
      return /^R[1-9A-HJ-NP-Za-km-z]{33}$/.test(v);
    case "zec":
      return /^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(v);
    case "kas":
      return /^kaspa:[023456789acdefghjklmnpqrstuvwxyz]{61,65}$/.test(v);
    case "erg":
      return validErgP2pkAddress(v);
    case "zeph":
      return validZephStandardAddress(v);
  }
}
export function poolAccountUrl(p: PoolProject, address: string, provider = poolProvider(p)) {
  if (p === "tsc")
    return provider === "chain"
      ? "https://scan.tensorcash.org/"
      : (
          {
            tigerpool: "https://tsc-miner.tiger-pool.com/",
            boblabs: "https://pool.tensorcash.boblabs.eu/",
            ariapool: "https://pool.ariabrain.com/tsc.html",
            luckypool: "https://tensorcash.luckypool.io/",
            suprnova: "https://tsc.suprnova.cc/",
          } as Record<string, string>
        )[provider]!;
  if (p === "prl" && provider === "luckypool")
    return `https://pearl.luckypool.io/miner-stats?address=${encodeURIComponent(address)}`;
  if (p === "btc")
    return validBtcAddress(address)
      ? `https://stats.ckpool.org/users/${encodeURIComponent(normalizeBtcAddress(address))}`
      : "https://solo.ckpool.org/";
  if (p === "csd") return "https://csd.yamaduo.no/";
  if (p === "bnt") return "https://bntpool.com/stats";
  if (p === "mds")
    return `https://midstate.luckypool.io/miner-stats?address=${encodeURIComponent(address)}`;
  const miners = twoMinersOrigin(p);
  return miners
    ? `${miners}/account/${encodeURIComponent(address)}`
    : `https://pool.kryptex.com/${p}/miner/stats/${encodeURIComponent(address)}`;
}
