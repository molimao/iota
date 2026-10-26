import { REFRESH_INTERRUPTED_MS, validFetchedAt, type DeviceStatus } from "./device-status";
import { z } from "zod";
export const agentAction = z.enum(["start", "stop", "restart", "update"]);
export const agentBindingManifest = z
  .array(
    z
      .object({
        id: z.string().uuid(),
        project: z.enum(["bnt", "prl", "noid", "xmr"]),
        identifier: z.string().min(1).max(200),
        worker: z.string().max(80),
      })
      .strict(),
  )
  .max(8);
export const localMinerObservation = z
  .object({
    project: z.enum(["xmr", "bnt", "prl", "noid"]),
    software: z.enum(["xmrig", "seine", "pearl-metal", "noid-mac"]),
    bindingId: z.string().uuid(),
    observedAt: z.string().datetime({ offset: true }),
    status: z.enum(["ok", "unavailable", "unauthorized", "stopped", "process"]),
    appCpu: z.number().finite().min(0).max(10000).nullable().optional(),
    processMemoryMb: z.number().finite().min(0).max(1e6).nullable().optional(),
    rateUnit: z.enum(["H/s", "tiles/s"]).optional(),
    rateWindow: z.enum(["10s", "60s", "session"]).optional(),
    counterUnit: z.enum(["shares", "blocks"]).optional(),
    hashrate10s: z.number().finite().min(0).max(1e15).nullable(),
    hashrate60s: z.number().finite().min(0).max(1e15).nullable(),
    hashrateSession: z.number().finite().min(0).max(1e15).nullable().optional(),
    accepted: z.number().int().min(0).max(1e15).nullable(),
    rejected: z.number().int().min(0).max(1e15).nullable(),
    uptime: z.number().int().min(0).max(1e15).nullable(),
  })
  .strict()
  .refine(
    (v) =>
      ({ xmrig: "xmr", seine: "bnt", "pearl-metal": "prl", "noid-mac": "noid" })[v.software] ===
      v.project,
    "Miner software and project mismatch",
  );
export const trainingStateSchema = z
  .object({
    phase: z.enum(["training", "weights_uploading", "merging_partitions"]),
    status: z.enum([
      "forward",
      "backward",
      "idle",
      "uploading_weights",
      "merging_partitions",
      "initializing",
      "frozen",
      "kicked",
    ]),
    observedAt: z.string().datetime({ offset: true }),
  })
  .strict();
export const agentSnapshot = z
  .object({
    appRunning: z.boolean(),
    workerRunning: z.boolean(),
    appCpu: z.number().finite().min(0).max(10000).nullable(),
    processMemoryMb: z.number().finite().min(0).max(1000000).nullable(),
    load: z.number().finite().min(0).max(10000).nullable(),
    version: z.string().regex(/^\d{1,4}\.\d{1,4}\.\d{1,4}$/),
    queue: z
      .object({
        position: z.number().int().min(0).max(10000000),
        observedAt: z.string().datetime({ offset: true }),
      })
      .strict()
      .nullable()
      .optional(),
    appSelectedRun: z
      .object({
        id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/),
        observedAt: z.string().datetime({ offset: true }),
      })
      .strict()
      .nullable()
      .optional(),
    trainingState: trainingStateSchema.nullable().optional(),
    logs: z.string().max(12000).optional(),
    miners: z
      .array(localMinerObservation)
      .max(8)
      .refine(
        (v) => new Set(v.map((m) => m.bindingId)).size === v.length,
        "Duplicate miner binding",
      )
      .optional(),
    recovery: z.enum(["idle", "restarted", "cooldown", "paused"]).default("idle"),
  })
  .strict();
export const agentBeat = z
  .object({
    requestBindings: z.literal(true).optional(),
    snapshot: agentSnapshot,
    ack: z.object({ id: z.string().uuid(), success: z.boolean() }).strict().nullable().optional(),
  })
  .strict();
