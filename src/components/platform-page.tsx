import { readQuery } from "@/lib/read-query";
import { hongKongDayStartSeconds } from "@/lib/earnings";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./site/locale";
import { ProjectAbout } from "./project-about";
import { QuietDetails } from "./simple-ui";
import { platformCopy, platformEditorial } from "./platform-copy";
import { fleetCopy } from "./fleet-copy";
import { PROJECTS } from "@/lib/projects";
import { LANGUAGE_TAG } from "@/lib/site";
import {
  isPrivatePlatform,
  validPlatformId,
  type Platform,
  type PlatformResult,
} from "@/lib/platforms";
import {
  getPublicPlatform,
  getPrivatePlatform,
  getConnectionStatus,
  connectPlatform,
  disconnectPlatform,
} from "@/lib/platforms.functions";
import { platformSample } from "@/lib/platform-samples";
export function PlatformPage({ project, demo = false }: { project: Platform; demo?: boolean }) {
  const { locale } = useLocale(),
    c = platformCopy(locale),
    f = fleetCopy(locale),
    auth = useAuth(),
    client = useQueryClient();
  const [input, setInput] = useState(""),
    [id, setId] = useState(""),
    [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState<string | null>(null);
  const privateRead = useServerFn(getPrivatePlatform),
    statusRead = useServerFn(getConnectionStatus),
    connect = useServerFn(connectPlatform),
    disconnect = useServerFn(disconnectPlatform);
  const secured = isPrivatePlatform(project);
  const status = useQuery({
    queryKey: ["platform-connection", auth.userId, project],
    enabled: !demo && !!auth.userId && secured,
    queryFn: () => {
      if (!isPrivatePlatform(project)) throw new Error("invalid");
      return statusRead({ data: { project } });
    },
    retry: false,
  });
  const lookup = useQuery({
    enabled:
      !demo &&
      validPlatformId(project, id) &&
      (!secured || (!!auth.userId && !!status.data?.connected)),
    ...readQuery(
      client,
      ["platform-node", auth.userId, project, id],
      () =>
        isPrivatePlatform(project)
          ? privateRead({ data: { project, id } })
          : getPublicPlatform({ data: { project, id } }),
      { private: secured },
    ),
    refetchInterval: 300000,
    staleTime: 300000,
    retry: false,
  });
  const result: PlatformResult | undefined = demo
    ? { data: platformSample(project), fetchedAt: null, error: null }
    : lookup.data;
  const data = result?.data;
  const sourceStale =
    !demo && data?.sourceUpdatedAt != null && Date.now() - data.sourceUpdatedAt > 900000;
  const online =
    sourceStale || result?.stale || result?.error || lookup.isError ? null : data?.online;
  const periodStale =
    !demo &&
    data?.periodStart != null &&
    (data.period === "hkDay"
      ? data.periodStart !== hongKongDayStartSeconds() * 1000
      : data.period === "utcDay"
        ? data.periodStart !== Math.floor(Date.now() / 86400000) * 86400000
        : false);
  function errorText(code: string | null | undefined) {
    return code === "connect-required"
      ? c.needConnection
      : code === "expired"
        ? c.expired
        : code === "not-configured"
          ? c.notConfigured
          : code === "not-found"
            ? c.notFound
            : f.unavailable;
  }
  async function save() {
    if (!isPrivatePlatform(project) || !validPlatformId(project, input.trim())) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await connect({ data: { project, id: input.trim(), token: token.trim() } });
      setToken("");
      if (!r.ok) {
        setMessage(errorText(r.error));
        return;
      }
      await client.invalidateQueries({ queryKey: ["platform-connection", auth.userId, project] });
      await client.resetQueries({ queryKey: ["platform-node", auth.userId, project] });
      setId(input.trim());
    } catch {
      setMessage(f.unavailable);
      setToken("");
    } finally {
      setBusy(false);
    }
  }
  async function revoke() {
    if (!isPrivatePlatform(project)) return;
    setBusy(true);
    try {
      const r = await disconnect({ data: { project } });
      if (!r.ok) {
        setMessage(f.unavailable);
        return;
      }
      setId("");
      client.removeQueries({ queryKey: ["platform-node", auth.userId, project] });
      await client.invalidateQueries({ queryKey: ["platform-connection", auth.userId, project] });
    } catch {
      setMessage(f.unavailable);
    } finally {
      setBusy(false);
    }
  }
  const metric = (label: string, value: string | number | null | undefined) => (
    <div className="compute-metric" key={label}>
      <span>{label}</span>
      <strong>
        {typeof value === "number"
          ? value.toLocaleString(LANGUAGE_TAG[locale], { maximumFractionDigits: 6 })
          : (value ?? "—")}
      </strong>
    </div>
  );
  return (
    <main id="main" className="projects-page">
      {demo && <p className="review-notice">{c.review}</p>}
      <header className="project-heading">
        <div>
          <h1>{PROJECTS[project].name}</h1>
          <p>{platformEditorial[project].summary[locale]}</p>
        </div>
        <a href={`/${locale}/devices?project=${project}`}>{f.add} →</a>
      </header>
      {!demo && (
        <section className="compute-panel">
          <form
            className="compute-lookup"
            onSubmit={(e) => {
              e.preventDefault();
              if (validPlatformId(project, input.trim())) {
                if (id === input.trim()) void lookup.refetch();
                else setId(input.trim());
                setMessage(null);
              }
            }}
          >
            <label htmlFor="platform-id">
              {project === "ionet"
                ? "Device ID"
                : project === "vast"
                  ? "Machine ID"
                  : project === "akash"
                    ? `${c.provider} · akash1…`
                    : `Golem Node ID · 0x…`}
            </label>
            <div>
              <input
                id="platform-id"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={100}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                disabled={
                  !validPlatformId(project, input.trim()) || (secured && !status.data?.connected)
                }
              >
                {c.lookup}
              </button>
            </div>
          </form>
          {secured &&
            (!auth.userId ? (
              <button
                className="platform-connect"
                disabled={!auth.ready || auth.signingIn}
                onClick={() => void auth.signInWithGoogle()}
              >
                {c.login}
              </button>
            ) : status.isPending ? (
              <p>…</p>
            ) : status.isError || !status.data?.configured ? (
              <p role="status">{c.notConfigured}</p>
            ) : status.data.connected && result?.error !== "expired" ? (
              <div className="platform-connection">
                <span>{c.connected}</span>
                <button disabled={busy} onClick={() => void revoke()}>
                  {c.disconnect}
                </button>
              </div>
            ) : (
              <form
                className="platform-authorization"
                onSubmit={(e) => {
                  e.preventDefault();
                  void save();
                }}
              >
                <label htmlFor="platform-token">{c.key}</label>
                <input
                  id="platform-token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="off"
                  maxLength={8192}
                  spellCheck={false}
                />
                <p>{c.connectNote}</p>
                <button
                  disabled={
                    busy || token.trim().length < 16 || !validPlatformId(project, input.trim())
                  }
                >
                  {busy ? "…" : c.connect}
                </button>
                <a
                  href={
                    project === "vast"
                      ? "https://docs.vast.ai/api-reference/permissions"
                      : "https://io.net/docs/reference/io-explorer/get-device-details"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.readOnly} ↗
                </a>
              </form>
            ))}
          {message && <p role="alert">{message}</p>}
        </section>
      )}
      {!demo && id && lookup.isFetching && !data && <p role="status">{f.loading}</p>}
      {(result?.error || lookup.isError) && <p role="alert">{errorText(result?.error)}</p>}
      {data && (
        <section className="compute-panel" aria-live="polite">
          <div className="platform-result-head">
            <h2>{data.name || `${data.id.slice(0, 12)}${data.id.length > 12 ? "…" : ""}`}</h2>
            <span>{online === true ? c.online : online === false ? c.offline : c.unknown}</span>
          </div>
          <div className="compute-metrics">
            {project === "akash" ? (
              <>
                {metric(c.gpu, data.gpuCount)}
                {metric(c.activeGpu, data.activeGpu)}
              </>
            ) : (
              <>
                {metric(
                  data.period ? c[data.period] : f.total,
                  data.reward === null
                    ? null
                    : `${data.reward.toLocaleString(LANGUAGE_TAG[locale], { maximumFractionDigits: 6 })} ${data.rewardUnit}`,
                )}
                {metric(
                  project === "golem" ? f.total : c.gpu,
                  project === "golem"
                    ? data.lifetime === null
                      ? null
                      : `${data.lifetime.toLocaleString(LANGUAGE_TAG[locale], { maximumFractionDigits: 6 })} GLM`
                    : data.gpuCount,
                )}
              </>
            )}
          </div>
          {(sourceStale || periodStale || result?.stale || (lookup.isError && data)) && (
            <p role="status">{f.stale}</p>
          )}
          {data.hardware && (
            <p>
              {c.hardware}: {data.hardware}
            </p>
          )}
          {project === "akash" && <p className="compute-caption">{c.capacityOnly}</p>}
          {data.partial && <p role="status">{c.partial}</p>}
          <QuietDetails title={f.source}>
            <p>
              {PROJECTS[project].name} ·{" "}
              {result?.fetchedAt
                ? new Date(result.fetchedAt).toLocaleString(LANGUAGE_TAG[locale])
                : "—"}
            </p>
            <p>
              {c.sourceTime}:{" "}
              {data.sourceUpdatedAt
                ? new Date(data.sourceUpdatedAt).toLocaleString(LANGUAGE_TAG[locale])
                : "—"}
            </p>
            <p className="platform-public-id">{data.id}</p>
          </QuietDetails>
        </section>
      )}
      <ProjectAbout project={project} />
    </main>
  );
}
