import { distinctRuns, type OfficialRun } from "@/lib/iota-run";
import { useLocale } from "./site/locale";

const copy = {
  zh: { label: "轮次", older: "旧数据", source: "官方公开名单", missing: "尚未查到轮次" },
  "zh-TW": { label: "輪次", older: "舊資料", source: "官方公開名單", missing: "尚未查到輪次" },
  en: {
    label: "Run",
    older: "Older data",
    source: "Official public roster",
    missing: "Run not found yet",
  },
  ja: { label: "ラン", older: "過去のデータ", source: "公式公開リスト", missing: "ラン未確認" },
  ko: { label: "Run", older: "이전 데이터", source: "공식 공개 목록", missing: "Run 미확인" },
};

export function IotaRunLabels({
  runs,
  showEmpty = true,
  layout = "inline",
}: {
  runs: Array<OfficialRun | null | undefined>;
  showEmpty?: boolean;
  layout?: "inline" | "row";
}) {
  const { locale } = useLocale();
  const c = copy[locale],
    values = distinctRuns(runs);
  if (!values.length && !showEmpty) return null;
  return (
    <span className={`iota-run-labels iota-run-labels-${layout}`}>
      {layout === "row" && <span className="iota-run-field-name">{c.label}</span>}
      {values.length ? (
        values.map((run) => (
          <span
            className="iota-run-label"
            key={run.id}
            data-stale={run.stale || undefined}
            title={c.source}
          >
            {layout === "inline" && <span>{c.label}</span>} <b>{run.id}</b>
            {run.stale && <small>{c.older}</small>}
          </span>
        ))
      ) : (
        <span className="iota-run-empty">{c.missing}</span>
      )}
    </span>
  );
}
