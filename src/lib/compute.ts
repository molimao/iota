import { base58, bech32 } from "@scure/base";
import { finite, record, type ComputeProject } from "./projects";

export function validComputeId(project: ComputeProject, id: string) {
  if (id !== id.trim() || id.length > 100) return false;
  try {
    if (project === "nosana")
      return id.length >= 32 && id.length <= 44 && base58.decode(id).length === 32;
    const address = bech32.decode(id as `${string}1${string}`);
    return (
      id === id.toLowerCase() &&
      address.prefix === "gonka" &&
      bech32.fromWords(address.words).length === 20
    );
  } catch {
    return false;
  }
}
export type ComputeSnapshot = {
  project: ComputeProject;
  active: number;
  completed: number | null;
  epoch: string | null;
  height: string | null;
  sourceUpdatedAt: number | null;
  participants: { address: string; weight: string | null; models: string[]; nodes: number }[];
};
export type NosanaNode = { running: number; completed: number; sourceUpdatedAt: number | null };
function count(value: unknown) {
  const n = finite(value);
  if (n === null || !Number.isSafeInteger(n)) throw new Error("invalid-data");
  return n;
}
function updated(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value * 1000 : null;
}
export function parseNosanaNode(stats: unknown, jobs: unknown): NosanaNode {
  const s = record(stats),
    j = record(jobs);
  if (!Array.isArray(j["jobs"])) throw new Error("invalid-data");
  return {
    completed: count(s["completed"]),
    running: count(j["totalJobs"]),
    sourceUpdatedAt: updated(s["retrieved"]),
  };
}
export function parseNosanaNetwork(stats: unknown, jobs: unknown): ComputeSnapshot {
  const n = parseNosanaNode(stats, jobs);
  return {
    project: "nosana",
    active: n.running,
    completed: n.completed,
    epoch: null,
    height: null,
    sourceUpdatedAt: n.sourceUpdatedAt,
    participants: [],
  };
}
export function parseGonkaNetwork(input: unknown): ComputeSnapshot {
  const root = record(input),
    active = record(root["active_participants"]);
  if (!Array.isArray(active["participants"]) || !/^\d+$/.test(String(active["epoch_id"])))
    throw new Error("invalid-data");
  const participants = active["participants"].map((entry: unknown) => {
    const p = record(entry);
    if (
      typeof p["index"] !== "string" ||
      !validComputeId("gonka", p["index"]) ||
      !Array.isArray(p["models"])
    )
      throw new Error("invalid-data");
    const nodes = new Set<string>();
    if (Array.isArray(p["ml_nodes"]))
      for (const group of p["ml_nodes"]) {
        const list = record(group)["ml_nodes"];
        if (Array.isArray(list))
          for (const node of list) {
            const id = record(node)["node_id"];
            if (typeof id === "string") nodes.add(id);
          }
      }
    return {
      address: p["index"],
      weight: /^\d+$/.test(String(p["weight"])) ? String(p["weight"]) : null,
      models: p["models"].filter((m): m is string => typeof m === "string"),
      nodes: nodes.size,
    };
  });
  const block = Array.isArray(root["block"]) ? record(root["block"][0]) : record(root["block"]);
  const header = record(block["header"]);
  const stamp = typeof header["time"] === "string" ? Date.parse(header["time"]) : NaN;
  return {
    project: "gonka",
    active: participants.length,
    completed: null,
    epoch: String(active["epoch_id"]),
    height:
      typeof header["height"] === "string" || typeof header["height"] === "number"
        ? String(header["height"])
        : null,
    sourceUpdatedAt: Number.isFinite(stamp) ? stamp : null,
    participants,
  };
}
