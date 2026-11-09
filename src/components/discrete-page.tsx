import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { summarizeDiscreteScan, useDiscreteScanSummary } from "@/hooks/use-discrete-scan-summary";
import {
  DISCRETE_ADDRESS_LENGTH,
  DISCRETE_BLOCK_SECONDS,
  DISCRETE_SOLO_PAGE_SIZE,
  type DiscreteSoloPage,
} from "@/lib/discrete";
import {
  getDiscreteNetwork,
  getDiscreteSoloHistory,
  lookupDiscreteAddress,
} from "@/lib/discrete.functions";
import { localized } from "@/lib/product-discovery";
import { PROJECTS } from "@/lib/projects";
import { readQuery } from "@/lib/read-query";
import { LANGUAGE_TAG } from "@/lib/site";
import { ProjectAbout } from "./project-about";
import { DiscreteAgentPanel, discreteDevices, type DiscreteDevice } from "./discrete-agent-reading";
import { discreteScanCopy } from "./discrete-overview-card";
import { projectsCopy } from "./projects-copy";
import { useLocale } from "./site/locale";

const copy = {
  description: localized([
    "查看设备算力和独挖出块。",
    "查看設備算力和獨挖出塊。",
    "See device hashrates and solo blocks.",
    "기기 해시레이트와 솔로 채굴 블록을 확인하세요.",
    "端末のハッシュレートとソロ採掘ブロックを確認できます。",
  ]),
  explorer: localized([
    "区块浏览器",
    "區塊瀏覽器",
    "Block explorer",
    "블록 탐색기",
    "ブロックエクスプローラー",
  ]),
  lookup: localized(["查询", "查詢", "Look up", "조회", "照会"]),
  addressTitle: localized([
    "独挖出块查询",
    "獨挖出塊查詢",
    "Solo mining history",
    "솔로 채굴 기록",
    "ソロマイニング履歴",
  ]),
  valid: localized([
    "主网地址有效",
    "主網地址有效",
    "Valid mainnet address",
    "유효한 메인넷 주소",
    "有効なメインネットアドレス",
  ]),
  account: localized([
    "链上账号编号",
    "鏈上帳號編號",
    "On-chain account number",
    "온체인 계정 번호",
    "オンチェーン口座番号",
  ]),
  unregistered: localized([
    "尚未注册账号编号",
    "尚未註冊帳號編號",
    "No account number registered",
    "등록된 계정 번호 없음",
    "登録済み口座番号なし",
  ]),
  lookupFailed: localized([
    "账号编号暂时查不到，请重试。",
    "帳號編號暫時查不到，請重試。",
    "Account lookup is unavailable. Try again.",
    "계정 번호를 조회할 수 없습니다. 다시 시도하세요.",
    "口座番号を取得できません。もう一度お試しください。",
  ]),
  scanScope: localized([
    "按地址统计出块和奖励，每次查 1,000 个区块。",
    "按地址統計出塊和獎勵，每次查 1,000 個區塊。",
    "Check blocks and rewards by address, 1,000 blocks at a time.",
    "주소별 채굴 블록과 보상을 한 번에 1,000개씩 조회합니다.",
    "アドレスごとの採掘ブロックと報酬を1,000ブロックずつ検索します。",
  ]),
  scanning: localized([
    "正在查找出块记录…",
    "正在搜尋出塊紀錄…",
    "Checking blocks…",
    "블록 조회 중…",
    "ブロックを検索中…",
  ]),
  noMatch: localized([
    "已查范围内没有匹配的独挖出块。",
    "已查範圍內沒有符合的獨挖出塊。",
    "No matching solo blocks in the checked range.",
    "조회한 범위에 일치하는 솔로 채굴 블록이 없습니다.",
    "検索範囲に一致するソロ採掘ブロックはありません。",
  ]),
  historyFailed: localized([
    "这段区块未能查完整，请重试。",
    "這段區塊未能查完整，請重試。",
    "This block range could not be checked in full. Try again.",
    "이 범위의 블록을 모두 조회하지 못했습니다. 다시 시도하세요.",
    "この範囲をすべて検索できませんでした。もう一度お試しください。",
  ]),
  earlier: localized([
    "继续往前查",
    "繼續往前查",
    "Check older blocks",
    "이전 블록 조회",
    "過去のブロックを検索",
  ]),
  nextReward: localized([
    "下一区块预计奖励",
    "下一區塊預計獎勵",
    "Projected next block reward",
    "다음 블록 예상 보상",
    "次のブロックの予想報酬",
  ]),
  target: localized([
    "目标出块间隔",
    "目標出塊間隔",
    "Target block interval",
    "목표 블록 간격",
    "目標ブロック間隔",
  ]),
};

