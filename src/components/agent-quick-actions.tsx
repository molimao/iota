import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { submitAgentBatch } from "@/lib/agent-batch.functions";
import { agentOnline, type AgentInfo } from "@/lib/device-agent";
import { agentCopy } from "./device-agent-copy";
import { batchCopy } from "./agent-batch-copy";
import { useLocale } from "./site/locale";
import "./agent-batch.css";

type Action = "start" | "stop" | "restart";
export function AgentQuickActions({
  agent,
  now,
  preview = false,
  onPreviewAction,
}: {
  agent: AgentInfo;
  now: number;
  preview?: boolean;
  onPreviewAction?: (action: Action) => void;
}) {
  const { locale } = useLocale(),
    auth = useAuth(),
    client = useQueryClient();
  const submit = useServerFn(submitAgentBatch),
    t = batchCopy(locale);
  const [confirm, setConfirm] = useState<Action | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const lock = useRef(false);
  const request = useRef<{ id: string; deviceIds: string[]; action: Action } | null>(null);
  const disabled = busy || !!agent.pending || !agentOnline(agent.lastSeen, now);
  useEffect(() => {
    if (!confirm) return;
    const timer = setTimeout(() => setConfirm(null), 30000);
    return () => clearTimeout(timer);
  }, [confirm]);
  async function execute(action: Action) {
    if (lock.current || disabled) return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    setConfirm(null);
    try {
      if (preview) {
        onPreviewAction?.(action);
        setMessage(t.sent);
      } else {
        request.current ??= { id: crypto.randomUUID(), deviceIds: [agent.deviceId], action };
        await client.cancelQueries({ queryKey: ["agent-batches", auth.userId] });
        const result = await submit({ data: request.current });
        client.setQueryData(["agent-batches", auth.userId], result);
        request.current = null;
        setMessage(t.submitted);
      }
      if (!preview) await client.invalidateQueries({ queryKey: ["device-agents", auth.userId] });
    } catch {
      setMessage(t.actionError);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (agent.snapshot.monitorOnly || agent.snapshot.platform === "linux") return null;
  return (
    <details className="agent-quick-actions">
      <summary>{t.operations}</summary>
      <div className="agent-quick-buttons">
        {(["start", "stop", "restart"] as const).map((action) => (
          <button
            key={action}
            type="button"
            disabled={disabled || (!!request.current && action !== request.current.action)}
            onClick={() => (action === "start" ? void execute(action) : setConfirm(action))}
          >
            {agentCopy[action][locale]}
          </button>
        ))}
      </div>
      {confirm && (
        <div className="agent-quick-confirm">
          <p>{confirm === "stop" ? t.stopWarning : t.warning}</p>
          <button type="button" disabled={disabled} onClick={() => void execute(confirm)}>
            {agentCopy.confirm[locale]} · {agentCopy[confirm][locale]}
          </button>
          <button type="button" disabled={busy} onClick={() => setConfirm(null)}>
            {t.cancel}
          </button>
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </details>
  );
}
