import { distinctRuns, type OfficialRun } from "@/lib/iota-run";
import { useLocale } from "./site/locale";

const copy = {
  zh: {
    label: "参与轮次",
    app: "APP 当前轮次",
    reference: "全网参考轮次",
    older: "旧数据",
    source: "官方公开名单",
    missing: "尚未查到轮次",
  },
  "zh-TW": {
    label: "參與輪次",
    app: "APP 目前輪次",
    reference: "全網參考輪次",
    older: "舊資料",
    source: "官方公開名單",
    missing: "尚未查到輪次",
  },
  en: {
    label: "Run",
    app: "App selected run",
    reference: "Network reference run",
    older: "Older data",
    source: "Official public roster",
    missing: "Run not found yet",
  },
  ja: {
    label: "参加ラン",
    app: "アプリの選択ラン",
    reference: "ネットワーク参考ラン",
    older: "過去のデータ",
    source: "公式公開リスト",
    missing: "ラン未確認",
  },
  ko: {
    label: "참여 Run",
    app: "앱 선택 Run",
    reference: "네트워크 참고 Run",
    older: "이전 데이터",
    source: "공식 공개 목록",
    missing: "Run 미확인",
  },
};

export function IotaRunLabels({
  runs,
  showEmpty = true,
  layout = "inline",
  emptyText,
}: {
  runs: Array<OfficialRun | null | undefined>;
  showEmpty?: boolean;
  layout?: "inline" | "row";
  emptyText?: string | undefined;
}) {
  const { locale } = useLocale();
  const c = copy[locale],
    values = distinctRuns(runs);
  if (!values.length && !showEmpty) return null;
  return (
    <span className={`iota-run-labels iota-run-labels-${layout}`}>
      {layout === "row" && (
        <span className="iota-run-field-name">
          {values.length && values.every((r) => r.kind === "reference") ? c.reference : values.length && values.every((r) => r.kind === "app") ? c.app : c.label}
        </span>
      )}
      {values.length ? (
        values.map((run) => (
          <span
            className="iota-run-label"
            key={run.id}
            data-stale={run.stale || undefined}
            title={run.kind === "reference" ? c.reference : run.kind === "app" ? c.app : c.source}
          >
            {layout === "inline" && <span>{run.kind === "reference" ? c.reference : run.kind === "app" ? c.app : c.label}</span>}{" "}
            <b>{run.id}</b>
            {run.stale && <small>{c.older}</small>}
          </span>
        ))
      ) : (
        <span className="iota-run-empty">{emptyText ?? c.missing}</span>
      )}
    </span>
  );
}
