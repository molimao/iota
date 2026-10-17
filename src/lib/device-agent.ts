import { z } from "zod";
export const agentAction = z.enum(["start", "stop", "restart", "update"]);
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
    logs: z.string().max(12000).optional(),
    recovery: z.enum(["idle", "restarted", "cooldown", "paused"]).default("idle"),
  })
  .strict();
export const agentBeat = z
  .object({
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
  return Number.isFinite(t) && t <= now + 5000 && now - t < 90000;
}

export const AGENT_RELEASE = "1.0.5";
export const AGENT_DOWNLOAD_URL = `/downloads/iota-watch-agent-${AGENT_RELEASE}.zip`;
export function agentCanUpdate(version?: string) {
  if (!version || !/^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(version)) return false;
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);
  return major > 1 || (major === 1 && (minor > 0 || patch >= 2));
}

export const AGENT_FILTERS = ["all", "online", "training", "queued", "stopped", "offline", "unpaired"] as const;
export type AgentFilter = typeof AGENT_FILTERS[number];
export function matchesAgentFilter(agent: AgentInfo | undefined, filter: AgentFilter, now = Date.now()) {
  if (filter === "all") return true;
  if (filter === "unpaired") return !agent;
  if (!agent) return false;
  const online = agentOnline(agent.lastSeen, now);
  if (filter === "online") return online;
  if (filter === "offline") return !online;
  if (!online) return false;
  const s = agent.snapshot;
  if (filter === "stopped") return s.appRunning === false;
  const age = s.queue ? now - Date.parse(s.queue.observedAt) : Infinity;
  const queued = !!s.appRunning && !!s.workerRunning && age >= 0 && age <= 300000 && !!s.queue && s.queue.position > 0;
  if (filter === "queued") return queued;
  return !!s.appRunning && !!s.workerRunning && !queued;
}
