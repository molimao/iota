import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { getDeviceAgents, pairDeviceAgent } from "@/lib/device-agent.functions";
import { getFleet } from "@/lib/fleet.functions";
import { AGENT_DOWNLOAD_URL, WINDOWS_AGENT_DOWNLOAD_URL } from "@/lib/device-agent";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useLocale } from "./site/locale";
import { agentCopy } from "./device-agent-copy";
import "./agent-pairing.css";

export function AgentPairing({
  deviceId,
  preview = false,
}: {
  deviceId: string;
  preview?: boolean;
}) {
  const { locale } = useLocale(),
    auth = useAuth(),
    now = useAgentClock();
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
  const deviceName = preview
    ? "Mac mini"
    : devices.data?.devices.find((d) => d.id === deviceId)?.name;
  const query = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => list(),
    enabled: open && !!code && !preview && !!auth.userId,
    refetchInterval: open && code && now < code.expiresAt ? 3000 : false,
    retry: false,
  });
  const connected = !preview && !!query.data?.some((a) => a.deviceId === deviceId);
  useEffect(() => {
    setOpen(false);
    setCode(null);
  }, [auth.userId, deviceId]);
  async function generate() {
    setOpen(true);
    setBusy(true);
    setError(false);
    setCopied(false);
    setCopyFailed(false);
    const user = auth.userId;
    try {
      const result = preview
        ? { token: "DEMO-CODE-NOT-VALID", expiresAt: Date.now() + 600000 }
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
      <button
        type="button"
        className="fleet-outline agent-pair-trigger"
        disabled={busy || (!preview && (!auth.ready || !auth.userId))}
        onClick={() => void generate()}
      >
        {agentCopy.pair[locale]}
      </button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setCode(null);
        }}
      >
        <DialogContent className="fleet-dialog agent-pair-dialog">
          <DialogTitle>
            {agentCopy.pairingCode[locale]}
            {deviceName ? ` · ${deviceName}` : ""}
          </DialogTitle>
          <DialogDescription>{agentCopy.steps[locale]}</DialogDescription>
          {preview && <p className="review-notice">{agentCopy.demo[locale]}</p>}
          {busy && <p role="status">{agentCopy.generatingCode[locale]}</p>}
          {error && <p role="alert">{agentCopy.error[locale]}</p>}
          {connected ? (
            <p role="status">{agentCopy.paired[locale]}</p>
          ) : (
            code &&
            !busy && (
              <div className="agent-pair-code">
                <label>
                  {agentCopy.pairingCode[locale]}
                  <input
                    readOnly
                    value={now < code.expiresAt ? code.token : ""}
                    onFocus={(event) => event.currentTarget.select()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </label>
                <button
                  type="button"
                  className="site-button"
                  disabled={now >= code.expiresAt}
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
                <p role="status">
                  {copyFailed
                    ? agentCopy.copyFailed[locale]
                    : now >= code.expiresAt
                      ? agentCopy.codeExpired[locale]
                      : agentCopy.waitPair[locale]}
                </p>
                <p>{agentCopy.setupRun[locale]}</p>
                <div className="agent-pair-actions">
                  <a className="fleet-outline" href={AGENT_DOWNLOAD_URL} download>
                    macOS
                  </a>
                  <a className="fleet-outline" href={WINDOWS_AGENT_DOWNLOAD_URL} download>
                    Windows
                  </a>
                </div>
              </div>
            )
          )}
          {(error || (code && now >= code.expiresAt)) && (
            <button
              type="button"
              className="site-button"
              disabled={busy}
              onClick={() => void generate()}
            >
              {agentCopy.pair[locale]}
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
