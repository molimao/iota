import type { SavedAnalysis } from "@/lib/log-analysis";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAgentCrashAnalyses } from "@/lib/device-agent.functions";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./site/locale";
import { AnalysisResult } from "./log-analysis";
import { logCopy as c } from "./log-analysis-copy";
import { LANGUAGE_TAG } from "@/lib/site";
export function AgentCrashAnalysis({
  deviceId,
  logsEnabled,
  preview = false,
  previewResult,
}: {
  deviceId: string;
  logsEnabled: boolean;
  preview?: boolean;
  previewResult?: SavedAnalysis | undefined;
}) {
  const { locale } = useLocale(),
    auth = useAuth(),
    get = useServerFn(getAgentCrashAnalyses);
  const query = useQuery({
    queryKey: ["agent-crash-analysis", auth.userId, deviceId, locale],
    queryFn: () => get({ data: { deviceId, locale } }),
    enabled: !preview && !!auth.userId,
    staleTime: 15000,
    refetchInterval: 15000,
    retry: false,
  });
  const latest =
    preview && previewResult?.locale === locale
      ? { status: "done", result: previewResult, created_at: "2026-10-18T02:00:03Z" }
      : query.data?.items[0];
  const analyzing =
    latest?.status === "queued" ||
    latest?.status === "running" ||
    latest?.status === "limited";
  return (
    <section className="agent-crash-analysis">
      <header>
        <strong>{c.autoTitle[locale]}</strong>
      </header>
      {preview && previewResult?.locale === locale && (
        <p className="compute-caption">本地效果示例 · 模拟崩溃日志 · 非真实设备报警</p>
      )}
      {!logsEnabled ? (
        <p>{c.autoDisabled[locale]}</p>
      ) : query.isError ? (
        <p role="status">
          {c.unavailable[locale]}{" "}
          <button onClick={() => void query.refetch()}>{c.autoRetry[locale]}</button>
        </p>
      ) : latest?.status === "done" && latest.result ? (
        <>
          <time>{new Date(latest.created_at).toLocaleString(LANGUAGE_TAG[locale])}</time>
          <AnalysisResult result={latest.result} />
        </>
      ) : latest?.status === "failed" || analyzing ? (
        <p role="status">
          {latest?.status === "failed"
                ? c.unavailable[locale]
                : latest.status === "limited" ? c.limit[locale] : c.autoQueued[locale]}
        </p>
      ) : null}
    </section>
  );
}
