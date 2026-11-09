import { ArrowUpRight } from "lucide-react";
import { useAgentClock } from "@/hooks/use-agent-clock";
import type { DiscreteScanSummary } from "@/hooks/use-discrete-scan-summary";
import { localized } from "@/lib/product-discovery";
import { projectPath, PROJECTS } from "@/lib/projects";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { boardCopy } from "./earnings-board-copy";
import { discreteDeviceSample, type DiscreteDevice } from "./discrete-agent-reading";

const tone = "#7ed7ec";

export const discreteScanCopy = {
  found: localized([
    "匹配出块",
    "符合的出塊",
    "Matching blocks",
    "일치한 블록",
    "一致したブロック",
  ]),
  reward: localized(["区块奖励", "區塊獎勵", "Block rewards", "블록 보상", "ブロック報酬"]),
  scanned: localized(["已查区块", "已查區塊", "Blocks checked", "조회한 블록", "検索済みブロック"]),
  lookup: localized(["查询出块", "查詢出塊", "Check blocks", "블록 조회", "ブロックを検索"]),
  lastScan: localized([
    "上次地址查询",
    "上次地址查詢",
    "Last address lookup",
    "최근 주소 조회",
    "前回のアドレス検索",
  ]),
  localRate: localized([
    "设备算力",
    "設備算力",
    "Device hashrate",
    "기기 해시레이트",
    "端末ハッシュレート",
  ]),
};

export function DiscreteOverviewCard({
  devices,
  summary,
  now: previewNow,
  locale,
}: {
  devices: DiscreteDevice[];
  summary: DiscreteScanSummary | null;
  now?: number | undefined;
  locale: SiteLocale;
}) {
  const clock = useAgentClock();
  const now = previewNow ?? clock;
  const rates = devices.flatMap(({ agent }) => {
    const rate = discreteDeviceSample(agent, now)?.rate;
    return rate == null ? [] : [rate];
  });
  const number = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 });
  const project = projectPath(locale, "xds");
  return (
    <article
      className="board-chart-panel board-project-panel"
      data-project="xds"
      style={{ borderTopColor: tone }}
    >
      <header className="board-project-heading">
        <div>
          <a href={project}>
            <i style={{ background: tone }} />
            {PROJECTS.xds.name}
            <ArrowUpRight size={16} />
          </a>
          <span>
            {devices.length}
            {boardCopy.countSuffix[locale]} {boardCopy.devices[locale]}
          </span>
        </div>
      </header>
      <div className="board-project-metrics">
        <div>
          <span>{discreteScanCopy.localRate[locale]}</span>
          <strong>
            {rates.length ? (
              <>
                {number.format(rates.reduce((total, rate) => total + rate, 0))} <small>H/s</small>
              </>
            ) : (
              "—"
            )}
          </strong>
          {devices.length > 0 && (
            <small>
              {rates.length}/{devices.length} {boardCopy.computeCoverage[locale]}
            </small>
          )}
        </div>
        <div>
          <span>{discreteScanCopy.lastScan[locale]}</span>
          {summary ? (
            <>
              <strong>
                {number.format(summary.rewardUnits / 100)} <small>XDS</small>
              </strong>
              <small>
                {discreteScanCopy.found[locale]} {number.format(summary.blocks)} · #
                {number.format(summary.fromHeight)}–{number.format(summary.toHeight)}
              </small>
            </>
          ) : (
            <strong>—</strong>
          )}
        </div>
      </div>
      <a className="board-project-footer xds-overview-lookup" href={`${project}#xds-address`}>
        {discreteScanCopy.lookup[locale]} <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
