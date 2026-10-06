import { bech32m } from "@scure/base";
import { decodeSs58 } from "./ss58";

export const PROJECT_IDS = [
  "iota",
  "xid",
  "quantus",
  "flyai",
  "nosana",
  "gonka",
  "akash",
  "ionet",
  "vast",
  "golem",
] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];
export type MiningProject = "xid" | "quantus";
export type MonitorProject = Exclude<ProjectId, "iota">;
export type ComputeProject = "nosana" | "gonka";
export function isComputeProject(value: unknown): value is ComputeProject {
  return value === "nosana" || value === "gonka";
}
export const PROJECTS = {
  iota: {
    name: "IOTA",
    detail: "Train at Home",
    token: "IOTA",
    website: "https://iota.macrocosmos.ai/",
    guide: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
    explorer: "https://iota.macrocosmos.ai/dashboard",
  },
  xid: {
    name: "XID",
    detail: "Mac Metal Miner",
    token: "XID",
    website: "https://xcoinproject.com/",
    guide: "https://macmetalminer.com/",
    explorer: "https://superknet.com/",
  },
  quantus: {
    name: "Quantus",
    detail: "QPoW",
    token: "QTC",
    website: "https://www.quantus.com/",
    guide: "https://docs.quantus.com/guides/mining/",
    explorer: "https://explorer.quantus.com/",
  },
  flyai: {
    name: "fly.ai",
    detail: "Compute",
    token: "Points",
    website: "https://www.flyaiworld.com/compute/",
    guide: "https://www.flyaiworld.com/compute/",
    explorer: "https://flyai-mine.fly.dev/api/month",
  },
  nosana: {
    name: "Nosana",
    detail: "GPU compute",
    token: "NOS",
    website: "https://nosana.com/",
    guide: "https://learn.nosana.com/",
    explorer: "https://dashboard.nosana.com/",
  },
  gonka: {
    name: "Gonka",
    detail: "AI inference",
    token: "GNK",
    website: "https://gonka.ai/",
    guide: "https://gonka.ai/docs/host/quickstart/",
    explorer: "https://gonka.ai/docs/host/network-node-api/",
  },
  akash: {
    name: "Akash",
    detail: "Cloud compute",
    token: "AKT",
    website: "https://akash.network/",
    guide: "https://akash.network/docs/providers/getting-started/",
    explorer: "https://console.akash.network/providers",
  },
  ionet: {
    name: "io.net",
    detail: "GPU compute",
    token: "IO",
    website: "https://io.net/",
    guide: "https://io.net/docs/reference/io-explorer/get-device-details",
    explorer: "https://explorer.io.net/",
  },
  vast: {
    name: "Vast.ai",
    detail: "GPU rental",
    token: "USD",
    website: "https://vast.ai/",
    guide: "https://docs.vast.ai/host/hosting-overview",
    explorer: "https://console.vast.ai/host/machines",
  },
  golem: {
    name: "Golem",
    detail: "Distributed compute",
    token: "GLM",
    website: "https://golem.network/",
    guide: "https://docs.golem.network/docs/providers/quickstarts/provider-quickstart",
    explorer: "https://stats.golem.network/",
  },
} as const;

export function isMiningProject(value: unknown): value is MiningProject {
  return value === "xid" || value === "quantus";
}

export function isMonitorProject(value: unknown): value is MonitorProject {
  return (
    isMiningProject(value) ||
    value === "flyai" ||
    isComputeProject(value) ||
    value === "akash" ||
    value === "ionet" ||
    value === "vast" ||
    value === "golem"
  );
}

export function projectPath(locale: string, project: ProjectId) {
  return project === "iota" ? `/${locale}/app` : `/${locale}/projects/${project}`;
}

