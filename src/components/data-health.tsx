import { QuietDetails, simpleCopy } from "./simple-ui";
import { localizeValue } from "@/components/site/localization";
import { useLocale } from "@/components/site/locale";
import { formatAgo } from "@/lib/format";
import { sourceHealth } from "@/lib/data-health";

export type DataSourceState = {
  label: string;
  fetchedAt: number | null;
  error?: string | null | undefined;
  loading: boolean;
  maxAgeMs?: number;
  partial?: boolean;
};

export function DataHealth({
  sources,
  now,
  note,
}: {
  sources: DataSourceState[];
  now: number;
  note?: string;
}) {
  const { t, en, locale } = useLocale();
  return (
    <section
      className="data-health"
      aria-label={localizeValue(en ? "Data freshness" : "数据时效", locale)}
    >
      <div className="data-sources">
        {sources.map((source) => {
          const state = sourceHealth(source, now);
          return (
            <div
              className="data-source"
              key={source.label}
              data-state={state}
              title={source.error ? t(source.error) : undefined}
            >
              <i aria-hidden="true" />
              <span>{t(source.label)}</span>
              <b>
                {source.loading && source.fetchedAt === null
                  ? t("刷新中")
                  : source.fetchedAt === null
                    ? t("未获取")
                    : formatAgo(source.fetchedAt, now, locale)}
              </b>
              {source.loading && source.fetchedAt !== null && <em>{t("刷新中")}</em>}
              {state === "old" && <em>{t("旧数据")}</em>}
              {state === "failed" && <em>{t("刷新失败")}</em>}
              {state === "partial" && <em>{t("部分数据")}</em>}
            </div>
          );
        })}
      </div>
      {note && (
        <QuietDetails title={simpleCopy(locale).definitions}>
          <p>{note}</p>
        </QuietDetails>
      )}
    </section>
  );
}
