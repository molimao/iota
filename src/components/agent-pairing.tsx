import { agentListInput } from "@/lib/device-agent";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { getDeviceAgents, pairDeviceAgent } from "@/lib/device-agent.functions";
import { getFleet } from "@/lib/fleet.functions";
import { AGENT_DOWNLOAD_URL, WINDOWS_AGENT_DOWNLOAD_URL } from "@/lib/device-agent";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useLocale } from "./site/locale";
import { agentCopy } from "./device-agent-copy";
import { pairingFlowCopy as flow } from "./agent-pairing-copy";
import { CheckCircle2, LoaderCircle, Download } from "lucide-react";
import "./agent-pairing.css";

export function AgentPairing({
  deviceId,
  preview = false,
  autoOpen = false,
  onDone,
  previewOutcome,
  deviceLabel,
}: {
  deviceId: string;
  preview?: boolean;
  deviceLabel?: string;
  autoOpen?: boolean;
  onDone?: () => void;
  previewOutcome?: "connected" | "expired" | "error";
}) {
  const { locale } = useLocale(),
    auth = useAuth(),
    now = useAgentClock();
  const client = useQueryClient();
  const [system, setSystem] = useState<"macOS" | "Windows">("macOS");
  const [downloaded, setDownloaded] = useState(false);
  const [issuedAt, setIssuedAt] = useState(0);
  const pair = useServerFn(pairDeviceAgent),
    list = useServerFn(getDeviceAgents),
    fleet = useServerFn(getFleet);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<{ token: string; expiresAt: number } | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const [copied, setCopied] = useState(false),
    [copyFailed, setCopyFailed] = useState(false);
  const actor = useRef(auth.userId);
  actor.current = auth.userId;
  const devices = useQuery({
    queryKey: ["fleet", auth.userId],
    queryFn: () => fleet(),
    enabled: open && !preview && !!auth.userId,
    staleTime: 15000,
  });
  const deviceName =
    deviceLabel ??
    (preview ? "Mac mini" : devices.data?.devices.find((d) => d.id === deviceId)?.name);
  const query = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => list(agentListInput()),
    enabled: open && !!code && !preview && !!auth.userId,
    refetchInterval: (q) =>
      q.state.data?.some(
        (a) => a.deviceId === deviceId && a.lastSeen && Date.parse(a.lastSeen) >= issuedAt,
      )
        ? false
        : open && code && now < code.expiresAt
          ? 3000
          : false,
    retry: false,
  });
  const connected =
    !!code &&
    (preview
      ? previewOutcome === "connected"
      : !!query.data?.some(
          (a) => a.deviceId === deviceId && a.lastSeen && Date.parse(a.lastSeen) >= issuedAt,
        ));
  useEffect(() => {
    if (connected) void client.invalidateQueries({ queryKey: ["fleet", auth.userId] });
  }, [connected, client, auth.userId]);
  useEffect(() => {
    setOpen(false);
    setCode(null);
  }, [auth.userId, deviceId]);
  useEffect(() => {
    if (autoOpen) void generate();
  }, [autoOpen]);
  function close() {
    setOpen(false);
    setCode(null);
    onDone?.();
  }
  async function generate() {
    setOpen(true);
    setBusy(true);
    setIssuedAt(Date.now());
    setCode(null);
    setDownloaded(false);
    setError(false);
    setCopied(false);
    setCopyFailed(false);
    const user = auth.userId;
    try {
      if (preview && previewOutcome === "error") throw new Error("preview");
      const result = preview
        ? {
            token: "DEMO-CODE-NOT-VALID",
            expiresAt: Date.now() + (previewOutcome === "expired" ? -1000 : 600000),
          }
        : await pair({ data: { deviceId } });
      if (actor.current === user) setCode(result);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {!autoOpen && (
        <button
          type="button"
          className="fleet-outline agent-pair-trigger"
          disabled={busy || (!preview && (!auth.ready || !auth.userId))}
          onClick={() => void generate()}
        >
          {agentCopy.pair[locale]}
        </button>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) close();
          else setOpen(true);
        }}
      >
        <DialogContent className="fleet-dialog agent-pair-dialog">
          <DialogTitle>
            {flow.title[locale]}
            {deviceName ? ` · ${deviceName}` : ""}
          </DialogTitle>
          <DialogDescription>
            {connected ? flow.finished[locale] : flow.intro[locale]}
          </DialogDescription>
          <ol className="agent-pair-progress" aria-label={flow.title[locale]}>
            {[flow.copy[locale], flow.install[locale], flow.connection[locale]].map(
              (label, index) => (
                <li
                  key={label}
                  aria-current={
                    !connected && (downloaded ? index === 2 : copied ? index === 1 : index === 0)
                      ? "step"
                      : undefined
                  }
                  data-complete={
                    connected || (index === 0 && copied) || (index === 1 && downloaded)
                  }
                >
                  <span>{index + 1}</span>
                  {label}
                </li>
              ),
            )}
          </ol>
          {preview && <p className="review-notice">{agentCopy.demo[locale]}</p>}
          {busy && <p role="status">{agentCopy.generatingCode[locale]}</p>}
          {error && <p role="alert">{agentCopy.error[locale]}</p>}
          {connected ? (
            <div className="agent-pair-success" role="status">
              <CheckCircle2 size={36} />
              <strong>{agentCopy.paired[locale]}</strong>
              <button className="site-button" onClick={close}>
                {flow.done[locale]}
              </button>
            </div>
          ) : (
            code &&
            !busy &&
            (now >= code.expiresAt ? (
              <p role="alert">{agentCopy.codeExpired[locale]}</p>
            ) : (
              <div className="agent-pair-code">
                <label>
                  <span className="agent-pair-label">
                    {agentCopy.pairingCode[locale]}
                    <small>
                      {flow.remaining[locale].replace(
                        "{n}",
                        String(
                          Math.min(10, Math.max(0, Math.ceil((code.expiresAt - now) / 60000))),
                        ),
                      )}
                    </small>
                  </span>
                  <input
                    readOnly
                    value={code.token}
                    onFocus={(event) => event.currentTarget.select()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </label>
                <button
                  type="button"
                  className="site-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(code.token);
                      setCopied(true);
                      setCopyFailed(false);
                    } catch {
                      setCopyFailed(true);
                    }
                  }}
                >
                  {copied ? agentCopy.copied[locale] : agentCopy.copyCode[locale]}
                </button>
                {copyFailed && (
                  <p className="agent-pair-feedback" role="status">
                    {agentCopy.copyFailed[locale]}
                  </p>
                )}
                <div className="agent-pair-install">
                  <div
                    className="agent-pair-systems"
                    role="group"
                    aria-label={flow.install[locale]}
                  >
                    {(["macOS", "Windows"] as const).map((os) => (
                      <button
                        type="button"
                        className="fleet-outline"
                        key={os}
                        aria-pressed={system === os}
                        onClick={() => setSystem(os)}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                  <a
                    className="site-button agent-pair-download"
                    href={system === "macOS" ? AGENT_DOWNLOAD_URL : WINDOWS_AGENT_DOWNLOAD_URL}
                    download
                    onClick={() => setDownloaded(true)}
                  >
                    <Download size={16} />
                    {system} · {flow.install[locale]}
                  </a>
                  <p>{flow.installHelp[locale]}</p>
                </div>
                <div className="agent-pair-wait" role="status">
                  <LoaderCircle size={16} />
                  {flow.waiting[locale]}
                </div>
                {query.isError && (
                  <p role="alert">
                    {flow.checkError[locale]}{" "}
                    <button
                      type="button"
                      className="fleet-outline"
                      onClick={() => void query.refetch()}
                    >
                      {flow.retry[locale]}
                    </button>
                  </p>
                )}
                <details className="agent-pair-help">
                  <summary>{flow.help[locale]}</summary>
                  <p>{flow.helpText[locale]}</p>
                </details>
              </div>
            ))
          )}
          {!connected && (error || (code && now >= code.expiresAt)) && (
            <button
              type="button"
              className="site-button"
              disabled={busy}
              onClick={() => void generate()}
            >
              {agentCopy.pair[locale]}
            </button>
          )}
          {!connected && (
            <button type="button" className="agent-pair-later" onClick={close}>
              {flow.later[locale]}
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
