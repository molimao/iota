import { z } from "zod";
import { redactAgentLog } from "./device-agent";
import { FLEET_PROJECTS } from "./fleet";
import { LOCALES } from "./site";
export const LOG_ANALYSIS_DAILY_LIMIT = 10;
export const logAnalysisInput = z
  .object({
    requestId: z.string().uuid(),
    project: z.enum(FLEET_PROJECTS),
    locale: z.enum(LOCALES),
    logs: z.string().trim().min(20).max(24000),
  })
  .strict();
export const logAnalysisResult = z
  .object({
    summary: z.string().min(1).max(450),
    confidence: z.enum(["high", "medium", "low"]),
    findings: z
      .array(
        z
          .object({
            title: z.string().min(1).max(160),
            explanation: z.string().min(1).max(700),
            lines: z.array(z.number().int().min(1).max(300)).max(8),
          })
          .strict(),
      )
      .max(5),
    nextSteps: z.array(z.string().min(1).max(400)).max(6),
    unknowns: z.array(z.string().min(1).max(400)).max(5),
  })
  .strict();
export type LogAnalysisResult = z.infer<typeof logAnalysisResult>;
function redactSecretFields(text: string) {
  return text.replace(
    /(["']?(?:token|secret|password|authorization|api[_\s-]?key|seed|mnemonic|private[_\s-]?key)["']?\s*[=:]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\r\n]+)/gi,
    "$1[redacted]",
  );
}

/** Local input is untrusted; send a bounded, redacted excerpt, not credentials or a full log archive. */
export function prepareAnalysisLog(raw: string) {
  const text = redactAgentLog(redactSecretFields(raw))
    .replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, "[redacted]")
    .replace(/\b(?:0x)?[A-Fa-f0-9]{64}\b/g, "[identifier]");
  const lines = text
    .split("\n")
    .filter((s) => s.trim())
    .slice(-300);
  if (lines.join("\n").trim().length < 20) throw new Error("log_too_short");
  return lines;
}
export function validateAnalysis(value: unknown, lines: string[]) {
  const result = logAnalysisResult.parse(value);
  return {
    ...result,
    summary: prepareOutput(result.summary),
    findings: result.findings.map((f) => ({
      ...f,
      title: prepareOutput(f.title),
      explanation: prepareOutput(f.explanation),
      lines: [...new Set(f.lines)].filter((n) => n <= lines.length),
    })),
    nextSteps: result.nextSteps.map(prepareOutput),
    unknowns: result.unknowns.map(prepareOutput),
  };
}
function prepareOutput(s: string) {
  return redactAgentLog(redactSecretFields(s)).replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, "[redacted]");
}
export const savedAnalysis = logAnalysisResult.extend({
  locale: z.enum(LOCALES).optional(),
  evidence: z
    .array(
      z.object({ line: z.number().int().positive().max(300), text: z.string().max(300) }).strict(),
    )
    .max(40),
});
export type SavedAnalysis = z.infer<typeof savedAnalysis>;
export const analysisState = z.object({
  eligible: z.boolean(),
  used: z.number().int().min(0),
  limit: z.number().int().positive(),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        project: z.string(),
        created_at: z.string(),
        result: savedAnalysis,
      }),
    )
    .max(20),
});

