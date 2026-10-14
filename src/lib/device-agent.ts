import { z } from "zod";
export const agentAction = z.enum(["start", "stop", "restart"]);
export const agentSnapshot = z
  .object({
    appRunning: z.boolean(),
    workerRunning: z.boolean(),
    appCpu: z.number().finite().min(0).max(10000).nullable(),
    processMemoryMb: z.number().finite().min(0).max(1000000).nullable(),
    load: z.number().finite().min(0).max(10000).nullable(),
    version: z.enum(["1.0.0", "1.0.1"]),
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
