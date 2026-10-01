import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocale } from "@/components/site/locale";
import { formatCount } from "@/lib/format";
import type { TrainingRow } from "@/lib/training";

export default function TrainingTrend({ rows }: { rows: TrainingRow[] }) {
  const { t, en, locale } = useLocale();
  const [metric, setMetric] = useState<"tokens" | "throughput" | "cumulative">("tokens");
  const labels = { tokens: t("训练 Token"), throughput: t("吞吐量"), cumulative: t("累计 Token") };
  const available = rows.filter((row) => row[metric] !== null).length;
  const compact = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return (
    <section className="training-trend">
      <div className="history-periods" role="group" aria-label={en ? "Chart metric" : "趋势图指标"}>
        {(["tokens", "throughput", "cumulative"] as const).map((key) => (
          <button key={key} aria-pressed={metric === key} onClick={() => setMetric(key)}>
            {labels[key]}
          </button>
        ))}
      </div>
      {available >= 2 ? (
        <div
          className="training-chart"
          role="img"
          aria-label={
            en
              ? `${labels[metric]} by epoch. Values are also listed in the table below.`
              : `${labels[metric]}随训练轮次变化，具体数值也列在下方表格中。`
          }
        >
          <ResponsiveContainer width="100%" height={190}>
            <LineChart
              data={[...rows].reverse()}
              margin={{ top: 18, right: 12, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="epoch"
                stroke="#8b929b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                stroke="#8b929b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(value: number) => compact.format(value)}
              />
              <Tooltip
                contentStyle={{ background: "#161616", border: "1px solid #444", fontSize: 12 }}
                labelFormatter={(value) => `${t("轮次")} ${value}`}
                formatter={(value: number) => [formatCount(value, locale), labels[metric]]}
              />
              <Line
                dataKey={metric}
                name={labels[metric]}
                type="linear"
                stroke="#6fe0ab"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="history-note">
          {en
            ? "At least two reported points are needed to show this trend."
            : "至少有两个上报数据点时显示趋势。"}
        </p>
      )}
    </section>
  );
}
