export const POOL_PROJECT_IDS = ["prl", "xmr", "etc", "rvn", "zec", "kas"] as const;
export type PoolProject = (typeof POOL_PROJECT_IDS)[number];
export type PoolProvider = "kryptex" | "2miners";
export const isPoolProject = (v: unknown): v is PoolProject =>
  POOL_PROJECT_IDS.includes(v as PoolProject);
export const poolProvider = (p: PoolProject): PoolProvider =>
  p === "prl" || p === "xmr" ? "kryptex" : "2miners";
export const poolName = (p: PoolProject) => (poolProvider(p) === "kryptex" ? "Kryptex" : "2Miners");
export const POOL_PROJECTS = {
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
  return poolProvider(p) === "kryptex"
    ? `https://pool.kryptex.com/${p}/miner/stats/${encodeURIComponent(address)}`
    : `https://${p}.2miners.com/account/${encodeURIComponent(address)}`;
}
