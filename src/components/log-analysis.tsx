import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLogAnalyses, analyzeMiningLog } from "@/lib/log-analysis.functions";
import { prepareAnalysisLog, analysisMatchesLocale, type SavedAnalysis } from "@/lib/log-analysis";
import { FLEET_NAMES, FLEET_PROJECTS, type FleetProject } from "@/lib/fleet";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./site/locale";
import { logCopy as c } from "./log-analysis-copy";
import { LANGUAGE_TAG } from "@/lib/site";
export function LogAnalysis({
  initialLogs = "",
  initialProject = "iota",
  preview = false,
  previewPlan = "pro",
}: {
  initialLogs?: string | undefined;
  initialProject?: FleetProject;
  preview?: boolean;
  previewPlan?: "free" | "pro";
}) {
  const { locale } = useLocale(),
    auth = useAuth(),
    client = useQueryClient();
  const get = useServerFn(getLogAnalyses),
    analyze = useServerFn(analyzeMiningLog);
  const query = useQuery({
    queryKey: ["log-analyses", auth.userId],
    queryFn: () => get(),
    enabled: !!auth.userId && !preview,
    staleTime: 30000,
    retry: false,
  });
  const [open, setOpen] = useState(false),
    [logs, setLogs] = useState(initialLogs),
    [project, setProject] = useState<FleetProject>(initialProject),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<{ locale: typeof locale; message: string } | null>(null),
    [result, setResult] = useState<SavedAnalysis | null>(null);
  const currentLocale = useRef(locale);
  currentLocale.current = locale;
  const history =
    query.data?.items.filter((item) => analysisMatchesLocale(item.result, locale)) ?? [];
  const eligible = preview ? previewPlan === "pro" : query.data?.eligible === true;
  async function submit() {
    if (busy || !eligible || preview) return;
    setError(null);
    setResult(null);
    let cleaned: string;
    try {
      cleaned = prepareAnalysisLog(logs).join("\n");
    } catch {
      setError({ locale, message: c.short[locale] });
      return;
    }
    setBusy(true);
    try {
      const output = await analyze({
        data: { requestId: crypto.randomUUID(), project, locale, logs: cleaned },
      });
      if (currentLocale.current === locale) setResult(output);
    } catch (e) {
      const s = e instanceof Error ? e.message : "";
      if (currentLocale.current === locale)
        setError({
          locale,
          message: s.includes("daily_limit")
            ? c.limit[locale]
            : s.includes("rate_limit")
              ? c.rate[locale]
              : s.includes("pro_required")
                ? c.upgrade[locale]
                : c.unavailable[locale],
        });
    } finally {
      setBusy(false);
      void client.invalidateQueries({ queryKey: ["log-analyses", auth.userId] });
    }
  }
  return (
    <section className="log-analysis">
      <button
        className="log-analysis-toggle"
        onClick={() => {
          if (!open && initialLogs && !logs) setLogs(initialLogs);
          setOpen(!open);
        }}
        aria-expanded={open}
      >
        <span>
          {c.title[locale]} <small>PRO</small>
        </span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="log-analysis-content">
          <p>{c.intro[locale]}</p>
          {eligible ? (
            <>
              <div className="log-analysis-toolbar">
                <select
                  aria-label={c.project[locale]}
                  value={project}
                  onChange={(e) => {
                    setProject(e.target.value as FleetProject);
                    setResult(null);
                  }}
                  disabled={busy}
                >
                  {FLEET_PROJECTS.map((p) => (
                    <option key={p} value={p}>
                      {FLEET_NAMES[p]}
                    </option>
                  ))}
                </select>
                <small>
                  {c.included[locale]}
                  {query.data
                    ? ` · ${c.remaining[locale]} ${query.data.used}/${query.data.limit}`
                    : ""}
                </small>
              </div>
              <textarea
                aria-label={c.paste[locale]}
                maxLength={24000}
                placeholder={c.placeholder[locale]}
                value={logs}
                disabled={busy}
                onChange={(e) => {
                  setLogs(e.target.value);
                  setResult(null);
                }}
                rows={8}
              />
              <p className="log-analysis-note">{c.privacy[locale]}</p>
              <button
                className="site-button"
                disabled={
                  busy || logs.trim().length < 20 || preview || (query.data?.used ?? 0) >= 10
                }
                onClick={() => void submit()}
              >
                {busy ? c.busy[locale] : c.action[locale]}
              </button>
              {error?.locale === locale && <p role="alert">{error.message}</p>}
              {result && analysisMatchesLocale(result, locale) && (
                <AnalysisResult result={result} />
              )}
              <p className="log-analysis-note">{c.hint[locale]}</p>
            </>
          ) : (
            <>
              <a className="site-button" href={`/${locale}/devices?view=membership#pro-plan`}>
                {auth.userId || preview ? c.upgrade[locale] : c.signin[locale]}
              </a>
              {query.isError && <p role="status">{c.unavailable[locale]}</p>}
            </>
          )}
          {!!history.length && (
            <details className="log-analysis-history">
              <summary>{c.history[locale]}</summary>
              {history.map((item) => (
                <details key={item.id}>
                  <summary>
                    {FLEET_NAMES[item.project as FleetProject] ?? item.project} ·{" "}
                    {new Date(item.created_at).toLocaleString(LANGUAGE_TAG[locale])}
                  </summary>
                  <AnalysisResult result={item.result} />
                </details>
              ))}
            </details>
          )}
        </div>
      )}
    </section>
  );
}
export function AnalysisResult({ result }: { result: SavedAnalysis }) {
  const { locale } = useLocale();
  return (
    <article className="log-analysis-result" role="status">
      <header>
        <h3>{result.summary}</h3>
        <small>{c[result.confidence][locale]}</small>
      </header>
      {!!result.nextSteps.length && (
        <section>
          <h4>{c.steps[locale]}</h4>
          <ol>
            {result.nextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      )}
      {!!result.findings.length && (
        <details className="log-analysis-evidence">
          <summary>
            {c.evidence[locale]} · {result.findings.length}
          </summary>
          {result.findings.map((f, i) => (
            <section key={i}>
              <h4>{f.title}</h4>
              <p>{f.explanation}</p>
              <pre>
                {result.evidence
                  .filter((e) => f.lines.includes(e.line))
                  .map((e) => `L${e.line} ${e.text}`)
                  .join("\n")}
              </pre>
            </section>
          ))}
        </details>
      )}
      {!!result.unknowns.length && (
        <details className="log-analysis-unknown">
          <summary>{c.unknown[locale]}</summary>
          <ul>
            {result.unknowns.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