/** Guard a well-understood abort sequence against an LLM treating absence of OOM as proof against memory issues. */
export function groundLogAnalysis(
  result: LogAnalysisResult,
  lines: string[],
  locale: import("./site").SiteLocale,
): LogAnalysisResult {
  const raw = lines.join("\n");
  if (!/SIGABRT/.test(raw) || !/missing local CID state/.test(raw) || !/panic/i.test(raw))
    return result;
  const explicitOom = lines.some(
    (line) =>
      !/(?:no|without|未|没有|沒有).{0,30}(?:OOM|out.of.memory)/i.test(line) &&
      /(?:OutOfMemoryError|(?:MPS|CUDA).{0,30}out of memory)/i.test(line),
  );
  if (explicitOom) return result;
  const abortMessage = {
    zh: "SIGABRT 表示进程主动中止。结合前序 Rust panic，可以确认发生异常退出，但不能仅凭信号确认最初诱因或排除其他问题。",
    "zh-TW":
      "SIGABRT 表示程序主動中止。結合先前 Rust panic，可確認異常退出，但不能僅憑訊號確認最初誘因或排除其他問題。",
    en: "SIGABRT is an explicit abort. Together with the preceding Rust panic it establishes an abnormal exit, but not the initiating cause or exclusion of other faults.",
    ko: "SIGABRT는 명시적인 중단입니다. 앞선 Rust 패닉과 함께 비정상 종료는 확인되지만 최초 원인이나 다른 장애 배제는 확인되지 않습니다.",
    ja: "SIGABRTは明示的な中止です。先行するRust panicと併せて異常終了を確認できますが、最初の原因や他の問題の否定はできません。",
  }[locale];
  const messages = {
    zh: [
      "日志记录了 P2P 通信异常、Rust panic 和 SIGABRT 退出。未见明确 OOM 报错，根因仍需结合崩溃堆栈确认。",
      "内存占用较高，但这些日志没有明确 OOM 报错；仅凭占用量不能判断或排除内存问题。",
      "缺少完整崩溃堆栈，不能确认最初的故障原因。",
    ],
    "zh-TW": [
      "日誌記錄了 P2P 通訊異常、Rust panic 與 SIGABRT 退出。未見明確 OOM 錯誤，根因仍需結合崩潰堆疊確認。",
      "記憶體占用較高，但日誌沒有明確 OOM 錯誤；僅憑占用量不能判斷或排除記憶體問題。",
      "缺少完整崩潰堆疊，無法確認最初的故障原因。",
    ],
    en: [
      "The log records P2P errors, a Rust panic and a SIGABRT exit. No explicit OOM is shown; the root cause requires the crash stack.",
      "Memory usage is high, but these lines do not report an explicit OOM. Usage alone neither proves nor rules out memory problems.",
      "The complete crash stack is missing, so the initiating cause is unconfirmed.",
    ],
    ko: [
      "로그에 P2P 오류, Rust 패닉, SIGABRT 종료가 있습니다. 명시적 OOM은 없으며 근본 원인은 크래시 스택으로 확인해야 합니다.",
      "메모리 사용량이 높지만 명시적 OOM은 없습니다. 사용량만으로 메모리 문제를 확정하거나 배제할 수 없습니다.",
      "전체 크래시 스택이 없어 최초 원인은 미확인입니다.",
    ],
    ja: [
      "ログにP2Pエラー、Rust panic、SIGABRT終了があります。明示的なOOMはなく、根本原因の確認にはクラッシュスタックが必要です。",
      "メモリ使用量は高いものの明示的なOOMはありません。使用量だけでメモリ問題を断定・否定できません。",
      "完全なクラッシュスタックがないため、最初の原因は未確認です。",
    ],
  }[locale];
  return {
    ...result,
    summary: messages[0]!,
    confidence: result.confidence === "low" ? "low" : "medium",
    findings: result.findings.map((f) =>
      f.lines.some((n) => /GPU memory|MPS.*memory/i.test(lines[n - 1] ?? ""))
        ? { ...f, explanation: messages[1]! }
        : f.lines.some((n) => /SIGABRT/.test(lines[n - 1] ?? ""))
          ? { ...f, title: "SIGABRT", explanation: abortMessage }
          : f,
    ),
    unknowns: [messages[2]!, ...result.unknowns].slice(0, 5),
  };
}

/** Never display a diagnosis generated for a different website language. */
export function analysisMatchesLocale(result: SavedAnalysis, locale: import("./site").SiteLocale) {
  return result.locale === locale;
}