export function projectEntity(project: ProjectId) {
  return {
    "@type": "Thing",
    "@id": `https://iotahome.site/#project-${project}`,
    name:
      project === "iota"
        ? "IOTA Train at Home"
        : project === "xid"
          ? "xCoin (XID)"
          : project === "quantus"
            ? "Quantus (QTC)"
            : project === "flyai"
              ? "fly.ai Compute"
              : PROJECTS[project].name,
    alternateName:
      project === "iota"
        ? ["Macrocosmos IOTA", "Train at Home"]
        : project === "xid"
          ? ["xCoin", "XID"]
          : project === "quantus"
            ? ["Quantus", "QTC"]
            : project === "flyai"
              ? ["fly.ai", "FlyAI Compute"]
              : [PROJECTS[project].name, PROJECTS[project].token],
    sameAs: PROJECTS[project].website,
  };
}

export function validProjectAddress(project: MiningProject, value: unknown): value is string {
  if (typeof value !== "string" || value !== value.trim() || value.length > 100) return false;
  if (project === "quantus") {
    const decoded = decodeSs58(value);
    return decoded.ok && decoded.value.networkPrefix === 189;
  }
  try {
    const decoded = bech32m.decode(value as `${string}1${string}`, 100);
    // xCoin witness-v3 mainnet address: version 3 + 32-byte key commitment.
    return (
      value === value.toLowerCase() &&
      decoded.prefix === "xpa" &&
      decoded.words[0] === 3 &&
      bech32m.fromWords(decoded.words.slice(1)).length === 32
    );
  } catch {
    return false;
  }
}

/** Exact decimal conversion; never pass chain integers through floating point. */
export function qtcAmount(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{1,60}$/.test(value)) return null;
  const units = BigInt(value);
  const decimals = (units % 1_000_000_000_000n).toString().padStart(12, "0").replace(/0+$/, "");
  return `${units / 1_000_000_000_000n}${decimals ? `.${decimals}` : ""}`;
}

export type ProjectWorker = {
  address: string;
  name: string;
  hashrate: number | null;
  reportedHashrate: number | null;
  shares: number | null;
  lastSeen: number | null;
};
export type ProjectBlock = {
  height: number;
  timestamp: number | null;
  reward: string | null;
  miner: string | null;
};
export type ProjectNetwork = {
  height: number | null;
  chainHashrate: number | null;
  poolHashrate: number | null;
  poolStale: boolean;
  listedWorkers: number | null;
  minersEverRewarded: number | null;
  accounts: number | null;
  difficulty: number | null;
  blockSeconds: number | null;
  sourceUpdatedAt: number | null;
  workers: ProjectWorker[];
  balances: Record<string, number>;
  minedBlocks: Record<string, number>;
  blocks: ProjectBlock[];
  series: { height: number; value: number }[];
};
export type ProjectAccount = {
  address: string;
  found: boolean;
  today: string | null;
  lifetime: string | null;
  blocks: number | null;
  recent: ProjectBlock[];
};
export type ProjectResult<T> = {
  data: T | null;
  fetchedAt: number | null;
  stale: boolean;
  error: string | null;
};
export type SavedProjectAddress = { address: string; name: string };
export function parseProjectList(project: MiningProject, value: unknown): SavedProjectAddress[] {
  if (!Array.isArray(value)) throw new Error("invalid-list");
  const seen = new Set<string>();
  return value.map((item) => {
    const row = record(item);
    if (
      !validProjectAddress(project, row["address"]) ||
      typeof row["name"] !== "string" ||
      row["name"].length > 40 ||
      seen.has(row["address"])
    )
      throw new Error("invalid-list");
    seen.add(row["address"]);
    return { address: row["address"], name: row["name"] };
  });
}

type RecordValue = Record<string, unknown>;
export function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RecordValue) : {};
}
export function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
function time(value: unknown): number | null {
  if (typeof value === "number") return value > 0 && Number.isFinite(value) ? value * 1000 : null;
  const t = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(t) ? t : null;
}
function numbers(value: unknown): Record<string, number> {
  return Object.fromEntries(
    Object.entries(record(value)).filter(
      (pair): pair is [string, number] => finite(pair[1]) !== null,
    ),
  );
}