export type AgentSnapshot = z.infer<typeof agentSnapshot>;
export type AgentInfo = {
  deviceId: string;
  lastSeen: string | null;
  snapshot: Partial<AgentSnapshot>;
  logsEnabled: boolean;
  recoveryEnabled: boolean;
  pending: { id: string; action: string; status: string } | null;
  latestCommand: { action: string; status: string; createdAt: string } | null;
};
/** Redact before storing; agent-side redaction provides a second layer. */
export function redactAgentLog(input: string) {
  return input
    .replace(/(?:Bearer\s+)[^\s"']+/gi, "Bearer [redacted]")
    .replace(/\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9]+\b/g, "[redacted]")
    .replace(
      /((?:token|secret|password|authorization|api[_-]?key|seed|mnemonic|private[_-]?key)\s*[=:]\s*)[^\n]+/gi,
      "$1[redacted]",
    )
    .replace(/https?:\/\/[^\s"']+/g, "[url]")
    .replace(/\/Users\/[^/\s]+/g, "/Users/[user]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email]")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[ip]")
    .replace(/\b[A-Za-z0-9_+/=-]{32,}\b/g, "[identifier]")
    .split("")
    .filter((c) => c >= " " || c === "\n" || c === "\t")
    .join("")
    .slice(-12000);
}
export function agentOnline(lastSeen: string | null, now = Date.now()) {
  const t = lastSeen ? Date.parse(lastSeen) : NaN;
  return Number.isFinite(t) && t <= now + 5000 && now - t < 60000;
}

export const AGENT_RELEASE = "1.0.13";
export const AGENT_DOWNLOAD_URL = `/downloads/iota-watch-agent-${AGENT_RELEASE}.zip`;
export function agentCanUpdate(version?: string) {
  if (!version || !/^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(version)) return false;
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);
  return major > 1 || (major === 1 && (minor > 0 || patch >= 2));
}

/** Newer supported semantic versions must never be offered a downgrade. */
export function agentUpdateAvailable(version?: string) {
  if (!version || !/^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(version)) return false;
  const current = version.split(".").map(Number),
    target = AGENT_RELEASE.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (current[i] !== target[i]) return current[i]! < target[i]!;
  }
  return false;
}

/** Local evidence only: a live process is not proof of training contribution. */
export type AgentPhase =
  | "offline"
  | "unknown"
  | "stopped"
  | "workerStopped"
  | "queued"
  | "running"
  | "preparing"
  | "blocked"
  | "working"
  | "waiting"
  | "uploading"
  | "merging";
export function agentPhase(
  agent: Pick<AgentInfo, "snapshot" | "lastSeen">,
  now = Date.now(),
): AgentPhase {
  if (!agentOnline(agent.lastSeen, now)) return "offline";
  const s = agent.snapshot;
  // The worker process is the training executable. GUI presence is not required.
  if (s.workerRunning !== true) {
    if (s.appRunning === false) return "stopped";
    if (s.appRunning !== true || s.workerRunning !== false) return "unknown";
    return "workerStopped";
  }
  const queueAge = s.queue ? now - Date.parse(s.queue.observedAt) : Infinity;
  const queued = !!s.queue && s.queue.position > 0 && queueAge >= 0 && queueAge <= 300000;
  const state = s.trainingState;
  const age = state ? now - Date.parse(state.observedAt) : Infinity;
  const fresh = !!state && age >= 0 && age <= 300000;
  if (queued && (!fresh || Date.parse(s.queue!.observedAt) >= Date.parse(state.observedAt)))
    return "queued";
  if (fresh) {
    if (state.status === "initializing" || state.status === "frozen") return "preparing";
    if (state.status === "kicked") return "blocked";
    if (state.phase === "weights_uploading") return "uploading";
    if (state.phase === "merging_partitions") return "merging";
    if (state.status === "forward" || state.status === "backward") return "working";
    // Orchestrator idle is not evidence that this miner has no training work.
    return "running";
  }
  return "running";
}

export type OfficialTrainingEvidence = { status: DeviceStatus; fetchedAt: number | null };
/** Combine account-matched evidence without hiding explicit local stop/queue/stage signals.
 * Fetch freshness is separate from the upstream statistics sample time.
 */
export function agentDisplayPhase(
  agent: Pick<AgentInfo, "snapshot" | "lastSeen">,
  official?: OfficialTrainingEvidence,
  now = Date.now(),
): AgentPhase | "training" {
  const phase = agentPhase(agent, now);
  if (!["running", "working"].includes(phase)) return phase;
  const fetchedAt = validFetchedAt(official?.fetchedAt);
  if (
    !official ||
    fetchedAt === null ||
    fetchedAt > now + 5000 ||
    now - fetchedAt > REFRESH_INTERRUPTED_MS
  )
    return phase;
  if (official.status === "contributing") return "training";
  // Positive local computation is stronger than a zero in an aggregated statistics sample.
  if (official.status === "waiting" && phase === "running") return "waiting";
  return phase;
}

// Keep the persisted filter key for existing links; its visible label says process running.
export const AGENT_FILTERS = [
  "all",
  "online",
  "training",
  "queued",
  "stopped",
  "offline",
  "unpaired",
] as const;
export type AgentFilter = (typeof AGENT_FILTERS)[number];
export function matchesAgentFilter(
  agent: AgentInfo | undefined,
  filter: AgentFilter,
  now = Date.now(),
) {
  if (filter === "all") return true;
  if (filter === "unpaired") return !agent;
  if (!agent) return false;
  if (filter === "online") return agentOnline(agent.lastSeen, now);
  const phase = agentPhase(agent, now);
  if (filter === "stopped") return phase === "stopped" || phase === "workerStopped";
  if (filter === "training")
    return ["running", "working", "waiting", "uploading", "merging", "preparing"].includes(phase);
  return phase === filter;
}

export const agentHistoryPointSchema = z
  .object({
    sampledAt: z.string().datetime({ offset: true }),
    snapshot: agentSnapshot.pick({
      appRunning: true,
      workerRunning: true,
      queue: true,
      trainingState: true,
    }),
  })
  .strict();
export type AgentHistoryPoint = z.infer<typeof agentHistoryPointSchema>;
