import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { agentOnline, type AgentInfo } from "@/lib/device-agent";
import { batchItemState, type AgentBatch, type BatchItem } from "@/lib/agent-batch";
import { getAgentBatches, submitAgentBatch } from "@/lib/agent-batch.functions";
import { useBilling } from "@/hooks/use-billing";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { batchCopy } from "./agent-batch-copy";
import { agentCopy } from "./device-agent-copy";
import "./agent-batch.css";

export function AgentBatchPanel({
  agents,
  names,
  locale,
  now,
  preview = false,
  userId,
  unpaired = [],
  previewPlan = "pro",
}: {
  agents: AgentInfo[];
  names: Record<string, string>;
  locale: SiteLocale;
  now: number;
  preview?: boolean;
  userId: string | null;
  unpaired?: { id: string; name: string }[];
  previewPlan?: "free" | "pro";
}) {
  const t = batchCopy(locale),
    read = useServerFn(getAgentBatches),
    send = useServerFn(submitAgentBatch);
  const billing = useBilling(userId, !preview);
  const pro = preview ? previewPlan === "pro" : billing.data?.plan === "pro";
  const membershipPending = !preview && (billing.isPending || billing.isError);
  const [action, setAction] = useState<"start" | "stop" | "restart">("restart");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState<string[]>([]),
    [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false),
    [demo, setDemo] = useState<AgentBatch[]>([]);
  const request = useRef<{
    id: string;
    deviceIds: string[];
    action: "start" | "stop" | "restart";
  } | null>(null);
  const lock = useRef(false);
  const q = useQuery({
    queryKey: ["agent-batches", userId],
    queryFn: () => read(),
    enabled: !preview && !!userId,
    refetchInterval: (query) =>
      query.state.data?.some((batch) =>
        batch.items.some(
          (item) =>
            item.status === "queued" ||
            item.status === "claimed" ||
            (item.status === "done" && Date.now() - Date.parse(item.finishedAt ?? "") < 180000),
        ),
      )
        ? 5000
        : 30000,
    retry: false,
  });
  const batches = preview ? demo : (q.data ?? []);
  useEffect(() => {
    if (!error || !request.current || !q.data?.some((batch) => batch.id === request.current?.id)) return;
    // A lost response must not leave an already accepted request stuck in confirmation.
    request.current = null;
    setError(false);
    setSelected([]);
    setReview(false);
    setOpen(false);
  }, [error, q.data]);
  function eligible(a: AgentInfo) {
    return agentOnline(a.lastSeen, now) && !a.pending;
  }
  async function submit() {
    if (lock.current || !pro) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    request.current ??= { id: crypto.randomUUID(), deviceIds: [...selected], action };
    try {
      if (!preview) await queryClient.cancelQueries({ queryKey: ["agent-batches", userId] });
      if (preview) {
        const stamp = new Date().toISOString();
        setDemo(
          [
            {
              id: request.current.id,
              action: request.current.action,
              createdAt: stamp,
              items: request.current.deviceIds.map((id, i) => ({
                deviceId: id,
                name: names[id] ?? "Mac",
                disposition: "queued" as const,
                commandId: crypto.randomUUID(),
                status: "done" as const,
                finishedAt: stamp,
                lastSeen: stamp,
                snapshot: {
                  workerRunning: request.current!.action !== "stop",
                  appRunning: request.current!.action !== "stop",
                  ...(i % 2 === 0
                    ? { queue: { position: 182, observedAt: stamp } }
                    : {
                        trainingState: {
                          phase: "training" as const,
                          status: "forward" as const,
                          observedAt: stamp,
                        },
                      }),
                },
              })),
            },
            ...demo,
          ].slice(0, 5),
        );
      } else {
        const result = await send({ data: request.current });
        queryClient.setQueryData(["agent-batches", userId], result);
      }
      request.current = null;
      setSelected([]);
      setReview(false);
      setOpen(false);
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const shown = batches;
  return (
    <section className="agent-batch-panel">
      <div className="agent-batch-heading">
        <div>
          <h2>
            {t.title} <span className="agent-pro-badge">PRO</span>
          </h2>
          <p>{t.intro}</p>
        </div>
        <div className="agent-bulk-actions">
          {(["start", "stop", "restart"] as const).map((value) =>
            pro || membershipPending ? (
              <button
                className="fleet-outline"
                type="button"
                key={value}
                disabled={busy || !!request.current || membershipPending}
                onClick={() => {
                  setAction(value);
                  setReview(false);
                  setOpen(true);
                }}
              >
                {t[value]}
              </button>
            ) : (
              <a className="fleet-outline" key={value} href={`/${locale}/devices?view=membership`}>
                {t[value]} ↗
              </a>
            ),
          )}
        </div>
      </div>
      {!pro && !membershipPending && (
        <p className="agent-pro-note">
          {t.proNote} <a href={`/${locale}/devices?view=membership`}>{t.upgrade} ↗</a>
        </p>
      )}
      {open && pro && (
        <div className="agent-batch-picker">
          {!review && (
            <button
              className="agent-batch-text"
              type="button"
              onClick={() => setSelected(agents.filter(eligible).map((a) => a.deviceId))}
            >
              {t.all}
            </button>
          )}
          <div className="agent-batch-targets">
            {!review &&
              unpaired.map((device) => (
                <div className="agent-batch-unpaired" key={device.id}>
                  <strong>{device.name}</strong>
                  <span>{t.unpaired}</span>
                  <a href={`/${locale}/machines?device=${encodeURIComponent(device.id)}`}>
                    {t.connect} ↗
                  </a>
                </div>
              ))}
            {agents
              .filter((a) => !review || selected.includes(a.deviceId))
              .map((a) => (
                <label key={a.deviceId}>
                  {!review && (
                    <input
                      type="checkbox"
                      checked={selected.includes(a.deviceId)}
                      disabled={!eligible(a)}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, a.deviceId]
                            : selected.filter((id) => id !== a.deviceId),
                        )
                      }
                    />
                  )}
                  <strong>{names[a.deviceId] ?? "Mac"}</strong>
                  <span>
                    {!agentOnline(a.lastSeen, now) ? t.offline : a.pending ? t.busy : "IOTA"}
                  </span>
                </label>
              ))}
          </div>
          {review && (
            <p className="agent-batch-warning">
              {action === "stop" ? t.stopWarning : action === "start" ? t.startWarning : t.warning}
            </p>
          )}
          <div className="agent-batch-buttons">
            <button
              className="site-button"
              type="button"
              disabled={busy || selected.length === 0 || selected.length > 50}
              onClick={() => (review ? void submit() : setReview(true))}
            >
              {busy
                ? t.sending
                : review
                  ? `${agentCopy[action][locale]} · ${t.confirm} · ${selected.length}`
                  : `${t.next} · ${selected.length}`}
            </button>
            {!request.current && (
              <button
                className="fleet-outline"
                type="button"
                disabled={busy}
                onClick={() => (review ? setReview(false) : setOpen(false))}
              >
                {t.cancel}
              </button>
            )}
          </div>
        </div>
      )}
      {error && (
        <p role="alert">
          {t.error}{" "}
          <button className="fleet-outline" disabled={busy} onClick={() => void submit()}>
            {t.retry}
          </button>
        </p>
      )}
      {q.isError && !preview && <p role="status">{t.unavailable}</p>}
      {shown.length > 0 && (
        <div className="agent-batch-history">
          <h3>{t.results}</h3>
          <p>{t.note}</p>
          {shown.map((batch, index) => (
            <details key={batch.id} open={index === 0}>
              <summary>
                IOTA · {agentCopy[batch.action][locale]} · {batch.items.length} ·{" "}
                {new Date(batch.createdAt).toLocaleString(LANGUAGE_TAG[locale])}
              </summary>
              <ul aria-live="polite">
                {batch.items.map((item) => (
                  <BatchRow
                    key={item.deviceId}
                    item={item}
                    action={batch.action}
                    now={now}
                    locale={locale}
                    onRetry={
                      pro &&
                      !busy &&
                      !request.current &&
                      agents.some((a) => a.deviceId === item.deviceId && eligible(a))
                        ? () => {
                            setAction(batch.action);
                            setSelected([item.deviceId]);
                            setReview(true);
                            setOpen(true);
                          }
                        : undefined
                    }
                  />
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
function BatchRow({
  item,
  now,
  locale,
  action,
  onRetry,
}: {
  item: BatchItem;
  now: number;
  locale: SiteLocale;
  action: AgentBatch["action"];
  onRetry?: (() => void) | undefined;
}) {
  const state = batchItemState(item, now, action),
    t = batchCopy(locale);
  return (
    <li data-state={state}>
      <strong>{item.name}</strong>
      <span>{state === "unavailable" ? t.missing : t[state]}</span>
      {onRetry && (state === "failed" || state === "expired") && (
        <button type="button" className="fleet-outline" onClick={onRetry}>
          {
            {
              zh: "重试这台",
              "zh-TW": "重試這台",
              en: "Retry this device",
              ko: "이 기기 재시도",
              ja: "この端末を再試行",
            }[locale]
          }
        </button>
      )}
    </li>
  );
}