export function DiscretePage({
  preview,
}: {
  preview?: { devices: DiscreteDevice[]; pages: DiscreteSoloPage[]; now: number } | undefined;
}) {
  const { locale } = useLocale();
  const c = projectsCopy[locale];
  const client = useQueryClient();
  const network = useQuery({
    ...readQuery(client, ["xds", "network"], () => getDiscreteNetwork()),
    enabled: !preview,
  });
  const snapshot = network.data?.data;
  const matched = useMatchedDeviceAgent(undefined, undefined, !!preview);
  const devices =
    preview?.devices ??
    discreteDevices(matched.devices ?? [], matched.enabled ? (matched.query.data ?? []) : []);
  const now = useAgentClock();
  const { save } = useDiscreteScanSummary(matched.userId);
  const [address, setAddress] = useState("");
  const lookup = useMutation({ mutationFn: (data: string) => lookupDiscreteAddress({ data }) });
  const [historyPages, setHistoryPages] = useState<DiscreteSoloPage[]>(preview?.pages ?? []);
  const solo = useMutation({
    mutationFn: (data: { address: string; before?: number }) => getDiscreteSoloHistory({ data }),
    onSuccess: (result, request) => {
      if (result.status !== "valid") return;
      const pages = request.before ? [...historyPages, result.history] : [result.history];
      setHistoryPages(pages);
      const summary = summarizeDiscreteScan(pages);
      if (summary) save(summary);
    },
  });
  const result = lookup.data;
  const newest = historyPages[0];
  const oldest = historyPages.at(-1);
  const blocks = historyPages.flatMap((page) => page.blocks);
  const summary = summarizeDiscreteScan(historyPages);
  const busy = lookup.isPending || solo.isPending;
  const fmt = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 });
  const checkedAt = network.data?.fetchedAt;
  const date = new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "short",
    timeStyle: "short",
  });
  const stats = [
    [c.height, snapshot ? fmt.format(snapshot.height) : "—"],
    [c.chainHashrate, snapshot ? `${fmt.format(snapshot.estimatedHashrate / 1_000)} kH/s` : "—"],
    [copy.nextReward[locale], snapshot ? `${fmt.format(snapshot.nextReward)} XDS` : "—"],
    [copy.target[locale], `${DISCRETE_BLOCK_SECONDS} ${c.seconds}`],
  ];
  return (
    <main id="main" className="projects-page project-detail xds-project">
      <header className="project-heading">
        <div>
          <h1>{PROJECTS.xds.name}</h1>
          <p>{copy.description[locale]}</p>
        </div>
        <a
          className="project-outline"
          href={PROJECTS.xds.explorer}
          target="_blank"
          rel="noreferrer"
        >
          {copy.explorer[locale]} ↗
        </a>
      </header>

      <div className="xds-monitor-grid">
        <DiscreteAgentPanel devices={devices} now={preview?.now ?? now} />

        <section className="project-panel" aria-labelledby="xds-address">
          <h2 id="xds-address">{copy.addressTitle[locale]}</h2>
          <p>{copy.scanScope[locale]}</p>
          <form
            className="pool-lookup"
            onSubmit={(event) => {
              event.preventDefault();
              const submitted = address.trim();
              setHistoryPages([]);
              lookup.mutate(submitted);
              solo.mutate({ address: submitted });
            }}
          >
            <label>
              {c.address}
              <input
                placeholder="disc1…"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  lookup.reset();
                  solo.reset();
                  setHistoryPages([]);
                }}
                maxLength={DISCRETE_ADDRESS_LENGTH}
                disabled={busy || !!preview}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </label>
            <button className="site-button" disabled={busy || !!preview}>
              {copy.lookup[locale]}
            </button>
          </form>
          <div aria-live="polite">
            {solo.isPending && <p>{copy.scanning[locale]}</p>}
            {solo.data?.status === "invalid" && <p>{c.invalid}</p>}
            {(solo.isError || solo.data?.status === "unavailable") && (
              <p>{copy.historyFailed[locale]}</p>
            )}
            {newest && oldest && summary && (
              <div className="xds-scan-result">
                <div className="pool-metrics xds-scan-metrics">
                  <div>
                    <span>{discreteScanCopy.found[locale]}</span>
                    <strong>{fmt.format(summary.blocks)}</strong>
                  </div>
                  <div>
                    <span>{discreteScanCopy.reward[locale]}</span>
                    <strong>
                      {fmt.format(summary.rewardUnits / 100)} <small>XDS</small>
                    </strong>
                  </div>
                </div>
                <p className="xds-scan-range">
                  <span>
                    {discreteScanCopy.scanned[locale]} #{fmt.format(summary.fromHeight)}–
                    {fmt.format(summary.toHeight)}
                  </span>
                  <span>
                    {date.format(oldest.fromTime * 1000)} – {date.format(newest.toTime * 1000)}{" "}
                    (UTC+8)
                  </span>
                </p>
                {blocks.length ? (
                  <div className="project-table-scroll">
                    <table className="project-table">
                      <thead>
                        <tr>
                          <th>{c.block}</th>
                          <th>{c.time} (UTC+8)</th>
                          <th>{c.reward}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blocks.map((block) => (
                          <tr key={block.hash}>
                            <td>
                              <a
                                href={`${PROJECTS.xds.explorer}block/${block.hash}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                #{fmt.format(block.height)} ↗
                              </a>
                            </td>
                            <td>{date.format(block.timestamp * 1000)}</td>
                            <td>{fmt.format(block.rewardUnits / 100)} XDS</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>{copy.noMatch[locale]}</p>
                )}
                {oldest.fromHeight > 1 && !preview && (
                  <button
                    className="project-outline mt-3"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      solo.mutate({ address: address.trim(), before: oldest.fromHeight })
                    }
                  >
                    {copy.earlier[locale]} ·{" "}
                    {fmt.format(Math.min(DISCRETE_SOLO_PAGE_SIZE, oldest.fromHeight - 1))}
                  </button>
                )}
              </div>
            )}
            {result?.status === "valid" && (
              <p>
                {copy.valid[locale]} ·{" "}
                {result.accountNumber
                  ? `${copy.account[locale]} ${result.accountNumber}`
                  : copy.unregistered[locale]}
              </p>
            )}
            {result?.status === "unavailable" && (
              <p>
                {copy.valid[locale]} · {copy.lookupFailed[locale]}
              </p>
            )}
            {lookup.isError && <p>{copy.lookupFailed[locale]}</p>}
          </div>
        </section>
      </div>
      {!preview && (
        <details className="project-panel xds-network">
          <summary>{c.network}</summary>
          <div className="project-stats">
            {stats.map(([label, value]) => (
              <div className="project-stat" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          {(network.isError || network.data?.error) && (
            <p role="status">{snapshot ? c.failed : c.unavailable}</p>
          )}
          <div className="project-section-head">
            {checkedAt != null && (
              <small>
                {c.fetched} · {date.format(checkedAt)} (UTC+8)
              </small>
            )}
            <button
              className="project-outline"
              type="button"
              disabled={network.isFetching}
              onClick={() => void network.refetch()}
            >
              {network.isFetching ? c.refreshing : c.refresh}
            </button>
          </div>
        </details>
      )}
      <ProjectAbout project="xds" />
    </main>
  );
}
