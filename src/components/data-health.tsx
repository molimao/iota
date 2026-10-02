import { localizeValue } from "@/components/site/localization";
import { useLocale } from "@/components/site/locale";
import { formatAgo } from "@/lib/format";

export type DataSourceState = {
  label: string;
  fetchedAt: number | null;
  error?: string | null | undefined;
  loading: boolean;
  maxAgeMs?: number;
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
          const old =
            !!source.error ||
            (source.fetchedAt !== null && now - source.fetchedAt > (source.maxAgeMs ?? 5 * 60_000));
          return (
            <div
              className="data-source"
              key={source.label}
              data-state={old ? "old" : source.fetchedAt === null ? "pending" : "ready"}
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
              {old && source.fetchedAt !== null && <em>{t("旧数据")}</em>}
            </div>
          );
        })}
      </div>
      {note && <p>{note}</p>}
    </section>
  );
}