export function parseXidNetwork(input: unknown, statsInput: unknown): ProjectNetwork {
  const n = record(input),
    stats = record(statsInput);
  if (
    finite(n["height"]) === null ||
    !Array.isArray(n["leaderboard"]) ||
    finite(stats["height"]) === null
  )
    throw new Error("invalid-data");
  const workers = n["leaderboard"]
    .map(record)
    .filter((w) => validProjectAddress("xid", w["address"]) && typeof w["worker"] === "string")
    .map((w) => ({
      address: w["address"] as string,
      name: (w["worker"] as string).slice(0, 80),
      hashrate: finite(w["hashrate_mhs"]),
      reportedHashrate: finite(w["reported_hashrate_mhs"]),
      shares: finite(w["shares"]),
      lastSeen: time(w["last"]),
    }));
  return {
    height: finite(n["height"]),
    chainHashrate: finite(n["chain_hashrate_mhs"]),
    poolHashrate: finite(n["pool_hashrate_mhs"]),
    poolStale: n["pool_stale"] !== false,
    listedWorkers: finite(n["active_miners"]),
    minersEverRewarded: null,
    accounts: null,
    difficulty: finite(n["difficulty"]),
    blockSeconds: null,
    sourceUpdatedAt: time(n["updated"]),
    workers,
    balances: numbers(n["balances"]),
    minedBlocks: numbers(n["chain_blocks"]),
    blocks: [],
    series: Array.isArray(stats["series"])
      ? stats["series"]
          .map(record)
          .filter((p) => finite(p["h"]) !== null && finite(p["d"]) !== null)
          .map((p) => ({ height: p["h"] as number, value: p["d"] as number }))
      : [],
  };
}

export function parseQuantusNetwork(input: unknown): ProjectNetwork {
  const n = record(input),
    stats = record(n["stats"]);
  if (finite(stats["block_height"]) === null || !Array.isArray(n["blocks"]))
    throw new Error("invalid-data");
  const blocks = n["blocks"]
    .map(record)
    .filter((b) => finite(b["height"]) !== null)
    .map((b) => ({
      height: b["height"] as number,
      timestamp: time(b["timestamp"]),
      reward: qtcAmount(b["reward"]),
      miner: typeof b["mined_by_id"] === "string" ? b["mined_by_id"] : null,
    }));
  const chronological = [...blocks].sort((a, b) => a.height - b["height"]);
  const series = chronological.flatMap((b, i) => {
    const prior = chronological[i - 1];
    return prior?.timestamp &&
      b["timestamp"] &&
      b["height"] === prior.height + 1 &&
      b["timestamp"] >= prior.timestamp
      ? [{ height: b["height"], value: (b["timestamp"] - prior.timestamp) / 1000 }]
      : [];
  });
  return {
    height: finite(stats["block_height"]),
    chainHashrate: null,
    poolHashrate: null,
    poolStale: false,
    listedWorkers: null,
    minersEverRewarded: finite(stats["total_miners"]),
    accounts: finite(stats["total_accounts"]),
    difficulty: null,
    blockSeconds: series.length
      ? series.reduce((sum, p) => sum + p["value"], 0) / series.length
      : null,
    sourceUpdatedAt: blocks[0]?.timestamp ?? null,
    workers: [],
    balances: {},
    minedBlocks: {},
    blocks,
    series,
  };
}

export function parseQuantusAccount(input: unknown, address: string): ProjectAccount {
  const n = record(input),
    account = record(n["account"]),
    today = record(record(n["today"])["aggregate"]),
    sum = record(today["sum"]);
  if (
    !("account" in n) ||
    (n["account"] !== null &&
      (!n["account"] || typeof n["account"] !== "object" || Array.isArray(n["account"]))) ||
    !Array.isArray(n["recent"]) ||
    finite(today["count"]) === null
  )
    throw new Error("invalid-data");
  return {
    address,
    found: n["account"] !== null,
    today: today["count"] === 0 ? "0" : qtcAmount(sum["reward"]),
    lifetime: qtcAmount(account["total_rewards"]),
    blocks: finite(account["total_mined_blocks"]),
    recent: n["recent"]
      .map(record)
      .filter((b) => finite(record(b["block"])["height"]) !== null)
      .map((b) => ({
        height: record(b["block"])["height"] as number,
        timestamp: time(b["timestamp"]),
        reward: qtcAmount(b["reward"]),
        miner: address,
      })),
  };
}
