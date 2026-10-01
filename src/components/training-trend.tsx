import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale } from "@/components/site/locale";
import { formatCount } from "@/lib/format";
import type { TrainingRow } from "@/lib/training";

export default function TrainingTrend({ rows }: { rows: TrainingRow[] }) {
  const { t, en, locale } = useLocale();
  const gradientId = useId();
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
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={[...rows].reverse()}
              margin={{ top: 18, right: 12, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e5e5e5" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#e5e5e5" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.07)"
                strokeDasharray="3 5"
              />
              <XAxis
                dataKey="epoch"
                stroke="#939393"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                stroke="#939393"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(value: number) => compact.format(value)}
              />
              <Tooltip
                contentStyle={{
                  background: "#1c1c1c",
                  border: "1px solid #383838",
                  borderRadius: 12,
                  color: "#f5f5f5",
                  fontSize: 12,
                }}
                cursor={{ stroke: "#737373", strokeDasharray: "3 4" }}
                labelFormatter={(value) => `${t("轮次")} ${value}`}
                formatter={(value: number) => [formatCount(value, locale), labels[metric]]}
              />
              <Area
                dataKey={metric}
                name={labels[metric]}
                type="linear"
                stroke="#e5e5e5"
                fill={`url(#${gradientId})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </AreaChart>
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
